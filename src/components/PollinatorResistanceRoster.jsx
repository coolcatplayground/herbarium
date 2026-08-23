import { useState } from "react";
import { spriteUrl, onSpriteError } from "../api/pokeapi";

// Three real, independently-evolved strategies insects use against toxic
// plant compounds. None of the three cited papers studies Vileplume or
// anything like it — each is cited only for the real mechanism, the same
// "grounded citation, speculative application" pattern used for Roselia's
// blue-arm theory. The toxins involved differ across the three real
// studies too (alkaloids for the enzymatic case, cardenolides for the
// other two) — that's honest: these are three real answers to the general
// problem of "a pollinator needs to survive a plant's toxic chemistry,"
// not three papers about one toxin.
//
// "examples" below are Pokémon-world pattern matches, not the specimen
// this Case File is built on — Vileplume itself isn't bound to any one
// strategy. Where a cohabitat claim is made, it's checked directly against
// the games' own wild-encounter tables (see cohabitat.note on each), not
// invented. Where no such claim is made, the example is included for
// strategy fit alone and says so.
const STRATEGIES = [
  {
    key: "detox",
    label: "Enzymatic Detoxification",
    tagline: "Break the toxin down before it acts",
    manuscriptId: "haas-2023-cyp336-detox",
    diagram: "detox",
    summary: [
      {
        tag: "Mechanism",
        text: "A family of cytochrome P450 enzymes (CYP336) intercepts the toxin in the gut and metabolizes it into an inactive form before it ever reaches its target.",
      },
      {
        tag: "What the studies found",
        text: "Bees, wasps and their relatives have all held on to the same family of detox enzymes across 281 million years of going their separate ways. Each line kept it independently, for the same job: clearing plant poisons out of nectar and pollen.",
      },
      {
        tag: "Trade-off",
        text: "Detox enzymes are metabolically expensive to run continuously and only work on toxins the enzyme has evolved to recognize \u2014 a new toxin structure can slip past entirely.",
      },
    ],
    examples: [
      {
        name: "Beedrill",
        pokemonName: "beedrill",
        rationale:
          "That work is about bees and wasps, and Beedrill is Kanto's most direct stand-in for them. Its whole design is built around a stinger that handles poison offensively, which suits a body that breaks toxins down rather than one that merely puts up with them.",
        cohabitat: {
          location: "Kanto Route 24",
          games: "Pok\u00e9mon Red, Blue & Yellow (1996/1998) \u2014 Generation I",
          companions: ["weedle", "oddish"],
          note: "The very first route in the series where these two appear together: Weedle (Beedrill's pre-evolution) and Oddish are both wild tall-grass encounters on Route 24 in the original Gen I games, per the games' own encounter tables \u2014 a checkable detail, not a guess.",
        },
      },
    ],
  },
  {
    key: "insensitivity",
    label: "Target-Site Insensitivity",
    tagline: "Redesign the lock so the toxin's key doesn't fit",
    manuscriptId: "dobler-2012-atpase-convergence",
    diagram: "insensitivity",
    summary: [
      {
        tag: "Mechanism",
        text: "The toxin works by grabbing onto one specific spot on a protein the insect's cells depend on \u2014 here, the sodium pump that keeps nerve and muscle cells firing correctly. That's a lock-and-key fit: the toxin is shaped to grab that one spot. Insects that happened to have a slightly different shape right at that one spot \u2014 close enough that the pump still does its normal job, different enough that the toxin can't grab on \u2014 survived exposure that would otherwise kill them. Over generations, that slightly-different shape spread. The pump keeps working exactly as before; it's just no longer a lock the toxin's key fits.",
      },
      {
        tag: "What the studies found",
        text: "Insects from six unrelated groups were checked, and the same small handful of changes turned up again and again in the same few spots \u2014 separate lineages each finding the same fix on their own, rather than inheriting it from a shared ancestor.",
      },
      {
        tag: "Trade-off",
        text: "This only closes off the one lock the toxin was using. The toxin is still absorbed into the body and still circulating \u2014 if it can harm the insect through any other route, insensitivity at this one site does nothing to stop it.",
      },
    ],
    examples: [
      {
        name: "Butterfree",
        pokemonName: "butterfree",
        rationale:
          "The real animal most associated with target-site insensitivity to plant toxins is, itself, a butterfly \u2014 the monarch. Butterfree is the direct Kanto analogue, and unlike Beedrill or Venomoth it's built around drinking nectar directly rather than stinging or storing, which fits a strategy that lets the toxin circulate rather than breaking it down or hoarding it.",
        cohabitat: {
          location: "Kanto Route 24",
          games: "Pok\u00e9mon Red, Blue & Yellow (1996/1998) \u2014 Generation I",
          companions: ["caterpie", "oddish"],
          note: "The very first route in the series where these two appear together: Caterpie (Butterfree's pre-evolution) and Oddish are both wild tall-grass encounters on Route 24 in the original Gen I games, per the games' own encounter tables.",
        },
      },
    ],
  },
  {
    key: "sequestration",
    label: "Sequestration",
    tagline: "Store the toxin, don't fight it",
    manuscriptId: "agrawal-2021-monarch-sequestration-cost",
    diagram: "sequestration",
    summary: [
      {
        tag: "Mechanism",
        text: "Instead of breaking the toxin down or resisting it, the insect selectively absorbs and stores it unmodified (or lightly converted) in its own tissues, repurposing the plant's weapon as its own defense against predators.",
      },
      {
        tag: "What the studies found",
        text: "Monarch caterpillars are choosy about which of milkweed's poisons they keep, and they turn the most dangerous one into a safer form before storing it. It is not free: caterpillars that do this grow measurably more slowly.",
      },
      {
        tag: "Trade-off",
        text: "Sequestration isn't free \u2014 the 2021 study is explicit that heavier sequestration directly predicted slower caterpillar growth. Carrying the toxin costs something, even successfully stored.",
      },
    ],
    examples: [
      {
        name: "Venomoth",
        pokemonName: "venomoth",
        rationale:
          "A poison-type moth that stores toxins defensively is exactly the sequestration shape \u2014 Venomoth's own Pok\u00e9dex flavor text already describes its wing scales as toxic to the touch, which reads as stored, weaponized toxin rather than a detox byproduct.",
        cohabitat: {
          location: "Kanto Route 24",
          games: "Pok\u00e9mon Red, Blue & Yellow (1996/1998) \u2014 Generation I",
          companions: ["venonat", "oddish"],
          note: "The very first route in the series where these two appear together: Venonat (Venomoth's pre-evolution) and Oddish are both wild tall-grass encounters on Route 24 in the original Gen I games, per the games' own encounter tables.",
        },
      },
      {
        name: "Dustox",
        pokemonName: "dustox",
        rationale:
          "A second, independent real-world pattern match rather than a coincidence: Dustox is a separate Bug/Poison moth line from a different region (Hoenn) that converges on the same design logic as Venomoth \u2014 poison-type moth, toxin worn as a defense rather than processed away.",
        cohabitat: {
          location: null,
          note: "Unlike Beedrill, Butterfree, and Venomoth's pre-evolutions, Dustox's own pre-evolution, Wurmple, doesn't cohabit with Oddish in any generation checked so far \u2014 Wurmple is Hoenn-native (introduced in Ruby & Sapphire) and Oddish's Hoenn routes and Wurmple's don't overlap. No \"first shared route\" exists to point to here, so none is claimed \u2014 Dustox is included for the strategy fit alone.",
        },
      },
    ],
  },
];

