import { Link, NavLink } from "react-router-dom";

export default function NavHeader() {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--ink)",
        background: "var(--paper-light)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          padding: "18px 24px",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <span
              className="mono"
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--specimen-red)",
                border: "1px solid var(--specimen-red)",
                borderRadius: "6px",
                padding: "2px 6px",
              }}
            >
              Glasshouse No. II
            </span>
            <h1 style={{ fontSize: "1.4rem", margin: 0 }}>Folia Codex</h1>
          </div>
        </Link>
        <nav style={{ display: "flex", gap: "22px" }}>
          {[
            { to: "/", label: "Specimens" },
            { to: "/grafting-bench", label: "Grafting Bench" },
            { to: "/manuscripts", label: "Reading Room" },
            { to: "/future-species", label: "Propagation Bench" },
            { to: "/about", label: "Field Notes" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              style={({ isActive }) => ({
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                textDecoration: "none",
                color: isActive ? "var(--specimen-red)" : "var(--ink-soft)",
                borderBottom: isActive ? "1px solid var(--specimen-red)" : "1px solid transparent",
                paddingBottom: "2px",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
