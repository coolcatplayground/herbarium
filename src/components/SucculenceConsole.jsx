import { useState } from "react";
import { spriteUrl } from "../api/pokeapi";

// Two real, independently-studied mechanisms behind how a real succulent
// plant survives on a fixed water budget: how much it can hold (tissue
// elasticity) and how carefully it spends what's already inside (CAM
// stomatal timing). Neither slider is a literal dial on Cacnea's actual
// biology — this is the same "real mechanism, speculative tuning" shape
// as Roselia's gene-expression console, applied to a different pathway.
const STORAGE_LABELS = [
  { max: 20, label: "Rigid, minimal reserve" },
  { max: 45, label: "Modest elastic capacity" },
  { max: 70, label: "Substantial elastic capacity" },
  { max: 100, label: "Highly elastic, deep reserve" },
];

const TIMING_LABELS = [
  { max: 20, label: "Fully diurnal (C3-like)" },
  { max: 45, label: "Mostly daytime, some night uptake" },
  { max: 70, label: "Mostly nocturnal (CAM-leaning)" },
  { max: 100, label: "Fully nocturnal (full CAM)" },
];

function pickLabel(list, value) {
  return list.find((l) => value <= l.max)?.label ?? list[list.length - 1].label;
}

// Illustrative only \u2014 not a real physiological formula. Higher storage
// raises the tank size; higher (more nocturnal) CAM timing cuts how much
// of that tank gets spent during the hot, dry daylight hours.
function estimateDays(storage, camTiming) {
  const tankSize = 1 + (storage / 100) * 9; // 1\u201310 "units" of stored water
  const dailyLossRate = 1 - (camTiming / 100) * 0.75; // CAM cuts daytime loss up to 75%
  const days = tankSize / Math.max(dailyLossRate, 0.1);
  return Math.max(1, Math.round(days));
}

function limitingFactor(storage, camTiming) {
  if (storage < 35 && camTiming < 35) return "Bottlenecked on both ends \u2014 small tank, leaky schedule";
  if (storage < camTiming - 15) return "Limited by tank size, not timing";
  if (camTiming < storage - 15) return "Limited by daytime water loss, not tank size";
  return "Storage and timing roughly balanced";
}

