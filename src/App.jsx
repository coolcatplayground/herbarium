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
      <footer style={{ borderTop: "1px solid var(--paper-line)", padding: "20px 0", marginTop: "40px" }}>
        <div className="container mono" style={{ fontSize: "0.72rem", color: "var(--ink-soft)" }}>
          CC Herbarium &mdash; a fan-made field guide. Not affiliated with Nintendo, Game Freak, or Creatures Inc.
        </div>
      </footer>
    </HashRouter>
  );
}
