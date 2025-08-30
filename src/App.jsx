import React, { useMemo, useRef, useState } from "react";

function degToRad(d) { return (d * Math.PI) / 180; }
function normalizeNames(input) {
  return input
    .split(/\r?\n/)
    .map((n) => n.trim())
    .filter(Boolean);
}

const defaultNames = [
  "Arjun",
  "Vikrant",
  "Shreya",
  "Shivanshu",
  "Sanjay",
  "Rajeshwar",
  "Rohit",
  "Mohit",
  "Manikanta",
  "Kaushiki",
];

export default function App() {
  const [namesText, setNamesText] = useState(defaultNames.join("\n"));
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState("");
  const [forceFourth, setForceFourth] = useState(true);
  const [duration, setDuration] = useState(5000);
  const wheelRef = useRef(null);

  const names = useMemo(() => normalizeNames(namesText), [namesText]);
  const seg = names.length > 0 ? 360 / names.length : 360;
  const startAngle = -90;

  const colors = useMemo(() => {
    const palette = ["#1e3a8a", "#ef4444", "#f59e0b", "#16a34a"];
    return names.map((_, i) => palette[i % palette.length]);
  }, [names]);

  // Calculate the exact angle so that the pointer lands right on the winner
  function angleForIndex(i) {
    const center = startAngle + i * seg + seg / 2;
    const pointerAngle = -90;
    const offset = center - pointerAngle;
    return -offset;
  }

  function spin() {
    if (spinning || names.length === 0) return;
    setWinner("");
    const wheel = wheelRef.current;
    if (!wheel) return;

    const forcedIndex = 3;
    let targetIndex;
    if (forceFourth && names.length > forcedIndex) {
      targetIndex = forcedIndex;
    } else {
      targetIndex = Math.floor(Math.random() * names.length);
    }

    const extraSpins = 8 + Math.floor(Math.random() * 4);
    const targetAngle = angleForIndex(targetIndex) + extraSpins * 360;

    setSpinning(true);
    wheel.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0.9, 0.2, 1)`;
    wheel.style.transform = `rotate(${targetAngle}deg)`;

    const timer = setTimeout(() => {
      setSpinning(false);
      setWinner(names[targetIndex] ?? "");
    }, duration + 50);

    return () => clearTimeout(timer);
  }

  function resetWheel() {
    const wheel = wheelRef.current;
    if (!wheel) return;
    wheel.style.transition = "none";
    wheel.style.transform = "rotate(0deg)";
    setWinner("");
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex items-center justify-center p-6">
      <div className="grid gap-6 w-full max-w-6xl md:grid-cols-[1.2fr_1fr]">
        <div className="bg-neutral-900/60 rounded-2xl shadow-xl p-6 relative overflow-hidden">
          <h1 className="text-2xl font-semibold mb-4">Rigged Wheel of Names</h1>
          <div className="relative mx-auto w-full flex items-center justify-center" style={{aspectRatio: '1/1'}}>
            {/* Pointer flipped 180 degrees to point inward */}
            <div className="absolute top-[4%] left-1/2 -translate-x-1/2 z-20">
              <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[40px] border-t-white drop-shadow" />
            </div>

            <div
              ref={wheelRef}
              className="relative rounded-full w-full max-w-[520px] aspect-square bg-neutral-800 select-none"
              style={{ transform: "rotate(0deg)" }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <g transform="translate(50,50)">
                  {names.map((label, i) => {
                    const a0 = degToRad(i * seg + startAngle);
                    const a1 = degToRad((i + 1) * seg + startAngle);
                    const large = seg > 180 ? 1 : 0;
                    const r = 48;
                    const x0 = r * Math.cos(a0);
                    const y0 = r * Math.sin(a0);
                    const x1 = r * Math.cos(a1);
                    const y1 = r * Math.sin(a1);
                    const path = `M0 0 L ${x0.toFixed(3)} ${y0.toFixed(3)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(3)} ${y1.toFixed(3)} Z`;
                    const mid = degToRad(i * seg + startAngle + seg / 2);
                    const tx = (r * 0.65) * Math.cos(mid);
                    const ty = (r * 0.65) * Math.sin(mid);
                    return (
                      <g key={i}>
                        <path d={path} fill={colors[i]} stroke="#111" strokeWidth={0.5} />
                        <text
                          x={tx}
                          y={ty}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={Math.max(6, 14 - Math.max(0, names.length - 6))}
                          fill="#fff"
                          transform={`rotate(${(i * seg + startAngle + seg / 2)} ${tx} ${ty})`}
                        >
                          {label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full shadow-inner" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={spin}
              disabled={spinning || names.length === 0}
              className="px-5 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed shadow"
            >
              {spinning ? "Spinning…" : "Spin"}
            </button>
            <button
              onClick={resetWheel}
              disabled={spinning}
              className="px-5 py-2 rounded-2xl bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 shadow"
            >
              Reset
            </button>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={forceFourth}
                onChange={(e) => setForceFourth(e.target.checked)}
                className="w-4 h-4"
              />
              Force 4th name (rig mode)
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <span>Duration</span>
              <input
                type="number"
                min={1000}
                max={15000}
                step={500}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value || "5000", 10))}
                className="w-24 rounded-lg bg-neutral-800 border border-neutral-700 px-2 py-1"
              />
              <span>ms</span>
            </label>
          </div>

          {winner && (
            <div className="mt-4 text-lg">
              Winner: <span className="font-semibold text-emerald-400">{winner}</span>
            </div>
          )}
        </div>

        <div className="bg-neutral-900/60 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Names (one per line)</h2>
          <textarea
            className="w-full h-80 bg-neutral-800 border border-neutral-700 rounded-xl p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={namesText}
            onChange={(e) => setNamesText(e.target.value)}
            placeholder={`Enter names here...`}
          />
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              onClick={() => {
                const arr = normalizeNames(namesText);
                if (arr.length < 2) return;
                const a = [...arr];
                for (let i = a.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [a[i], a[j]] = [a[j], a[i]];
                }
                setNamesText(a.join("\n"));
                setWinner("");
              }}
              className="px-4 py-2 rounded-2xl bg-blue-500 hover:bg-blue-600 shadow"
            >
              Shuffle Names
            </button>
            <button
              onClick={() => {
                alert("Tip: The 4th name in this list is the one forced when rig mode is on.");
              }}
              className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 shadow"
            >
              Tip: 4th position wins
            </button>
          </div>
          <p className="mt-4 text-sm text-neutral-400">
            With <span className="text-emerald-400">Rig mode</span> enabled, the wheel will always land with the 4th name directly under the pointer. Turn it off to spin fairly.
          </p>
        </div>
      </div>
    </div>
  );
}
