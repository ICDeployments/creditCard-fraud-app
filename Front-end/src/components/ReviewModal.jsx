import React, { useState, useEffect } from 'react';
import './ReviewModal.css';

const FEEDBACK_API_URL = 'https://cyq6vipxxd.execute-api.us-west-2.amazonaws.com/dev/User_feedback';

const ReviewModal = ({ open, onClose, transaction, onApprove, onReject }) => {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const prevOpenRef = React.useRef(open);

  useEffect(() => {
    if (!prevOpenRef.current && open) {
      setComment('');
      setSubmitting(false);
    }
    prevOpenRef.current = open;
  }, [open]);

  if (!open || !transaction) return null;

  const userId = transaction.UID || transaction.User_ID || transaction.user_id || '-';
  const transactionId = transaction.Transaction_ID || transaction.transaction_id || '-';
  const timestamp = transaction.Timestamp || transaction.timestamp || '12-02-2026, 23:59';
  const fraudScore = transaction.Fraud_Score || transaction.fraud_score || '0.873515474';
  const status = transaction.Status || transaction.status || 'Non-Legitimate';
  const reason = transaction.Reason || transaction.reason || 'Fraud score > 0.85 international transaction.';

  const sendFeedback = async (statusValue) => {
    setSubmitting(true);
    try {
      const response = await fetch(FEEDBACK_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          transactionId,
          comment,
          status: statusValue
        })
      });
      if (!response.ok) throw new Error('Failed to submit feedback');
      if (statusValue === 'approved') onApprove(comment);
      else onReject(comment);
    } catch (err) {
      alert('Error submitting feedback: ' + err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          Review for User ID : {userId}
          <button className="modal-close" onClick={onClose} disabled={submitting}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="review-section">
            <div className="review-title">Non-Legitimate Review</div>
            <table className="review-table">
              <tbody>
                <tr>
                  <td className="review-label">Transaction ID</td>
                  <td className="review-value bordered-cell">{transactionId}</td>
                </tr>
                {/* <tr>
                  <td className="review-label">Time Stamp</td>
                  <td className="review-value bordered-cell">{timestamp}</td>
                </tr> */}
                <tr>
                  <td className="review-label">Fraud Score</td>
                  <td className="review-value bordered-cell">{fraudScore}</td>
                </tr>
                 <tr>
                  <td className="review-label">Status</td>
                  <td className="status-non-legit bordered-cell">{status}</td>
                </tr>
                     <tr>
                  <td className="review-label">Reason</td>
                  <td className="review-value bordered-cell">{reason}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="comment-section-aligned">
            <div className="comment-title">Comments</div>
            <textarea
              className="modal-comment-box bluish-box"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Input here"
              rows={4}
              disabled={submitting}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="reject-btn" onClick={() => sendFeedback('rejected')} disabled={submitting}>Reject</button>
          <button className="approve-btn" onClick={() => sendFeedback('approved')} disabled={submitting}>Approve</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
