import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './Stage2.css';

const getModelColor = (modelName) => {
  if (!modelName || typeof modelName !== 'string') {
    return 'var(--text-primary)';
  }
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22'];
  let hash = 0;
  for (let i = 0; i < modelName.length; i++) {
    hash = modelName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

function deAnonymizeText(text, labelToModel) {
  if (!labelToModel) return text;

  let result = text;
  // Replace each "Response X" with the actual model name
  Object.entries(labelToModel).forEach(([label, model]) => {
    const modelShortName = model.split('/')[1] || model;
    result = result.replace(new RegExp(label, 'g'), `**${modelShortName}**`);
  });
  return result;
}

export default function Stage2({ rankings, labelToModel, aggregateRankings }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!rankings || rankings.length === 0) {
    return null;
  }

  const activeRanking = rankings[activeTab];
  const activeColor = getModelColor(activeRanking.model);

  return (
    <div className="stage stage2">
      <h3 className="stage-title">Stage 2: Peer Rankings</h3>

      <h4>Raw Evaluations</h4>
      <p className="stage-description">
        Each model evaluated all responses (anonymized as Response A, B, C, etc.) and provided rankings.
        Below, model names are shown in <strong>bold</strong> for readability, but the original evaluation used anonymous labels.
      </p>

      <div className="tabs">
        {rankings.map((rank, index) => (
          <button
            key={index}
            className={`tab ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
            style={{
              borderBottom: activeTab === index ? `3px solid ${activeColor}` : '1px solid var(--border-color)',
              color: activeTab === index ? activeColor : 'var(--text-secondary)',
            }}
          >
            {rank.model.split('/')[1] || rank.model}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <div className="ranking-header">
          <div className="ranking-model" style={{ color: activeColor }}>
            {activeRanking.model || 'Unknown Model'}
          </div>
          {activeRanking.duration && (
              <div className="model-latency">
                {activeRanking.duration}s
              </div>
            )}
        </div>
        <div className="ranking-content markdown-content">
          <ReactMarkdown>
            {deAnonymizeText(activeRanking.ranking, labelToModel)}
          </ReactMarkdown>
        </div>

        {activeRanking.parsed_ranking &&
         activeRanking.parsed_ranking.length > 0 && (
          <div className="parsed-ranking">
            <strong>Extracted Ranking:</strong>
            <ol>
                {activeRanking.parsed_ranking.map((label, i) => {
                const modelName = labelToModel && labelToModel[label]
                  ? labelToModel[label].split('/')[1] || labelToModel[label]
                  : label;
                const itemColor = labelToModel ? getModelColor(labelToModel[label] || label) : 'var(--text-primary)';
                
                return (
                  <li key={i} style={{ color: itemColor, fontWeight: 500 }}>
                    {modelName}
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>

      {aggregateRankings && aggregateRankings.length > 0 && (
        <div className="aggregate-rankings">
          <h4>Aggregate Rankings (Street Cred)</h4>
          <p className="stage-description">
            Combined results across all peer evaluations (lower score is better):
          </p>
          <div className="aggregate-list">
            {aggregateRankings.map((agg, index) => {
              const aggColor = getModelColor(agg.model);
              return (
                <div key={index} className="aggregate-item">
                  <span className="rank-position" style={{ color: aggColor }}>#{index + 1}</span>
                  <span className="rank-model" style={{ color: aggColor }}>
                    {agg.model.split('/')[1] || agg.model}
                  </span>
                  <span className="rank-score">
                    Avg: {agg.average_rank.toFixed(2)}
                  </span>
                  <span className="rank-count">
                    ({agg.rankings_count} votes)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
