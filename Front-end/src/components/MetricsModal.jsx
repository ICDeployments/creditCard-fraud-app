import React from 'react';
import './MetricsModal.css';

const MetricsModal = ({ open, onClose, metrics, isAfterEnhancement }) => {
  if (!open) return null;

  // Fallback for missing metrics and format to 2 decimal places
  const safe = (val) => {
    if (val === undefined || val === null || val === '--') return '--';
    const num = Number(val);
    return isNaN(num) ? val : num.toFixed(2);
  };

  return (
    <div className="metrics-modal-overlay">
      <div className="metrics-modal-container">
        <div className="metrics-modal-header">
          <span className="metrics-modal-title">Credit Fraud Analysis : Metrics</span>
          <button className="metrics-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="metrics-modal-content">
          <div className="metrics-modal-section-title">
            {isAfterEnhancement ? 'After Enhancement' : 'Before Enhancement'}
          </div>
          <table className="metrics-modal-table">
            <tbody>
              <tr><th>Accuracy</th><td>{safe(metrics?.accuracy)}</td></tr>
              <tr><th>Precision</th><td>{safe(metrics?.precision)}</td></tr>
              <tr><th>Recall</th><td>{safe(metrics?.recall)}</td></tr>
              <tr><th>F1_Score</th><td>{safe(metrics?.f1_score)}</td></tr>
              <tr><th>Scale_Pos_Weight</th><td>{safe(metrics?.scale_pos_weight)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MetricsModal;