function Diagram({ type }) {
  // Small, deliberately simple SVGs \u2014 one visual idea each, not a literal
  // biochemical illustration. Toxin molecule in specimen-red throughout so
  // its fate is the throughline across all three panels.
  if (type === "detox") {
    return (
      <svg viewBox="0 0 220 120" width="100%" height="120" role="img" aria-label="Toxin broken down by an enzyme into an inactive fragment">
        <circle cx="30" cy="60" r="10" fill="var(--specimen-red)" />
        <path d="M46 60 H90" stroke="var(--ink-soft)" strokeWidth="2" markerEnd="url(#arrow)" />
        <rect x="92" y="40" width="46" height="40" rx="8" fill="var(--paper)" stroke="var(--botanical-green-deep)" strokeWidth="2" />
        <text x="115" y="65" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--botanical-green-deep)">CYP336</text>
        <path d="M140 60 H170" stroke="var(--ink-soft)" strokeWidth="2" markerEnd="url(#arrow)" />
        <circle cx="185" cy="52" r="5" fill="var(--moss)" />
        <circle cx="196" cy="66" r="4" fill="var(--moss)" />
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--ink-soft)" />
          </marker>
        </defs>
      </svg>
    );
  }
  if (type === "insensitivity") {
    return (
      <svg viewBox="0 0 220 120" width="100%" height="120" role="img" aria-label="Toxin unable to bind a redesigned receptor">
        <circle cx="40" cy="45" r="10" fill="var(--specimen-red)" />
        <path d="M40 55 L40 80" stroke="var(--specimen-red)" strokeWidth="2" strokeDasharray="3 3" />
        <rect x="120" y="30" width="70" height="60" rx="10" fill="var(--paper)" stroke="var(--botanical-green-deep)" strokeWidth="2" />
        <path d="M148 45 L162 75 M162 45 L148 75" stroke="var(--botanical-green-deep)" strokeWidth="3" strokeLinecap="round" />
        <text x="155" y="105" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--ink-soft)">Na+/K+-ATPase</text>
        <path d="M50 60 Q80 20 118 45" stroke="var(--ink-soft)" strokeWidth="2" fill="none" markerEnd="url(#arrow2)" />
        <defs>
          <marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--ink-soft)" />
          </marker>
        </defs>
      </svg>
    );
  }
  // sequestration
  return (
    <svg viewBox="0 0 220 120" width="100%" height="120" role="img" aria-label="Toxin absorbed and stored intact inside the insect's body">
      <circle cx="30" cy="60" r="10" fill="var(--specimen-red)" />
      <path d="M46 60 H80" stroke="var(--ink-soft)" strokeWidth="2" markerEnd="url(#arrow3)" />
      <ellipse cx="150" cy="60" rx="55" ry="38" fill="var(--paper)" stroke="var(--botanical-green-deep)" strokeWidth="2" />
      <circle cx="130" cy="50" r="6" fill="var(--specimen-red)" />
      <circle cx="150" cy="68" r="6" fill="var(--specimen-red)" />
      <circle cx="170" cy="48" r="6" fill="var(--specimen-red)" />
      <text x="150" y="105" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--ink-soft)">stored intact</text>
      <defs>
        <marker id="arrow3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--ink-soft)" />
        </marker>
      </defs>
    </svg>
  );
}

