import React, { useState } from 'react';

export default function Tabs({ tabs, active, onChange }) {
    const [items, setItems] = useState(tabs);
    const [editing, setEditing] = useState(null);
    const [newTab, setNewTab] = useState('');

    const addTab = () => {
        const name = newTab.trim();
        if (name && !items.includes(name)) {
            const updated = [...items, name];
            setItems(updated);
            onChange(name);
        }
        setNewTab('');
    };

    const renameTab = (oldName, newName) => {
        const name = newName.trim();
        if (!name) return;
        const updated = items.map(t => (t === oldName ? name : t));
        setItems(updated);
        if (active === oldName) onChange(name);
        setEditing(null);
    };

    const deleteTab = (name) => {
        const updated = items.filter(t => t !== name);
        setItems(updated);
        if (active === name) onChange(updated[0] || 'general');
    };

    return (
        <div className="tabs">
            {items.map(tab => (
                <div key={tab} className="tab-item">
                    {editing === tab ? (
                        <input
                            type="text"
                            defaultValue={tab}
                            onBlur={e => renameTab(tab, e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && renameTab(tab, e.target.value)}
                            autoFocus
                        />
                    ) : (
                        <button
                            className={`tab-btn${active === tab ? ' active' : ''}`}
                            onClick={() => onChange(tab)}
                            onDoubleClick={() => setEditing(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    )}
                    <button
                        className="delete-btn"
                        onClick={() => deleteTab(tab)}
                        title="Delete tab"
                    >
                        ×
                    </button>
                </div>
            ))}
            <div className="tab-add">
                <input
                    type="text"
                    value={newTab}
                    placeholder="New tab name"
                    onChange={e => setNewTab(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTab()}
                />
                <button className="add-tab-btn" onClick={addTab}>+</button>
            </div>
        </div>
    )
}