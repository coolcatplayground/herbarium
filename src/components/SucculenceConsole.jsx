import { useEffect, useMemo, useState } from "react";
import { spriteUrl, onSpriteError } from "../api/pokeapi";

// Cacnea's case is about a drought, and a drought is something that happens
// TO a plant over time — it isn't a set of dials the plant gets to tune. So
// this console deliberately doesn't share Roselia's shape: the specimen is
// built once from real morphological types, and then time is the only thing
// the reader advances. Everything interesting (facultative CAM switching,
// CAM idling, tissue collapse) is a state the specimen ENTERS on its own as
// the reserve falls, which is exactly the part a slider cannot express.
//
// Both real mechanisms are still here, they've just moved: storage capacity
// and wall elasticity live in the build, stomatal scheduling plays out in
// the run.

// Length of the dry season. Tuned so that exactly one configuration — full
// succulence committed to nocturnal uptake — reaches the rains, and the
// facultative build misses by three days. That isn't an arbitrary difficulty
// setting: in an unbroken drought, commitment to CAM genuinely does beat
// switching, and the near-miss is the most legible way to show it.
const MAX_DAYS = 45;

// Water-storage architecture. `capacity` is the tank in abstract units;
// `collapseFloor` is the reserve percentage below which the tissue is under
// real mechanical stress, and `ruptureAfter` is how many consecutive days
// there it survives — the Fradera-Soler point is that elastic walls fold
// and refill without tearing, so a genuinely elastic build never ruptures.
const BUILDS = [
  {
    key: "rigid",
    label: "Rigid cortex",
    sub: "minimal reserve",
    capacity: 3,
    collapseFloor: 35,
    ruptureAfter: 4,
    note: "Thin, stiff-walled tissue. Very little to draw on, and the walls tear rather than fold once the cells start emptying.",
  },
  {
    key: "moderate",
    label: "Moderate parenchyma",
    sub: "partial elasticity",
    capacity: 6,
    collapseFloor: 20,
    ruptureAfter: 8,
    note: "A real reserve and walls that tolerate some collapse — but past a point the folding does permanent damage.",
  },
  {
    key: "elastic",
    label: "Deep elastic parenchyma",
    sub: "full succulence",
    capacity: 10,
    collapseFloor: 8,
    ruptureAfter: Infinity,
    note: "Thick water-storage tissue whose walls swell and collapse repeatedly without rupturing. The specimen visibly shrinks and is fine.",
  },
];

// Photosynthetic scheduling. Facultative CAM is the interesting one and the
// reason this had to become a simulation: a C3–CAM intermediate looks
// identical to a C3 plant until drought actually arrives and it switches.
const SCHEDULES = [
  {
    key: "c3",
    label: "C3 — daytime uptake",
    sub: "no CAM pathway",
    note: "Opens stomata in the heat of the day, every day. Under stress it can only shut them and wait — there's no night-uptake pathway to fall back on.",
  },
  {
    key: "facultative",
    label: "Facultative CAM",
    sub: "switches under stress",
    note: "Runs as a C3 plant while water is available, then shifts CO2 uptake to the night once the reserve drops. Real C3–CAM intermediates do exactly this.",
  },
  {
    key: "obligate",
    label: "Obligate CAM",
    sub: "night uptake always",
    note: "Committed to nocturnal uptake from day one. Loses far less water, but gives up the faster carbon gain a C3 schedule gets while conditions are still good.",
  },
];