function SpeciesChip({ name, pokemonName, spriteIds }) {
  const id = spriteIds[pokemonName];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", width: "64px" }}>
      {id ? (
        <img src={spriteUrl(id)} alt={name} width={48} height={48} style={{ objectFit: "contain" }} onError={onSpriteError} />
      ) : (
        <div style={{ width: 48, height: 48 }} />
      )}
      <span className="mono" style={{ fontSize: "0.62rem", color: "var(--ink-soft)", textAlign: "center" }}>{name}</span>
    </div>
  );
}

function CohabitatPanel({ cohabitat, spriteIds }) {
  if (!cohabitat) return null;

  if (!cohabitat.location) {
    // No verified shared route — say so plainly instead of implying one.
    return (
      <div style={{ marginTop: "12px", padding: "12px 14px", background: "var(--paper)", borderRadius: "10px", border: "1px dashed var(--paper-shadow)" }}>
        <p className="eyebrow" style={{ fontSize: "0.85rem", marginBottom: "4px" }}>In-Game Distribution</p>
        <p style={{ fontSize: "0.8rem", color: "var(--ink-soft)", margin: 0 }}>{cohabitat.note}</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "12px", padding: "14px 16px", background: "var(--paper)", borderRadius: "10px", border: "1px solid var(--paper-shadow)" }}>
      <p className="eyebrow" style={{ fontSize: "0.85rem", marginBottom: "8px" }}>
        In-Game Distribution &mdash; {cohabitat.location} <span style={{ color: "var(--ink-soft)", fontWeight: 400 }}>({cohabitat.games})</span>
      </p>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "8px" }}>
        {cohabitat.companions.map((n) => (
          <SpeciesChip key={n} name={n[0].toUpperCase() + n.slice(1)} pokemonName={n} spriteIds={spriteIds} />
        ))}
      </div>
      <p style={{ fontSize: "0.78rem", color: "var(--ink-soft)", margin: 0 }}>{cohabitat.note}</p>
    </div>
  );
}

