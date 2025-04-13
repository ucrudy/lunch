'use client';
import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { createBubbles } from './bubbleSVG'; 
import { Lunch } from '@/types/lunch';
import { Button } from '@heroui/react';

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
  const svgRef = useRef(null);
  const width = typeof window !== 'undefined' ? window.innerWidth : 0;
  const height = 400;
  const [data, setData] = useState<Bubble[]>([]);

  useEffect(() => { 
    return setData(lunch.map((l: Lunch) => ({
       id: l.fsq_id,
       name: l.name,
       logo: l.logo,
       menu_link: l.menu_link,
       radius: Number(l.distance.toString().slice(0, -2)),
       x: width / 2,
       y: height / 2,
     })));
  }, [lunch]);

  useEffect(() => {    // Initial empty chart
    drawChart(data);
  }, [data]);

  // useEffect(() => {
  //   if(isScrolling) {
  //     console.log("Scrolling detected, adding bubbles ...");
  //     addBubble();
  //   }
  // }, [isScrolling]);

  const drawChart = (data: Bubble[]) => {      
    const svg = d3.select(svgRef.current)
    .attr('width', width)
    .attr('height', height);

    console.log('D3 simulation initialized');
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
      window.location.href = d.menu_link;
    });
    
    bubbles.exit().remove();

    // Update the simulation with new data
    simulation.nodes(data);
  };  

  // Function to add a new bubble
  const addBubble = () => {
    console.log(" called add bubbles");
    const newBubble = {
      id: Date.now().toString(), // Unique ID as a string
      name: "New Bubble", // Default name
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/390px-McDonald%27s_Golden_Arches.svg.png", // Default logo
      menu_link: "https://www.mcdonalds.com/menu", // Default menu link
      radius: Math.random() * 30 + 20, // Random radius between 10 and 40
      x: width / 2, // Start from the center
      y: height / 2, // Start from the center
    };

    // Add the new bubble to the data
    setData([...data, newBubble]);
  };

  return (
    <div>
      <Button className='absolute mt-12' onPress={addBubble}>Add a Bubble</Button>
      <svg ref={svgRef} style={{ width: '100%', height: '400px' }}></svg>
    </div>
  );
};

export default BubbleChart;