function ReservoirDiagram({ storage, camTiming }) {
  const fillHeight = 8 + (storage / 100) * 74; // px, within an 90px-tall tank
  const isNightLeaning = camTiming >= 50;
  return (
    <svg viewBox="0 0 220 140" width="100%" height="140" role="img" aria-label="Water reservoir tank with a day/night stomata cycle">
      {/* day/night cycle bar */}
      <rect x="20" y="14" width="180" height="14" rx="7" fill={isNightLeaning ? "var(--paper-shadow)" : "#f4d35e"} opacity="0.5" />
      <rect
        x={isNightLeaning ? 20 : 110}
        y="14"
        width="90"
        height="14"
        rx="7"
        fill={isNightLeaning ? "#3a3a5c" : "#f4d35e"}
      />
      <text x="30" y="12" fontSize="8" fontFamily="var(--font-mono)" fill="var(--ink-soft)">day</text>
      <text x="184" y="12" fontSize="8" fontFamily="var(--font-mono)" fill="var(--ink-soft)">night</text>
      <text x="108" y="44" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="var(--botanical-green-deep)">
        stomata open: {isNightLeaning ? "night" : "day"}
      </text>

      {/* reservoir tank */}
      <rect x="80" y="52" width="60" height="82" rx="10" fill="var(--paper)" stroke="var(--botanical-green-deep)" strokeWidth="2" />
      <rect
        x="83"
        y={131 - fillHeight}
        width="54"
        height={fillHeight}
        rx="6"
        fill="var(--botanical-green)"
        opacity="0.55"
      />
      <text x="110" y="140" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="var(--ink-soft)">
        parenchyma reserve
      </text>
    </svg>
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
          <img src={spriteUrl(id)} alt={name} width={48} height={48} style={{ objectFit: "contain" }} />
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
  const [storage, setStorage] = useState(50);
  const [camTiming, setCamTiming] = useState(50);

  const days = estimateDays(storage, camTiming);
  const storageLabel = pickLabel(STORAGE_LABELS, storage);
  const timingLabel = pickLabel(TIMING_LABELS, camTiming);
  const bottleneck = limitingFactor(storage, camTiming);

  return (
    <div className="plate-frame" style={{ padding: "24px 26px" }}>
      <p className="eyebrow" style={{ marginBottom: "4px" }}>Two Real Mechanisms, Tuned Together</p>
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: "20px" }}>
        Surviving on a fixed water budget comes down to two separate real questions: how much can
        the tissue actually hold, and how carefully is what's stored being spent? Adjust both to
        see how they interact.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "20px" }}>
        <div>
          <p className="eyebrow" style={{ fontSize: "0.9rem", marginBottom: "6px" }}>
            Parenchyma Elasticity &mdash; {storageLabel}
          </p>
          <input
            type="range"
            min="0"
            max="100"
            value={storage}
            onChange={(e) => setStorage(Number(e.target.value))}
            style={{ width: "100%" }}
          />
          <p className="mono" style={{ fontSize: "0.68rem", color: "var(--ink-soft)", marginTop: "4px" }}>
            How much the water-storage cell walls can swell and collapse without rupturing.
          </p>
        </div>
        <div>
          <p className="eyebrow" style={{ fontSize: "0.9rem", marginBottom: "6px" }}>
            CAM Stomatal Timing &mdash; {timingLabel}
          </p>
          <input
            type="range"
            min="0"
            max="100"
            value={camTiming}
            onChange={(e) => setCamTiming(Number(e.target.value))}
            style={{ width: "100%" }}
          />
          <p className="mono" style={{ fontSize: "0.68rem", color: "var(--ink-soft)", marginTop: "4px" }}>
            When the stomata actually open to take in CO2 &mdash; daytime loses far more water to
            heat than night does.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "28px", alignItems: "center", marginBottom: "8px" }}>
        <div style={{ background: "var(--paper)", border: "1px solid var(--paper-shadow)", borderRadius: "12px", padding: "10px" }}>
          <ReservoirDiagram storage={storage} camTiming={camTiming} />
        </div>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: "0.95rem" }}>
            <strong style={{ fontSize: "1.6rem", color: "var(--botanical-green-deep)" }}>{days}</strong>{" "}
            <span style={{ color: "var(--ink-soft)" }}>estimated day{days === 1 ? "" : "s"} between waterings</span>
          </p>
          <p className="mono" style={{ fontSize: "0.72rem", color: "var(--specimen-red)", margin: 0 }}>{bottleneck}</p>
          <p style={{ fontSize: "0.78rem", color: "var(--ink-soft)", marginTop: "8px" }}>
            Illustrative only &mdash; a simplified stand-in for two real, separately-studied
            mechanisms, not a real physiological prediction.
          </p>
        </div>
      </div>

      <div style={{ marginTop: "20px", paddingTop: "18px", borderTop: "1.5px dashed var(--paper-shadow)" }}>
        <p className="eyebrow" style={{ marginBottom: "10px" }}>Real Evidence Behind Each Slider</p>
        <div style={{ display: "grid", gap: "10px" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", margin: 0 }}>
            <span className="eyebrow" style={{ fontSize: "0.88rem", marginRight: "8px" }}>Storage</span>
            Fradera-Soler et al. (2022) reviewed how succulent water-storage tissue depends on cell
            walls that can regulate their own elasticity &mdash; swelling as they fill and collapsing
            as they empty, without the tissue tearing itself apart in the process.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", margin: 0 }}>
            <span className="eyebrow" style={{ fontSize: "0.88rem", marginRight: "8px" }}>Timing</span>
            Tan &amp; Chen (2023) reviewed Crassulacean Acid Metabolism (CAM) as an engineering
            target for drought resistance &mdash; plants that shift CO2 uptake to the cooler night
            hours and keep stomata shut during the day lose dramatically less water to transpiration.
          </p>
        </div>
      </div>

      <div style={{ marginTop: "22px", paddingTop: "18px", borderTop: "1.5px dashed var(--paper-shadow)" }}>
        <p className="eyebrow" style={{ marginBottom: "10px", color: "var(--specimen-red)" }}>
          Not Just One Cactus &mdash; Real-World Analogues
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--ink-soft)", marginTop: 0, marginBottom: "14px" }}>
          Succulence itself is a heavily convergent trait &mdash; real botany estimates it evolved
          independently in over 80 separate plant families, not just cacti. Two Pok&eacute;mon give
          this case a second data point beyond Cacnea's own line.
        </p>
        <div style={{ display: "grid", gap: "12px" }}>
          <AnalogueCard
            name="Cacturne"
            pokemonName="cacturne"
            family="Cacnea's own evolution"
            blurb="Already the specimen this whole console is built around — shown here for the side-by-side. Cacturne's day/night dormancy is Cacnea's Case File material for the CAM-timing half of this console specifically."
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
    </div>
  );
}
