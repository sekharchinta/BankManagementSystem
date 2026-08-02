import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { formatCurrency } from "../../lib/format";

const DEFAULT_MASK = "₹ ••••••";

export default function HiddenBalance({
  value,
  className = "",
  iconSize = 14,
  mask = DEFAULT_MASK,
  revealMs = 4000,
}) {
  const [revealed, setRevealed] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearTimeout(timer.current);
    if (revealed) {
      setRevealed(false);
    } else {
      setRevealed(true);
      timer.current = setTimeout(() => setRevealed(false), revealMs);
    }
  };

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {revealed ? (
        <span className="tabular-nums">{formatCurrency(value)}</span>
      ) : (
        <span className="tabular-nums">{mask}</span>
      )}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={revealed ? "Hide balance" : "Show balance"}
        title={revealed ? "Hide balance" : "Show balance"}
        className="shrink-0 rounded-full p-1 text-current opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
      >
        {revealed ? <EyeOff size={iconSize} /> : <Eye size={iconSize} />}
      </button>
    </span>
  );
}
