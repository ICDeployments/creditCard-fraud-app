import React from 'react';
import './MetricsModal.css'; // Reuse modal styles

const formatSummary = (text) => {
  if (!text) return null;
  // Split into sections by double newlines
  const sections = text.split(/\n\s*\n/);
  return sections.map((section, idx) => {
    // Split all lines, treat all as bullet points
    const lines = section.trim().split(/\n/).filter(Boolean);
    if (lines.length === 0) return null;
    return (
      <div key={idx} style={{marginBottom: '1.5rem', textAlign: 'left'}}>
        <ul style={{paddingLeft: '1.2em', margin: 0, textAlign: 'left'}}>
          {lines.map((pt, i) => {
            // Remove leading numbers and dot (e.g., '1. ')
            const clean = pt.replace(/^\d+\.\s*/, '').trim();
            if (!clean) return null;
            // If pointer ends with a colon and is not indented, treat as heading
            if (/^[^:]+:\s*$/.test(pt)) {
              const headingText = clean;
              return (
                <div key={i} style={{fontWeight: 700, fontSize: '1.18rem', color: '#000048', margin: '1.1em 0 0.5em 0', fontFamily: 'Gellix, sans-serif'}}>{headingText}</div>
              );
            }
            // If colon present, split and style left part
            if (clean.includes(':')) {
              let [left, ...rightArr] = clean.split(':');
              const right = rightArr.join(':').trim();
              // Replace underscores with spaces and capitalize each word
              left = left.trim().replace(/_/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              return (
                <li key={i} style={{marginBottom: '0.3em', textAlign: 'left', marginLeft: '30px', paddingBottom:'5px', fontFamily: 'Gellix, sans-serif'}}>
                  <span style={{color: '#000048', fontWeight: 700}}>{left}:</span> {right}
                </li>
              );
            }
            // Capitalize first letter of non-colon points
            const cleanCap = clean.charAt(0).toUpperCase() + clean.slice(1);
            return <li key={i} style={{marginBottom: '0.3em', textAlign: 'left', marginLeft: '30px', paddingBottom:'5px', fontFamily: 'Gellix, sans-serif'}}>{cleanCap}</li>;
          })}
        </ul>
      </div>
    );
  });
};

const SummaryModal = ({ open, onClose, summary }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content metrics-modal-content" style={{padding: 0, overflow: 'hidden', minHeight: '410px', fontFamily: 'Gellix, sans-serif'}}>
        <div style={{background: '#000048', color: '#fff', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTopLeftRadius: '12px', borderTopRightRadius: '12px'}}>
          <h2 style={{margin: 0, fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Gellix, sans-serif'}}>Summary </h2>
          <button className="metrics-modal-close" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div style={{whiteSpace: 'pre-wrap', fontSize: '1rem', color: '#222', maxHeight: '100vh', overflowY: 'auto', paddingLeft: '1.3em', textAlign: 'left', fontFamily: 'Gellix, sans-serif'}}>
          {formatSummary(summary)}
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
