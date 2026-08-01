// How closely each real in-game breeding mechanic actually parallels real
// genetics. Written to be honest, including where the parallel is weak or
// nonexistent — that's a feature, not a gap.

const STRENGTH_META = {
  strong: { label: "Strong parallel", color: "var(--botanical-green)" },
  partial: { label: "Partial parallel", color: "var(--gold-line)" },
  none: { label: "No real analog", color: "var(--specimen-red)" },
};

const gameMechanics = [
  {
    name: "IVs & the Destiny Knot",
    strength: "strong",
    gameRule:
      "Every stat secretly has an Individual Value (IV) from 0\u201331, rolled when an egg is created. Holding a Destiny Knot while breeding makes the offspring inherit 5 of its 6 IVs directly from its two parents; the 6th is rolled fresh.",
    biologyRead:
      "This is the closest real parallel in the games: each stat behaves like an unlinked gene, independently inherited from one parent or the other rather than blended \u2014 real independent assortment. The Destiny Knot just raises how many stats get sampled from the parents instead of generated from scratch.",
  },
  {
    name: "Hidden Ability inheritance",
    strength: "strong",
    gameRule:
      "If the mother (or either parent, depending on the game) has a Hidden Ability, there's roughly a 60% chance \u2014 100% with certain items \u2014 that offspring will have it too. Otherwise offspring get a normal ability.",
    biologyRead:
      "A trait that's present in the genome but only shows up in some offspring some of the time is a solid match for incomplete penetrance: carrying an allele doesn't guarantee the associated trait actually gets expressed.",
  },
  {
    name: "Egg Groups",
    strength: "strong",
    gameRule:
      "Two Pok\u00e9mon can only breed if they share at least one Egg Group \u2014 a fixed compatibility category assigned to every species.",
    biologyRead:
      "This maps well onto reproductive isolation: the behavioral, mechanical, or genetic barriers that keep related-but-distinct species from interbreeding in the wild. Egg Groups are essentially an explicit, simplified version of that same boundary.",
  },
  {
    name: "Nature & the Everstone",
    strength: "partial",
    gameRule:
      "Nature (one of 25 fixed personality types that skews stat growth) is normally random on hatch. Holding an Everstone during breeding forces the offspring to inherit one parent's Nature exactly, with no randomness at all.",
    biologyRead:
      "The weakest parallel here. Real inherited traits pass through allele combinations with randomness built in \u2014 a guaranteed, 100% carbon-copy inheritance doesn't resemble any normal biological process. It reads more like cloning a trait than passing it down genetically.",
  },
  {
    name: "Masuda Method (shiny odds)",
    strength: "none",
    gameRule:
      "Breeding two Pok\u00e9mon whose game cartridges were originally set to different languages boosts the odds of a shiny hatching, from roughly 1-in-4096 to about 1-in-512.",
    biologyRead:
      "No biological reading applies \u2014 it isn't about the parents' genetics at all, it's a reward for owning game copies from different regions. A useful example of a mechanic that sounds sciencey but is really just a game-design incentive.",
  },
];

export { gameMechanics, STRENGTH_META };
