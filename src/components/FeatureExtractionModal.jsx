import React from 'react';
import './FeatureExtractionModal.css';

const formatFeatureName = (name) =>
  name
    ? name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : '';

const FeatureExtractionModal = ({ open, onClose, data }) => {
  if (!open) return null;
  // Data expected as array of objects: [{ feature: 'channel', contribution_percentage: 47.6 }, ...]
  const features = Array.isArray(data) ? data : [];

  return (
    <div className="feature-modal-overlay">
      <div className="feature-modal">
        <div className="feature-modal-header">
          <span>Credit Fraud Analysis : Feature Extraction</span>
          <button className="feature-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="feature-modal-body">
          <table className="feature-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th className="vertical-border">Contribution Percentage</th>
              </tr>
            </thead>
            <tbody>
              {features.length > 0 ? features.map((row, idx) => (
                <tr key={idx}>
                  <td
                    style={{
                      color: '#0a1650',
                      fontWeight: 700,
                      fontFamily: 'inherit',
                      fontSize: '1.08rem',
                      letterSpacing: 0,
                      padding: '18px 24px',
                      borderBottom: '1px solid #ececec',
                      textTransform: 'capitalize',
                    }}
                  >
                    {formatFeatureName(row.Feature || row.feature || '')}
                  </td>
                  <td className="vertical-border">
                    {(() => {
                      const value = row.Contribution !== undefined
                        ? row.Contribution
                        : row['Contribution Percentage'] !== undefined
                        ? row['Contribution Percentage']
                        : row.contribution_percentage !== undefined
                        ? row.contribution_percentage
                        : row.contribution || 0;
                      return typeof value === 'number' ? value.toFixed(2) : parseFloat(value).toFixed(2);
                    })()}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={2} style={{textAlign:'center'}}>No data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeatureExtractionModal;
