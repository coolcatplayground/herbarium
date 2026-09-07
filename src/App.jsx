import { HashRouter, Routes, Route } from "react-router-dom";
import NavHeader from "./components/NavHeader";
import ScrollToTop from "./components/ScrollToTop";
import Herbarium from "./pages/Herbarium";
import Specimen from "./pages/Specimen";
import DeterminationKey from "./pages/DeterminationKey";
import HabitatExhibition from "./pages/HabitatExhibition";
import ExhibitionHall from "./pages/ExhibitionHall";
import GraftingBench from "./pages/GraftingBench";
import Manuscripts from "./pages/Manuscripts";
import FutureSpecies from "./pages/FutureSpecies";
import About from "./pages/About";
import WriteToCurator from "./pages/WriteToCurator";
import "./styles/tokens.css";

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <NavHeader />
      <main>
        <Routes>
          <Route path="/" element={<Herbarium />} />
          <Route path="/specimen/:name" element={<Specimen />} />
          <Route path="/key" element={<DeterminationKey />} />
          <Route path="/exhibition" element={<ExhibitionHall />} />
          <Route path="/habitat/:slug" element={<HabitatExhibition />} />
          <Route path="/grafting-bench" element={<GraftingBench />} />
          <Route path="/manuscripts" element={<Manuscripts />} />
          <Route path="/future-species" element={<FutureSpecies />} />
          <Route path="/about" element={<About />} />
          <Route path="/write" element={<WriteToCurator />} />
        </Routes>
      </main>
      {/* The one line on this site that is not in the curator's voice, and the
          one that has to be legible to someone who is not enjoying themselves.
          It was 0.72rem of --ink-soft, which measures 5.04:1 against the page's
          bottom gradient stop — passing AA, and still hard to read, because the
          ratio was never the problem. 0.72rem is 11.5px, and this is a mono
          face: thin strokes and a small x-height at a size where neither can
          spare anything.

          So it grows to 0.8rem and takes --ink at 7.36:1. An outline was the
          other idea and is the wrong tool — a stroke exists to lift text off a
          busy backdrop, and this sits on flat paper, where it would only thicken
          small glyphs into mud. */}
      <footer style={{ borderTop: "1px solid var(--paper-line)", padding: "22px 0", marginTop: "40px" }}>
        <div className="container mono" style={{ fontSize: "0.8rem", color: "var(--ink)" }}>
          CC Herbarium &mdash; a fan-made field guide. Not affiliated with Nintendo, Game Freak, or Creatures Inc.
        </div>
      </footer>
    </HashRouter>
  );
}
