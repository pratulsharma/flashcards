import React, { useEffect, useRef } from 'react';

export default function Chart({ cards, type }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const total = cards.length;
    const count = cards.filter(c => c[type]).length;
    const percent = total ? count / total : 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI/2, -Math.PI/2 + 2*Math.PI*percent);
    ctx.lineTo(centerX, centerY);
    ctx.fillStyle = '#28a745';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI/2 + 2*Math.PI*percent, -Math.PI/2 + 2*Math.PI);
    ctx.lineTo(centerX, centerY);
    ctx.fillStyle = '#6c757d';
    ctx.fill();

    ctx.fillStyle = '#e0e0e0';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(percent * 100)}%`, centerX, centerY);
  }, [cards, type]);

  return (
    <div className="chart-container">
      <h3>{type === 'done' ? 'Done Progress' : 'Perfected Progress'}</h3>
      <canvas ref={canvasRef} width={200} height={200}></canvas>
    </div>
  );
}