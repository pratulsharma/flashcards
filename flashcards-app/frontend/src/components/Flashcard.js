import React, { useState } from 'react';
import API from '../utils/api';

export default function Flashcard({ card, onChange, onEdit }) {
  const [showAnswer, setShowAnswer] = useState(false);

  // Convert markdown-style fences into HTML <pre><code> for rendering
  const htmlAnswer = card.answer.replace(
    /```([\s\S]*?)```/g,
    '<pre><code>$1</code></pre>'
  );

  const toggleDone = () =>
    API.put(`/${card._id}`, { ...card, done: !card.done }).then(onChange);

  const togglePerfected = () =>
    API.put(`/${card._id}`, { ...card, perfected: !card.perfected }).then(onChange);

  const deleteCard = () => {
    if (window.confirm('Delete this flashcard?')) {
      API.delete(`/${card._id}`).then(onChange);
    }
  };

  return (
    <div className="card">
      <div className="question-container">
        <div className="question">{card.question}</div>
        <button
          className="view-btn"
          onClick={() => setShowAnswer(prev => !prev)}
        >
          {showAnswer ? 'Hide Answer' : 'View Answer'}
        </button>
      </div>

      {showAnswer && (
        <div
          className="answer"
          dangerouslySetInnerHTML={{ __html: htmlAnswer }}
        />
      )}
      {showAnswer && card.image && (
        <div className="image-preview">
          <img src={card.image} alt="flashcard" />
        </div>
      )}

      <div className="button-group">
        <button
          className={`done-btn${card.done ? ' active' : ''}`}
          onClick={toggleDone}
        >
          Done
        </button>
        <button
          className={`perfected-btn${card.perfected ? ' active' : ''}`}
          onClick={togglePerfected}
        >
          Perfected
        </button>
        <button className="edit-btn" onClick={() => onEdit(card)}>
          Edit
        </button>
        <button className="delete-btn" onClick={deleteCard}>
          Delete
        </button>
      </div>
    </div>
  );
}