// Illustrative rates, not a physiological model. What matters pedagogically
// is the ordering: daytime uptake is expensive, nocturnal uptake is much
// cheaper, and sealing up entirely is nearly free but earns nothing.
const MODES = {
  c3: {
    label: "Daytime uptake",
    detail: "Stomata open in daylight. Maximum carbon gain, maximum water cost.",
    stomata: "day",
    loss: 1.0,
    carbon: 1.0,
    tone: "var(--botanical-green-deep)",
  },
  cam: {
    label: "Nocturnal uptake (CAM)",
    detail: "Stomata open only after dark, when the air is cool and damp. CO2 is banked as acid overnight and spent behind closed stomata the next day.",
    stomata: "night",
    loss: 0.35,
    carbon: 0.45,
    tone: "var(--botanical-green-deep)",
  },
  closed: {
    label: "Stomata shut — wilting",
    detail: "Water stress forces the stomata closed. Nothing comes in, and without a night-uptake pathway there's no way to earn anything while sealed.",
    stomata: "none",
    loss: 0.2,
    carbon: 0,
    tone: "var(--specimen-red)",
  },
  idling: {
    label: "CAM idling",
    detail: "Stomata stay sealed around the clock. The specimen recycles its own respiratory CO2 behind closed stomata — net carbon gain is zero, but the tissue stays alive and can restart within hours of rain.",
    stomata: "none",
    loss: 0.08,
    carbon: 0,
    tone: "var(--specimen-red)",
  },
};

const CAM_THRESHOLD = 60;
const IDLE_THRESHOLD = 25;

// Reserve falls monotonically across a run with no rain, so mode follows
// directly from the current reserve — no hysteresis needed.
function modeFor(scheduleKey, pct) {
  if (scheduleKey === "c3") return pct <= IDLE_THRESHOLD ? "closed" : "c3";
  if (scheduleKey === "obligate") return pct <= IDLE_THRESHOLD ? "idling" : "cam";
  if (pct <= IDLE_THRESHOLD) return "idling";
  if (pct <= CAM_THRESHOLD) return "cam";
  return "c3";
}

function initialSim(build, schedule) {
  return {
    day: 0,
    water: build.capacity,
    carbon: 0,
    mode: modeFor(schedule.key, 100),
    stressDays: 0,
    dead: false,
    cause: null,
    log: [],
  };
}

function stepSim(sim, build, schedule) {
  if (sim.dead || sim.day >= MAX_DAYS) return sim;

  const day = sim.day + 1;
  const pctBefore = (sim.water / build.capacity) * 100;
  const mode = modeFor(schedule.key, pctBefore);
  const spec = MODES[mode];

  const water = Math.max(0, sim.water - spec.loss);
  const carbon = sim.carbon + spec.carbon;
  const pct = (water / build.capacity) * 100;

  const underStress = pct < build.collapseFloor;
  const stressDays = underStress ? sim.stressDays + 1 : 0;

  const log = [...sim.log];
  const note = (text, kind) => log.push({ day, text, kind });

  if (mode !== sim.mode) {
    if (mode === "cam") {
      note(
        `Reserve ${Math.round(pct)}%. Uptake shifted to the night — facultative CAM engaged.`,
        "shift"
      );
    } else if (mode === "idling") {
      note(
        `Reserve ${Math.round(pct)}%. Stomata sealed around the clock. Net carbon gain drops to zero — CAM idling.`,
        "alarm"
      );
    } else if (mode === "closed") {
      note(
        `Reserve ${Math.round(pct)}%. Stomata forced shut by water stress. No night pathway to fall back on.`,
        "alarm"
      );
    }
  }

  if (underStress && sim.stressDays === 0) {
    note(
      build.ruptureAfter === Infinity
        ? `Reserve ${Math.round(pct)}%. Cortex visibly shrinking — elastic walls folding inward without tearing.`
        : `Reserve ${Math.round(pct)}%. Tissue under mechanical stress; the walls are starting to buckle.`,
      "stress"
    );
  }

  let dead = false;
  let cause = null;

  if (water <= 0) {
    dead = true;
    cause = "desiccation";
    note("Reserve exhausted. Specimen desiccated.", "death");
  } else if (stressDays >= build.ruptureAfter) {
    dead = true;
    cause = "rupture";
    note(
      "Storage tissue ruptured — the cell walls collapsed past what they could recover from.",
      "death"
    );
  } else if (day >= MAX_DAYS) {
    note(`Day ${MAX_DAYS}. The rains return. Specimen still alive.`, "survive");
  }

  return { day, water, carbon, mode, stressDays, dead, cause, log };
}

