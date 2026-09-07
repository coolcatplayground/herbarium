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
        </Routes>
      </main>
      {/* The one line on this site that is not in the curator's voice, and the
          one that has to stay legible to somebody who is not enjoying
          themselves. It is mounted, like every other block of text here — see
          .site-footer for why that took two goes to get right. */}
      <footer className="site-footer">
        <div className="container mono site-footer__line">
          CC Herbarium &mdash; a fan-made field guide. Not affiliated with Nintendo, Game Freak, or Creatures Inc.
        </div>
      </footer>
    </HashRouter>
  );
}
