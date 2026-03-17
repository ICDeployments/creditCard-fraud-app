import React from "react";
import "./ModelAccuracyModal.css";

const falsePositivesData = [
  { time: "00:00", original: 12, enhanced: 6 },
  { time: "04:00", original: 15, enhanced: 7 },
  { time: "08:00", original: 13, enhanced: 4 },
  { time: "12:00", original: 16, enhanced: 8 },
  { time: "16:00", original: 20, enhanced: 10 },
  { time: "20:00", original: 14, enhanced: 4 },
  { time: "24:00", original: 15, enhanced: 5 },
];

export default function FalsePositivesModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="model-accuracy-modal-overlay">
      <div className="model-accuracy-modal-content">
        <div className="model-accuracy-modal-header">
          <span className="model-accuracy-modal-title">
            Credit Fraud Analysis : Data Enhancement
          </span>
          <button className="model-accuracy-close-btn" onClick={onClose}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 8L20 20M20 8L8 20" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="model-accuracy-modal-heading-row">
          <span className="model-accuracy-modal-main-heading">False Positives</span>
          <span className="model-accuracy-modal-legend">
            <span className="model-accuracy-legend original" style={{background: 'linear-gradient(180deg, #FFE699 50%, #FFF7CC 100%)'}}></span>Original
            <span style={{width: 16}}></span>
            <span className="model-accuracy-legend enhanced" style={{background: 'linear-gradient(180deg, #B6F5B6 50%, #D9FCD9 100%)'}}></span>Enhanced
          </span>
        </div>
        <div className="model-accuracy-modal-divider" />
        <div className="model-accuracy-modal-body">
          <div className="model-accuracy-chart">
            <svg width="600" height="260" style={{overflow: 'visible'}}>
              {/* Y Axis grid lines and labels */}
              {[0, 5, 10, 15, 20].map((y) => (
                <g key={y}>
                  <text x={18} y={230 - y * 10} fill="#7B7BCE" fontSize="16" fontFamily="Gellix, sans-serif" opacity="0.6">{y}</text>
                  <line x1={48} y1={230 - y * 10} x2={580} y2={230 - y * 10} stroke="#E6E6FA" strokeDasharray="4 4" />
                </g>
              ))}
              {/* Bars */}
              {falsePositivesData.map((d, i) => {
                const barWidth = 38;
                const gap = 38;
                const x = 70 + i * (barWidth + gap);
                const yEnhanced = 230 - d.enhanced * 10;
                const yOriginal = 230 - d.original * 10;
                return (
                  <g key={d.time}>
                    {/* Enhanced (bottom) */}
                    <rect x={x} y={yEnhanced} width={barWidth} height={d.enhanced * 10} rx={7} fill="url(#enhancedGradient)" />
                    {/* Original (top, stacked) */}
                    <rect x={x} y={yOriginal} width={barWidth} height={(d.original - d.enhanced) * 10} rx={7} fill="url(#originalGradient)" />
                    {/* Time label */}
                    <text x={x + barWidth / 2} y={255} textAnchor="middle" fill="#7B7BCE" fontSize="16" fontFamily="Gellix, sans-serif">{d.time}</text>
                  </g>
                );
              })}
              {/* Gradients */}
              <defs>
                <linearGradient id="originalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFE699" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#FFF7CC" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="enhancedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B6F5B6" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#D9FCD9" stopOpacity="0.7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
