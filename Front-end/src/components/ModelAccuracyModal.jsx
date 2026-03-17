import React from 'react';
import './ModelAccuracyModal.css';

const CloseButton = ({ onClick }) => (
  <button className="model-accuracy-close-btn" onClick={onClick} aria-label="Close">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 8L20 20M20 8L8 20" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  </button>
);

const ModelAccuracyModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="model-accuracy-modal-overlay">
      <div className="model-accuracy-modal-content">
        <div className="model-accuracy-modal-header">
          <span className="model-accuracy-modal-title">Credit Fraud Analysis : Data Enhancement</span>
          <CloseButton onClick={onClose} />
        </div>
        {/* Heading + legend row */}
        <div className="model-accuracy-modal-heading-row">
          <span className="model-accuracy-modal-main-heading">Model Accuracy</span>
          <span className="model-accuracy-modal-legend">
            <span className="model-accuracy-legend original" /> Original
            <span className="model-accuracy-legend enhanced" style={{marginLeft: '24px'}} /> Enhanced
          </span>
        </div>
        <div className="model-accuracy-modal-divider" />
        <div className="model-accuracy-modal-body">
          <div className="model-accuracy-chart">
            <svg width="700" height="350">
              {/* Dotted grid lines */}
              <g>
                {[60, 120, 180, 240, 300].map((y, i) => (
                  <line key={i} x1="70" y1={y} x2="650" y2={y} stroke="#8A8AFF" strokeDasharray="6,6" strokeWidth="1.5" opacity="0.25" />
                ))}
              </g>
              {/* Y-axis labels */}
              <text x="30" y="65" fill="#8A8AFF" fontSize="18">100%</text>
              <text x="30" y="125" fill="#8A8AFF" fontSize="18">75%</text>
              <text x="30" y="185" fill="#8A8AFF" fontSize="18">50%</text>
              <text x="30" y="245" fill="#8A8AFF" fontSize="18">25%</text>
              <text x="30" y="305" fill="#8A8AFF" fontSize="18">0%</text>
              {/* Bars: Original (blue gradient) */}
              <defs>
                <linearGradient id="originalBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3D54D0" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#3D54D0" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="enhancedBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2DB81F" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#2DB81F" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
                </linearGradient>
              </defs>
              <rect x="100" y="240" width="42" height="70" fill="url(#originalBarGradient)" rx="8" />
              <rect x="184" y="200" width="42" height="110" fill="url(#originalBarGradient)" rx="8" />
              <rect x="268" y="160" width="42" height="150" fill="url(#originalBarGradient)" rx="8" />
              <rect x="352" y="220" width="42" height="90" fill="url(#originalBarGradient)" rx="8" />
              <rect x="436" y="180" width="42" height="130" fill="url(#originalBarGradient)" rx="8" />
              <rect x="520" y="200" width="42" height="110" fill="url(#originalBarGradient)" rx="8" />
              <rect x="604" y="220" width="42" height="90" fill="url(#originalBarGradient)" rx="8" />
              {/* Bars: Enhanced (green gradient) */}
              <rect x="100" y="120" width="42" height="190" fill="url(#enhancedBarGradient)" rx="8" />
              <rect x="184" y="100" width="42" height="210" fill="url(#enhancedBarGradient)" rx="8" />
              <rect x="268" y="60" width="42" height="250" fill="url(#enhancedBarGradient)" rx="8" />
              <rect x="352" y="130" width="42" height="180" fill="url(#enhancedBarGradient)" rx="8" />
              <rect x="436" y="90" width="42" height="220" fill="url(#enhancedBarGradient)" rx="8" />
              <rect x="520" y="110" width="42" height="200" fill="url(#enhancedBarGradient)" rx="8" />
              <rect x="604" y="130" width="42" height="180" fill="url(#enhancedBarGradient)" rx="8" />
              {/* X-axis labels */}
              <text x="100" y="335" fill="#8A8AFF" fontSize="18">00:00</text>
              <text x="185" y="335" fill="#8A8AFF" fontSize="18">04:00</text>
              <text x="270" y="335" fill="#8A8AFF" fontSize="18">08:00</text>
              <text x="350" y="335" fill="#8A8AFF" fontSize="18">12:00</text>
              <text x="435" y="335" fill="#8A8AFF" fontSize="18">16:00</text>
              <text x="520" y="335" fill="#8A8AFF" fontSize="18">20:00</text>
              <text x="604" y="335" fill="#8A8AFF" fontSize="18">24:00</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelAccuracyModal;
