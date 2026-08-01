// Ditto can breed with almost any species, full stop, no relation needed.
// Real biology has a name for why that's strange: reproductive isolation,
// the barriers that keep species distinct. These are the closest real
// mechanisms to what Ditto pulls off, rated honestly — reusing the same
// strong/partial/none scale as the in-game breeding mechanics table.

const dittoCandidates = [
  {
    name: "Horizontal Gene Transfer (bacteria)",
    strength: "partial",
    mechanism:
      "Bacteria routinely swap genetic material directly with unrelated bacteria \u2014 sometimes even unrelated species \u2014 via plasmids, viruses, or direct uptake from the environment, entirely outside of reproduction.",
    verdict:
      "The right idea (genes moving between very different organisms) in the wrong domain of life: this is a prokaryote phenomenon. Nothing resembling it happens between complex animals through mating.",
  },
  {
    name: "Plant Hybridization & Polyploidy",
    strength: "partial",
    mechanism:
      "Plants hybridize across species, and even genera, far more readily than animals do. Whole-genome duplication (polyploidy) can rescue an otherwise-sterile hybrid by giving it a complete, balanced set of chromosomes to work with \u2014 this is literally how bread wheat came to exist, from three different grass species merging.",
    verdict:
      "The closest natural analog, but it still requires real underlying genetic relatedness. No amount of polyploidy lets a rose hybridize with a mushroom.",
  },
  {
    name: "Protoplast Fusion (plant biotechnology)",
    strength: "strong",
    mechanism:
      "In the lab, a plant cell's wall can be stripped away entirely, leaving a \u201cprotoplast.\u201d Protoplasts from two very different, normally incompatible species can sometimes be fused directly into one hybrid cell \u2014 bypassing the reproductive barrier rather than working around it.",
    verdict:
      "The best functional match to what Ditto does: compatibility gets forced, not found. The catch is it only happens with deliberate lab intervention, never spontaneously in nature, and viability still drops off fast with genetic distance.",
  },
];

export default dittoCandidates;
