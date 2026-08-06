import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PunnettSquare from "../components/PunnettSquare";
import GeneExpressionConsole from "../components/GeneExpressionConsole";
import PollinatorResistanceRoster from "../components/PollinatorResistanceRoster";
import { fetchPokemon, spriteUrl } from "../api/pokeapi";
import { loadManuscripts } from "../data/manuscriptsLoader";
import useDocumentTitle from "../hooks/useDocumentTitle";

// Real-world-analogue and in-game-cohabitation species referenced inside
// Vileplume's Case File (PollinatorResistanceRoster) but not specimens in
// their own right — fetched here so the roster can show real sprites
// without duplicating fetch/cache logic.
const RESISTANCE_EXAMPLE_NAMES = [
  "beedrill", "weedle",
  "butterfree",
  "venomoth", "venonat",
  "dustox",
  "oddish",
];

// Both traits are grounded in a real specimen's own field note (see
// public/field-notes.txt) rather than invented placeholders — this is
// explicitly "what if that specimen's real biology followed simple
// Mendelian rules," not a claim about how the trait actually inherits.
// Each case's supporting citation is fetched live from manuscripts.txt
// (see manuscriptId below) rather than duplicated here as hardcoded text.
const TRAITS = {
  pigment: {
    label: "Roselia's Flower Pigment",
    caseNumber: "01",
    specimenName: "roselia",
    manuscriptId: "lu-2021-rose-anthocyanin",
    interactionType: "expression",
    summary: [
      {
        tag: "Abstract",
        text: "Lu et al. (2021) compared a light-pink miniature rose to its natural deep-pink mutant using paired metabolomics and transcriptomics. Deeper pigmentation tracked coordinated upregulation across three pathway stages \u2014 biosynthesis, stabilization, and vacuolar transport \u2014 rather than a single gene switching on or off.",
      },
      {
        tag: "Hypothesis",
        text: "If Roselia's bloom intensity runs on the same real mechanism, tuning expression across these same three stages should reproduce the same pale-to-deep gradient.",
      },
      {
        tag: "Result",
        text: "A gene-expression model explains variation within one individual \u2014 exactly what Roselia's own two-flower, two-color design calls for. A Punnett square only explains variation between separate individuals from a cross, which makes it the wrong tool here.",
      },
    ],
  },
  waxiness: {
    label: "Cacnea's Water-Storage Tissue",
    caseNumber: "02",
    specimenName: "cacnea",
    manuscriptId: "fraderasoler-2022-succulent-cell-walls",
    interactionType: "punnett",
    mode: "incomplete",
    alleleUpper: "W",
    alleleLower: "w",
    dominantLabel: "Heavy succulence",
    recessiveLabel: "Minimal water storage",
    blendLabel: "Moderate succulence (blended)",
    explainer:
      "Cacnea's own field note ties its desert survival to succulent parenchyma cells built for water retention. Real succulence often behaves as a dosage-dependent trait: a heterozygote produces roughly half the water-storage tissue of a homozygous-heavy individual, showing up as an intermediate build rather than a simple present/absent trait.",
  },
  toxinResistance: {
    label: "Vileplume's Toxic Pollen",
    caseNumber: "03",
    specimenName: "vileplume",
    manuscriptId: "haas-2023-cyp336-detox",
    interactionType: "resistance",
    summary: [
      {
        tag: "Premise",
        text: "Vileplume's pollen is framed, in-universe, as toxic enough to be genuinely dangerous \u2014 not just an allergen. Real plants that weaponize their pollen or nectar this way create a hard problem for anything that regularly has to handle it.",
      },
      {
        tag: "Question",
        text: "Real biology hasn't settled on one universal fix for that problem \u2014 it's found several independent ones. Which of them would something that regularly handled Vileplume's pollen most plausibly evolve?",
      },
      {
        tag: "Approach",
        text: "Rather than one theory, this case is a roster: three real, independently-evolved resistance strategies, each grounded in its own real study, laid out side by side below.",
      },
    ],
  },
};

const GENOTYPES = ["homozygous dominant", "heterozygous", "homozygous recessive"];

function genotypeString(choice, upper, lower) {
  if (choice === "homozygous dominant") return upper + upper;
  if (choice === "heterozygous") return upper + lower;
  return lower + lower;
}

