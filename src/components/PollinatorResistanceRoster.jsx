import { useState } from "react";

// Three real, independently-evolved strategies insects use against toxic
// plant compounds. None of the three cited papers studies Vileplume or
// anything like it — each is cited only for the real mechanism, the same
// "grounded citation, speculative application" pattern used for Roselia's
// blue-arm theory. The toxins involved differ across the three real
// studies too (alkaloids for the enzymatic case, cardenolides for the
// other two) — that's honest: these are three real answers to the general
// problem of "a pollinator needs to survive a plant's toxic chemistry,"
// not three papers about one toxin.
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
        tag: "Real Evidence",
        text: "Haas et al. (2023) found the CYP336 family conserved across honeybees and other Hymenoptera spanning 281 million years of divergence \u2014 all of them independently kept the same enzyme family for the same job: clearing alkaloids from nectar and pollen.",
      },
      {
        tag: "Trade-off",
        text: "Detox enzymes are metabolically expensive to run continuously and only work on toxins the enzyme has evolved to recognize \u2014 a new toxin structure can slip past entirely.",
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
        text: "The toxin's actual binding target \u2014 here, the sodium pump (Na+/K+-ATPase) that cardenolides jam \u2014 accumulates amino acid substitutions that block the toxin from docking, without losing the pump's own normal job.",
      },
      {
        tag: "Real Evidence",
        text: "Dobler et al. (2012) screened insects across six orders and found the same handful of substitution sites reused again and again \u2014 convergent evolution converging on the same fix independently, not one shared ancestor's trick.",
      },
      {
        tag: "Trade-off",
        text: "The toxin is still absorbed and circulating; insensitivity only protects the one target site. Anything toxic through a different mechanism gets straight through.",
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
        tag: "Real Evidence",
        text: "Agrawal et al. (2021) showed monarch caterpillars selectively sequester specific milkweed cardenolides while converting a more dangerous one \u2014 voruscharin \u2014 into safer stored forms, but paid a real, measurable cost in growth rate for doing it.",
      },
      {
        tag: "Trade-off",
        text: "Sequestration isn't free \u2014 the 2021 study is explicit that heavier sequestration directly predicted slower caterpillar growth. Carrying the toxin costs something, even successfully stored.",
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

export default function PollinatorResistanceRoster({ manuscripts }) {
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

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "28px", alignItems: "start" }}>
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
              <span className="eyebrow" style={{ fontSize: "0.68rem", marginRight: "8px" }}>{s.tag}</span>
              {s.text}
            </p>
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

      <div style={{ marginTop: "22px", paddingTop: "18px", borderTop: "1.5px dashed var(--paper-shadow)" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--ink-soft)", margin: 0 }}>
          <strong style={{ color: "var(--ink)" }}>Worth being honest about:</strong> none of these
          three papers studies Vileplume, and they aren't even about the same toxin class as each
          other (alkaloids for the detox case, cardenolides for the other two). They're cited here
          only for the real mechanism each one demonstrates. Vileplume's own field note already
          grounds its pollen in real spore-dispersal biology &mdash; this case asks a different,
          speculative question: given how toxic that pollen is framed in-universe, which of these
          three real strategies would something that regularly handled it most plausibly evolve?
        </p>
      </div>
    </div>
  );
}