function SpecimenDiagram({ pct, mode, dead }) {
  // The column narrows as the reserve empties — the shrinkage IS the
  // elasticity mechanism, so it's shown rather than described.
  const shrink = 1 - (1 - pct / 100) * 0.45;
  const halfWidth = 30 * shrink;
  const fillHeight = Math.max(0, (pct / 100) * 78);
  const isNight = MODES[mode].stomata === "night";
  const sealed = MODES[mode].stomata === "none";

  return (
    <svg viewBox="0 0 220 150" width="100%" height="150" role="img" aria-label={`Specimen at ${Math.round(pct)} percent water reserve, ${MODES[mode].label}`}>
      <rect x="20" y="10" width="180" height="14" rx="7" fill="var(--paper-shadow)" opacity="0.35" />
      <rect
        x={isNight ? 110 : 20}
        y="10"
        width="90"
        height="14"
        rx="7"
        fill={isNight ? "#3a3a5c" : "#f4d35e"}
        opacity={sealed ? 0.25 : 1}
      />
      <text x="34" y="21" fontSize="8" fontFamily="var(--font-mono)" fill="var(--ink-soft)">day</text>
      <text x="176" y="21" fontSize="8" fontFamily="var(--font-mono)" fill="var(--ink-soft)">night</text>
      <text x="110" y="38" textAnchor="middle" fontSize="8.5" fontFamily="var(--font-mono)" fill={sealed ? "var(--specimen-red)" : "var(--botanical-green-deep)"}>
        {sealed ? "stomata sealed" : `stomata open: ${isNight ? "night" : "day"}`}
      </text>

      <rect
        x={110 - halfWidth}
        y="48"
        width={halfWidth * 2}
        height="88"
        rx={halfWidth * 0.55}
        fill="var(--paper)"
        stroke={dead ? "var(--specimen-red)" : "var(--botanical-green-deep)"}
        strokeWidth="2"
        opacity={dead ? 0.55 : 1}
      />
      <rect
        x={110 - halfWidth + 3}
        y={133 - fillHeight}
        width={Math.max(0, halfWidth * 2 - 6)}
        height={fillHeight}
        rx={Math.max(0, halfWidth * 0.4)}
        fill="var(--botanical-green)"
        opacity="0.55"
      />
      {[62, 82, 102].map((y) => (
        <path
          key={y}
          d={`M${110 - halfWidth - 4} ${y} l-7 -4 M${110 + halfWidth + 4} ${y} l7 -4`}
          stroke={dead ? "var(--specimen-red)" : "var(--moss)"}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={dead ? 0.4 : 0.8}
        />
      ))}
      <text x="110" y="147" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="var(--ink-soft)">
        parenchyma reserve
      </text>
    </svg>
  );
}

function ChoiceRow({ options, value, onChange, disabled, label }) {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }} role="group" aria-label={label}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            disabled={disabled}
            aria-pressed={active}
            style={{
              flex: "1 1 150px",
              padding: "9px 12px",
              background: active ? "var(--botanical-green-deep)" : "var(--paper)",
              color: active ? "var(--paper-light)" : "var(--ink)",
              border: "1px solid var(--paper-shadow)",
              borderRadius: "10px",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled && !active ? 0.45 : 1,
              fontFamily: "var(--font-body)",
              fontWeight: active ? 700 : 500,
              fontSize: "0.83rem",
              textAlign: "left",
            }}
          >
            <span style={{ display: "block" }}>{o.label}</span>
            <span
              className="mono"
              style={{
                display: "block",
                fontSize: "0.66rem",
                marginTop: "2px",
                color: active ? "var(--paper)" : "var(--ink-soft)",
              }}
            >
              {o.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function AnalogueCard({ name, pokemonName, family, blurb, spriteIds }) {
  const id = spriteIds[pokemonName];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "64px 1fr",
        gap: "14px",
        padding: "12px 14px",
        border: "1.5px dashed var(--paper-shadow)",
        borderRadius: "12px",
        alignItems: "start",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
        {id ? (
          <img src={spriteUrl(id)} alt={name} width={48} height={48} style={{ objectFit: "contain" }} onError={onSpriteError} />
        ) : (
          <div style={{ width: 48, height: 48 }} />
        )}
        <span className="mono" style={{ fontSize: "0.62rem", color: "var(--ink-soft)" }}>{name}</span>
      </div>
      <div>
        <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: "0.9rem" }}>
          {name} <span className="mono" style={{ fontWeight: 400, fontSize: "0.68rem", color: "var(--specimen-red)" }}>{family}</span>
        </p>
        <p style={{ margin: 0, fontSize: "0.83rem", color: "var(--ink-soft)" }}>{blurb}</p>
      </div>
    </div>
  );
}

