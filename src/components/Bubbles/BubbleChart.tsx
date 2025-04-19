'use client';
import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { Lunch } from '@/types/lunch';
import { useAppContext } from '@/components/AppContext';
import ScrollAttempt from '../ScrollAttempt';
import { fetchLunch } from '@/lib/fetchLunch';

type Props = {
  lunch: Lunch[];
};

interface Bubble {
  id: string; 
  name: string;
  logo: string;
  menu_link: string; 
  radius: number; 
  x: number; 
  y: number;
}

// bubbles
// .on("click", function (event: any, d: any) { 
//   window.open(d.menu_link, '_blank');
// });

const BubbleChart: React.FC<Props> = ({ lunch }) => {
  const { location, distance, priceRange, page, isScrolling, setLoading, setPage } = useAppContext();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simulationRef = useRef<d3.Simulation<Bubble, undefined> | null>(null);
  const bubblesRef = useRef<Bubble[]>([]);  
  const imageMapRef = useRef<Record<string, HTMLImageElement>>({});

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const drawBubbles = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    bubblesRef.current.forEach(bubble => {
      if (!bubble.logo) return;
      const img = imageMapRef.current[bubble.logo];

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff'; // Dummy fill to cast shadow
      ctx.fill();
      ctx.restore();
      // Now clip and draw the image
      ctx.save();
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.clip();
      if (img) {
        ctx.drawImage(img, bubble.x - bubble.radius, bubble.y - bubble.radius, bubble.radius * 2, bubble.radius * 2);
      }
      ctx.restore();
    });
  };

  const createBubble = (l: Lunch, width: number, height: number): Bubble => {
    const distanceMiles = Math.round(l.distance * 0.000621371 * 100) / 100;
    const distanceFactor = 1 - (distanceMiles / (distance || 1));
    const radius = (Math.round(distanceFactor * 100) / 1.8) + 14;

    return {
      id: l.fsq_id,
      name: l.name,
      logo: l.logo,
      menu_link: l.menu_link,
      radius,
      x: width / 2,
      y: height / 2
    };
  };

  // Function to add a new bubble
  const getMoreBubbles = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // call api with page number as offset/limit
    const newPage = (page || 1) + 1;
    setLoading(true);
    setPage(newPage);
    const lunch = await fetchLunch(location, distance, priceRange, newPage);
    const lunchBubbles = lunch.map((l: Lunch) => createBubble(l, canvas.width, canvas.height) as Bubble);
    console.log("lunchBubbles", lunchBubbles);
    setLoading(false);

    bubblesRef.current.push(...lunchBubbles);
    // todo: use a promise
    loadImagesThenStartSimulation();
  };

  useEffect(() => {
    if(isScrolling) {
      getMoreBubbles();
    }
  }, [isScrolling]);

  const loadImagesThenStartSimulation = () => {
    const uniqueSrcs = [...new Set(bubblesRef.current.map(b => b.logo))];
    let loaded = 0;

    // Preload images
    uniqueSrcs.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageMapRef.current[src] = img;
        loaded++;
        if (loaded === uniqueSrcs.length) {
          startSimulation();
        }
      };
    });
  }

  const startSimulation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Click event
    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      bubblesRef.current.forEach(bubble => {
        const dx = x - bubble.x;
        const dy = y - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < bubble.radius) {
          window.open(bubble.menu_link, '_blank');
        }
      });
    });
    // hover detection
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let found = null;
      for (let node of bubblesRef.current) {
        const dx = x - node.x;
        const dy = y - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.radius) {
          found = node.id;
          break;
        }
      }

      setHoveredId(found); // will trigger re-draw with new color
    });

    const width = canvas.width;
    const height = canvas.height;

    if (simulationRef.current) simulationRef.current.stop();

    simulationRef.current = d3.forceSimulation(bubblesRef.current)
      .alpha(0.4)
      .alphaDecay(0.05)
      .velocityDecay(0.7)
      .force("charge", d3.forceManyBody().strength(0.1)) // Repulsion force
      .force("radial", d3.forceRadial(50, width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d) => (d as { radius: number }).radius + 1))
      .on('tick', () => {
        const ctx = canvasRef.current ? canvasRef.current.getContext('2d') : null;

        if (ctx) {
          drawBubbles(ctx);
        }
      });
  };

  useEffect(() => {
    console.log("hoverid: ", hoveredId);
    // change color of bubble and show menu text
  }, [hoveredId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      bubblesRef.current = lunch.map((l: Lunch) => createBubble(l, canvas.width, canvas.height) as Bubble);
      // todo: use a promise
      loadImagesThenStartSimulation();
    };

    // Initial size
    resizeCanvas();

    // Resize on window change
    window.addEventListener('resize', resizeCanvas);

    // Clean up on unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [lunch]);

  return (
    <div>
      <ScrollAttempt />
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
        />
      </div>
    </div>
  );
};

export default BubbleChart;
