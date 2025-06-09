// import React, { useState, useEffect } from 'react';
// import API from '../utils/api';

// export default function Modal({ card, category, onClose, onSaved }) {
//   const [questionsText, setQuestionsText] = useState('');
//   const [answerText, setAnswerText] = useState('');
//   const [pastedImage, setPastedImage] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(card?.category || category);

//   useEffect(() => {
//     if (card) {
//       setQuestionsText(card.question);
//       setAnswerText(
//         card.answer.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, '```$1```')
//       );
//       setPastedImage(card.image || null);
//       setSelectedCategory(card.category || category);
//     } else {
//       setQuestionsText('');
//       setAnswerText('');
//       setPastedImage(null);
//       setSelectedCategory(category);
//     }
//   }, [card, category]);

//   const handlePaste = (e) => {
//     const items = e.clipboardData?.items;
//     if (!items) return;
//     for (const item of items) {
//       if (item.type.includes('image')) {
//         const blob = item.getAsFile();
//         const reader = new FileReader();
//         reader.onload = (ev) => setPastedImage(ev.target.result);
//         reader.readAsDataURL(blob);
//       }
//     }
//   };

//   const save = () => {
//     const htmlAnswer = answerText.replace(
//       /```([\s\S]*?)```/g,
//       '<pre><code>$1</code></pre>'
//     );
//     const questions = questionsText
//       .split('\n')
//       .map(q => q.trim())
//       .filter(q => q);

//     const operations = questions.map(q => {
//  const payload = {
//   question: q,
//   answer: htmlAnswer,
//   category: selectedCategory,   // ← this must be here
//   ...(pastedImage && { image: pastedImage })
// };

//       if (pastedImage) payload.image = pastedImage;
//       return card && questions.length === 1
//         ? API.put(`/${card._id}`, payload)
//         : API.post('/', payload);
//     });

//     Promise.all(operations).then(onSaved);
//   };

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <h2>{card ? 'Edit Flashcard' : 'Add New Flashcard'}</h2>

//         {/* <label>Category:</label>
//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//         >
//           <option value="general">General</option>
//           <option value="javascript">JavaScript</option>
//           <option value="system design">System Design</option>
//         </select> */}

//         <textarea
//           rows={3}
//           value={questionsText}
//           onChange={(e) => setQuestionsText(e.target.value)}
//           placeholder="Enter question(s), one per line"
//         />

//         <textarea
//           rows={6}
//           value={answerText}
//           onChange={(e) => setAnswerText(e.target.value)}
//           onPaste={handlePaste}
//           placeholder="Enter answer (use ``` for code blocks)"
//         />

//         <div className="paste-instruction">Paste an image (Ctrl+V) to include it</div>
//         {pastedImage && (
//           <div className="image-preview">
//             <img src={pastedImage} alt="pasted preview" />
//           </div>
//         )}

//         <div className="button-group">
//           <button className="view-btn" onClick={save}>
//             {card ? 'Update' : 'Submit'}
//           </button>
//           <button className="delete-btn" onClick={onClose}>
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import API from '../utils/api';

export default function Modal({ card, category, onClose, onSaved }) {
  const [questionsText, setQuestionsText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [pastedImage, setPastedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(card?.category || category);
 const deleteImage = () => {
    setPastedImage(null);
  };

  useEffect(() => {
    if (card) {
      setQuestionsText(card.question);
      let formattedAnswer = card.answer
        .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, '```$1```')
        .replace(/<\/p>\s*<p>/g, '\n')
        .replace(/<p>(.*?)<\/p>/g, '$1')
        .replace(/<br>/g, '\n');
      setAnswerText(formattedAnswer.trim());
      setPastedImage(card.image || null);
      setSelectedCategory(card.category || category);
    } else {
      setQuestionsText('');
      setAnswerText('');
      setPastedImage(null);
      setSelectedCategory(category);
    }
  }, [card, category]);

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.includes('image')) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (ev) => setPastedImage(ev.target.result);
        reader.readAsDataURL(blob);
      }
    }
  };

  const save = () => {
    let htmlAnswer = answerText.replace(
      /```([\s\S]*?)```/g,
      '<pre><code>$1</code></pre>'
    );

    htmlAnswer = htmlAnswer
      .split('\n')
      .map(line => {
        if (!line.trim() || line.match(/<pre><code>[\s\S]*<\/code><\/pre>/)) {
          return line;
        }
        return `<p>${line.trim()}</p>`;
      })
      .filter(line => line)
      .join('');

    const questions = questionsText
      .split('\n')
      .map(q => q.trim())
      .filter(q => q);

    const operations = questions.map(q => {
      const payload = {
        question: q,
        answer: htmlAnswer,
        category: selectedCategory,
        ...(pastedImage && { image: pastedImage }),
      };

      return card && questions.length === 1
        ? API.put(`/${card._id}`, payload)
        : API.post('/', payload);
    });

    Promise.all(operations).then(onSaved);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{card ? 'Edit Flashcard' : 'Add New Flashcard'}</h2>

        <textarea
          rows={3}
          value={questionsText}
          onChange={(e) => setQuestionsText(e.target.value)}
          placeholder="Enter question(s), one per line"
        />

        <textarea
          rows={6}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          onPaste={handlePaste}
          placeholder="Enter answer (use ``` for code blocks)"
        />

        <div className="paste-instruction">Paste an image (Ctrl+V) to include it</div>
        {pastedImage && (
          <div className="image-preview">
            <img src={pastedImage} alt="pasted preview" />
             <button 
              className="delete-image-btn" 
              onClick={deleteImage}
              title="Delete image"
            >
              ×
            </button>
          </div>
        )}

        <div className="button-group">
          <button className="view-btn" onClick={save}>
            {card ? 'Update' : 'Submit'}
          </button>
          <button className="delete-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}