export default function SucculenceConsole({ spriteIds = {} }) {
  const [buildKey, setBuildKey] = useState("moderate");
  const [scheduleKey, setScheduleKey] = useState("facultative");
  const [playing, setPlaying] = useState(false);

  const build = useMemo(() => BUILDS.find((b) => b.key === buildKey), [buildKey]);
  const schedule = useMemo(() => SCHEDULES.find((s) => s.key === scheduleKey), [scheduleKey]);

  const [sim, setSim] = useState(() => initialSim(build, schedule));

  // Changing the build starts a new run — a specimen isn't re-sculpted
  // halfway through a drought.
  useEffect(() => {
    setPlaying(false);
    setSim(initialSim(build, schedule));
  }, [build, schedule]);

  const finished = sim.dead || sim.day >= MAX_DAYS;

  useEffect(() => {
    if (finished) setPlaying(false);
  }, [finished]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setSim((s) => stepSim(s, build, schedule)), 380);
    return () => clearInterval(id);
  }, [playing, build, schedule]);

  const pct = (sim.water / build.capacity) * 100;
  const modeSpec = MODES[sim.mode];
  const started = sim.day > 0;

  return (
    <div className="plate-frame" style={{ padding: "24px 26px" }}>
      <p className="eyebrow" style={{ marginBottom: "4px" }}>Run the Drought</p>
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: "20px" }}>
        A real succulent doesn&rsquo;t adjust itself to survive a dry season &mdash; it arrives at the
        drought already built a certain way, and then the drought happens to it. Build the specimen
        below, then advance the calendar and watch what it does on its own as the reserve falls.
      </p>

      <div style={{ display: "grid", gap: "18px", marginBottom: "24px" }}>
        <div>
          <p className="eyebrow" style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
            Storage Architecture
          </p>
          <ChoiceRow
            options={BUILDS}
            value={buildKey}
            onChange={setBuildKey}
            disabled={started && !finished}
            label="Storage architecture"
          />
          <p className="mono" style={{ fontSize: "0.7rem", color: "var(--ink-soft)", marginTop: "6px" }}>
            {build.note}
          </p>
        </div>
        <div>
          <p className="eyebrow" style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
            Photosynthetic Schedule
          </p>
          <ChoiceRow
            options={SCHEDULES}
            value={scheduleKey}
            onChange={setScheduleKey}
            disabled={started && !finished}
            label="Photosynthetic schedule"
          />
          <p className="mono" style={{ fontSize: "0.7rem", color: "var(--ink-soft)", marginTop: "6px" }}>
            {schedule.note}
          </p>
        </div>
      </div>

      <div className="console-split console-split--figure-left">
        <div style={{ background: "var(--paper)", border: "1px solid var(--paper-shadow)", borderRadius: "12px", padding: "10px" }}>
          <SpecimenDiagram pct={pct} mode={sim.mode} dead={sim.dead} />
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
            <p className="eyebrow" style={{ margin: 0, fontSize: "0.95rem" }}>
              Drought day{" "}
              <strong style={{ fontSize: "1.5rem", color: "var(--botanical-green-deep)" }}>{sim.day}</strong>
            </p>
            <span className="mono" style={{ fontSize: "0.75rem", color: "var(--ink-soft)" }}>
              reserve {Math.round(pct)}%
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`Water reserve ${Math.round(pct)} percent`}
            style={{
              height: "12px",
              background: "var(--paper)",
              border: "1px solid var(--paper-shadow)",
              borderRadius: "999px",
              overflow: "hidden",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: `${Math.max(0, pct)}%`,
                height: "100%",
                background: pct < build.collapseFloor ? "var(--specimen-red)" : "var(--botanical-green)",
                opacity: 0.65,
                transition: "width 0.3s ease",
              }}
            />
          </div>

          <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: "0.95rem", color: modeSpec.tone }}>
            {modeSpec.label}
          </p>
          <p style={{ margin: "0 0 14px", fontSize: "0.84rem", color: "var(--ink-soft)" }}>
            {modeSpec.detail}
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
            <button
              onClick={() => setSim((s) => stepSim(s, build, schedule))}
              disabled={finished}
              style={{
                padding: "8px 16px",
                background: finished ? "var(--paper)" : "var(--botanical-green-deep)",
                color: finished ? "var(--ink-soft)" : "var(--paper-light)",
                border: "1px solid var(--paper-shadow)",
                borderRadius: "999px",
                cursor: finished ? "not-allowed" : "pointer",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.82rem",
              }}
            >
              Advance one day
            </button>
            <button
              onClick={() => setPlaying((p) => !p)}
              disabled={finished}
              style={{
                padding: "8px 16px",
                background: "var(--paper)",
                color: finished ? "var(--ink-soft)" : "var(--ink)",
                border: "1px solid var(--paper-shadow)",
                borderRadius: "999px",
                cursor: finished ? "not-allowed" : "pointer",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.82rem",
              }}
            >
              {playing ? "Pause" : "Run the season"}
            </button>
            <button
              onClick={() => {
                setPlaying(false);
                setSim(initialSim(build, schedule));
              }}
              style={{
                padding: "8px 16px",
                background: "var(--paper)",
                border: "1px solid var(--paper-shadow)",
                borderRadius: "999px",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.82rem",
                color: "var(--ink-soft)",
              }}
            >
              Reset
            </button>
          </div>

          {finished && (
            <div
              role="status"
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: `1.5px solid ${sim.dead ? "var(--specimen-red)" : "var(--botanical-green)"}`,
                background: "var(--paper)",
              }}
            >
              <p className="eyebrow" style={{ margin: "0 0 4px", fontSize: "0.88rem", color: sim.dead ? "var(--specimen-red)" : "var(--botanical-green-deep)" }}>
                {sim.dead
                  ? sim.cause === "rupture"
                    ? "Lost to tissue rupture"
                    : "Lost to desiccation"
                  : "Reached the rains"}
              </p>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--ink-soft)" }}>
                {sim.day} day{sim.day === 1 ? "" : "s"} without rain &middot; {sim.carbon.toFixed(1)} units
                of carbon gained.{" "}
                {sim.cause === "rupture"
                  ? `The reserve wasn't the binding constraint here — ${Math.round(pct)}% of the water was still in the tank when the walls gave out.`
                  : sim.dead
                  ? `The tank ran dry ${MAX_DAYS - sim.day} day${MAX_DAYS - sim.day === 1 ? "" : "s"} short of the rains.`
                  : "It made it — and spent most of the season sealed shut earning nothing to do it. Staying alive and growing are not the same achievement."}
              </p>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <p className="eyebrow" style={{ marginBottom: "8px" }}>Field Log</p>
        <div
          role="log"
          aria-label="Drought field log"
          style={{
            maxHeight: "160px",
            overflowY: "auto",
            padding: "12px 14px",
            background: "var(--paper)",
            border: "1px solid var(--paper-shadow)",
            borderRadius: "10px",
          }}
        >
          {sim.log.length === 0 ? (
            <p className="mono" style={{ fontSize: "0.75rem", color: "var(--ink-soft)", margin: 0 }}>
              Nothing recorded yet &mdash; advance the calendar to begin the run.
            </p>
          ) : (
            sim.log.map((entry, i) => (
              <p
                key={i}
                className="mono"
                style={{
                  fontSize: "0.74rem",
                  margin: i === 0 ? 0 : "6px 0 0",
                  color:
                    entry.kind === "death" || entry.kind === "alarm"
                      ? "var(--specimen-red)"
                      : "var(--ink-soft)",
                }}
              >
                <span style={{ color: "var(--botanical-green-deep)" }}>Day {entry.day}</span> &mdash;{" "}
                {entry.text}
              </p>
            ))
          )}
        </div>
      </div>

      <div style={{ marginTop: "22px", paddingTop: "18px", borderTop: "1.5px dashed var(--paper-shadow)" }}>
        <p className="eyebrow" style={{ marginBottom: "10px" }}>Real Evidence Behind Each Mechanism</p>
        <div style={{ display: "grid", gap: "10px" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", margin: 0 }}>
            <span className="eyebrow" style={{ fontSize: "0.88rem", marginRight: "8px" }}>Storage</span>
            Fradera-Soler et al. (2022) reviewed how succulent water-storage tissue depends on cell
            walls that can regulate their own elasticity &mdash; swelling as they fill and collapsing
            as they empty, without the tissue tearing itself apart in the process. That&rsquo;s the
            difference between the rigid and elastic builds above: both run dry, but only one of them
            ruptures on the way down.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", margin: 0 }}>
            <span className="eyebrow" style={{ fontSize: "0.88rem", marginRight: "8px" }}>Timing</span>
            Tan &amp; Chen (2023) reviewed Crassulacean Acid Metabolism as an engineering target for
            drought resistance &mdash; plants that shift CO2 uptake to the cooler night hours and keep
            stomata shut during the day lose dramatically less water to transpiration.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", margin: 0 }}>
            <span className="eyebrow" style={{ fontSize: "0.88rem", marginRight: "8px" }}>Idling</span>
            CAM idling is a documented extreme of that same pathway: under severe drought the stomata
            stop opening at all, day or night, and the plant cycles its own respiratory CO2 behind
            them. Net carbon gain is zero &mdash; it isn&rsquo;t growing, it&rsquo;s waiting &mdash;
            but the tissue stays alive and can resume within hours of rain. It is a state a specimen
            enters over time, which is why this case is a calendar rather than a set of dials.
          </p>
        </div>
      </div>

      <div style={{ marginTop: "22px", paddingTop: "18px", borderTop: "1.5px dashed var(--paper-shadow)" }}>
        <p className="eyebrow" style={{ marginBottom: "10px", color: "var(--specimen-red)" }}>
          Not Just One Cactus &mdash; Real-World Analogues
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--ink-soft)", marginTop: 0, marginBottom: "14px" }}>
          Succulence itself is a heavily convergent trait &mdash; Fradera-Soler et al. (2022), in a
          companion paper to the cell-wall review cited above, put it plainly: the succulent syndrome
          &ldquo;has evolved convergently in over 80 plant families.&rdquo; Not just cacti. Two
          Pok&eacute;mon give this case a second data point beyond Cacnea&rsquo;s own line.
        </p>
        <div style={{ display: "grid", gap: "12px" }}>
          <AnalogueCard
            name="Cacturne"
            pokemonName="cacturne"
            family="Cacnea's own evolution"
            blurb="Cacturne is described as moving and hunting at night and standing still through the day — the CAM-timing side of the case above, acted out as behaviour instead of chemistry. Whatever schedule Cacnea is running, its evolution has committed to it."
            spriteIds={spriteIds}
          />
          <AnalogueCard
            name="Maractus"
            pokemonName="maractus"
            family="Different design lineage"
            blurb="A second, independently-designed cactus Pokémon from a different region and generation entirely. If real succulence keeps re-evolving the same storage-plus-timing combination across 80-plus unrelated plant families, two unrelated cactus Pokémon converging on the same design isn't a coincidence worth explaining away — it's the expected pattern."
            spriteIds={spriteIds}
          />
        </div>
      </div>

      <p className="mono" style={{ fontSize: "0.7rem", color: "var(--ink-soft)", marginTop: "18px", marginBottom: 0 }}>
        Rates here are illustrative stand-ins chosen to preserve the real ordering between these
        mechanisms &mdash; not a physiological prediction for any actual plant.
      </p>
    </div>
  );
}
