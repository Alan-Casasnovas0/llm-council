import { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import './Sidebar.css';

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>LLM Council</h1>
        <div className="header-actions">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            title="Toggle Dark/Light Mode"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="new-conversation-btn" onClick={onNewConversation}>
            + New Conversation
          </button>
        </div>
      </div>

      <div className="conversation-list">
        {conversations.length === 0 ? (
          <div className="no-conversations">No conversations yet</div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${
                conv.id === currentConversationId ? 'active' : ''
              }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="conversation-title">
                {conv.title || 'New Conversation'}
              </div>
                <button
                className="delete-btn"
                onClick={(e) => onDeleteConversation(conv.id, e)}
                title="Delete conversation"
                >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}