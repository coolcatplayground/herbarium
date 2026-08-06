// Maps a specimen name to its Grafting Bench case, if one exists — lets a
// specimen page link straight to the matching case study instead of just
// pointing at the page in general. Keep this in sync with the case keys
// defined in pages/GraftingBench.jsx.
const graftingCases = {
  roselia: { caseKey: "pigment", caseNumber: "01", label: "Flower Pigment" },
  cacnea: { caseKey: "waxiness", caseNumber: "02", label: "Water-Storage Tissue" },
  vileplume: { caseKey: "toxinResistance", caseNumber: "03", label: "Toxic Pollen Resistance" },
};

export default graftingCases;
