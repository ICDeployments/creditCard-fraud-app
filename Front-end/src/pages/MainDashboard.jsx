import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css'; 
import '../../src/DashboardCustom.css'; // Import custom styles
import Reload from '../assets/Reload.png';
import DataEnBtn from '../assets/facelift-icons/data-enhancement-btn.png';
import LiveDot from '../assets/facelift-icons/live-dot.png';
import GreenTick from '../assets/facelift-icons/green-tick.png';
import RedCross from '../assets/facelift-icons/red-cross.png';
import EyeReview from '../assets/eye-review.png';
import ReviewModal from '../components/ReviewModal';
import LiveCommentary from '../components/LiveCommentary';
import ModelAccuracyModal from '../components/ModelAccuracyModal';
import FalsePositivesModal from '../components/FalsePositivesModal';
import FraudDetectionsModal from '../components/FraudDetectionsModal';
import MetricsModal from '../components/MetricsModal';
import FeatureExtractionModal from '../components/FeatureExtractionModal';
import FeatureBar from "../assets/facelift-icons/feature-bar.png";
import GrowthIcon from "../assets/facelift-icons/growth.png";
import UpArrowIcon from "../assets/facelift-icons/up-arrow.png";
import DownArrowIcon from "../assets/facelift-icons/down-arrow.png";
import SummaryModal from '../components/SummaryModal';
import SummaryIcon from '../assets/agentIcons/final-verdict.png';

const API_URL = 'https://9mqsnu1t46.execute-api.us-west-2.amazonaws.com/dev/S3_fraud_fp_api';
const ENHANCE_API_URL = 'https://mtnvwfzgs2.execute-api.us-west-2.amazonaws.com/dev/Final_S3_Api';
const BEFORE_RETRAIN_API_URL = 'https://qichlk81h2.execute-api.us-west-2.amazonaws.com/dev/before_metrics';
const AFTER_RETRAIN_API_URL = 'https://jgj0nriyc5.execute-api.us-west-2.amazonaws.com/dev/after_metrics';
const BEFORE_RETRAIN_RAW_URL = 'https://qichlk81h2.execute-api.us-west-2.amazonaws.com/dev/before_retrain';
const AFTER_RETRAIN_RAW_URL = 'https://jgj0nriyc5.execute-api.us-west-2.amazonaws.com/dev/after_retrain';

const PAGE_SIZE = 20; // Number of legitimate transactions per page

