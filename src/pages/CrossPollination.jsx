import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PunnettSquare from "../components/PunnettSquare";
import IVBreeder from "../components/IVBreeder";
import TheorycraftingFAQ from "../components/TheorycraftingFAQ";
import { fetchPokemon } from "../api/pokeapi";
import { loadManuscripts } from "../data/manuscriptsLoader";
import { gameMechanics, STRENGTH_META } from "../data/gameMechanics";
import theorycrafting from "../data/theorycrafting";
import useDocumentTitle from "../hooks/useDocumentTitle";

function spriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

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
    mode: "complete",
    alleleUpper: "A",
    alleleLower: "a",
    dominantLabel: "Red-shifted bloom",
    recessiveLabel: "Blue-shifted bloom",
    blendLabel: "",
    explainer:
      "Roselia's own field note credits its red-and-blue flower combo to anthocyanin pathway genetics \u2014 the same pigment system real roses use, shiftable red-to-blue by modifying genes and soil pH. Treat that pigment-shifting gene as simple Mendelian dominance, and one copy of the red-shifting allele is enough to pull a bloom toward red, regardless of the second allele.",
  },
  waxiness: {
    label: "Cacnea's Water-Storage Tissue",
    caseNumber: "02",
    specimenName: "cacnea",
    manuscriptId: "fraderasoler-2022-succulent-cell-walls",
    mode: "incomplete",
    alleleUpper: "W",
    alleleLower: "w",
    dominantLabel: "Heavy succulence",
    recessiveLabel: "Minimal water storage",
    blendLabel: "Moderate succulence (blended)",
    explainer:
      "Cacnea's own field note ties its desert survival to succulent parenchyma cells built for water retention. Real succulence often behaves as a dosage-dependent trait: a heterozygote produces roughly half the water-storage tissue of a homozygous-heavy individual, showing up as an intermediate build rather than a simple present/absent trait.",
  },
};

const GENOTYPES = ["homozygous dominant", "heterozygous", "homozygous recessive"];

function genotypeString(choice, upper, lower) {
  if (choice === "homozygous dominant") return upper + upper;
  if (choice === "heterozygous") return upper + lower;
  return lower + lower;
}

