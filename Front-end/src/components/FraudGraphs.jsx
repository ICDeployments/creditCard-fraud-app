import React, { useState } from 'react';
import './FraudGraphs.css';

export default function FraudGraphs() {
  // Dummy data for graphs
  const fraudData = [18, 30, 12, 35,  60, 28, 12];
  const falsePositiveData = [7, 14, 5, 20, 8, 17, 5];
//   const labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
const labels = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun',];

  return (
    <div className="fraud-graphs-section">
      <div className="graph-card">
        <div className="graph-title">Fraud Detection</div>
        <Graph
          data={fraudData}
          labels={labels}
          color="#B81F2D"
          fillColor="rgba(184,31,45,0.12)"
          yLabelColor="#B81F2D"
          maxY={60}
        />
      </div>
      <div className="graph-card">
        <div className="graph-title">False Positives</div>
        <Graph
          data={falsePositiveData}
          labels={labels}
          color="#E9C71D"
          fillColor="rgba(233,199,29,0.12)"
          yLabelColor="#E9C71D"
          maxY={20}
        />
      </div>
    </div>
  );
}

function Graph({ data, labels, color, fillColor, yLabelColor, maxY = 60 }) {
  // --- Layout constants ---
  const width = 520;
  const height = 260;
  const paddingLeft = 71;
  const paddingRight = 48;
  const padding = 48; // for y axis and grid
  const labelPadding = 32;
  const pointRadius = 5;
  const gridCount = 4;
  const minY = 0;
  const ySteps = Array.from({ length: gridCount + 1 }, (_, i) => Math.round(minY + (maxY - minY) * i / gridCount));

  // --- Tooltip state ---
  const [tooltip, setTooltip] = useState(null);

  // --- Calculate points for smooth curve ---
  function getSmoothPath(points) {
    if (points.length < 2) return '';
    let d = `M${points[0][0]},${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const control1x = p1[0] + (p2[0] - p0[0]) / 6;
      const control1y = p1[1] + (p2[1] - p0[1]) / 6;
      const control2x = p2[0] - (p3[0] - p1[0]) / 6;
      const control2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C${control1x},${control1y} ${control2x},${control2y} ${p2[0]},${p2[1]}`;
    }
    return d;
  }

  // --- Calculate graph points ---
  const points = data.map((v, i) => {
    // Use left and right padding for even spacing
    const x = paddingLeft + ((width - paddingLeft - paddingRight) / (data.length - 1)) * i;
    const y = padding + ((height - 2 * padding) * (1 - (v - minY) / (maxY - minY)));
    return [x, y];
  });

  // --- Area fill path ---
  const areaPath = (() => {
    if (points.length < 2) return '';
    let d = `M${points[0][0]},${height - padding}`;
    d += ` L${points[0][0]},${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const control1x = p1[0] + (p2[0] - p0[0]) / 6;
      const control1y = p1[1] + (p2[1] - p0[1]) / 6;
      const control2x = p2[0] - (p3[0] - p1[0]) / 6;
      const control2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C${control1x},${control1y} ${control2x},${control2y} ${p2[0]},${p2[1]}`;
    }
    d += ` L${points[points.length - 1][0]},${height - padding} Z`;
    return d;
  })();

  // --- Grid lines and Y labels ---
  const gridLines = [];
  const yLabels = [];
  for (let i = 0; i < ySteps.length; i++) {
    const y = padding + ((height - 2 * padding) * (1 - (ySteps[i] - minY) / (maxY - minY)));
    gridLines.push(
      <line
        key={i}
        x1={padding}
        x2={width - padding}
        y1={y}
        y2={y}
        className="graph-grid-line"
      />
    );
    yLabels.push(
      <text
        key={i}
        x={padding - 14}
        y={y + 6}
        textAnchor="end"
        className="graph-axis-label"
      >
        {ySteps[i]}
      </text>
    );
  }

  // --- Tooltip rendering ---
  const renderTooltip = () => {
    if (!tooltip) return null;
    const { x, y, value, label } = tooltip;
    return (
      <g>
        <rect
          x={x - 48}
          y={y - 60}
          rx={10}
          ry={10}
          width={96}
          height={44}
          fill="#0A0A23"
          opacity="0.95"
          stroke={color}
          strokeWidth="2"
        />
        <text
          x={x}
          y={y - 42}
          textAnchor="middle"
          fontSize="13"
          fill="#fff"
          fontWeight="600"
        >
          {label}
        </text>
        <text
          x={x}
          y={y - 22}
          textAnchor="middle"
          fontSize="16"
          fill={color}
          fontWeight="700"
        >
          {value}
        </text>
      </g>
    );
  };

  // --- Area gradients ---
  const redGradient = (
    <defs>
      <linearGradient id="red-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#B81F2D" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#B81F2D" stopOpacity="0.0001" />
      </linearGradient>
    </defs>
  );
  const yellowGradient = (
    <defs>
      <linearGradient id="yellow-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E9C71D" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#E9C71D" stopOpacity="0.0001" />
      </linearGradient>
    </defs>
  );

  return (
    <div style={{ position: 'relative', width, height: height + 32 }}>
      <svg width={width} height={height + 32} className="graph-svg">
        {color === "#B81F2D" ? redGradient : yellowGradient}
        {/* Grid lines */}
        {gridLines}
        {/* Y-axis labels */}
        {yLabels}
        {/* Area fill */}
        <path d={areaPath} className={color === "#B81F2D" ? "graph-area" : "graph-area-yellow"} stroke="none" />
        {/* Smooth line */}
        <path d={getSmoothPath(points)} className={color === "#B81F2D" ? "graph-line" : "graph-line-yellow"} />
        {/* Data points */}
        {points.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            className={color === "#B81F2D" ? "graph-point" : "graph-point-yellow"}
            onMouseEnter={() => setTooltip({ x, y, value: data[i], label: labels[i] })}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
        {/* X-axis labels */}
        {labels.map((label, i) => {
          let x = points[i][0];
          return (
            <text
              key={label}
              x={x}
              y={height - padding + 32}
              textAnchor="middle"
              fontSize="18"
              fill="#7373D8"
              fontWeight="700"
              fontFamily="Gellix, sans-serif"
            >
              {label}
            </text>
          );
        })}
        {/* Tooltip */}
        {renderTooltip()}
      </svg>
    </div>
  );
}
