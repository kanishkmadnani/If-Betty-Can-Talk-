'use client';

import { useEffect, useRef } from 'react';

interface WaveBackgroundProps {
  isListening: boolean;
}

export function WaveBackground({ isListening }: WaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (!isListening) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      const waves = [
        { color: 'rgba(255, 240, 240, 0.2)', amplitude: 50, frequency: 0.02, speed: 0.02 },
        { color: 'rgba(0, 0, 0, 0.05)', amplitude: 30, frequency: 0.03, speed: 0.03 },
        { color: 'rgba(255, 200, 200, 0.15)', amplitude: 40, frequency: 0.01, speed: 0.01 }
      ];

      waves.forEach(wave => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);

        for (let x = 0; x < canvas.width; x++) {
          const y = Math.sin(x * wave.frequency + phase * wave.speed) * wave.amplitude;
          ctx.lineTo(x, canvas.height / 2 + y);
        }

        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      phase += 0.5;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isListening]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}