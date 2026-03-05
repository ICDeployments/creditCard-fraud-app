import React from 'react';
import './ModelAccuracyModal.css';

const CloseButton = ({ onClick }) => (
  <button className="model-accuracy-close-btn" onClick={onClick} aria-label="Close">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 8L20 20M20 8L8 20" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  </button>
);

const FraudDetectionsModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="model-accuracy-modal-overlay">
      <div className="model-accuracy-modal-content">
        <div className="model-accuracy-modal-header">
          <span className="model-accuracy-modal-title">Credit Fraud Analysis : Data Enhancement</span>
          <CloseButton onClick={onClose} />
        </div>

        <div className="model-accuracy-modal-heading-row">
          <span className="model-accuracy-modal-main-heading">Fraud Counts</span>
          {/* <div className="model-accuracy-modal-legend">
            <span className="model-accuracy-legend original" style={{ backgroundColor: '#B4D3B4', borderRadius: '4px' }} /> Original
            <span className="model-accuracy-legend enhanced" style={{ marginLeft: '24px', backgroundColor: '#E5A9A9', borderRadius: '4px' }} /> Enhanced
          </div> */}
          <div className="model-accuracy-modal-legend">
  {/* Green box for Original */}
  <span 
    className="model-accuracy-legend original" 
    style={{ 
      backgroundColor: '#B4D3B4', 
      borderRadius: '4px',
      display: 'inline-block',
      width: '12px',
      height: '12px' 
    }} 
  /> Original
  
  {/* Pink box for Enhanced */}
  <span 
    className="model-accuracy-legend enhanced" 
    style={{ 
      marginLeft: '24px', 
      backgroundColor: '#E5A9A9', 
      borderRadius: '4px',
      display: 'inline-block',
      width: '12px',
      height: '12px' 
    }} 
  /> Enhanced
</div>
        </div>

        <div className="model-accuracy-modal-divider" />

        <div className="model-accuracy-modal-body">
          <div className="model-accuracy-chart">
            <svg width="750" height="400" viewBox="0 0 750 400">
              <defs>
                {/* Green Gradient - Bottom part (Original) */}
                <linearGradient id="greenBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B4D3B4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#B4D3B4" stopOpacity="0.1" />
                </linearGradient>

                {/* Pink Gradient - Top part (Enhanced) */}
                <linearGradient id="pinkBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E5A9A9" stopOpacity="1" />
                  <stop offset="100%" stopColor="#E5A9A9" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Dotted grid lines */}
              <g>
                {[50, 120, 190, 260, 330].map((y, i) => (
                  <line key={i} x1="70" y1={y} x2="700" y2={y} stroke="#8A8AFF" strokeDasharray="6,6" strokeWidth="1.5" opacity="0.15" />
                ))}
              </g>

              {/* Y-axis labels */}
              <g fill="#8A8AFF" fontSize="16" opacity="0.6">
                <text x="30" y="55">60</text>
                <text x="30" y="125">45</text>
                <text x="30" y="195">30</text>
                <text x="30" y="265">15</text>
                <text x="30" y="335">0</text>
              </g>

              {/* STACKED BARS */}
              
              {/* Layer 1: Pink Bars (Full height / Enhanced) */}
              <g>
                <rect x="100" y="180" width="52" height="150" fill="url(#pinkBarGradient)" rx="12" />
                <rect x="185" y="120" width="52" height="210" fill="url(#pinkBarGradient)" rx="12" />
                <rect x="270" y="160" width="52" height="170" fill="url(#pinkBarGradient)" rx="12" />
                <rect x="355" y="50"  width="52" height="280" fill="url(#pinkBarGradient)" rx="12" />
                <rect x="440" y="140" width="52" height="190" fill="url(#pinkBarGradient)" rx="12" />
                <rect x="525" y="90"  width="52" height="240" fill="url(#pinkBarGradient)" rx="12" />
                <rect x="610" y="150" width="52" height="180" fill="url(#pinkBarGradient)" rx="12" />
              </g>

              {/* Layer 2: Green Bars (Bottom height / Original) */}
              <g>
                <rect x="100" y="250" width="52" height="80"  fill="url(#greenBarGradient)" rx="12" />
                <rect x="185" y="210" width="52" height="120" fill="url(#greenBarGradient)" rx="12" />
                <rect x="270" y="230" width="52" height="100" fill="url(#greenBarGradient)" rx="12" />
                <rect x="355" y="190" width="52" height="140" fill="url(#greenBarGradient)" rx="12" />
                <rect x="440" y="220" width="52" height="110" fill="url(#greenBarGradient)" rx="12" />
                <rect x="525" y="200" width="52" height="130" fill="url(#greenBarGradient)" rx="12" />
                <rect x="610" y="240" width="52" height="90"  fill="url(#greenBarGradient)" rx="12" />
              </g>

              {/* X-axis labels */}
              <g fill="#8A8AFF" fontSize="18" fontWeight="500">
                <text x="100" y="375">00:00</text>
                <text x="185" y="375">04:00</text>
                <text x="270" y="375">08:00</text>
                <text x="355" y="375">12:00</text>
                <text x="440" y="375">16:00</text>
                <text x="525" y="375">20:00</text>
                <text x="610" y="375">24:00</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudDetectionsModal;