const Dashboard = () => {
    const [data, setData] = useState([]); 
    const [enhancedData, setEnhancedData] = useState(null); 
    const [initialAccuracy, setInitialAccuracy] = useState(null);
    const [enhancedAccuracy, setEnhancedAccuracy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enhanceLoading, setEnhanceLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('non-legitimate'); // 'legitimate' or 'non-legitimate'
    const [showEnhanced, setShowEnhanced] = useState(false);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [modelAccuracyModalOpen, setModelAccuracyModalOpen] = useState(false);
    const [falsePositivesModalOpen, setFalsePositivesModalOpen] = useState(false);
    const [fraudDetectionsModalOpen, setFraudDetectionsModalOpen] = useState(false);
    const [metricsModalOpen, setMetricsModalOpen] = useState(false);
    const [featureModalOpen, setFeatureModalOpen] = useState(false);
    const [legitPage, setLegitPage] = useState(1); // Pagination for legitimate
    const [beforeRetrainData, setBeforeRetrainData] = useState(null);
    const [afterRetrainData, setAfterRetrainData] = useState(null);
    const [beforeRetrainRaw, setBeforeRetrainRaw] = useState(null);
    const [afterRetrainRaw, setAfterRetrainRaw] = useState(null);
    const [summaryModalOpen, setSummaryModalOpen] = useState(false);
    const [summaryContent, setSummaryContent] = useState('');
    const enhancedSectionRef = useRef(null);

    // Initial Fetch (now expects JSON)
    useEffect(() => {
        setLoading(true);
        const safeJson = async (res) => {
            const text = await res.text();
            if (!text) return null;
            try {
                return JSON.parse(text);
            } catch {
                return null;
            }
        };
        Promise.all([
            fetch(API_URL).then(safeJson),
            fetch(BEFORE_RETRAIN_API_URL).then(safeJson),
            fetch(AFTER_RETRAIN_API_URL).then(safeJson),
            fetch(BEFORE_RETRAIN_RAW_URL).then(safeJson),
            fetch(AFTER_RETRAIN_RAW_URL).then(safeJson)
        ])
        .then(([mainJson, beforeJson, afterJson, beforeRaw, afterRaw]) => {
            // const cleanData = Array.isArray(mainJson) ? mainJson.filter(item => item && item.transaction_status) : [];
            const cleanData = Array.isArray(mainJson) ? mainJson.filter(item => item !== null) : [];
            setData(cleanData);
            setBeforeRetrainData(beforeJson);
            setAfterRetrainData(afterJson);
            setBeforeRetrainRaw(beforeRaw);
            setAfterRetrainRaw(afterRaw);
            setInitialAccuracy(beforeJson && beforeJson.accuracy ? beforeJson.accuracy : null);
            setEnhancedAccuracy(afterJson && afterJson.accuracy ? afterJson.accuracy : null);
            setLoading(false);
            console.log("mainJson:", mainJson);
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });
    }, []);

    // Scroll to enhanced section
    useEffect(() => {
        if (enhancedData && enhancedSectionRef.current) {
            enhancedSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [enhancedData]);

    const handleEnhance = async () => {
        if (enhancedData && showEnhanced) {
            setShowEnhanced(false);
            setEnhancedAccuracy(null); // Reset to before accuracy
            return;
        }
        setEnhanceLoading(true);
        try {
            const [enhanceRes, afterRes, summaryRes] = await Promise.all([
                fetch(ENHANCE_API_URL),
                fetch(AFTER_RETRAIN_API_URL),
                fetch('https://qichlk81h2.execute-api.us-west-2.amazonaws.com/dev//Summary')
            ]);
            const enhanceJson = await enhanceRes.json();
            const afterJson = await afterRes.json();
            const summaryText = await summaryRes.text();
            const cleanEnhanced = Array.isArray(enhanceJson) ? enhanceJson.filter(item => item && item.user_id) : [];
            setEnhancedData(cleanEnhanced);
            setEnhancedAccuracy(afterJson && afterJson.accuracy ? afterJson.accuracy : null);
            setShowEnhanced(true);
            setEnhanceLoading(false);
            // Store summary content, but do NOT open modal
            setSummaryContent(summaryText);
        } catch (err) {
            setError(err.message);
            setEnhanceLoading(false);
        }
    };

    // Review button click handler
    const handleReviewClick = (transaction) => {
        setSelectedTransaction(transaction);
        setReviewModalOpen(true);
    };
    const handleCloseReview = () => {
        setReviewModalOpen(false);
        setSelectedTransaction(null);
    };
    const handleApprove = (comment) => {
        handleCloseReview();
    };
    const handleReject = (comment) => {
        handleCloseReview();
    };

    // Model accuracy value: show enhanced only when enhancement is active
    const modelAccuracyValue = (showEnhanced && enhancedData && enhancedAccuracy)
        ? enhancedAccuracy
        : initialAccuracy;

    // Move getFraudCount above all usages
    const getFraudCount = (arr) =>
    arr.filter(item => {
        const status = (item.Transaction_Status || item.transaction_status || '').toLowerCase();
        return status.includes('non') || status.includes('fraud');
    }).length;

    // Dynamic counts for cards
    const nonLegitimateCount = showEnhanced && enhancedData
        ? getFraudCount(enhancedData)
        : getFraudCount(data);
    
    const legitimateList = data.filter(item => {
    // Use the key found in your console log: Transaction_Status
    const status = (item.Transaction_Status || item.transaction_status || '').toLowerCase();
    return status.includes('legit') && !status.includes('non');
});
    const legitimateCount = legitimateList.length;
    // For enhanced view, reduced false positives count is just enhancedData.length
    const reducedFalsePositivesCount = enhancedData && showEnhanced ? enhancedData.length : null;
    const falsePositivesLabel = (enhancedData && showEnhanced)
        ? 'Reduced False Positives'
        : 'Legitimate Transactions';
    const falsePositivesValue = (enhancedData && showEnhanced)
        ? reducedFalsePositivesCount
        : legitimateCount;

    // Calculate percentage changes for cards
    const totalTransactionsPre = data.length;
    const totalTransactionsPost = enhancedData ? enhancedData.length : 0;
    const totalTransactionsChange = totalTransactionsPre > 0 && showEnhanced && enhancedData
      ? (((totalTransactionsPost - totalTransactionsPre) / totalTransactionsPre) * 100).toFixed(2)
      : null;

    const fraudPre = getFraudCount(data);
    const fraudPost = enhancedData ? getFraudCount(enhancedData) : 0;
    const fraudChange = fraudPre > 0 && showEnhanced && enhancedData
      ? (((fraudPost - fraudPre) / fraudPre) * 100).toFixed(2)
      : null;

    // FIX: False Positives percentage should use legitimate transaction counts
    const falsePositivesPre = legitimateCount;
    const falsePositivesPost = reducedFalsePositivesCount;
    const falsePositivesChange = falsePositivesPre > 0 && showEnhanced && enhancedData
      ? (((falsePositivesPost - falsePositivesPre) / falsePositivesPre) * 100).toFixed(2)
      : null;

    const accuracyPre = initialAccuracy ? parseFloat(initialAccuracy) : 0;
    const accuracyPost = enhancedAccuracy ? parseFloat(enhancedAccuracy) : 0;
    const accuracyChange = accuracyPre > 0 && showEnhanced && enhancedData
      ? (((accuracyPost - accuracyPre) / accuracyPre) * 100).toFixed(2)
      : null;

    // Pagination logic for legitimate tab
    const totalLegitPages = Math.ceil(legitimateList.length / PAGE_SIZE);
    const paginatedLegit = legitimateList.slice((legitPage - 1) * PAGE_SIZE, legitPage * PAGE_SIZE);

    // Determine which data is currently displayed (for card calculations)
    const currentDisplayData = showEnhanced && enhancedData ? enhancedData : data;

    // Filtered data based on tab
    let filteredData;
    if (showEnhanced && enhancedData) {
        filteredData = enhancedData;
    } else {
        if (activeTab === 'legitimate') {
            filteredData = paginatedLegit;
        } else {
            // filteredData = data.filter(item => {
            //     const status = (item.transaction_status || '').toLowerCase();
            //     return status.includes('non') || status.includes('fraud');

            filteredData = data.filter(item => {
        // Look for either casing to be safe
        const status = (item.Transaction_Status || item.transaction_status || '').toLowerCase();
        return status.includes('non') || status.includes('fraud');
            });
        }
    }

    console.log("filteredData:", filteredData);

    // Feature extraction data selection
    const featureExtractionData = (showEnhanced && afterRetrainRaw && Array.isArray(afterRetrainRaw))
        ? afterRetrainRaw
        : (beforeRetrainRaw && Array.isArray(beforeRetrainRaw) ? beforeRetrainRaw : []);

    // Shimmer skeletons for loading state (YouTube-style)
const ShimmerCard = () => (
  <div className="stat-card-v2 shimmer-card">
    <div className="shimmer shimmer-title shimmer-animate" />
    <div className="shimmer shimmer-value shimmer-animate" />
  </div>
);
const ShimmerHeading = () => (
  <div className="shimmer-heading">
    <div className="shimmer shimmer-h1 shimmer-animate" />
    <div className="shimmer shimmer-p shimmer-animate" />
  </div>
);
const ShimmerTable = () => (
  <div className="shimmer-table">
    <div className="shimmer shimmer-table-header shimmer-animate" />
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="shimmer shimmer-table-row shimmer-animate" />
    ))}
  </div>
);

    if (loading) return (
      <div className="dashboard-container-main">
        <header className="dashboard-header">
          <ShimmerHeading />
        </header>
        <section className="stats-grid-v2">
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
        </section>
        <section className="table-controls-section">
          <div className="shimmer shimmer-table-title shimmer-animate" />
        </section>
        <div className="applications-table-container">
          <ShimmerTable />
        </div>
      </div>
    );
    if (error) return <div className="error">Error: {error}</div>;

    // Utility to extract primary failure modes from summary text (bullets, no numbering, exclude actions)
function extractFailureModes(summaryText) {
    // Find the section starting with 'Why' and ending before 'Immediate Actions Required:'
    const startIdx = summaryText.indexOf('Why');
    const endIdx = summaryText.indexOf('Immediate Actions Required:');
    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return [];
    const section = summaryText.slice(startIdx, endIdx);
    // Match numbered lines (e.g., 1. ... 2. ...)
    const lines = section.split('\n').map(l => l.trim());
    // Find lines that start with a number and a dot, then remove the number
    const failureLines = lines.filter(l => /^\d+\.\s/.test(l)).map(l => l.replace(/^\d+\.\s*/, ''));
    return failureLines;
}

// Add handler function above return
const handleSummaryClick = () => {
    setSummaryModalOpen(true);
};

// Extract logs for live feed from summaryContent
const liveFeedLogs = extractFailureModes(summaryContent);

    return (
        <div className="dashboard-container-main">
    <header className="dashboard-header">
        <div className="header-text">
            <h1>Credit Fraud Analysis</h1>
            <p>Command Center - Offline Monitoring</p>
        </div>

        {/* New container to hold both the label and the button */}
        <div className="refresh-section">
            <span className="refresh-label">Last Refreshed, 10:10 AM, IST</span>
            <button className="refresh-btn" onClick={() => window.location.reload()}>
                <img src={Reload} alt="Refresh" />
            </button>
        </div>
    </header>

            {/* Statistic Cards (All 4 Cards restored and linked to data) */}
            <section className="stats-grid-v2">

                {/* Card 1: Total Records */}
<div className="stat-card-v2" style={{ border: '1px solid #2DB81F80' }}>
    <div className="stat-card-titles">
        <div className="titles-left">
            <span className="stat-title-v2">Total Transactions</span>
            <span className="stat-subtitle-v2">Offline Monitoring</span>
        </div>
        <span className="live-indicator">
            <img src={LiveDot} alt="Live" className="live-dot" /> 
        </span>
    </div>
    <div className="stat-value-container">
        <h2 className="stat-value-v2">{data.length}</h2>
        {/* Percentage change removed for this card as requested */}
         <span className="fp-fn">
            ( FP + FN )
        </span>
    </div>
</div>

{/* Card 2: Fraud Detections */}
<div 
  className="stat-card-v2" 
  style={{ 
    border: '1px solid #B81F2D80', // 1px solid, #B81F2D with 50% opacity
    backgroundColor: 'rgba(252, 158, 166, 0.05)', // Subtle tint
  }}
  onClick={() => setFraudDetectionsModalOpen(true)} // Add click handler
>
    <div className="stat-card-titles">
        <div className="titles-left">
            <span className="stat-title-v2">False Negatives</span>
            {/* Subtitle logic: show 'Reduced False Negatives' after enhancement, else 'Non-Legitimate Transactions' */}
            <span className="stat-subtitle-v2">
              {showEnhanced && enhancedData ? 'Reduced False Negatives' : 'Non-Legitimate Transactions'}
            </span>
        </div>
        <span className="live-indicator">
            <img src={LiveDot} alt="Live" className="live-dot" /> 
        </span>
    </div>
    <div className="stat-value-container">
        <h2 className="stat-value-v2">{nonLegitimateCount}</h2>
        {/* Only show percentage after enhancement */}
        {showEnhanced && enhancedData && (
          <div className={`stat-change ${fraudChange >= 0 ? 'positive' : 'negative'}`}>
              {fraudChange >= 0 ? <img src={UpArrowIcon} alt="Up Arrow" /> : <img src={DownArrowIcon} alt="Down Arrow" />}
              {fraudChange > 0 ? ` ${fraudChange}%` : ` ${Math.abs(fraudChange)}%`}
          </div>
        )}
    </div>
</div>

              {/* Card 3: False Positives */}
<div className="stat-card-v2" style={{ borderColor: '#A2B9FF', cursor: 'pointer' }}
    onClick={() => setFalsePositivesModalOpen(true)}>
    <div className="stat-card-titles">
        <div className="titles-left">
            <span className="stat-title-v2">False Positives</span>
            <span className="stat-subtitle-v2">{falsePositivesLabel}</span>
        </div>
    </div>
    <div className="stat-value-container">
        <h2 className="stat-value-v2">{falsePositivesValue}</h2>
        {/* Only show percentage after enhancement */}
        {showEnhanced && enhancedData && (
          <div className={`stat-change ${falsePositivesChange >= 0 ? 'positive' : 'negative'}`}>
            {falsePositivesChange >= 0 ? <img src={UpArrowIcon} alt="Up Arrow" /> : <img src={DownArrowIcon} alt="Down Arrow" />}
            {falsePositivesChange > 0 ? ` ${falsePositivesChange}%` : ` ${Math.abs(falsePositivesChange)}%`}
          </div>
        )}
    </div>
</div>

{/* Card 4: Model Accuracy */}
<div className="stat-card-v2" style={{ borderColor: '#FFD93D', cursor: 'pointer' }}
     onClick={() => setModelAccuracyModalOpen(true)}>
    <div className="stat-card-titles">
        <div className="titles-left">
            <span className="stat-title-v2">Model Accuracy</span>
            <span className="stat-subtitle-v2">ML Performance</span>
        </div>
    </div>
    <div className="stat-value-container">
        <h2 className="stat-value-v2">
            {(parseFloat(modelAccuracyValue || 0) * 100).toFixed(2)}%
        </h2>
        {/* Only show percentage after enhancement */}
        {showEnhanced && enhancedData && (
          <div className={`stat-change ${accuracyChange >= 0 ? 'positive' : 'negative'}`}>
            {accuracyChange >= 0 ? <img src={UpArrowIcon} alt="Up Arrow" /> : <img src={DownArrowIcon} alt="Down Arrow" />}
            {accuracyChange > 0 ? ` ${accuracyChange}%` : ` ${Math.abs(accuracyChange)}%`}
          </div>
        )}
    </div>
</div>
            </section>

            <section className="table-controls-section">
  {/* TOP ROW: Title and Button */}
  <div className="header-top-row">
    <div className="table-header-info">
      <h2>{enhancedData && showEnhanced ? "Post Model Enhancement" : "Analysis & Reasoning of ML O/P ( Fp +Fn ) Data"}</h2>
      <p>Offline transaction monitoring</p>
    </div>
    
    <div className="filter-bar">
      <button 
        className="enhance-btn" 
        onClick={handleEnhance} 
        style={{
          padding: '12px 20px',
          background: '#26EFE9',
          color: '#000048',
          border: 'none',
          borderRadius: '90px',
          cursor: 'pointer',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <img src={DataEnBtn} alt="" style={{width: '18px', height: '16px'}} /> 
        {enhanceLoading ? 'Processing...' : showEnhanced ? 'Hide Enhancement' : 'Data Enhancement'}
      </button>
    </div>
  </div>

  {/* BOTTOM ROW: Status Stickers - moved above filter tabs */}
  <div className="status-stickers-row">
    <div className="sticker" style={{cursor: 'pointer'}} onClick={() => setFeatureModalOpen(true)}><img src={FeatureBar} alt=""/> Feature Abstraction</div>
    <div className="sticker" style={{cursor: 'pointer'}} onClick={() => setMetricsModalOpen(true)}>
      <img src={GrowthIcon} alt=""/> Metrics
    </div>
    {/* Summary Button: Always show, but disabled unless enhanced mode is active */}
    <div
      className="sticker"
      style={{cursor: showEnhanced && enhancedData ? 'pointer' : 'not-allowed', opacity: showEnhanced && enhancedData ? 1 : 0.5}}
      onClick={showEnhanced && enhancedData ? handleSummaryClick : undefined}
      aria-disabled={!showEnhanced || !enhancedData}
    >
      <img src={SummaryIcon} alt=""/> Explainable AI
    </div>
    {/* <div className="sticker"><img src={StickerThree} alt=""/> ML Processing</div> */}
    {/* <div className="sticker"><img src={StickerFour} alt=""/> Analysis Live</div> */}
  </div>

  {/* FILTER TABS: Only show if not in enhanced view */}
  {!(showEnhanced && enhancedData) && (
    <div className="dashboard-tabs-row">
      <button
        className={`dashboard-tab ${activeTab === 'legitimate' ? 'active' : ''}`}
        onClick={() => setActiveTab('legitimate')}
      >
        Legitimate
      </button>
      <button
        className={`dashboard-tab ${activeTab === 'non-legitimate' ? 'active' : ''}`}
        onClick={() => setActiveTab('non-legitimate')}
      >
        Non - Legitimate
      </button>
    </div>
  )}

</section>

     <div className="applications-table-container">
    <table className="dashboard-table">
        <thead>
            <tr>
                {/* Dynamically render headers based on data */}
                {filteredData.length > 0 && Object.keys(filteredData[0]).map(header => {
                    // Remove 'reason' column for non-legitimate tab (if not in enhanced view)
                    if (!(showEnhanced && enhancedData) && activeTab === 'non-legitimate' && header.toLowerCase() === 'reason') {
                        return null;
                    }
                    const formattedHeader = header.replace(/_/g, ' ');
                    const sentenceCase = formattedHeader.charAt(0).toUpperCase() + formattedHeader.slice(1).toLowerCase();
                    // Center align all headers
                    return (
                        <th key={header} style={{textAlign: 'center'}}>{sentenceCase}</th>
                    );
                })}
                {/* Add Review column for Non-Legitimate tab, only if not in enhanced view */}
                {!(showEnhanced && enhancedData) && activeTab === 'non-legitimate' && <th style={{textAlign: 'center'}}>Action</th>}
            </tr>
        </thead>
<tbody>
  {filteredData.map((item, index) => (
    <tr key={index}>
      {Object.keys(item).map((key) => {
        // Remove 'reason' column for non-legitimate tab (if not in enhanced view)
        if (!(showEnhanced && enhancedData) && activeTab === 'non-legitimate' && key.toLowerCase() === 'reason') {
          return null;
        }
        const value = item[key];
        const lowerKey = key.toLowerCase();
        // 1. User ID Column (Blue and Bold)
        if (lowerKey.includes('user') || lowerKey === 'uid') {
          return <td key={key} className="column-userid" style={{textAlign: 'center'}}>{value}</td>;
        }
        // 2. Status / Actual Columns (Text + ICON)
        if (lowerKey === 'transaction_status' || lowerKey === 'status' || lowerKey === 'actual') {
          const isLegit = value && value.toLowerCase().includes('legit') && !value.toLowerCase().includes('non');
          const isFraud = value && (value.toLowerCase().includes('fraud') || value.toLowerCase().includes('non'));
          let statusClass = isLegit ? "text-legit" : isFraud ? "text-fraud" : "";
          return (
            <td key={key} style={{textAlign: 'center'}}>
              <div className={`status-wrapper ${statusClass}`}>
                {value}
                {isLegit && <img src={GreenTick} alt="Legit" className="status-icon" />}
                {isFraud && <img src={RedCross} alt="Fraud" className="status-icon" />}
              </div>
            </td>
          );
        }
        // 3. Channel Column (Red text if non-legitimate/fraud context)
        if (lowerKey === 'channel') {
          const isFraudContext = item.transaction_status?.toLowerCase().includes('non');
          return (
            <td key={key} className={isFraudContext ? "text-fraud-reason" : ""} style={{textAlign: 'center'}}>
              {value}
            </td>
          );
        }
        // 4. Timestamp Column: Format date and time, center time
        if (lowerKey === 'timestamp' || key === 'Timestamp') {
          let date = '', time = '';
          const val = item[key] || item['timestamp'] || item['Timestamp'];
          if (val) {
            if (val.includes('T')) {
              [date, time] = val.split('T');
              if (time && time.length >= 5) time = time.slice(0, 5); // HH:MM
            } else if (val.includes(' ')) {
              [date, time] = val.split(' ');
              if (time && time.length >= 5) time = time.slice(0, 5); // HH:MM
            } else {
              date = val;
              time = '';
            }
          }
          return (
            <td key={key} style={{textAlign: 'center'}}>
              <div style={{whiteSpace: 'nowrap'}}>
                <span style={{fontWeight: 500, display: 'block'}}>{date}</span>
                <span style={{color: '#888', display: 'block', textAlign: 'center'}}>{time}</span>
              </div>
            </td>
          );
        }
        // 5. Country name column: center align
        if (lowerKey === 'country_name') {
          return <td key={key} style={{textAlign: 'center'}}>{value}</td>;
        }
        // 6. Fraud score column: center align
        if (lowerKey === 'fraud_score') {
          return <td key={key} style={{textAlign: 'center'}}>{value}</td>;
        }
        // Merchant category column: center align
        if (lowerKey === 'merchant category' || lowerKey === 'merchant_category') {
          return <td key={key} style={{textAlign: 'center'}}>{value}</td>;
        }
        // Country risk column: center align
        if (lowerKey === 'country risk' || lowerKey === 'country_risk') {
          return <td key={key} style={{textAlign: 'center'}}>{value}</td>;
        }
        // Is international column: center align
        if (lowerKey === 'is international' || lowerKey === 'is_international') {
          return <td key={key} style={{textAlign: 'center'}}>{value}</td>;
        }
        // 7. Reason Column: Truncate to 20 chars and show styled tooltip
        if (lowerKey === 'reason') {
          const displayValue = value && value.length > 20 ? value.slice(0, 20) + '...' : value;
          return (
            <td key={key} style={{textAlign: 'center'}}>
              <span
                style={{
                  cursor: value && value.length > 20 ? 'pointer' : 'default',
                  borderBottom: value && value.length > 20 ? '1px dotted #888' : 'none',
                  color: '#333',
                  position: 'relative'
                }}
                // Remove title attribute to prevent default browser tooltip
                onMouseOver={e => {
                  if (value && value.length > 20) {
                    const tooltip = document.createElement('div');
                    tooltip.innerText = value;
                    // In the tooltip creation JS, set className first, then set position, top, and left after appending to body
                    tooltip.className = 'custom-tooltip';
                    document.body.appendChild(tooltip);
                    const rect = e.target.getBoundingClientRect();
                    tooltip.style.position = 'fixed';
                    tooltip.style.top = (rect.bottom + 8) + 'px';
                    tooltip.style.left = (rect.left) + 'px';
                    e.target._tooltip = tooltip;
                  }
                }}
                onMouseOut={e => {
                  if (e.target._tooltip) {
                    document.body.removeChild(e.target._tooltip);
                    e.target._tooltip = null;
                  }
                }}
              >
                {displayValue}
              </span>
            </td>
          );
        }
        // 8. Default Columns: center align for initial rendering
        return <td key={key} style={{textAlign: 'center'}}>{value}</td>;
      })}
      {/* Add Review button/icon for Non-Legitimate tab, only if not in enhanced view */}
      {!(showEnhanced && enhancedData) && activeTab === 'non-legitimate' ? (
        <td key="review" style={{textAlign: 'center'}}>
          <button className="review-btn" title="Review" style={{background: 'none', border: 'none', cursor: 'pointer'}} onClick={() => handleReviewClick(item)}>
            <span role="img" aria-label="eye"><img src={EyeReview} alt="Review" /></span>
          </button>
        </td>
      ) : null}
    </tr>
  ))}
</tbody>
    </table>
    {/* Pagination for legitimate tab */}
    {activeTab === 'legitimate' && !showEnhanced && totalLegitPages > 1 && (
      <div className="pagination-bar custom-pagination-bar">
        {Array.from({ length: totalLegitPages }, (_, i) => (
          <span
            key={i + 1}
            onClick={() => setLegitPage(i + 1)}
            className={
              'custom-pagination-page' + (legitPage === i + 1 ? ' selected' : '')
            }
          >
            {i + 1}
          </span>
        ))}
      </div>
    )}
</div>

            {enhancedData && <div ref={enhancedSectionRef} className="chart-section-footer" />}

            {/* Live Commentary and Graphs: Only show when enhancement view is active */}
            {enhancedData && showEnhanced && (
              <>
                <LiveCommentary logs={liveFeedLogs} />
                {/* <FraudGraphs /> */}
              </>
            )}

            {/* Review Modal should be rendered here, outside the table and main content */}
            <ReviewModal
              open={reviewModalOpen}
              onClose={handleCloseReview}
              transaction={selectedTransaction}
              onApprove={handleApprove}
              onReject={handleReject}
            />

            {/* False Positives Modal Popup */}
            <FalsePositivesModal 
                open={falsePositivesModalOpen} 
                onClose={() => setFalsePositivesModalOpen(false)} 
            />

            {/* Model Accuracy Modal Popup */}
            <ModelAccuracyModal 
                open={modelAccuracyModalOpen} 
                onClose={() => setModelAccuracyModalOpen(false)} 
                metrics={showEnhanced && enhancedData ? afterRetrainData : beforeRetrainData}
            />

            {/* Fraud Detections Modal Popup */}
            <FraudDetectionsModal 
                open={fraudDetectionsModalOpen} 
                onClose={() => setFraudDetectionsModalOpen(false)} 
            />

            {/* Metrics Modal Popup */}
            <MetricsModal
              open={metricsModalOpen}
              onClose={() => setMetricsModalOpen(false)}
              metrics={showEnhanced && enhancedData ? afterRetrainData : beforeRetrainData}
              isAfterEnhancement={showEnhanced && enhancedData}
            />

            {/* Feature Extraction Modal Popup */}
            <FeatureExtractionModal
              open={featureModalOpen}
              onClose={() => setFeatureModalOpen(false)}
              data={featureExtractionData}
            />

            {/* Summary Modal Popup: New modal for summary data */}
            <SummaryModal
              open={summaryModalOpen}
              onClose={() => setSummaryModalOpen(false)}
              summary={summaryContent}
              title="Explainable AI"
            />
        </div>
    );
};

export default Dashboard;