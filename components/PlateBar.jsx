// Plate-loading visualizer: chunks of 45lb rendered as blocks
export function PlateBar({ weight }) {
  const w = weight || 0;
  const full = Math.floor(w / 45);
  const remainder = w % 45;
  const blocks = [];
  for (let i = 0; i < Math.min(full, 8); i++) blocks.push(45);
  if (remainder > 0) blocks.push(remainder);
  const maxTotal = 405;
  return (
    <div style={{ display: "flex", gap: 2, height: 10, width: "100%", background: "#241F1B", borderRadius: 2, overflow: "hidden" }}>
      {blocks.length === 0 ? (
        <div style={{ width: "100%", background: "#2E2B27" }} />
      ) : (
        blocks.map((b, i) => (
          <div
            key={i}
            style={{
              width: `${(b / maxTotal) * 100}%`,
              background: i % 2 === 0 ? "#B5453B" : "#8C3A32",
              minWidth: 3,
            }}
          />
        ))
      )}
    </div>
  );
}
