import React, { useEffect, useState } from 'react';
import API from './utils/api';
import Flashcard from './components/Flashcard';
import Modal from './components/Modal';
import Chart from './components/Chart';
import Tabs from './components/Tabs';
import './App.css';

function App() {
  const [cards, setCards] = useState([]);
  const [modal, setModal] = useState({ open: false, card: null });
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    API.get('/').then(res => setCards(res.data));
  }, []);

  const refresh = () => API.get('/').then(res => setCards(res.data));

  // Treat missing category as general
  const filtered = cards.filter(c => (c.category || 'general') === activeTab);

  return (
    <div className="App">
      <h1>Heap</h1>

      <Tabs
        tabs={Array.from(new Set(cards.map(c => c.category || 'general')))}
        active={activeTab}
        onChange={setActiveTab}
      />

      <div className="charts">
        <Chart cards={filtered} type="done" />
        <Chart cards={filtered} type="perfected" />
      </div>

      <button className="add-btn" onClick={() => setModal({ open: true, card: null })}>
        + Add New Question
      </button>

      {filtered.map(c => (
        <Flashcard
          key={c._id}
          card={c}
          onChange={refresh}
          onEdit={card => setModal({ open: true, card })}
        />
      ))}

      {modal.open && (
        <Modal
          card={modal.card}
          category={activeTab}
          onClose={() => setModal({ open: false, card: null })}
          onSaved={() => { setModal({ open: false, card: null }); refresh(); }}
        />
      )}
    </div>
  );
}

export default App;