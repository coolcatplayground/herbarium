import { Link } from "react-router-dom";

function spriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function TreeNode({ node, currentName }) {
  const isCurrent = node.name === currentName;
  return (
    <li>
      <div className="evo-node-wrap">
        {node.trigger && <span className="evo-trigger mono">{node.trigger}</span>}
        <Link to={`/specimen/${node.name}`} className={`evo-node${isCurrent ? " current" : ""}`}>
          <img src={spriteUrl(node.id)} alt={node.name} width={44} height={44} loading="lazy" />
          <span className="mono evo-name">{node.name}</span>
        </Link>
      </div>
      {node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <TreeNode key={child.name} node={child} currentName={currentName} />
          ))}
        </ul>
      )}
    </li>
  );
}

// Renders a branch-preserving evolution tree from buildEvolutionTree's
// output. Single-child chains render as a straight line (via the
// :only-child CSS rule); actual branch points fan out visibly.
export default function EvolutionTree({ tree, currentName }) {
  return (
    <div className="evo-tree">
      <ul>
        <TreeNode node={tree} currentName={currentName} />
      </ul>
    </div>
  );
}