export default function PollinatorResistanceRoster({ manuscripts, spriteIds = {} }) {
  const [activeKey, setActiveKey] = useState("detox");
  const active = STRATEGIES.find((s) => s.key === activeKey);
  const citation = manuscripts[active.manuscriptId];

  return (
    <div className="plate-frame" style={{ padding: "24px 26px" }}>
      <p className="eyebrow" style={{ marginBottom: "4px" }}>Three Real Answers to One Problem</p>
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: "20px" }}>
        A pollinator or herbivore that regularly encounters a toxic plant has to survive it somehow.
        Real biology has independently found (at least) three different working answers &mdash;
        select one to see how it actually works and the real study behind it.
      </p>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        {STRATEGIES.map((s) => {
          const isActive = s.key === activeKey;
          return (
            <button
              key={s.key}
              onClick={() => setActiveKey(s.key)}
              style={{
                padding: "10px 14px",
                background: isActive ? "var(--botanical-green-deep)" : "var(--paper)",
                color: isActive ? "var(--paper-light)" : "var(--ink)",
                border: "1px solid var(--paper-shadow)",
                borderRadius: "10px",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontWeight: isActive ? 700 : 500,
                fontSize: "0.85rem",
                textAlign: "left",
              }}
            >
              <span style={{ display: "block" }}>{s.label}</span>
              <span
                className="mono"
                style={{
                  display: "block",
                  fontSize: "0.68rem",
                  marginTop: "2px",
                  color: isActive ? "var(--paper)" : "var(--ink-soft)",
                }}
              >
                {s.tagline}
              </span>
            </button>
          );
        })}
      </div>

      <div className="console-split console-split--figure-left">
        <div
          style={{
            background: "var(--paper)",
            border: "1px solid var(--paper-shadow)",
            borderRadius: "12px",
            padding: "12px",
          }}
        >
          <Diagram type={active.diagram} />
        </div>

        <div style={{ display: "grid", gap: "10px" }}>
          {active.summary.map((s) => (
            <p key={s.tag} style={{ fontSize: "0.9rem", color: "var(--ink-soft)", margin: 0 }}>
              <span className="eyebrow" style={{ fontSize: "0.88rem", marginRight: "8px" }}>{s.tag}</span>
              {s.text}
            </p>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "22px", paddingTop: "18px", borderTop: "1.5px dashed var(--paper-shadow)" }}>
        <p className="eyebrow" style={{ marginBottom: "10px", color: "var(--specimen-red)" }}>
          Who Might Actually Use This &mdash; Pok&eacute;mon-World Examples
        </p>
        <div style={{ display: "grid", gap: "16px" }}>
          {active.examples.map((ex) => (
            <div
              key={ex.name}
              style={{
                display: "grid",
                gridTemplateColumns: "72px 1fr",
                gap: "16px",
                padding: "14px 16px",
                border: "1.5px dashed var(--paper-shadow)",
                borderRadius: "12px",
              }}
            >
              <SpeciesChip name={ex.name} pokemonName={ex.pokemonName} spriteIds={spriteIds} />
              <div>
                <p style={{ fontWeight: 700, margin: "0 0 4px", fontSize: "0.95rem" }}>{ex.name}</p>
                <p style={{ fontSize: "0.85rem", color: "var(--ink-soft)", margin: 0 }}>{ex.rationale}</p>
                <CohabitatPanel cohabitat={ex.cohabitat} spriteIds={spriteIds} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "22px", padding: "16px 18px", background: "var(--paper)", borderRadius: "10px", border: "1px solid var(--paper-shadow)" }}>
        <p className="eyebrow" style={{ marginBottom: "8px" }}>Citation for This Strategy</p>
        {citation ? (
          <>
            <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: "0.9rem" }}>{citation.title}</p>
            <p className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-soft)", margin: "0 0 10px" }}>
              {[citation.authors, citation.year, citation.journal].filter(Boolean).join(" \u00b7 ")}
            </p>
            <a
              href={citation.link}
              target="_blank"
              rel="noreferrer"
              className="mono"
              style={{
                fontSize: "0.72rem",
                color: "var(--botanical-green-deep)",
                textDecoration: "none",
                border: "1px solid var(--botanical-green)",
                borderRadius: "999px",
                padding: "4px 12px",
              }}
            >
              Read the paper &#8599;
            </a>
          </>
        ) : (
          <p className="mono" style={{ fontSize: "0.8rem", color: "var(--ink-soft)", margin: 0 }}>Loading citation&hellip;</p>
        )}
      </div>
    </div>
  );
}

