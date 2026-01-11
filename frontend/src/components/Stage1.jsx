import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './Stage1.css';

const getModelColor = (modelName) => {
  const colors = ['#c32a19', '#2192dd', '#15cb61', '#f1c40f', '#9b59b6', '#d56d13'];
  let hash = 0;
  for (let i = 0; i < modelName.length; i++) {
    hash = modelName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export default function Stage1({ responses }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!responses || responses.length === 0) {
    return null;
  }

  const activeResponse = responses[activeTab];
  const modelColor = getModelColor(activeResponse.model);

  return (
    <div className="stage stage1">
      <h3 className="stage-title">Stage 1: Individual Responses</h3>

      <div className="tabs">
        {responses.map((resp, index) => (
          <button
            key={index}
            className={`tab ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
            style={{ 
                borderBottom: activeTab === index ? `3px solid ${getModelColor(resp.model)}` : '1px solid #d0d0d0',
                color: activeTab === index ? getModelColor(resp.model) : '#666'
            }}
          >
            {resp.model.split('/')[1] || resp.model}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <div className="model-header">
          <div className="model-name" style={{ color: modelColor }}>
            {activeResponse.model}
          </div>
          {activeResponse.duration && (
            <div className="model-latency">
              {activeResponse.duration}s  
            </div>
          )}
        </div>
        <div className="response-text markdown-content">
          <ReactMarkdown>{activeResponse.response}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