export default function CrossPollination() {
  useDocumentTitle("The Grafting Bench");
  const [traitKey, setTraitKey] = useState("pigment");
  const [parentAChoice, setParentAChoice] = useState("heterozygous");
  const [parentBChoice, setParentBChoice] = useState("homozygous recessive");
  const [specimenIds, setSpecimenIds] = useState({});
  const [manuscripts, setManuscripts] = useState({});

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      Object.values(TRAITS).map((t) =>
        fetchPokemon(t.specimenName).then((data) => [t.specimenName, data.id])
      )
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
          succeed. This page runs the same test on Pok&eacute;mon's world: real plant genetics on
          one side, the games' own pseudo-genetics and fan theory on the other, checked against each
          other section by section to see where the graft actually holds.
        </p>
      </section>

      <section style={{ maxWidth: "720px", marginBottom: "36px" }}>
        <p className="eyebrow">The Rootstock &mdash; Real Botany</p>
        <h2 style={{ fontSize: "var(--step3)" }}>Case Files</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          Two open case files, each built on a real specimen already in the Herbarium and a real,
          open-access paper on that exact trait &mdash; what would happen if a detail from each
          one's own field note actually followed simple Mendelian inheritance? Everything else on
          this page grafts onto this.
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

      <div
        className="plate-frame"
        style={{ borderTopLeftRadius: 0, padding: "28px", display: "grid", gridTemplateColumns: "280px 1fr", gap: "40px", alignItems: "start" }}
      >
        <div style={{ display: "grid", gap: "18px" }}>
          <div>
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

          <hr className="hairline" />
          <p style={{ fontSize: "0.82rem", color: "var(--ink-soft)", margin: 0 }}>{trait.explainer}</p>
        </div>

        <div>
          <PunnettSquare
            parentA={parentA}
            parentB={parentB}
            mode={trait.mode}
            dominantLabel={trait.dominantLabel}
            recessiveLabel={trait.recessiveLabel}
            blendLabel={trait.blendLabel}
          />

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

          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--paper-line)" }}>
            <p className="eyebrow" style={{ marginBottom: "8px" }}>From the Field Journal</p>
            <p style={{ margin: 0 }}>
              Genotype is the pair of alleles a specimen carries; phenotype is what you can actually
              observe. Two specimens can look identical yet carry different genotypes &mdash; a heterozygote
              and a homozygous dominant individual often can't be told apart without a test cross,
              which is exactly what this bench lets you simulate: hold one parent's genotype
              constant and vary the other to see which offspring ratios would reveal a hidden
              recessive allele.
            </p>
          </div>
        </div>
      </div>

      <section style={{ maxWidth: "760px", margin: "80px 0 32px" }}>
        <p className="eyebrow">Testing the Graft</p>
        <h2 style={{ fontSize: "var(--step3)" }}>What If It Were Real?</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          The games use genetics-flavored words &mdash; inheritance, natures, hidden traits &mdash;
          but the actual rules are game design, not biology. Here's an honest read on which
          mechanics hold up as real genetics, and which don't.
        </p>
      </section>

      <div style={{ display: "grid", gap: "16px", marginBottom: "40px" }}>
        {gameMechanics.map((m) => {
          const meta = STRENGTH_META[m.strength];
          return (
            <div key={m.name} className="plate-frame" style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                <h3 style={{ fontSize: "1.05rem", margin: 0 }}>{m.name}</h3>
                <span
                  className="mono"
                  style={{
                    fontSize: "0.68rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: meta.color,
                    border: `1px solid ${meta.color}`,
                    borderRadius: "999px",
                    padding: "3px 10px",
                  }}
                >
                  {meta.label}
                </span>
              </div>
              <p style={{ margin: "0 0 8px", fontSize: "0.92rem" }}>
                <span className="eyebrow" style={{ fontSize: "0.7rem", display: "block", marginBottom: "2px" }}>The Game Rule</span>
                {m.gameRule}
              </p>
              <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--ink-soft)" }}>
                <span className="eyebrow" style={{ fontSize: "0.7rem", display: "block", marginBottom: "2px" }}>The Biology Read</span>
                {m.biologyRead}
              </p>
            </div>
          );
        })}
      </div>

      <IVBreeder />

      <section style={{ maxWidth: "760px", margin: "80px 0 24px" }}>
        <p className="eyebrow">A Graft That Barely Takes</p>
        <h2 style={{ fontSize: "var(--step3)" }}>The Ditto Problem</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          Ditto can breed with almost any Pok&eacute;mon in the game, transforming to mate with
          whatever it's paired with &mdash; and the offspring is always 100% the other parent's
          species, never part-Ditto. Play that straight as real biology and it gets genuinely
          strange fast.
        </p>
      </section>

      <div style={{ display: "grid", gap: "16px", maxWidth: "760px", marginBottom: "40px" }}>
        <div className="plate-frame" style={{ padding: "18px 22px" }}>
          <p className="eyebrow" style={{ marginBottom: "8px" }}>Why Real Biology Says This Shouldn't Work</p>
          <p style={{ margin: 0 }}>
            Real species keep to their own kind through reproductive isolation &mdash; mismatched
            courtship behavior, incompatible mating anatomy, sperm-egg recognition proteins that
            don't fit, or, if fertilization somehow happens anyway, inviable or sterile hybrids
            (a mule can't have foals). A universal genetic donor compatible with almost the entire
            Pok&eacute;dex has no real precedent &mdash; but there's one animal that gets
            unnervingly close.
          </p>
        </div>

        <div className="plate-frame" style={{ padding: "18px 22px" }}>
          <p className="eyebrow" style={{ marginBottom: "8px" }}>The Closest Real Parallel: Gynogenesis</p>
          <p style={{ margin: 0 }}>
            The Amazon molly (<em>Poecilia formosa</em>), an all-female fish, reproduces by
            gynogenesis &mdash; sperm-dependent parthenogenesis. Females still need to mate with a
            male of a related species, but his sperm only triggers embryo development; his genetic
            material is discarded entirely, and the offspring are clones of the mother alone. That's
            a striking match for how Ditto breeding actually works: the non-Ditto parent's species
            is all that comes out the other end, as if Ditto's own genetic identity simply doesn't
            get incorporated.
          </p>
        </div>

        <div className="plate-frame" style={{ padding: "18px 22px" }}>
          <p className="eyebrow" style={{ marginBottom: "8px" }}>Where Even That Comparison Breaks Down</p>
          <p style={{ margin: 0 }}>
            Even gynogenesis has real limits Ditto doesn't share. A 2023 study found Amazon mollies
            could trigger reproduction with sperm from closely related genera (<em>Poecilia</em>,{" "}
            <em>Limia</em>) but not from more distantly related ones (<em>Gambusia</em>,{" "}
            <em>Girardinus</em>, <em>Heterandria</em>, <em>Poeciliopsis</em>, <em>Xiphophorus</em>)
            &mdash; real sperm-egg compatibility still hits a wall. Ditto, by contrast, can pair
            with nearly the entire Pok&eacute;dex regardless of type, size, or design. The real-world
            animal that comes closest to a Ditto still isn't nearly as promiscuous as Ditto actually
            is in the games.
          </p>
          <p className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-soft)", margin: "12px 0 0" }}>
            Source: Cerepaka &amp; Schlupp, 2023, <em>PeerJ</em> &mdash; see The Reading Room for the full citation and link.
          </p>
        </div>
      </div>

      <section style={{ maxWidth: "760px", margin: "60px 0 24px" }}>
        <p className="eyebrow">Looser Grafts</p>
        <h2 style={{ fontSize: "var(--step3)" }}>Theorycrafting Corner</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          A few more popular fan theories, each given an honest real-genetics read rather than a
          hand-wave.
        </p>
      </section>

      <div style={{ maxWidth: "760px" }}>
        <TheorycraftingFAQ items={theorycrafting} />
      </div>
    </div>
  );
}
