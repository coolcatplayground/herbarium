import { useState } from "react";
import PunnettSquare from "../components/PunnettSquare";
import IVBreeder from "../components/IVBreeder";
import TheorycraftingFAQ from "../components/TheorycraftingFAQ";
import { gameMechanics, STRENGTH_META } from "../data/gameMechanics";
import theorycrafting from "../data/theorycrafting";
import useDocumentTitle from "../hooks/useDocumentTitle";

const TRAITS = {
  pigment: {
    label: "Petal Pigment",
    mode: "complete",
    alleleUpper: "V",
    alleleLower: "v",
    dominantLabel: "Vivid crimson",
    recessiveLabel: "Pale ivory",
    blendLabel: "",
    explainer:
      "Complete dominance: one allele fully masks the other in the heterozygote. This is the classic Mendelian pattern from his pea plant crosses \u2014 a single copy of the dominant pigment-producing allele is enough to turn petals crimson, regardless of what the second allele is.",
  },
  waxiness: {
    label: "Leaf Cuticle Wax",
    mode: "incomplete",
    alleleUpper: "W",
    alleleLower: "w",
    dominantLabel: "Heavy wax bloom",
    recessiveLabel: "Matte leaf",
    blendLabel: "Light sheen (blended)",
    explainer:
      "Incomplete dominance: the heterozygote doesn't resemble either parent, it blends between them. Real cuticle-wax thickness often behaves this way \u2014 wax output scales roughly with allele dosage, so one working copy of the gene produces about half the wax of two.",
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

  const trait = TRAITS[traitKey];
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
        <h2 style={{ fontSize: "var(--step3)" }}>The Real Cross</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          A simplified monohybrid cross calculator, using real plant genetics &mdash; this section
          isn't about how Pok&eacute;mon breeding actually works in the games, just the biology
          underneath any real cross. Everything else on this page grafts onto this.
        </p>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "40px", alignItems: "start" }}>
        <div className="plate-frame" style={{ padding: "20px", display: "grid", gap: "18px" }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: "8px" }}>Trait</p>
            {Object.entries(TRAITS).map(([key, t]) => (
              <label key={key} style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.85rem", marginBottom: "6px" }}>
                <input type="radio" name="trait" checked={traitKey === key} onChange={() => setTraitKey(key)} />
                {t.label}
              </label>
            ))}
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

          <div className="plate-frame" style={{ padding: "18px 20px", marginTop: "28px" }}>
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
