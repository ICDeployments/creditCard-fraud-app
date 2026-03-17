import React from 'react';
import './LiveCommentary.css';

export default function LiveCommentary({ logs }) {
  // Fallback to static alerts if logs not provided or empty
  const alerts = logs && logs.length > 0
    ? logs.map(text => ({ text, type: 'danger' }))
    : [
      {
        text: 'Suspicious activity detected: User UID-00785 attempted 47 transactions from 12 different IP addresses within 3 minutes across APAC region.',
        type: 'danger',
      },
      {
        text: 'Database optimization complete: ML model retrained with 2.3 million new transaction records, improving precision score to 94.23%.',
        type: 'success',
      },
      {
        text: 'System alert: New fraud pattern identified in POS transactions - card-not-present fraud increased by 34% in European retail sector.',
        type: 'danger',
      },
    ];

  return (
    <div className="live-commentary-section">
      <div className="live-feed-header">
        <span className="live-dot" />
        <span className="live-feed-title">Analysis: Detection Gaps</span>
      </div>
      <div className="live-alerts">
        {alerts.map((alert, idx) => (
          <div
            key={idx}
            className={`live-alert live-alert-${alert.type}`}
          >
            {alert.text}
          </div>
        ))}
      </div>
    </div>
  );
}
