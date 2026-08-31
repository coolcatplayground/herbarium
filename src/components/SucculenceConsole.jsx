import { useEffect, useMemo, useState } from "react";
import { onSpriteError, thumbUrl } from "../api/pokeapi";

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

// ---- Diagram geometry -------------------------------------------------
// The figure used to be 208x150 inside a panel over 2,300px tall, which made
// the one element in this case that actually moves about 6% of it — an icon
// beside an essay rather than the subject. It is now a tall column: a
// 200x340 viewBox that renders at roughly 214x364 in the 230px figure column
// and 203x345 at 375px where `.console-split--figure-left` collapses. Both
// land in the 320-400px band where it holds its own against the prose.
// Portrait rather than landscape because a ribbed columnar succulent is the
// shape being drawn, and because the height is what gives the ribs room to
// read as pleats rather than as hatching.
const VB_W = 200;
const VB_H = 340;
const CX = 100;

const SKY_X = 6;
const SKY_Y = 4;
const SKY_W = 188;
const SKY_H = 54;
const SKY_CY = 24;
// The rail travels flat rather than arcing a luminary up over the horizon. An
// arc needs each luminary's y to be a function of its *current* x, which a CSS
// transform on the shared rail cannot express — it would take an offset-path or
// a JS-driven animation, and neither earns its weight on a 54-unit strip. Flat
// travel already reads as sun giving way to moon.

// The rail carries alternating sun and moon exactly one strip-width apart,
// so travelling the rail by SKY_W is the same motion as advancing the sky by
// one phase. That equivalence is the whole trick: the day-advance sweep
// always starts one strip to the RIGHT of wherever the new mode has parked
// the rail, and one strip right of the new phase is exactly where the old
// phase was. Sweep and resting position therefore compose into a correct
// old-state-to-new-state travel without either knowing the other's value —
// including on the days when the mode does not change at all, which still
// carry a full night into a full dawn.
const SKY_PHASES = [-2, -1, 0, 1, 2, 3];

const BODY_TOP = 84;
const BODY_BOT = 292;
const CROWN = 30;
const HALF_W_MAX = 46;
// Seven crests, six grooves between them. Enough that the spacing visibly
// closes as the body narrows — half-width runs 46 to 25 across a full drain,
// so the grooves come 45% closer together — without collapsing into hatching
// at a 200-unit width.
const RIBS = 7;
const GROOVES = RIBS - 1;

// The crown is sampled rather than hand-drawn. Rib count, fold depth and
// body width all change during a run, so a formula that takes them as
// arguments stays correct where a tuned `d` string would quietly stop
// matching the ribs beneath it. The cosine term puts a trough exactly
// halfway between each pair of crests, which is where the groove lines go.
function bodyPath(halfW, fold) {
  // Trough depth. 1.4 at full turgor because a turgid cactus is still
  // ribbed, not smooth; 6.6 at empty, deep enough that the crown reads as
  // folded from across the page.
  const ripple = 1.4 + fold * 5.2;
  const pts = [];
  const samples = 54;
  for (let i = 0; i <= samples; i += 1) {
    const s = i / samples;
    const x = CX - halfW + s * halfW * 2;
    const dome = CROWN * (1 - Math.sin(Math.PI * s) ** 0.75);
    const trough = (ripple * (1 - Math.cos(2 * Math.PI * GROOVES * s))) / 2;
    pts.push(`${x.toFixed(2)} ${(BODY_TOP + dome + trough).toFixed(2)}`);
  }
  return `M ${(CX - halfW).toFixed(2)} ${BODY_BOT} L ${pts.join(" L ")} L ${(CX + halfW).toFixed(2)} ${BODY_BOT} Z`;
}

