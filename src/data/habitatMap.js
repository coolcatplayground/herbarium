// A heuristic, not a rule: real habitat depends on far more than a game's
// typing choices, and individual specimens can and do break the pattern
// (Cacturne is Grass/Dark and Cacnea pure Grass, neither Grass/Ground, despite both being desert
// cacti — see the Dark entry below for why that's actually a coherent
// reading rather than a mismatch). Treat this as "what a dual-type often
// *suggests* about habitat," not as biological fact. Exceptions belong in
// each specimen's own field note, not as caveats bolted onto the category.

const habitatMap = {
  // Mono-Grass — the largest single group in the catalog, 46 specimens.
  // Deliberately NOT named after a biome: a pure-Grass typing signals the
  // absence of a second adaptation, which is not the same as signalling
  // temperate woodland. Maractus is a mono-Grass desert cactus; Sceptile
  // reads tropical; Snover's line would be alpine if it weren't Ice-typed.
  // Naming this "Temperate Woodland" (as it was) actively mislabelled all of
  // them, so the category describes the plant strategy instead and says
  // plainly that the typing gives no habitat signal at all.
  // Rewritten against the 46 actually filed here, the largest and most
  // heterogeneous roster in the collection — Maractus the desert cactus and
  // Carnivine the flytrap stand in it alongside Chikorita. That heterogeneity
  // is the room rather than a flaw in it: this is the one category whose
  // honest content is "the heuristic returned nothing, read the placards."
  // The leaf economics spectrum gives it a real subject under the admission.
  none: {
    name: "Mesophytic & Unspecialized Flora",
    description:
      "Every other room in this wing makes a claim. This one makes an admission. A mono-Grass typing carries no second signal, so nothing here has been sorted by what it is — only by what the data failed to say, which is why this is at once the largest room in the collection and the least coherent gathering in it. A desert cactus, a flytrap, a chilli, a sunflower, a kudzu-scale vine and an orchid mimic stand here together for the single reason that none of them arrived with a label. Each specimen's own placard is where that gets settled, and in this room more than any other they are the exhibit. The category does have a real subject underneath, though, and it is worth defending. Mesophyte is not a synonym for unremarkable: it names the middle of the water gradient, between the hydrophytes standing in it and the xerophytes hoarding it, and the middle is a design with its own commitments. Leaves broad and thin enough to be cheap. Stomata open through the day. No water stored anywhere. Roots that never go looking very far. Every one of those is a bet that rain will arrive again shortly — take the bet away and the whole arrangement fails within days, which is precisely why a mesophyte wilts on a windowsill and a cactus does not. Moderate conditions are not the absence of a strategy; they are the condition a strategy was built around. There is also one axis that organises most of it. Measure enough leaves, across a few thousand species and every continent, and the variation collapses onto a single spectrum running from fast to slow: fast leaves thin, nitrogen-rich, quick to photosynthesise and quick to die; slow leaves thick, tough, cheap to maintain and built to last for years. Nothing sits in the good corner of both, because there is no such corner — a leaf that repays its construction quickly cannot also be durable. The specialists in the other rooms are out at the ends of that line. This room is the middle of it, which is where most plants on Earth, and very nearly all of agriculture, actually live.",
  },
  // Written against the Lotad line and Ogerpon-Wellspring. The old one-liner
  // listed habitats; the room needed the actual problem, which is that water is
  // not the easy option — it is a place where a land plant's whole design fails,
  // and everything here is a returning emigrant rather than an original resident.
  water: {
    name: "Wetland & Aquatic",
    description:
      "The mistake to get out of the way first is that water is the easy option. Every plant in a pond is descended from ancestors that left the water for the land and then went back, and the return costs more than it saves. The problem is gas. Oxygen diffuses through water something like ten thousand times more slowly than through air, and waterlogged sediment goes anoxic within millimetres of the surface, so a root in mud is suffocating rather than drinking. The answer is aerenchyma — continuous air channels running from the leaves down through the stem into the roots, built by killing off files of cells in a controlled way to leave a gallery behind them. Some plants go further and ventilate. Water lilies run a pressurised through-flow: young leaves draw air in, push it down the petiole to the rhizome, and vent it up through the older leaves, so the plant is quietly breathing through a circuit rather than waiting on diffusion. Then there is the light, which fails fast — a metre of clear water removes most of the red end of the spectrum, and submerged leaves are correspondingly thin, finely divided and stripped of the waterproofing a land plant cannot do without, since a cuticle would block the very exchange the leaf is there for. Many species build both kinds at once, dissected threads below the surface and flat entire blades above it, on the same stem. And structure becomes optional: water carries the weight, so aquatic plants abandon lignin and stiffening and go floppy, which is why a pond weed hauled onto the bank collapses into a heap. What this room catalogues is not plants that love water. It is plants that gave up several hard-won terrestrial inventions in order to live somewhere their ancestors had already escaped.",
  },
  // Written against its three: Torterra, Toedscool and Toedscruel. Two of the
  // three are fungi, which turns out to be what the room is really about — the
  // work underground is done in partnership, and mostly by the fungal half.
  // Opens by dismantling the mirror-image root picture, because the category's
  // own name is the misconception that has to be corrected first.
  ground: {
    name: "Deep-Rooted & Soil-Anchored Flora",
    image: "habitats/ground.jpg",
    description:
      "The picture most people carry — a tree's roots mirroring its crown underground — is wrong in a way that matters. Most root mass sits in the top thirty centimetres or so and spreads outward well past the edge of the canopy rather than downward, and genuinely deep roots are rare and specific: the record belongs to a shepherd's tree in the Kalahari, found sixty-eight metres down the wall of a mine shaft, reaching water nothing else could touch. Depth is the exception; spread is the rule. And even at spreading, roots are outclassed. A root hair is perhaps ten micrometres across, a fungal hypha two or three, and the fungus can put out metres of thread for the carbon a root would spend on centimetres. Which is why almost nothing does this alone. Something like ninety per cent of land plant species carry mycorrhizal fungi in or against their roots, trading sugar out for phosphorus and nitrogen in — an arrangement old enough to predate the organ that now depends on it. The earliest land plants preserved in the Rhynie chert, four hundred million years ago, already have fungal partners threading their tissue and do not yet have roots. The partnership came first, and roots arrived to hold it. It behaves like a market, too: plants push more carbon toward the partners delivering more phosphorus and the fungi reciprocate, and like any market it gets cheated — Indian pipe has given up chlorophyll altogether and stands white on the forest floor, drawing its carbon out of trees through the fungus that connects them. The anchoring in this room's name is mutual as well: roots and hyphae bind loose soil into crumbs that hold their shape, and a plant will spend a serious fraction of everything it fixes leaking sugars into the few millimetres of ground around its roots, feeding a population it is effectively farming. Which leaves one thing to say plainly. Two of the three specimens here are fungi rather than plants, which for a room about soil is close to the right proportion — and in a collection like this one it is not even an error, since fungi sat inside the plant kingdom for most of the history of herbaria.",
  },
  // Two of the three exhibits are chilli peppers, whose fire is a receptor trick
  // rather than combustion — Capsakid's record covers that chemistry, so this
  // room names the pun and moves on. The three placards take one fire strategy
  // each: resist (bark), resprout (epicormic buds and lignotubers), and recruit
  // (serotiny), which is the whole taxonomy of the subject in three specimens.
  fire: {
    name: "Pyrophyte / Fire-Adapted Flora",
    description:
      "Worth clearing something up on the way in: two of the three specimens here are chilli peppers, and a chilli has no relationship with fire whatever. Its heat is a false report delivered to a receptor built for real temperature, which is a fine trick and belongs to a different room — Capsakid's record has the chemistry. Actual fire-adapted plants are doing something else entirely, and they sort into three strategies. The first is to resist. Bark is an insulator, and species from fire country invest heavily in it: cork oak, longleaf pine and giant sequoia carry bark that runs to tens of centimetres, fibrous and low in resin, so a ground fire scorches the outside and the living tissue beneath is never heated enough to matter. Such trees also shed their lower branches as they grow, which removes the ladder a fire would otherwise climb into the crown. The second is to resprout. Many eucalypts keep dormant buds buried beneath the bark along the entire trunk, so a tree burned to a black pole greens along its whole length within weeks, foliage bursting straight out of the wood; others carry a lignotuber, a woody swelling at ground level packed with buds and starch, which survives when everything above it does not and starts again from the soil surface. The third is to recruit — to treat fire as the signal to reproduce, holding seed in reserve for years and releasing it only when the heat arrives, into an opening where competitors have just been reduced to ash and fertiliser. What makes this more than a curiosity is what happens when the fire stops coming. A century of suppression in systems that had burned lightly every few years does not produce safety; it produces fuel, and converts frequent low fires that ran along the ground into rare ones that take the canopy and kill everything. Longleaf pine savanna, one of the richest plant communities in North America, collapsed to a fraction of its range largely because people put the fires out. These plants do not survive fire despite being plants. They have arranged their entire lives around it arriving on schedule, and the dangerous thing is when it does not.",
  },
  // Written against Lileep, Cradily and Ogerpon-Cornerstone-Mask. Two of the
  // three are crinoids, which lets this room run on a genuine two-way exchange
  // between rock and life rather than a generic "grows on cliffs" gloss.
  rock: {
    name: "Cliffside & Mineral-Poor Soil",
    image: "habitats/rock.jpg",
    description:
      "Bare rock offers anchorage and almost nothing else, so the flora here solves two separate problems: how to hold on, and how to eat. Lithophytes root directly onto stone and live off rain, dust and their own fallen litter. Pioneer lichens and mosses go further and attack the rock itself, secreting organic acids that dissolve minerals out of the crystal while roots wedge into fissures and split them wider — on bare stone, life doesn't find soil so much as manufacture it, one thin layer at a time. Where there is soil but it's poor, the answers get stranger still: plants on serpentine ground tolerate nickel and chromium that would kill their neighbours, and Proteaceae on the world's most phosphorus-starved soils grow dense brush-like cluster roots that flood the ground with acids to prise the last phosphorus off mineral grains. And the traffic runs both ways. Much of the world's limestone is made of the crushed remains of crinoids — the sea lilies two of this room's specimens are modelled on — so the rock a plant is prising apart for minerals is frequently the compacted bodies of whatever lived there first.",
  },
  // Written against its nine, which split three ways: two real desert CAM
  // plants (Cacnea by hand, Cacturne by typing), a forest pair whose darkness
  // is shade rather than night, and four filed here for temperament rather
  // than for any nocturnal biology. The room text carries the actual night
  // shift; the placards say which of the three each specimen belongs to, and
  // the ones that fit badly say so.
  dark: {
    name: "Nocturnal-Function Flora",
    description:
      "Darkness is not the day with the lights turned off. For a plant the decisive cost of opening a stoma is water, and after sunset the air is cooler and wetter and the loss per pore is a fraction of what it would be at noon — so night is simply when gas exchange is cheap, and a whole set of strategies exists to take advantage of that. The best known collects carbon in the dark and uses it in the light. What is less often said is what that costs: a plant running crassulacean acid metabolism can only fix as much carbon overnight as it has room to store as acid, which caps its growth, and CAM plants are correspondingly slow. Pushed to the limit it becomes pure endurance. Under severe drought some will not open their stomata at all, day or night, and simply cycle their own respiratory carbon dioxide round and round behind sealed pores — CAM idling, which yields no net gain whatever and can hold a plant alive for months or years while it waits. Others treat it as a setting rather than an identity, running ordinary daytime photosynthesis when there is water and switching to the night shift when there is not. Flowering moves into the dark as well, and it brings its own clientele. Moth flowers are pale, often white, held open after dusk with long corolla tubes and a heavy scent that is released on a schedule rather than continuously. Bat flowers are built for a heavier visitor: drab, robust, musty-smelling, with a landing platform and a great deal of dilute nectar — agave, saguaro and durian all depend on them. And plants keep the time themselves. The founding experiment of the entire study of biological clocks was done on a plant and done early: in 1729 de Mairan shut a mimosa in a dark cupboard and found its leaves still opening and closing on a daily rhythm with nothing outside to cue them. The arithmetic that goes with it is stranger still. A plant spends the night living on starch banked during the day, and it meters the reserve so that it runs down to almost nothing at dawn and not before — which means dividing what it has by how long the darkness will last, and getting it right.",
  },
  // The biggest chemical room, sixteen specimens, and the one place where the
  // category and the roster actually agree. The room takes the question the other
  // chemical placards across the collection never answer — how a plant carries a
  // poison without being poisoned — and then the arms race that follows from it.
  // Individual compounds live on the placards; this is the machinery.
  poison: {
    name: "Toxic & Chemically-Defended Flora",
    description:
      "Sixteen specimens, and for once the category and the roster agree completely. Which makes this the place to ask the question all the scattered talk of toxins in this collection leaves hanging: how does a plant carry a poison without being poisoned by it? The answer is that most of them do not carry a poison at all. They carry two harmless halves, kept apart. A great many defensive systems are stored as an inert precursor — a toxin bonded to a sugar and parked in the vacuole — while the enzyme that would cleave them sits somewhere else entirely, in a different compartment or a different cell. Nothing happens until the tissue is crushed, at which point the compartments rupture, the two components meet, and the poison is manufactured in the mouth of whatever is chewing. Almonds, cassava and cherry laurel do it with cyanide precursors, releasing hydrogen cyanide on damage. Mustard, horseradish and wasabi do it with glucosinolates and the enzyme myrosinase, and the reaction is fast and violent enough that entomologists call it the mustard oil bomb — which is also, precisely, why wasabi is sharp only after grating and why the sharpness fades within the hour. The plant is not stockpiling a weapon. It is stockpiling the parts. What follows from that is an arms race, and it is the founding case of the whole idea of coevolution: Ehrlich and Raven proposed in 1964 that a plant lineage evolving a new toxin escapes its herbivores and radiates into the space that buys it, until some insect lineage cracks the chemistry and radiates in turn across the newly available plants. Run that alternation for a hundred million years and you get both the diversity of flowering plants and the diversity of the insects eating them, each explained by the other. And the counter-moves get audacious. A monarch caterpillar does not merely tolerate milkweed cardenolides, it stores them in its own tissue and becomes poisonous itself, which is the plant's defence repurposed as the herbivore's. Nearly everything humans call a spice, a stimulant, a drug or a poison was drawn from this room. We are downstream of an argument that was never about us.",
  },
  // Written against its six, only one of which is really a coloniser — the rest
  // are fighters. So the room takes the word pioneer at its technical value: a
  // specific bargain (fast, cheap, light-hungry, short-lived, prolific) whose
  // success is also the mechanism of its own eviction. The asymmetry of light
  // competition is what makes any of it a fight rather than a division of spoils.
  fighting: {
    name: "Pioneer & Fast-Colonizing Flora",
    description:
      "Pioneer is a technical word rather than a compliment, and it names a bargain with fixed terms. Grow fast, build cheaply, demand full light, produce enormous numbers of small seeds, and do not expect to live long. Every part of that is bought at the expense of something else: thin cheap tissue is easily eaten and easily broken, and a plant sprinting for height has nothing left over for defence or for storage. It works because bare ground is a temporary opportunity and the only thing that matters on it is being there first and being tall soonest. What makes this a fight rather than a sharing-out is a peculiarity of the resource. Competition below ground for water and nutrients is roughly proportional — two root systems in the same soil divide it more or less as their sizes suggest. Competition for light is nothing of the kind. The taller plant intercepts the light first and completely, and its neighbour gets whatever is left after the leaves above have finished, which means a small advantage in height converts into a total advantage in supply. Asymmetric competition of that sort is what turns a crowded patch of ground into a race upward, and it is why plants that could have grown comfortably at a metre instead spend everything they have reaching two. And the pioneer's reward for winning is to be replaced. By shading the ground, dropping litter and building soil, a coloniser makes the site steadily more hospitable to the slower, shade-tolerant, better-defended species that will grow up underneath it and eventually over it. Succession is not a sequence of arrivals so much as a sequence of evictions, each carried out by the tenants the previous occupant made room for. Nothing here is permanent, which is the point: a forest that looks static is a mosaic of gaps of different ages, and somewhere in it, at any moment, something fast is taking a piece of open ground that will not stay open.",
  },
  // Written against its seven: the Hoppip line, Tropius, the Rowlet pair and
  // Shaymin-Sky. The old gloss listed the equipment; the room needed the physics,
  // which is that at this size air is thick and falling slowly is the entire
  // trick. The dandelion's vortex ring is on Gossifleur's placard in the
  // mesophytic room, so this text takes the wings, the plumes and the arithmetic.
  flying: {
    name: "Wind-Dispersed & Aerial Flora",
    description:
      "Everything in this room turns on a fact about scale: a seed is small enough that air is not thin. At the size of a dandelion floret, viscosity dominates over inertia, and the problem is no longer how to generate lift but simply how to fall slowly — because a seed that descends at ten centimetres a second in a wind of two metres a second travels twenty metres for every metre it drops, and the arithmetic is entirely settling speed against horizontal drift. Everything else follows from that. There are only a few ways to fall slowly and plants have found all of them. Plumed seeds hang under a bristle of fine filaments that is mostly empty space, which is far more effective per unit of material than any solid canopy of the same width. Winged seeds do something else and do it beautifully: a sycamore or maple samara is asymmetric, so it autorotates as it falls, and the spinning wing generates a stable leading-edge vortex that roughly doubles its time in the air — the same flow structure insects and hovering birds use, produced by a dead object with no moving parts. Dust seeds abandon provisioning altogether: an orchid capsule holds hundreds of thousands of seeds so small they are essentially airborne particles, carrying almost no reserves at all, which is why an orchid seed needs a fungus waiting for it at the other end in order to germinate. The trade running underneath all of it is the same one throughout. Every gram spent on flight is a gram not packed into the seed, so wind dispersal buys distance with provisioning, and the seedling arrives further away and worse equipped. That is a sound bet where the destination is open ground and a terrible one where it is deep shade, which is why the plants in this room are, almost without exception, the ones that need somewhere new.",
  },
  // Written against its six: Paras and Parasect, Wormadam-Plant, and the
  // Sewaddle line. Not one of them is a plant — they are insects that use plant
  // tissue, plus a fungus using an insect — so the room says that outright and
  // then supplies the half the roster cannot: what the plant is doing while
  // this happens to it. Induced defence and volatile recruitment carry the
  // argument; galls, domatia and the yucca contract are split across the
  // placards so the room text isn't carrying all six ideas at once.
  bug: {
    name: "Insect-Associated Flora",
    image: "habitats/bug.jpg",
    description:
      "The category promises plants associated with insects, and there is not a plant in the room. Every specimen here stands on the other side of the relationship — insects that use plant tissue for food, shelter and building material, plus one fungus using an insect. That is worth saying rather than smoothing over, because the plant's half of this is the half that habitually gets left out, and it is not the passive half. A leaf being eaten is not a leaf doing nothing. Within minutes of a caterpillar starting work the damaged tissue changes its chemistry, raising protease inhibitors that make the leaf harder to digest, and it changes what it is releasing into the air. That second part is the striking one. The blend of volatiles coming off a chewed leaf is specific enough that parasitoid wasps navigate by it, so the plant is in effect calling in something that will lay eggs inside the animal eating it. Maize does this, lima bean does this, and the wasps arrive. Some plants go further and build for insects on purpose. Look at the underside of many tree leaves where a vein meets the midrib and there are small pits or tufts of hair — domatia, which house predatory mites that patrol the leaf and eat whatever would damage it. There are whole-tree versions: bullhorn acacias grow hollow swollen thorns for ants to live inside and secrete protein and oil bodies to feed them, and the ants in return attack anything that lands, clip back encroaching vegetation, and defend the tree more effectively than any chemistry it could manufacture. So the association genuinely runs both ways, and the specimens here hold up one end of it. The plants are the exhibits that never got collected, and the wall text is theirs.",
  },
  // Written against its six, only one of which is really a showy bloom: two
  // cottons, two luminous fungi, a guardian deity and Meganium-Mega. So the room
  // is about advertising rather than about ornament — what a display costs, who
  // it is addressed to, how often it lies, and the two specimens here whose
  // lineage gave up on animal pollination altogether.
  fairy: {
    name: "Ornamental & Pollinator Flora",
    description:
      "A flower is an advertisement, and the commercial metaphor holds further than it has any right to: there is a budget, a target audience, and a persistent problem with fraud. The audience first, because the scale of it is easy to underrate — something in the region of nine tenths of flowering plant species depend on animals to move their pollen, which makes the relationship between plants and their couriers one of the largest arrangements in biology. The budget is real sugar. Nectar is manufactured and given away, and a plant that secretes too little goes unvisited while one that secretes too much is subsidising traffic it does not need. Then the targeting, which is more precise than it looks to us, because we are not the intended readers. Many flowers carry nectar guides — lines and bullseyes converging on the centre — printed in ultraviolet, so a bloom that reads to a human eye as a plain yellow disc appears to a bee with a dark landing target at its middle. And where there is advertising there is deception. Something like a third of orchid species offer no reward whatever: they look like a flower that pays, or smell like one, or in the more specialised cases like something else entirely, and they are pollinated by visitors who leave with nothing. Deceit is not a rare pathology in this system, it is a standing strategy. Against all of which sit the plants that closed the account. Wind pollination has evolved repeatedly out of animal-pollinated ancestry, generally where pollinators became unreliable or where a species grew densely enough to make broadcasting worthwhile, and it means abandoning the whole apparatus — no petals, no scent, no nectar, tiny drab flowers, and pollen produced in quantities that would be absurd if it were not being thrown away on purpose. Two of the six specimens standing in this room are cotton on the wind. The category is not really about ornament. It is about the decision of whom to pay, and whether to pay at all.",
  },
  // Written against the seven specimens actually filed here — the whole Applin
  // line, Sceptile-Mega and Exeggutor-Alola — rather than as a generic gloss on
  // the Dragon typing. Five of the seven are apples and one is a palm, which
  // makes this category specifically about *woody* longevity and the orchard
  // trick of outliving the tree.
  dragon: {
    name: "Ancient & Long-Lived Flora",
    image: "habitats/dragon.jpg",
    description:
      "Woody perennials, and the two different ways a plant gets to be old. The first is structural: lignin stiffens cell walls into true wood, which is what lets a trunk hold itself up for centuries rather than a season. Pushed as far as it goes, that route produces the oldest individual organisms on Earth — a bristlecone pine on a dry White Mountains slope has been alive for something over 4,800 years, growing so slowly that the wood is denser than the axe made to cut it. The second route is stranger, and it's why five of the seven specimens here are apples: don't keep the tree alive, keep the genotype. An orchard cultivar survives by being grafted onto fresh rootstock, again and again, so one genetic individual continues long after every tree that bore it has died. Plants worked this out well before orchardists did. Pando, a single male quaking aspen in Utah, spreads more than forty hectares of trunks from one connected root system, and has been doing it for thousands of years — every trunk a stem of the same organism, none of them individually old. What is ancient in this room is usually not the specimen in front of you but the lineage it was cut from.",
  },
  // Written against its ten: the Phantump line, the Pumpkaboo line, Decidueye,
  // Dhelmise, the Bramblin line and the two teas. Only two of them are actually
  // wood, so the room leads on wood — where the biology is strongest — and then
  // spends the rest of itself on the fact that "decay" is not one process on one
  // clock. Wood, fruit, leaf litter, drifting kelp and dry brush each break down
  // at their own rate, by their own organisms, and in the dry country at the end
  // of the paragraph they largely don't break down at all.
  ghost: {
    name: "Deadwood & Decomposer-Associated Flora",
    image: "habitats/ghost.jpg",
    description:
      "A mature tree is already mostly dead, which reframes everything else in this room. The heartwood at its centre is non-living tissue, plugged and loaded with tannins and resins, and the living part of a trunk is a thin sleeve of sapwood and cambium wrapped around it. So when fungi hollow out an old tree they are eating the part that had already stopped, and the tree goes on standing, because the strength of a cylinder is in its wall. Nor does a tree heal a wound — it walls the wound off, laying down chemical and structural boundaries around the damage so that decay is contained rather than driven out. The hollow you can put an arm into is where that negotiation settled. The slowness is chemistry: cellulose is sugar in a queue and goes quickly, while lignin is an irregular aromatic tangle with no repeating bond to cut, and essentially only the white-rot fungi, working through peroxidases and loose radicals, take it all the way apart. Brown rot does not try — it strips the sugars and abandons the lignin as the crumbling brown residue that makes up a great deal of the dark matter in forest soil. Softer tissue runs on an entirely different clock: a gourd left in a field is dismantled pectin-first and collapses where it sits rather than crumbling, and the leaf litter a deciduous wood drops every autumn is gone within a season or two, which by annual weight makes it the largest thing this wing is really about. Rot is also not guaranteed. Decomposers need water as much as anything else does, so on dry ground dead plant matter accumulates instead of breaking down, and fire ends up doing the work the fungi cannot. And a dead trunk is an address, not an ending. In European forests something close to a third of the species present depend on deadwood at some point in their lives, and in the Pacific Northwest hemlock seedlings germinate so reliably on rotting logs that mature trees end up in straight colonnades, standing on stilt roots above a log that has long since rotted out from beneath them.",
  },
  // The original text already made the right concession — two unlike threads
  // sharing a type by coincidence — and named the contested claims honestly, so
  // that framing is kept and the room is deepened rather than replaced. The new
  // material is the part neither thread had: why plant compounds fit animal
  // receptors at all, and what a plant's senses actually are.
  psychic: {
    name: "Psychoactive & Sensory-Signaling Flora",
    description:
      "Two real threads share this type by coincidence of vibe, and both are worth having. The first is chemistry that acts on minds. Caffeine, nicotine, morphine, cocaine and the rest are not gifts and were not aimed at us — they are herbivore deterrents, manufactured at real metabolic cost to poison, deter or derange whatever was eating the plant. What makes them work on people is that the targets are old. Nicotine fits the acetylcholine receptor, which is why it is a stimulant in a human and a lethal insecticide in an aphid; the whole neonicotinoid class was built by improving on it. Morphine fits receptors that exist for the body's own endorphins. The plant did not evolve toward our nervous systems; our nervous systems are assembled from parts so ancient and so conserved that a molecule shaped to jam an insect's will often fit ours too. Every psychoactive plant is a case of collateral damage that people went looking for on purpose. The second thread is sensing, and the honest version is more impressive than the mystical one. A plant has no nerves and no brain, and it nonetheless registers light across several wavebands with distinct photoreceptors, touch, temperature, humidity, chemical gradients, the volatiles released by damaged neighbours, and its own orientation in space — that last through statoliths, dense starch grains that settle under gravity inside specialised cells so the plant can read which wall they have landed against. It answers all of it by growing, which is slow enough that we tend not to count it as a response. Where this room has to be careful is at the edges, and it is worth saying which is which. Volatile signalling between plants and nutrient transfer through shared fungal networks are well established. Roots orienting toward the sound of running water, and habituation in a repeatedly disturbed mimosa, are published, striking, and genuinely disputed within plant science rather than settled. This is the wing where the collection keeps the least certain of its claims, and it labels them.",
  },
  steel: {
    name: "Mineral-Accumulating Flora",
    description:
      "The soil does most of the work in this room, and the soil in question is serpentine. Where ultramafic rock from deep in the mantle reaches the surface and weathers, it leaves ground that is wrong in several directions at once: heavy in magnesium and light in calcium, thin on nitrogen, phosphorus and potassium, and loaded with nickel, chromium and cobalt at concentrations that kill ordinary plants outright. Almost nothing will grow on it, and what does grow there is frequently found nowhere else — serpentine outcrops are islands, and they are full of endemics. A few hundred of those species went further than tolerance. A hyperaccumulator does not merely survive the metal, it collects it: the working threshold is a thousand micrograms of nickel per gram of dry leaf, a tenth of one per cent, and something like seven hundred species are now known to clear it, the overwhelming majority for nickel. The extreme is barely credible. A New Caledonian tree, Pycnandra acuminata, bleeds a latex that is blue-green rather than white, and the colour is nickel — around a quarter of the dried sap by weight. Why any plant would do this was argued over for decades, and the best-supported answer is defence: leaves loaded with metal are measurably less attractive to insects and less prone to infection, which makes the metal a poison the plant has borrowed rather than manufactured. There is a use for it, too. Agromining grows hyperaccumulator crops on ore-grade ground, burns the harvest, and smelts a genuine nickel concentrate out of the ash, while the same trick run on contaminated land is phytoremediation — the same plant, sold as a cleaner rather than a miner. One correction the exhibits require, though. Every specimen in this room wears its metal on the outside, as plate and spike. Real accumulation is nothing of the kind: the metal is dissolved through the leaf tissue, stored in vacuoles and cell walls where it can do no harm to the plant itself, and it is invisible. You cannot pick a hyperaccumulator out of a meadow by looking. You have to burn it and weigh what is left.",
  },
  // Written against Snover, Abomasnow and Abomasnow-Mega — one conifer line,
  // which makes this the treeline room specifically rather than a general
  // "cold places" gloss. Leads on the two facts that most often get it wrong:
  // cold isn't the enemy, and snow isn't either.
  ice: {
    name: "Cold-Adapted & Alpine Flora",
    image: "habitats/ice.jpg",
    description:
      "Cold on its own doesn't kill a hardy plant — ice inside its cells does, because growing crystals shred membranes from within. So the trick is not to avoid freezing but to control where it happens: a cold-acclimated conifer lets ice form deliberately in the spaces between its cells, and as those crystals grow they pull water out of the living cells and into the ice. The cell survives the winter by drying out rather than bursting. Snow is misread the same way. A metre of snowpack is insulation, not assault — the ground beneath it sits near freezing while the air above plunges far colder, and alpine plants depend on being buried. A cold winter without snow does far more damage than a colder one with it. What actually stops a forest is subtler than any of this: measure treelines anywhere in the world and they sit at roughly the same growing-season soil temperature, near 6 to 7°C. Trees are not turned back by winter minima but by summers too brief and too cool to build wood, and the last of them stand twisted and flagged by wind-driven ice into the low contorted growth foresters call krummholz.",
  },
  // Written against its three: Voltorb-Hisui, Electrode-Hisui and Rotom-Mow.
  // The smallest room, and the one whose specimens sit least comfortably in
  // it — two wooden spheres and a possessed lawnmower. The category is carried
  // by the science rather than by the exhibits, and says so.
  electric: {
    name: "Bioelectric-Signaling Flora",
    image: "habitats/electric.jpg",
    description:
      "Plants are electrically active, and far faster at it than they are at anything else. A Venus flytrap fires an action potential when a trigger hair is touched, holds the count, and snaps only if a second touch arrives soon after — a plant keeping short-term memory in charge rather than in tissue. Bite an Arabidopsis leaf and a wave of calcium and glutamate signalling travels out through the plant at around a millimetre a second, priming defences in leaves the caterpillar hasn't reached yet. Flowers hold a weak negative charge that bumblebees, positively charged from flight, can read on approach — enough to tell a flower already emptied of nectar from a fresh one before landing. Growth is measured in days; this is the register where a plant answers in seconds. It is also, honestly, the room where the exhibits fit their category least well: two of the three are wooden spheres and the third is a possessed lawnmower, so what holds this wing together is the biology on the walls more than the specimens under glass.",
  },
  // Written against its five: the Deerling line and the Smoliv line. A Normal
  // secondary type makes the same non-claim mono-Grass does, and repeating the
  // mesophytic room's "this is missing information" line would be saying it
  // twice — so the room deals with that in a sentence and then reads what the
  // exhibits actually share, which is a calendar rather than a place. A
  // seasonal deer and an olive are both organisms defined by timing, so this
  // is the phenology room. Note the notes on all five already gesture at
  // photoperiod, so the room text carries the mechanism they don't: night
  // length, phytochrome, degree-days and vernalization.
  normal: {
    name: "Generalist Flora",
    image: "habitats/normal.jpg",
    description:
      "Normal is the type that declines to say anything, so this room makes the same non-claim the mono-Grass room does, and there is nothing gained by making it twice. Read the exhibits instead. What a seasonal deer and an olive have in common is not a place — it is a calendar. Every other room in this wing answers where a plant lives; this one answers when it does things, which is the one adaptation with no location attached to it. Plants do not count days. They count heat. Development advances with accumulated temperature above some threshold, so a crop that ripens in early July one year and late July the next has usually arrived at the same total, and growers plan in degree-days rather than dates because the calendar is the less reliable instrument. Where a plant does need a date, it measures the dark. Photoperiodism sounds like a plant watching the day, but the experiment that settled it did the opposite: interrupt a long winter night with a few minutes of light and a short-day plant will not flower, while trimming the day without touching the night changes nothing at all. What is being timed is the length of the darkness, and the pigment doing it — phytochrome — is flipped into one form by light and relaxes back in the dark slowly enough to work as an hourglass. Winter, meanwhile, gets treated as information rather than obstacle. Vernalization is a real requirement: winter wheat sown in spring will simply not flower, because it has not had its cold. Weeks of low temperature progressively shut down a gene that otherwise blocks flowering, and it stays shut once the warmth returns, so the plant carries a memory of a winter it has already survived into the spring that follows. All of which is why timing is the fragile part of the whole arrangement. A plant in the right place at the wrong moment is, in every way that counts, in the wrong place.",
  },
};

export function getHabitat(secondaryType, override) {
  if (override) return override;
  return habitatMap[secondaryType || "none"] || habitatMap.none;
}

// URL slug from the habitat's display name rather than its map key: the key is
// a secondary type (`dragon`, `none`), which makes for opaque and occasionally
// nonsensical URLs. Slugging the name gives /habitat/ancient-and-long-lived-flora,
// and it also lets an overridden habitat — which carries a name but no key —
// resolve to the same exhibition as everyone else in its category.
export function habitatSlug(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const HABITATS = Object.entries(habitatMap).map(([key, habitat]) => ({
  key,
  slug: habitatSlug(habitat.name),
  ...habitat,
}));

export function getHabitatBySlug(slug) {
  return HABITATS.find((h) => h.slug === slug) || null;
}

export default habitatMap;
