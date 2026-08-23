import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import GeneExpressionConsole from "../components/GeneExpressionConsole";
import PollinatorResistanceRoster from "../components/PollinatorResistanceRoster";
import SucculenceConsole from "../components/SucculenceConsole";
import { fetchPokemon, spriteUrl, onSpriteError } from "../api/pokeapi";
import { loadManuscripts } from "../data/manuscriptsLoader";
import useDocumentTitle from "../hooks/useDocumentTitle";

// Real-world-analogue and in-game-cohabitation species referenced inside
// Vileplume's Case File (PollinatorResistanceRoster) but not specimens in
// their own right — fetched here so the roster can show real sprites
// without duplicating fetch/cache logic.
const RESISTANCE_EXAMPLE_NAMES = [
  "beedrill", "weedle",
  "butterfree", "caterpie",
  "venomoth", "venonat",
  "dustox",
  "oddish",
];

// Same idea for Cacnea's Case File (SucculenceConsole) — Cacturne and
// Maractus aren't the specimen itself, just comparison sprites.
const SUCCULENCE_EXAMPLE_NAMES = ["cacturne", "maractus"];

// Each case is grounded in a real specimen's own field note (see
// public/field-notes.txt) and real, open-access research — not invented
// placeholders. Each case's supporting citation is fetched live from
// manuscripts.txt (see manuscriptId below) rather than duplicated here
// as hardcoded text.
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
  succulence: {
    label: "Cacnea's Water Economy",
    caseNumber: "02",
    specimenName: "cacnea",
    manuscriptId: "fraderasoler-2022-succulent-cell-walls",
    interactionType: "succulence",
    summary: [
      {
        tag: "Abstract",
        text: "Fradera-Soler et al. (2022) reviewed how a succulent's water-storage capacity depends on cell walls that regulate their own elasticity, while Tan & Chen (2023) reviewed Crassulacean Acid Metabolism (CAM) as a separate mechanism for cutting daytime water loss by shifting stomatal activity to night. Two real, independently-studied mechanisms, not one.",
      },
      {
        tag: "Hypothesis",
        text: "A real plant doesn't tune itself mid-drought \u2014 it meets the dry season already built a certain way, and the season does the rest. So the honest test isn't adjusting two mechanisms against each other; it's fixing a specimen's build and running time forward to see which day it fails on, and why.",
      },
      {
        tag: "Result",
        text: "Storage and timing fail in genuinely different ways, which only becomes visible once time is running: a rigid-walled specimen ruptures with water still in the tank, while a well-built one survives by entering CAM idling and earning nothing for weeks. Surviving and growing turn out to be separate outcomes \u2014 and the same storage-plus-timing combination shows up independently across 80-plus unrelated real plant families, and in a second, unrelated cactus Pok\u00e9mon.",
      },
    ],
  },
  toxinResistance: {
    label: "Vileplume's Toxic Pollen",
    caseNumber: "03",
    specimenName: "vileplume",
    manuscriptId: "haas-2023-cyp336-detox",
    interactionType: "resistance",
    summary: [
      {
        tag: "Abstract",
        text: "Three real, independently-evolved insect strategies exist for surviving a toxic plant: enzymatic detoxification (Haas et al. 2023), target-site insensitivity (Dobler et al. 2012), and sequestration (Agrawal et al. 2021) \u2014 three separate real answers to the same underlying problem, not three competing theories about one answer.",
      },
      {
        tag: "Hypothesis",
        text: "Vileplume's pollen is framed, in-universe, as toxic enough to be genuinely dangerous, not just an allergen. If something regularly handled it, real biology says it would need one of these three strategies (or more than one at once) to survive \u2014 which fits best?",
      },
      {
        tag: "Result",
        text: "There isn't one right answer to test against \u2014 real biology has already solved this problem three separate ways, and a real community around one toxic plant can easily run several of these strategies side by side in different species. The roster below is the case itself, not a verdict.",
      },
    ],
  },
};