export default function GraftingBench() {
  useDocumentTitle("The Grafting Bench");
  const [searchParams] = useSearchParams();
  const requestedCase = searchParams.get("case");
  const [traitKey, setTraitKey] = useState(
    requestedCase && TRAITS[requestedCase] ? requestedCase : "pigment"
  );
  const [parentAChoice, setParentAChoice] = useState("heterozygous");
  const [parentBChoice, setParentBChoice] = useState("homozygous recessive");
  const [specimenIds, setSpecimenIds] = useState({});
  const [manuscripts, setManuscripts] = useState({});

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      [
        ...Object.values(TRAITS).map((t) => t.specimenName),
        ...RESISTANCE_EXAMPLE_NAMES,
      ].map((name) => fetchPokemon(name).then((data) => [name, data.id]))
    ).then((pairs) => {
      if (!cancelled) setSpecimenIds(Object.fromEntries(pairs));
    });
    loadManuscripts().then((list) => {
      if (cancelled) return;
      const byId = {};
      list.forEach((m) => {
        byId[m.id] = m;
      });
      setManuscripts(byId);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const trait = TRAITS[traitKey];
  const citation = manuscripts[trait.manuscriptId];
  const parentA = genotypeString(parentAChoice, trait.alleleUpper, trait.alleleLower);
  const parentB = genotypeString(parentBChoice, trait.alleleUpper, trait.alleleLower);

  return (
    <div className="container" style={{ padding: "40px 24px 100px" }}>
      <section style={{ maxWidth: "760px", marginBottom: "48px" }}>
        <p className="eyebrow">Where Two Things Meet</p>
        <h2 style={{ fontSize: "var(--step3)" }}>The Grafting Bench</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          A graft only works when two genetically different plants are compatible enough to fuse
          into one functioning organism &mdash; the rootstock keeps growing, the scion produces the
          fruit, and where they don't take, the graft fails cleanly rather than pretending to
          succeed. This page runs the same test on Pok&eacute;mon's world: real plant genetics
          checked against a specimen already in the Herbarium, case by case, to see where the graft
          actually holds.
        </p>
      </section>

      <section style={{ maxWidth: "720px", marginBottom: "36px" }}>
        <p className="eyebrow">The Rootstock &mdash; Real Botany</p>
        <h2 style={{ fontSize: "var(--step3)" }}>Case Files</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          Three open case files, each built on a real specimen already in the Herbarium and real,
          open-access research &mdash; two ask what would happen if a detail from a specimen's own
          field note actually followed simple Mendelian inheritance, and the third is a roster of
          real strategies real biology has found for a real problem.
        </p>
      </section>

      <div style={{ display: "flex", gap: "8px", marginBottom: "-1px", position: "relative", zIndex: 1 }}>
        {Object.entries(TRAITS).map(([key, t]) => {
          const active = traitKey === key;
          return (
            <button
              key={key}
              onClick={() => setTraitKey(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                background: active ? "var(--paper-light)" : "var(--paper)",
                border: "1px solid var(--paper-shadow)",
                borderBottom: active ? "1px solid var(--paper-light)" : "1px solid var(--paper-shadow)",
                borderRadius: "10px 10px 0 0",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontWeight: active ? 700 : 500,
                color: active ? "var(--botanical-green-deep)" : "var(--ink-soft)",
              }}
            >
              {specimenIds[t.specimenName] && (
                <img src={spriteUrl(specimenIds[t.specimenName])} alt={t.specimenName} width={22} height={22} />
              )}
              <span className="mono" style={{ fontSize: "0.65rem", color: "var(--specimen-red)" }}>
                Case {t.caseNumber}
              </span>
              <span style={{ fontSize: "0.85rem" }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="plate-frame" style={{ borderTopLeftRadius: 0, padding: "28px" }}>
        <div style={{ marginBottom: "20px" }}>
          <p className="eyebrow" style={{ marginBottom: "4px" }}>
            Case {trait.caseNumber} &mdash; {trait.label}
          </p>
          <Link
            to={`/specimen/${trait.specimenName}`}
            className="mono"
            style={{ fontSize: "0.7rem", color: "var(--specimen-red)", textDecoration: "none" }}
          >
            &rarr; see {trait.specimenName}'s full field note
          </Link>
        </div>

        {trait.summary ? (
          <div style={{ display: "grid", gap: "10px", marginBottom: "24px", maxWidth: "680px" }}>
            {trait.summary.map((s) => (
              <p key={s.tag} style={{ fontSize: "0.9rem", color: "var(--ink-soft)", margin: 0 }}>
                <span className="eyebrow" style={{ fontSize: "0.68rem", marginRight: "8px" }}>{s.tag}</span>
                {s.text}
              </p>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", marginBottom: "24px", maxWidth: "680px" }}>{trait.explainer}</p>
        )}

        {trait.interactionType === "expression" ? (
          <GeneExpressionConsole />
        ) : trait.interactionType === "resistance" ? (
          <PollinatorResistanceRoster manuscripts={manuscripts} spriteIds={specimenIds} />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "40px", alignItems: "start" }}>
            <div style={{ display: "grid", gap: "18px" }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: "8px" }}>Parent A ({trait.alleleUpper}{trait.alleleLower})</p>
                <select value={parentAChoice} onChange={(e) => setParentAChoice(e.target.value)} style={{ width: "100%", padding: "8px", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                  {GENOTYPES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="eyebrow" style={{ marginBottom: "8px" }}>Parent B ({trait.alleleUpper}{trait.alleleLower})</p>
                <select value={parentBChoice} onChange={(e) => setParentBChoice(e.target.value)} style={{ width: "100%", padding: "8px", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                  {GENOTYPES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <PunnettSquare
              parentA={parentA}
              parentB={parentB}
              mode={trait.mode}
              dominantLabel={trait.dominantLabel}
              recessiveLabel={trait.recessiveLabel}
              blendLabel={trait.blendLabel}
            />
          </div>
        )}

        {trait.interactionType !== "resistance" && (
        <div style={{ marginTop: "24px", padding: "16px 18px", background: "var(--paper)", borderRadius: "10px", border: "1px solid var(--paper-shadow)" }}>
          <p className="eyebrow" style={{ marginBottom: "8px" }}>Supporting Literature</p>
          {citation ? (
            <>
              <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: "0.9rem" }}>{citation.title}</p>
              <p className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-soft)", margin: "0 0 10px" }}>
                {[citation.authors, citation.year, citation.journal].filter(Boolean).join(" \u00b7 ")}
              </p>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
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
                <Link to="/manuscripts" className="mono" style={{ fontSize: "0.72rem", color: "var(--specimen-red)", textDecoration: "none" }}>
                  &rarr; full entry in the Reading Room
                </Link>
              </div>
            </>
          ) : (
            <p className="mono" style={{ fontSize: "0.8rem", color: "var(--ink-soft)", margin: 0 }}>Loading citation&hellip;</p>
          )}
        </div>
        )}

        <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--paper-line)" }}>
          <p className="eyebrow" style={{ marginBottom: "8px" }}>From the Field Journal</p>
          {trait.interactionType === "expression" ? (
            <p style={{ margin: 0 }}>
              Notice that pushing any single slider to 100 doesn't guarantee a deep color if the
              other two stay low &mdash; the bottleneck label tracks whichever stage is currently
              most limiting. That's how real biosynthetic pathways behave: output is capped by the
              most restrictive step, not the average of all of them, which is exactly why the real
              paper singles out CHS as "the primary rate-limiting enzyme" rather than treating all
              fifteen differentially expressed genes as equally important.
            </p>
          ) : trait.interactionType === "resistance" ? (
            <p style={{ margin: 0 }}>
              None of these three strategies is "the" answer &mdash; they're independent solutions
              that different insect lineages arrived at separately, sometimes to the very same toxin
              class. A real community of pollinators and herbivores around one toxic plant can easily
              contain several of these strategies at once, running side by side in different species,
              which is closer to how real chemical ecology actually looks than a single universal fix
              would be.
            </p>
          ) : (
            <p style={{ margin: 0 }}>
              Genotype is the pair of alleles a specimen carries; phenotype is what you can actually
              observe. Two specimens can look identical yet carry different genotypes &mdash; a heterozygote
              and a homozygous dominant individual often can't be told apart without a test cross,
              which is exactly what this bench lets you simulate: hold one parent's genotype
              constant and vary the other to see which offspring ratios would reveal a hidden
              recessive allele.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