// Crown height at a given position across the body, so grooves and areoles
// can start at the surface instead of at an assumed flat top.
function crownY(s, fold) {
  const ripple = 1.4 + fold * 5.2;
  const dome = CROWN * (1 - Math.sin(Math.PI * s) ** 0.75);
  const trough = (ripple * (1 - Math.cos(2 * Math.PI * GROOVES * s))) / 2;
  return BODY_TOP + dome + trough;
}

function Sun({ x }) {
  return (
    <g transform={`translate(${x} ${SKY_CY})`}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line
          key={a}
          x1={Math.cos((a * Math.PI) / 180) * 12.5}
          y1={Math.sin((a * Math.PI) / 180) * 12.5}
          x2={Math.cos((a * Math.PI) / 180) * 16}
          y2={Math.sin((a * Math.PI) / 180) * 16}
          stroke="var(--gold-line)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ))}
      <circle r="9.5" fill="var(--gold-line)" />
    </g>
  );
}

function Moon({ x, maskId }) {
  return (
    <g transform={`translate(${x} ${SKY_CY})`}>
      <circle r="9.5" fill="var(--paper-light)" mask={`url(#${maskId})`} />
    </g>
  );
}

function SpecimenDiagram({ pct, mode, dead, day, idle }) {
  // The column narrows as the reserve empties — the shrinkage IS the
  // elasticity mechanism, so it's shown rather than described.
  const shrink = 1 - (1 - pct / 100) * 0.45;
  const halfW = HALF_W_MAX * shrink;
  const fold = Math.min(1, Math.max(0, 1 - pct / 100));
  const isNight = MODES[mode].stomata === "night";
  const sealed = MODES[mode].stomata === "none";

  // Resting position of the rail: 0 keeps the sun over the specimen, one
  // strip-width to the left brings the moon there instead. A sealed specimen
  // still gets a sun — the drought does not stop being sunny because the
  // stomata shut — so only genuine nocturnal uptake moves the sky.
  const railX = isNight ? -SKY_W : 0;

  const fillTop = BODY_BOT - (Math.max(0, pct) / 100) * (BODY_BOT - BODY_TOP - 6);
  const grooveTone = dead ? "var(--specimen-red)" : undefined;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width="100%"
      style={{ display: "block", height: "auto" }}
      role="img"
      aria-label={`Specimen at ${Math.round(pct)} percent water reserve, ${MODES[mode].label}`}
    >
      <defs>
        <clipPath id="succ-sky-clip">
          <rect x={SKY_X} y={SKY_Y} width={SKY_W} height={SKY_H} rx="10" />
        </clipPath>
        <clipPath id="succ-body-clip">
          <path d={bodyPath(halfW, fold)} />
        </clipPath>
        {/* Crescent by subtraction rather than by arc arithmetic: the two
            circles are trivially correct, an A-command crescent is not. */}
        <mask id="succ-moon" maskUnits="userSpaceOnUse" x="-14" y="-14" width="28" height="28">
          <circle r="9.5" fill="#fff" />
          <circle cx="4.6" cy="-2.6" r="8.4" fill="#000" />
        </mask>
        <linearGradient id="succ-day-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--gold-line)" stopOpacity="0.34" />
          <stop offset="58%" stopColor="var(--paper-light)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--moss)" stopOpacity="0.4" />
        </linearGradient>
        {/* Night is mixed from the two darkest tokens in the palette rather
            than from an imported indigo. Warm brown over deep green reads as
            night against cream and keeps the greenhouse palette intact. */}
        <linearGradient id="succ-night-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ink)" />
          <stop offset="100%" stopColor="var(--botanical-green-deep)" />
        </linearGradient>
      </defs>

      <g clipPath="url(#succ-sky-clip)">
        <rect x={SKY_X} y={SKY_Y} width={SKY_W} height={SKY_H} fill="url(#succ-day-sky)" />
        <rect
          x={SKY_X}
          y={SKY_Y}
          width={SKY_W}
          height={SKY_H}
          fill="url(#succ-night-sky)"
          className={idle ? "dsky-night dsky-night--idle" : "dsky-night"}
          style={{ opacity: isNight ? 1 : 0 }}
        />
        {/* Remounting on every day is what restarts the sweep animation; the
            key is doing real work here rather than satisfying a list. */}
        <g key={day} className={day > 0 ? "dsky-sweep" : undefined}>
          <g
            className={idle ? "dsky-rail dsky-rail--idle" : "dsky-rail"}
            style={{ transform: `translate(${railX}px, 0px)` }}
          >
            {SKY_PHASES.map((k) =>
              k % 2 === 0 ? (
                <Sun key={k} x={CX + k * SKY_W} />
              ) : (
                <Moon key={k} x={CX + k * SKY_W} maskId="succ-moon" />
              )
            )}
          </g>
        </g>
      </g>
      <rect
        x={SKY_X}
        y={SKY_Y}
        width={SKY_W}
        height={SKY_H}
        rx="10"
        fill="none"
        stroke="var(--paper-shadow)"
        strokeWidth="1"
      />

      <text
        x={CX}
        y="72"
        textAnchor="middle"
        fontSize="8.5"
        fontFamily="var(--font-mono)"
        fill={sealed ? "var(--specimen-red)" : "var(--botanical-green-deep)"}
      >
        {sealed ? "stomata sealed" : `stomata open: ${isNight ? "night" : "day"}`}
      </text>

      {/* Body, then the reserve clipped to it — one shape, so the water line
          sits inside the folded silhouette instead of inside a rectangle
          that stops agreeing with it as the ribs close. */}
      <path d={bodyPath(halfW, fold)} fill="var(--paper-light)" />
      <g clipPath="url(#succ-body-clip)">
        <rect
          x={CX - HALF_W_MAX}
          y={fillTop}
          width={HALF_W_MAX * 2}
          height={Math.max(0, BODY_BOT - fillTop)}
          fill="var(--botanical-green)"
          opacity={dead ? 0.3 : 0.55}
        />
        {pct > 1 && (
          <line
            x1={CX - HALF_W_MAX}
            y1={fillTop}
            x2={CX + HALF_W_MAX}
            y2={fillTop}
            stroke="var(--botanical-green-deep)"
            strokeWidth="1.2"
            opacity="0.5"
          />
        )}
        {/* The grooves run through both the filled and the emptied tissue:
            the pleats are structure, not a fill effect. */}
        {Array.from({ length: GROOVES }, (_, i) => {
          const s = (i + 0.5) / GROOVES;
          return (
            <line
              key={i}
              x1={CX - halfW + s * halfW * 2}
              y1={crownY(s, fold) + 2}
              x2={CX - halfW + s * halfW * 2}
              y2={BODY_BOT}
              className={dead ? "dsvg-rib is-dead" : "dsvg-rib"}
              stroke={grooveTone}
              strokeWidth={1 + fold * 1.8}
              strokeLinecap="round"
              opacity={0.35 + fold * 0.4}
            />
          );
        })}
        {/* Areoles on the interior crests. Spines are what a rib crest is
            FOR, so they mark the crests and confirm which lines are folds. */}
        {[1, 2, 3, 4, 5].map((i) => {
          const s = i / GROOVES;
          const x = CX - halfW + s * halfW * 2;
          const top = crownY(s, fold);
          return [0.22, 0.46, 0.7, 0.9].map((f) => (
            <circle
              key={`${i}-${f}`}
              cx={x}
              cy={top + (BODY_BOT - top) * f}
              r="1.5"
              fill={dead ? "var(--specimen-red)" : "var(--moss)"}
              opacity="0.85"
            />
          ));
        })}
      </g>
      <path
        d={bodyPath(halfW, fold)}
        fill="none"
        className={dead ? "dsvg-body is-dead" : "dsvg-body"}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Magnified stoma. One pore at 21 units across is legible where three
          at 5 units on the body were decoration — and it is the element the
          idle cycle breathes, so it has to be large enough to notice
          without being looked for. */}
      <line
        x1={CX + halfW}
        y1="214"
        x2="156"
        y2="232"
        stroke="var(--paper-shadow)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <g transform="translate(168 250)">
        <circle
          r="21"
          fill="var(--paper-light)"
          stroke="var(--paper-shadow)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <ellipse
          cx="-5"
          cy="0"
          rx="3.4"
          ry="9"
          fill="none"
          stroke={dead ? "var(--specimen-red)" : "var(--botanical-green-deep)"}
          strokeWidth="1.8"
        />
        <ellipse
          cx="5"
          cy="0"
          rx="3.4"
          ry="9"
          fill="none"
          stroke={dead ? "var(--specimen-red)" : "var(--botanical-green-deep)"}
          strokeWidth="1.8"
        />
        <ellipse
          rx="2.4"
          ry="8"
          fill={dead ? "var(--specimen-red)" : "var(--botanical-green-deep)"}
          opacity="0.75"
          className={
            idle
              ? `dstoma-pore dstoma-pore--idle-${isNight ? "night" : "day"}`
              : "dstoma-pore"
          }
          style={{ transform: `scaleY(${sealed ? 0.1 : 1})` }}
        />
      </g>
      <text
        x="168"
        y="282"
        textAnchor="middle"
        fontSize="7.5"
        fontFamily="var(--font-mono)"
        fill="var(--ink-soft)"
      >
        stoma
      </text>

      {/* Ground. The cracks are the only place the drought is drawn rather
          than measured, and they stay under half opacity so they read as
          setting rather than as a second gauge. */}
      <line
        x1="14"
        y1={BODY_BOT}
        x2="186"
        y2={BODY_BOT}
        stroke="var(--paper-shadow)"
        strokeWidth="1.5"
      />
      {[26, 58, 138, 172].map((x, i) => (
        <path
          key={x}
          d={`M${x} ${BODY_BOT + 2} l${i % 2 ? 5 : -5} 7 l${i % 2 ? -3 : 3} 6`}
          fill="none"
          stroke="var(--ink-soft)"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity={fold * 0.45}
        />
      ))}
      <text
        x={CX}
        y="330"
        textAnchor="middle"
        fontSize="8"
        fontFamily="var(--font-mono)"
        fill="var(--ink-soft)"
      >
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
          <img src={thumbUrl(id)} alt={name} width={48} height={48} style={{ objectFit: "contain" }} onError={onSpriteError} />
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
        <p className="eyebrow" style={{ marginBottom: "10px" }}>Where each mechanism comes from</p>
        <div style={{ display: "grid", gap: "10px" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", margin: 0 }}>
            <span className="eyebrow" style={{ fontSize: "0.88rem", marginRight: "8px" }}>Storage</span>
            A succulent&rsquo;s water store depends on cell walls that can fold inward as they empty
            and swell again as they fill, without the tissue tearing itself apart on the way. That is
            the whole difference between the rigid and elastic builds above: both run dry, but only
            one of them ruptures getting there.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", margin: 0 }}>
            <span className="eyebrow" style={{ fontSize: "0.88rem", marginRight: "8px" }}>Timing</span>
            A plant that opens its pores at night instead of during the day loses far less water,
            because the night air is cool and damp. It takes in the day&rsquo;s carbon dioxide in the
            dark, banks it, and spends it the next morning with its pores shut. Growers are actively
            trying to breed this into crops for drought resistance.
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
          Not just one cactus
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--ink-soft)", marginTop: 0, marginBottom: "14px" }}>
          Storing water this way is not a cactus invention. More than eighty separate plant families
          have arrived at it independently, none of them copying the others &mdash; which is what
          makes it worth taking seriously as a design rather than a quirk. Two Pok&eacute;mon give
          this case a second look at it, beyond Cacnea&rsquo;s own line.
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
