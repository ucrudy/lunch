'use client';
import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { createBubbles } from './bubbleSVG'; 
import { Lunch } from '@/types/lunch';
import { Button } from '@heroui/react';
import { useAppContext } from '@/components/AppContext';
import ScrollAttempt from '../ScrollAttempt';

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

const BubbleChart: React.FC<Props> = ({ lunch }) => {
  const { distance, isScrolling } = useAppContext();
  const svgRef = useRef(null);
  const width = typeof window !== 'undefined' ? window.innerWidth : 0;
  const height = 400;
  const [limit, setLimit] = useState(6);
  const [data, setData] = useState<Bubble[]>([]);

  const buildBubble = (l: Lunch) => {
    const distanceMiles = Math.round(l.distance * 0.000621371 * 100) / 100;
    const distanceFactor = 1 - (distanceMiles / (distance || 1));
    const radius = (Math.round(distanceFactor * 100) / 1.8) + 14;

    if (!l.logo) {
      console.log("no logo: ", l.name);
    }

    return ({
     id: l.fsq_id,
     name: l.name,
     logo: l.logo,
     menu_link: l.menu_link,
     radius: radius,
     x: width / 2,
     y: height / 2,
   })
  }
  // Function to add a new bubble
  const addBubble = () => {
    console.log(" called add bubbles");
    // get a slice of lunch using the limit
    const lunchSlice = lunch.slice(lunch.length, limit);

    const newBubble = buildBubble({
      fsq_id: Date.now().toString(),
      name: "New Bubble", // Default name
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/390px-McDonald%27s_Golden_Arches.svg.png",
      menu_link: "https://www.mcdonalds.com/menu",
      distance: Math.floor(Math.random() * (6000 - 3000 + 1)) + 3000,
      logo_color: ''
    });
    const copies = Array.from({ length: 10 }, () => ({ ...newBubble }));
    // Add the new bubble to the data
    setData([...data, ...copies]);
  };

  useEffect(() => { 
    console.log("new lunch data: ", lunch);
    console.log("limit: ", limit);
    
    return setData(lunch.map((l: Lunch) => buildBubble(l)));
  }, [lunch]);

  useEffect(() => {
    console.log("draw chart with ", data);
    drawChart(data);
  }, [data]);

  useEffect(() => {
    if(isScrolling) {
      console.log("Scrolling detected, adding bubbles ...");
      setLimit((prevLimit) => prevLimit + 3);
    }
  }, [isScrolling]);

  useEffect(() => { 
    // find how many bubbles are needed using new limit and lunch.length

    // addBubble();
  }, [limit]);

  const drawChart = (data: Bubble[]) => {      
    const svg = d3.select(svgRef.current)
    .attr('width', width)
    .attr('height', height);

    if (Array.isArray(data) && data.length === 0) {
      svg.selectAll('*').remove();
      return;
    }

    console.log("data: ", data);

    // Force simulation
    const simulation = d3.forceSimulation(data)
    .alpha(0.4)
    .alphaDecay(0.05)
    .velocityDecay(0.7)
    .force("charge", d3.forceManyBody().strength(0.1)) // Repulsion force
    .force("radial", d3.forceRadial(50, width / 2, height / 2))
    .force("collide", d3.forceCollide().radius((d) => (d as { radius: number }).radius + 1)) // Prevent overlap by setting a radius around each circle
    .on("tick", ticked); // Update positions on each tick

    // Ticked function updates the positions of the circles based on simulation
    function ticked() {
      svg.selectAll('g')
        .data(data)
        .attr('transform', (d: { x: any; y: any; }) => `translate(${d.x},${d.y})`);
    }
  
    // Create the bubbles (circles)
    const bubbles = createBubbles(svg, data);

    bubbles.merge(bubbles);

    bubbles
    .on("click", function (event: any, d: any) { 
      window.open(d.menu_link, '_blank');
    });
    
    bubbles.exit().remove();

    // Update the simulation with new data
    simulation.nodes(data);
  };  

  return (
    <div>
      <ScrollAttempt />
      <Button className='absolute mt-12' onPress={addBubble}>Add a Bubble</Button>
      <svg ref={svgRef} style={{ width: '100%', height: '400px' }}></svg>
    </div>
  );
};

export default BubbleChart;