export default function GraftingBench() {
  useDocumentTitle("The Grafting Bench");
  const [searchParams] = useSearchParams();
  const requestedCase = searchParams.get("case");
  const [traitKey, setTraitKey] = useState(
    requestedCase && TRAITS[requestedCase] ? requestedCase : "pigment"
  );
  const [specimenIds, setSpecimenIds] = useState({});
  const [manuscripts, setManuscripts] = useState({});

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      [
        ...Object.values(TRAITS).map((t) => t.specimenName),
        ...RESISTANCE_EXAMPLE_NAMES,
        ...SUCCULENCE_EXAMPLE_NAMES,
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

  return (
    <div className="container" style={{ padding: "40px 24px 100px" }}>
      <section style={{ maxWidth: "760px", marginBottom: "32px" }}>
        <p className="eyebrow">Where Two Things Meet</p>
        <h2 style={{ fontSize: "var(--step3)" }}>The Grafting Bench</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          A graft only takes when the tissue underneath is actually compatible &mdash; force two
          incompatible species together and it fails cleanly rather than pretending to succeed.
          This bench runs the same test on Pok&eacute;mon's world: take a real study, hold it up
          against a specimen already in the Herbarium, and see how far it actually reaches. Some
          cases graft clean all the way through &mdash; a real mechanism, applied directly. Others
          only reach partway, and the case says so rather than forcing the rest.
        </p>
      </section>

      {/* Trimmed to keep the console reachable. Two headed sections both
          explaining the bench put the first control 1467px down the page, and
          this one's tail — the journey being half the fun, the drawer always
          open — was saying nothing the paragraph above had not already said
          better. What survives is the part that carries information: what
          every case is actually made of. */}
      <section style={{ maxWidth: "720px", marginBottom: "28px" }}>
        <p className="eyebrow">The Rootstock &mdash; Real Botany</p>
        <h2 style={{ fontSize: "var(--step3)" }}>Case Files</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          Pull up a stool. Every case starts the same way: a real specimen from the Herbarium and
          a real, open-access paper. After that, all bets are off &mdash; some end with satisfying
          answers, others with better questions.
        </p>
      </section>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "-1px", position: "relative", zIndex: 1 }}>
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
                <img src={spriteUrl(specimenIds[t.specimenName])} alt={t.specimenName} width={22} height={22} onError={onSpriteError} />
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

        {/* The instrument comes before the argument for it.
            Measured in the browser rather than judged by eye: with the
            Abstract/Hypothesis/Result block sitting above, the first control on
            this page was at 1467px and the specimen diagram at 1761px — past
            two full screens at a 720px viewport, with nothing touchable visible
            on the first one. A visitor decided whether to stay before reaching
            anything they could press. Each console carries its own one-line
            framing, so nothing is orphaned by the move.

            It also stops the case spoiling itself: "Result" describes what the
            console is about to show you. Read before, it is a spoiler; read
            after, it is the payoff. */}
        {trait.interactionType === "expression" ? (
          <GeneExpressionConsole />
        ) : trait.interactionType === "resistance" ? (
          <PollinatorResistanceRoster manuscripts={manuscripts} spriteIds={specimenIds} />
        ) : (
          <SucculenceConsole spriteIds={specimenIds} />
        )}

        {trait.summary ? (
          <div style={{ display: "grid", gap: "10px", marginTop: "24px", maxWidth: "680px" }}>
            {trait.summary.map((s) => (
              <p key={s.tag} style={{ fontSize: "0.9rem", color: "var(--ink-soft)", margin: 0 }}>
                <span className="eyebrow" style={{ fontSize: "0.88rem", marginRight: "8px" }}>{s.tag}</span>
                {s.text}
              </p>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", marginTop: "24px", maxWidth: "680px" }}>{trait.explainer}</p>
        )}

        {trait.interactionType !== "resistance" && trait.interactionType !== "succulence" && (
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
              Truth is, nobody's actually run any of these three tests on Vileplume's own pollen
              &mdash; we don't know which mechanism a real specimen would need, or even how many
              different toxins are packed into one flower. It's entirely possible it isn't one clean
              toxin at all, but a cocktail: something an enzymatic-detox insect could shrug off,
              sitting right next to a compound only a target-site-insensitive insect could survive.
              A single real flower producing several structurally different defenses at once isn't
              far-fetched &mdash; plenty of real plants do exactly that. Filing this case as an open
              research proposal, not a conclusion. The actual test subject is still out in the field.
            </p>
          ) : (
            <p style={{ margin: 0 }}>
              Run a rigid cortex on an obligate CAM schedule and watch what actually kills it: it
              ruptures on day nine with 13% of its water still in the tank. Flawless stomatal timing
              doesn&rsquo;t save tissue that can&rsquo;t fold as it empties &mdash; the two
              mechanisms fail in genuinely different ways, and only one of those failures is about
              running out of water. Then try every combination. Exactly one reaches the rains: deep
              elastic parenchyma committed to nocturnal uptake from day one. The facultative build
              misses by three days, which is the honest result rather than a tuned one &mdash; in an
              unbroken drought, commitment beats flexibility, and the reason real facultative CAM
              plants exist is that most climates aren&rsquo;t unbroken droughts. They&rsquo;re
              variable, and switching only pays when there&rsquo;s something to switch back to.
              Worth noting what the winner actually earned: it survives by spending most of the
              season sealed shut, gaining nothing. Surviving and growing come apart entirely, and a
              real desert plant spends most of its life on the wrong side of that gap.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
