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
  const [category, setcategory] = useState(['general']); // Initialize with 'general'

  // useEffect(() => {
  //   API.get('/').then(res => setCards(res.data));
  // }, []);
  useEffect(() => {
    // Fetch cards and extract unique category
    API.get('/').then(res => {
      setCards(res.data);
      console.log("RES", res.data)
      const uniquecategory = Array.from(
        new Set(res.data.map(c => c.category || 'general'))
      );
      console.log("CAT", category, uniquecategory)
      console.log("UCAT", uniquecategory)
      setcategory(uniquecategory);
    });
  }, []);
  // const refresh = () => API.get('/').then(res => setCards(res.data));
    const refresh = async () => {
    const res = await API.get('/');
    setCards(res.data);
    const uniquecategory = Array.from(
      new Set(res.data.map(c => c.category || 'general'))
    );
    setcategory(uniquecategory);
  };


  // Treat missing category as general
  // const filtered = cards.filter(c => (c.category || 'general') === activeTab);
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