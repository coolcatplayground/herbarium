// A heuristic, not a rule: real habitat depends on far more than a game's
// typing choices, and individual specimens can and do break the pattern
// (Cacnea/Cacturne are Grass/Dark, not Grass/Ground, despite being desert
// cacti — see the Dark entry below for why that's actually a coherent
// reading rather than a mismatch). Treat this as "what a dual-type often
// *suggests* about habitat," not as biological fact. Exceptions belong in
// each specimen's own field note, not as caveats bolted onto the category.

const habitatMap = {
  none: {
    name: "Temperate Woodland",
    description: "General forest and meadow flora with no strongly specialized secondary adaptation.",
  },
  water: {
    name: "Wetland & Aquatic",
    description: "Pond, marsh, and riverbank flora — water lilies, reeds, and other moisture-loving plants.",
  },
  ground: {
    name: "Deep-Rooted & Soil-Anchored Flora",
    description: "Plants investing heavily in extensive root systems and soil interaction — mycorrhizal networks, rhizosphere microbiome, structural anchoring — rather than aboveground growth. Drought tolerance often follows from this, but isn't the defining trait; it's about the relationship with soil, not necessarily dryness.",
  },
  fire: {
    name: "Pyrophyte / Fire-Adapted Flora",
    description: "A nod to real pyrophytes — plants adapted to fire-prone ecosystems, some of which even require fire exposure (serotiny) to germinate at all.",
  },
  rock: {
    name: "Cliffside & Mineral-Poor Soil",
    description: "Lithophytes and crevice-dwelling plants that root directly into rock or thin, mineral-poor soil.",
  },
  dark: {
    name: "Nocturnal-Function Flora",
    description: "Plants whose most important biology happens after dark: stomata that only open at night (as in CAM photosynthesis), processes timed to cooler night-time temperature and humidity, and flowers built for moth or bat pollinators instead of daytime insects. Desert cacti like Cacnea belong here precisely because of this, not despite it.",
  },
  poison: {
    name: "Toxic & Chemically-Defended Flora",
    description: "Plants leaning hard on secondary-metabolite chemistry — alkaloids, irritants, and other compounds — as their main defense against being eaten.",
  },
  fighting: {
    name: "Pioneer & Fast-Colonizing Flora",
    description: "Aggressive, competitive species built to move in fast after disturbance and out-compete slower neighbors for light, space, and nutrients — the plant-world equivalent of picking a fight and winning it through sheer growth rate.",
  },
  flying: {
    name: "Wind-Dispersed & Aerial Flora",
    description: "Anemochory specialists built for catching the wind — light seeds, fluffy pappus, minimal mass.",
  },
  bug: {
    name: "Insect-Associated Flora",
    description: "Plants whose life cycle is tightly bound up with insects, through mutualism, camouflage, or parasitism.",
  },
  fairy: {
    name: "Ornamental & Pollinator Flora",
    description: "Showy, pollinator-attracting blooms — the horticultural end of the spectrum.",
  },
  dragon: {
    name: "Ancient & Long-Lived Flora",
    description: "Slow-growing, long-lived species in the mold of old-growth trees and living fossils.",
  },
  ghost: {
    name: "Deadwood & Decomposer-Associated Flora",
    description: "Species tied to dead or decaying plant matter — fungi on old stumps, graveyard flora.",
  },
  psychic: {
    name: "Psychoactive & Sensory-Signaling Flora",
    description: "Two real threads share this type by coincidence of vibe. First, psychoactive chemistry: alkaloids like caffeine and nicotine, which evolved as herbivore deterrents and happen to alter animal minds too. Second, unusual sensing that reads almost extrasensory — volatile-compound \"communication\" between neighboring plants and mycorrhizal fungal networks relaying signals root-to-root (the \"wood wide web\") are well-established; claims of roots orienting toward the sound of running water, or plants showing learned habituation to a repeated stimulus, are published but genuinely contested within plant science, not settled fact.",
  },
  steel: {
    name: "Mineral-Accumulating Flora",
    description: "A nod to real hyperaccumulator plants, which concentrate metals from soil into their own tissue — some species are even used to help remediate contaminated soil.",
  },
  ice: {
    name: "Cold-Adapted & Alpine Flora",
    description: "Frost-hardy species suited to subalpine or high-latitude conditions.",
  },
  electric: {
    name: "Bioelectric-Signaling Flora",
    description: "A nod to real plant electrophysiology: many plants use electrical action potentials for rapid movement (a Venus flytrap's trap-shutting) or systemic signaling (an electrical spike racing through the whole plant after a wound). Not every member of this pairing is biological, though — Rotom-Mow is a possessed lawnmower, not a species, so treat that one as a flagged exception rather than a counterexample to the category.",
  },
  normal: {
    name: "Generalist Flora",
    description: "No strong secondary adaptation is signaled by this typing.",
  },
};

export function getHabitat(secondaryType, override) {
  if (override) return override;
  return habitatMap[secondaryType || "none"] || habitatMap.none;
}

export default habitatMap;
