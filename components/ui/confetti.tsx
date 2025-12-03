'use client';

import { useEffect, useState } from 'react';

export function Confetti() {
  const [confettiPieces, setConfettiPieces] = useState<Array<{
    id: number;
    left: number;
    animationDuration: number;
    animationDelay: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 2 + Math.random() * 2,
      animationDelay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setConfettiPieces(pieces);

    const timeout = setTimeout(() => {
      setConfettiPieces([]);
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  if (confettiPieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0 h-3 w-3 animate-confetti"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDuration: `${piece.animationDuration}s`,
            animationDelay: `${piece.animationDelay}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
}
