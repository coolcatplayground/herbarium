// Curated field notes written by hand, connecting each specimen's design
// to a real plant biology or genetics concept. Species without an entry
// here fall back to a generated note in specimenNote.js.
//
// geneticConcept is deliberately short — it's used as a catalog tag.

const botanicalNotes = {
  bulbasaur: {
    binomial: "Bulbasaur cormus-dorsalis",
    plantAnalogue: "Corms & bulbs (e.g. Crocus, Gladiolus)",
    geneticConcept: "Vegetative storage organs",
    note:
      "The bulb on its back mirrors a corm: a swollen underground stem that stockpiles carbohydrate for a later growth flush. In real corms this reserve fuels the rapid stem elongation seen right before flowering — which tracks neatly with the sudden bloom this species undergoes at its next life stage.",
  },
  ivysaur: {
    binomial: "Ivysaur cormus-intermedius",
    plantAnalogue: "Pre-anthesis flower buds",
    geneticConcept: "Photoperiodism",
    note:
      "The unopened bud is a photoperiod-sensitive structure in most flowering plants: many species delay opening until day length crosses a genetically set threshold (short-day vs. long-day flowering). The bud's growing size suggests it is accumulating the floral hormone signal (florigen) needed to trigger anthesis.",
  },
  venusaur: {
    binomial: "Venusaur magniflora",
    plantAnalogue: "Giant Rafflesia / Titan arum",
    geneticConcept: "Heterochrony (shifted developmental timing)",
    note:
      "A fully bloomed structure this large, on an otherwise animal-shaped body, is a case of heterochrony: developmental timing has been stretched so a normally proportionate organ (a flower) grows disproportionately large relative to the rest of the organism, much as Rafflesia devotes almost all of its biomass to a single bloom.",
  },
  oddish: {
    binomial: "Oddish nocturnus-radix",
    plantAnalogue: "Geophytes (underground bulbs/tubers)",
    geneticConcept: "Circadian gene expression",
    note:
      "Field data describes this species burying itself by day and surfacing at night to absorb moonlight — behavior consistent with circadian clock genes (like plant CCA1/LHY homologs) that gate growth and gas exchange to specific hours to avoid daytime water loss.",
  },
  gloom: {
    binomial: "Gloom nocturnus-nectaris",
    plantAnalogue: "Carrion flowers (Amorphophallus, Stapelia)",
    geneticConcept: "Convergent floral chemistry",
    note:
      "The foul-smelling nectar is a documented pollination strategy: several unrelated plant lineages independently evolved rotting-flesh scent compounds to attract carrion flies and beetles as pollinators — a strong real-world case of convergent evolution.",
  },
  vileplume: {
    binomial: "Vileplume sporocarpus-maximus",
    plantAnalogue: "Puffball fungi & Lycopodium spores",
    geneticConcept: "Spore dispersal & allergenicity",
    note:
      "Its petals release irritant spores by the hundred thousand, echoing how puffballs and clubmosses eject spores by the trillion, relying on sheer statistical volume — since any single spore's odds of landing somewhere hospitable are vanishingly small.",
  },
  bellossom: {
    binomial: "Bellossom heliotropica",
    plantAnalogue: "Sun-tracking flowers (Helianthus)",
    geneticConcept: "Heliotropism",
    note:
      "This form only appears after exposure to a specific evolutionary stimulus tied to sunlight, paralleling heliotropic species whose flower heads physically reorient to track the sun via differential auxin distribution on the stem's shaded side.",
  },
  tangela: {
    binomial: "Tangela vine-confertus",
    plantAnalogue: "Bindweed & kudzu (Convolvulaceae)",
    geneticConcept: "Indeterminate vine growth",
    note:
      "A body made entirely of tangled vines models indeterminate growth: unlike a tree that stops elongating a shoot once a bud sets, vining plants keep extending vegetatively for as long as resources allow, producing the dense mats this species is known for.",
  },
  tangrowth: {
    binomial: "Tangrowth vine-perennis",
    plantAnalogue: "Established perennial vine thickets",
    geneticConcept: "Biomass accumulation over time",
    note:
      "Longer, thicker vines than its prior stage reflect a real distinction between annual and perennial vines — perennials keep adding woody or fibrous tissue year over year, becoming structurally denser rather than resetting each season.",
  },
  exeggcute: {
    binomial: "Exeggcute ovulum-sextus",
    plantAnalogue: "Multi-seeded fruit clusters",
    geneticConcept: "Seed clustering & clonal grouping",
    note:
      "Six segments behaving as one organism resembles clonal seed clusters (as in some Ficus or palm fruit heads), where genetically identical or closely related units mature together and rely on collective, not individual, dispersal success.",
  },
  exeggutor: {
    binomial: "Exeggutor palma-cephala",
    plantAnalogue: "Coconut palm (Cocos nucifera)",
    geneticConcept: "Regional phenotypic variation",
    note:
      "A palm-tree body with a coconut-like head, and a documented regional variant with an elongated form, mirrors how the same species of palm can show markedly different growth habits across latitude and soil conditions — phenotypic plasticity driven by environment rather than a change in genotype.",
  },
  chikorita: {
    binomial: "Chikorita foliolum-primus",
    plantAnalogue: "Seedling / juvenile leaf stage",
    geneticConcept: "Juvenile vs. adult leaf morphology",
    note:
      "The single broad leaf is characteristic of a juvenile growth phase in many dicots, where early 'true leaves' are simpler and larger relative to the plant than the more complex leaf shapes that develop at maturity.",
  },
  bayleef: {
    binomial: "Bayleef foliolum-secundus",
    plantAnalogue: "Aromatic foliage (bay laurel, eucalyptus)",
    geneticConcept: "Secondary metabolite production",
    note:
      "Its fragrant neck leaves reflect a real trend: as many plants mature past the seedling stage, they upregulate genes for aromatic secondary metabolites (terpenes, essential oils) used in defense and pollinator attraction, which is why mature bay leaves smell far stronger than young shoots.",
  },
  meganium: {
    binomial: "Meganium corolla-magna",
    plantAnalogue: "Mature flowering canopy trees",
    geneticConcept: "Floral maturity & scent signaling",
    note:
      "The large petals around its neck are described as releasing a calming aroma that can revive other plants — a stylized nod to how mature flowering canopies can measurably shift the microclimate and volatile-compound profile of the area beneath them.",
  },
  hoppip: {
    binomial: "Hoppip pappus-minimus",
    plantAnalogue: "Dandelion & thistle achenes",
    geneticConcept: "Wind-mediated seed dispersal (anemochory)",
    note:
      "So light it drifts on the faintest breeze, this species models anemochory — seeds like dandelion achenes evolve a high surface-area-to-mass ratio specifically to maximize wind transport distance, trading seed size for dispersal range.",
  },
  skiploom: {
    binomial: "Skiploom pappus-medius",
    plantAnalogue: "Maturing seed head",
    geneticConcept: "Dispersal-stage transition",
    note:
      "Its cotton-like fluff becoming more effective at catching wind captures the stage in a real seed head's development where the pappus fully dries and expands, switching the structure from photosynthetic to purely dispersal-optimized.",
  },
  jumpluff: {
    binomial: "Jumpluff pappus-maximus",
    plantAnalogue: "Fully dehisced dandelion seed head",
    geneticConcept: "Terminal dispersal morphology",
    note:
      "Three cotton puffs released to travel the globe on trade winds is a fair caricature of long-distance anemochory, which real dandelion-type seeds achieve through a parachute-shaped pappus that dramatically slows terminal velocity.",
  },
  sunkern: {
    binomial: "Sunkern semen-quiescens",
    plantAnalogue: "Dormant sunflower seed",
    geneticConcept: "Seed dormancy",
    note:
      "Almost motionless and drawing energy from sunlight while barely moving models seed dormancy, a genetically regulated state (often controlled by abscisic acid signaling) that halts development until light, temperature, and moisture cues jointly signal it's safe to germinate.",
  },
  sunflora: {
    binomial: "Sunflora helianthus-erectus",
    plantAnalogue: "Sunflower (Helianthus annuus)",
    geneticConcept: "Heliotropism & phototropic growth",
    note:
      "Directly modeled on the sunflower, whose young flower heads track the sun east-to-west across the day via a circadian-gated growth-hormone gradient — a textbook example of phototropism that stops once the flower matures and locks facing east.",
  },
  bellsprout: {
    binomial: "Bellsprout caulis-carnivorus",
    plantAnalogue: "Pitcher plant seedling stage",
    geneticConcept: "Root-to-shoot resource allocation",
    note:
      "A thin stem with barely developed roots reflects how many carnivorous and vine plants prioritize shoot growth early on, delaying investment in a large root system until after the plant has secured an alternative resource strategy — in this lineage, prey capture.",
  },
  weepinbell: {
    binomial: "Weepinbell caulis-praedator",
    plantAnalogue: "Pitcher plant (Nepenthes) trap",
    geneticConcept: "Carnivory as nutrient-poor-soil adaptation",
    note:
      "The bell-shaped mouth releasing digestive fluid mirrors Nepenthes pitchers precisely: carnivory evolved independently multiple times in plants as a workaround for nitrogen- and phosphorus-poor soils, supplementing photosynthesis with captured animal protein.",
  },
  victreebel: {
    binomial: "Victreebel caulis-voraciosus",
    plantAnalogue: "Mature pitcher plant with lure scent",
    geneticConcept: "Chemical mimicry for prey attraction",
    note:
      "A honey-like lure scent that masks a trap is consistent with real pitcher-plant chemistry, where nectar-mimicking volatiles recruit insects that would otherwise have no reason to approach a modified, non-photosynthetic leaf.",
  },
  treecko: {
    binomial: "Treecko lacerta-viridis",
    plantAnalogue: "Chlorophyll-pigmented epidermis",
    geneticConcept: "Camouflage via convergent pigmentation",
    note:
      "Green skin used for forest camouflage isn't chlorophyll-based (it lacks photosynthetic tissue), but the selective pressure is the same one that shaped green coloration in countless understory plants: matching a chlorophyll-saturated visual environment to avoid detection.",
  },
  grovyle: {
    binomial: "Treecko lacerta-silvestris",
    plantAnalogue: "Canopy-adapted foliage",
    geneticConcept: "Habitat-matched morphology",
    note:
      "Leaf-like growths that provide lift while gliding through the canopy echo how canopy epiphytes and vines evolve flattened, leaf-shaped structures to maximize light capture and surface area in a crowded vertical habitat.",
  },
  sceptile: {
    binomial: "Treecko lacerta-arborea",
    plantAnalogue: "Woody seed pods",
    geneticConcept: "Structural lignification",
    note:
      "Seeds growing from its back that harden into usable projectiles is a nod to lignification — the process by which plant cell walls deposit lignin to become rigid and woody, the same process that hardens a seed coat for protection.",
  },
  seedot: {
    binomial: "Seedot glans-pendulus",
    plantAnalogue: "Acorn (Quercus)",
    geneticConcept: "Mast fruiting",
    note:
      "Modeled directly on an acorn hanging from a tree, this species alludes to mast fruiting — the boom-and-bust seed production cycle oaks use to occasionally overwhelm seed predators with more acorns than they can possibly eat, improving the odds some survive to germinate.",
  },
  nuzleaf: {
    binomial: "Seedot glans-erectus",
    plantAnalogue: "Sprouting acorn / sapling",
    geneticConcept: "Germination & apical growth",
    note:
      "A long, leaf-topped nose growing from what was an acorn-shaped body traces the path of germination: the radicle and shoot break through a seed coat and begin apical (tip-first) elongation toward light.",
  },
  shiftry: {
    binomial: "Seedot glans-arborifex",
    plantAnalogue: "Wind-dispersing mature tree",
    geneticConcept: "Fan-shaped leaf adaptation for wind capture",
    note:
      "Large leaf-fans said to summon wind reflect a real trade-off in leaf shape: broad, flexible leaves increase drag and flutter in real wind, which some species exploit to shake loose and disperse their own seeds during storms.",
  },
  lotad: {
    binomial: "Lotad nymphaea-minor",
    plantAnalogue: "Water lily pad (Nymphaea)",
    geneticConcept: "Aquatic leaf buoyancy",
    note:
      "A lily pad worn on its head models a real structural adaptation: water-lily leaves have air pockets and a waxy, water-repellent surface (via wax-biosynthesis genes) that keep them afloat and free of surface film.",
  },
  lombre: {
    binomial: "Lotad nymphaea-media",
    plantAnalogue: "Emergent aquatic vegetation",
    geneticConcept: "Aquatic-to-terrestrial transition",
    note:
      "Standing partly upright out of the water reflects amphibious plant strategies, where the same species grows submerged leaves underwater and different, more rigid aerial leaves once a stem breaches the surface.",
  },
  ludicolo: {
    binomial: "Lotad nymphaea-maxima",
    plantAnalogue: "Fully emergent wetland plant",
    geneticConcept: "Environmentally triggered phenotype switch",
    note:
      "This stage only appears with exposure to a specific stimulus, matching how some wetland plants express an entirely different mature phenotype depending on water depth at the site they took root — same genotype, environmentally switched form.",
  },
  roselia: {
    binomial: "Roselia rosa-gemina",
    plantAnalogue: "Garden rose (Rosa)",
    geneticConcept: "Flower color genetics (anthocyanin pathway)",
    note:
      "Carrying both a red and a blue flower on one stem is a fair stand-in for anthocyanin pigment genetics in roses: the same biosynthetic pathway, tuned by pH and modifying genes, can shift a bloom's color across the red-to-blue spectrum within one cultivar line.",
  },
  budew: {
    binomial: "Roselia rosa-clausa",
    plantAnalogue: "Unopened rosebud",
    geneticConcept: "Pre-bloom bud dormancy",
    note:
      "A closed bud that releases pollen-like powder when disturbed captures a rosebud's pre-anthesis state, when reproductive tissue is fully formed but held closed until temperature and moisture cues call for the bud to open.",
  },
  roserade: {
    binomial: "Roselia rosa-duplex",
    plantAnalogue: "Bicolor rose cultivar",
    geneticConcept: "Polymorphic floral traits",
    note:
      "Two different flower-hands, one sweet-scented and one sharply toxic, mirrors how closely related rose cultivars can diverge sharply in scent-compound and toxin production despite near-identical floral structure — a case of polymorphism at the biochemical level.",
  },
  cacnea: {
    binomial: "Cacnea opuntia-minor",
    plantAnalogue: "Barrel & prickly-pear cactus",
    geneticConcept: "Water-storage tissue (succulence)",
    note:
      "A round, spine-covered body built for the desert is a direct model of cactus succulence: specialized parenchyma cells with genes upregulated for water retention allow the plant to store months of water and survive extreme drought.",
  },
  cacturne: {
    binomial: "Cacnea opuntia-nocturna",
    plantAnalogue: "Nocturnal desert cactus (Saguaro-type CAM plants)",
    geneticConcept: "CAM photosynthesis",
    note:
      "Becoming active only at night mirrors Crassulacean Acid Metabolism (CAM), used by most cacti: stomata stay shut in the punishing daytime heat and open only at night to fix CO2 with minimal water loss, then run photosynthesis internally come daylight.",
  },
  turtwig: {
    binomial: "Turtwig testudo-foliata",
    plantAnalogue: "Shell as living topsoil",
    geneticConcept: "Rhizosphere / soil microbiome",
    note:
      "A shell literally made of packed soil that supports a growing leaf models the rhizosphere — the thin zone of soil around roots that plants actively condition with exuded sugars to cultivate a beneficial microbial community.",
  },
  grotle: {
    binomial: "Turtwig testudo-silvestris",
    plantAnalogue: "Established shrub root mass",
    geneticConcept: "Root system establishment",
    note:
      "Branches and a bigger canopy sprouting from its shell reflect how, once a root system is established enough to secure water reliably, a plant shifts investment from root growth to aboveground canopy expansion.",
  },
  torterra: {
    binomial: "Turtwig testudo-arborea",
    plantAnalogue: "Small ecosystem-supporting tree",
    geneticConcept: "Facilitation (nurse plant effect)",
    note:
      "A full tree and landscape growing on its back is a striking version of the nurse-plant effect, where an established plant's canopy and root structure create a stable microhabitat that other species then colonize.",
  },
  cherubi: {
    binomial: "Cherubi prunus-gemina",
    plantAnalogue: "Cherry fruit cluster",
    geneticConcept: "Fruit ripening signaling (ethylene)",
    note:
      "Two cherries, one described as still gathering nutrients, models asynchronous fruit ripening within a cluster — driven in real Prunus species by localized ethylene signaling that can trigger one fruit to ripen ahead of its neighbor.",
  },
  cherrim: {
    binomial: "Cherubi prunus-solaris",
    plantAnalogue: "Light-responsive bloom",
    geneticConcept: "Photoreceptor-gated opening",
    note:
      "Switching between a closed and an open, sunlit form based on light intensity is a stylized phytochrome response: many flowers use light-sensing photoreceptor proteins to decide, in real time, whether conditions justify opening their petals.",
  },
  snivy: {
    binomial: "Snivy serpens-chlorophylla",
    plantAnalogue: "Photosynthetic epidermis",
    geneticConcept: "Whole-body photosynthesis (fictional extension)",
    note:
      "Described as photosynthesizing through its entire body, this is a fictional extrapolation of chlorophyll function — real chlorophyll requires chloroplast-containing tissue, so this models what a plant-animal hybrid would need at the cellular level to make the claim work.",
  },
  servine: {
    binomial: "Snivy serpens-scutifera",
    plantAnalogue: "Waxy cuticle leaves",
    geneticConcept: "Cuticle wax biosynthesis",
    note:
      "Leaf-like growths described as blade-sharp point to real cuticle biology: many mature leaves synthesize a thick, stiff wax cuticle layer via CER-family genes that both reduces water loss and adds rigidity — sharp edges are a plausible mechanical side effect.",
  },
  serperior: {
    binomial: "Snivy serpens-regalis",
    plantAnalogue: "Ancient/long-lived tree",
    geneticConcept: "Longevity & growth-rate trade-offs",
    note:
      "Said to move without expending energy, a stylized nod to how the most long-lived plants (bristlecone pines, some yews) grow extremely slowly, trading fast biomass gain for cellular efficiency and multi-century lifespan.",
  },
  fomantis: {
    binomial: "Fomantis mantis-foliata",
    plantAnalogue: "Leaf mimicry",
    geneticConcept: "Crypsis via leaf morphology",
    note:
      "A body shaped like a fallen leaf, sunning itself each morning, models crypsis: plant-mimicking morphology paired with genuine sun-seeking behavior to maximize the light exposure a leaf-shaped structure would need to actually photosynthesize.",
  },
  lurantis: {
    binomial: "Fomantis mantis-floralis",
    plantAnalogue: "Orchid mantis convergence",
    geneticConcept: "Aggressive floral mimicry",
    note:
      "A flower-shaped body used to lure prey is the plant-world mirror of the orchid mantis: whether the mimicry evolved in an insect or, hypothetically, a plant-type creature, the underlying strategy — resemble a flower closely enough to draw pollinators within striking range — is identical.",
  },
  rowlet: {
    binomial: "Rowlet strix-photosynthetica",
    plantAnalogue: "C4/CAM-style efficient photosynthesis",
    geneticConcept: "Photosynthetic efficiency under low light",
    note:
      "Said to photosynthesize even while barely moving, this models shade-adapted plants that express higher chlorophyll-b ratios and larger, thinner leaves specifically to harvest usable light in low-luminance forest understories.",
  },
  bounsweet: {
    binomial: "Bounsweet fructus-parvulus",
    plantAnalogue: "Immature stone fruit",
    geneticConcept: "Pre-ripening sugar accumulation",
    note:
      "A sweet scent that grows stronger with movement or stress reflects how unripe fruit accumulates volatile sugar-derived compounds gradually, with mechanical stress sometimes accelerating the same ripening enzymes that would otherwise activate on a slower schedule.",
  },
  steenee: {
    binomial: "Bounsweet fructus-erectus",
    plantAnalogue: "Fruit-bearing stem elongation",
    geneticConcept: "Stem elongation pre-fruit-set",
    note:
      "A longer, more poised stem before full fruiting is consistent with real pre-fruit-set elongation, where a plant extends its stem to position a future fruit for better light exposure or pollinator access before committing resources to the fruit itself.",
  },
  tsareena: {
    binomial: "Bounsweet fructus-regalis",
    plantAnalogue: "Fully ripened fruit crown",
    geneticConcept: "Terminal ripening morphology",
    note:
      "A crown-like ripened form that can strike with force stretches the idea of a fully ripe fruit's structural rigidity — cell walls firm up during late ripening even as sugar content peaks, the opposite of the softening most fruits undergo, in this stylized case.",
  },
  grookey: {
    binomial: "Grookey chloroplasta-manuum",
    plantAnalogue: "Chlorophyll-charged percussion stick",
    geneticConcept: "Chlorophyll as an energy-storage metaphor",
    note:
      "A stick charged with chlorophyll energy that can be released as a shockwave has no direct real analogue, but usefully sets up a genetics discussion: chlorophyll itself doesn't store usable chemical energy directly, ATP and NADPH do, downstream of the light reactions.",
  },
  sprigatito: {
    binomial: "Sprigatito herba-felina",
    plantAnalogue: "Aromatic herb (catnip, Nepeta)",
    geneticConcept: "Volatile terpene production",
    note:
      "A cat that smells like fresh herbs is a playful nod to plants like catnip, whose leaves produce nepetalactone, a terpenoid compound synthesized via genes in the mevalonate pathway that many felines are behaviorally drawn to.",
  },
  applin: {
    binomial: "Applin malus-habitans",
    plantAnalogue: "Apple (Malus domestica)",
    geneticConcept: "Endozoochory (dispersal via being eaten)",
    note:
      "Living inside an apple and only leaving once it's carved out models endozoochory directly: apples evolved sweet flesh specifically so animals would eat the fruit whole and disperse the seeds elsewhere in their waste, a mutual bet between plant and disperser.",
  },
  appletun: {
    binomial: "Applin malus-dulcis",
    plantAnalogue: "Heirloom sweet apple cultivar",
    geneticConcept: "Selective breeding for sugar content",
    note:
      "Its extra-sweet apple shell mirrors centuries of selective breeding in cultivated apples, where growers have repeatedly selected for higher sugar and lower acidity, a slow, human-driven form of artificial selection layered on top of the wild species' natural genetic variation.",
  },
  flapple: {
    binomial: "Applin malus-alata",
    plantAnalogue: "Winged samara seed (maple)",
    geneticConcept: "Convergent dispersal morphology",
    note:
      "Wing-like flaps for gliding are a plant-type crossover of the samara — the winged seed pod of maples and ash trees, whose asymmetric shape induces a spinning helicopter fall that measurably increases dispersal distance from the parent tree.",
  },
  ferroseed: {
    binomial: "Ferroseed spina-metallica",
    plantAnalogue: "Burr & bur-seed (Xanthium, Arctium)",
    geneticConcept: "Epizoochory (hitchhiking seed dispersal)",
    note:
      "Metal spikes covering a seed-shaped body are a stylized version of bur seeds, which evolved hooked spines specifically to snag onto passing animal fur, hitching a ride to a new germination site with zero energy cost to the parent plant.",
  },
  ferrothorn: {
    binomial: "Ferroseed spina-ancorata",
    plantAnalogue: "Anchored bur-plant with hooked spines",
    geneticConcept: "Physical anti-herbivory defense",
    note:
      "Sharper, larger spines at maturity reflect ontogenetic defense escalation seen in real thorny plants: spine density and toughness often increase as a plant ages and has more standing biomass worth protecting from browsing animals.",
  },
};

export default botanicalNotes;
