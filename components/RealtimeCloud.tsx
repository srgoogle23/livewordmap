import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { WordData } from '../types';
import { getColor } from '../utils/color';
import { useLanguage } from '../contexts/LanguageContext';

interface RealtimeCloudProps {
  words: WordData[];
}

const RealtimeCloud: React.FC<RealtimeCloudProps> = ({ words }) => {
  const { t } = useLanguage();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Early exit if no data or refs
    if (!svgRef.current || !containerRef.current || words.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Clear previous SVG content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create a group centered in the container
    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const maxCount = Math.max(...words.map(w => w.count));
    const minCount = Math.min(...words.map(w => w.count));
    
    // Create an off-screen canvas to measure text width accurately
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Font scaling
    const fontScale = d3.scaleLinear()
      .domain([minCount, maxCount])
      .range([24, 96]); // Slightly larger max size for impact

    // Prepare nodes with precise dimensions
    const nodes = words.map((w, i) => {
      const size = fontScale(w.count);
      let textWidth = 0;
      
      if (context) {
        context.font = `800 ${size}px 'Inter', sans-serif`;
        textWidth = context.measureText(w.text).width;
      } else {
        // Fallback calculation if canvas is unavailable
        textWidth = w.text.length * size * 0.6;
      }

      // To prevent overlap, we treat the word as a circle.
      // Since words are usually wider than tall, using half-width as radius
      // ensures no horizontal overlap. 
      // REDUCED RADIUS: Multiplied by 0.9 to allow tighter packing (slightly risky but denser)
      const radius = (textWidth / 2) * 0.9;

      return {
        ...w,
        size,
        textWidth,
        radius,
        x: (Math.random() - 0.5) * 100, // Random start position near center
        y: (Math.random() - 0.5) * 100,
      };
    });

    // Configure the physics simulation
    const simulation = d3.forceSimulation(nodes as any)
      // REMOVED: forceManyBody (repulsion) to allow words to cluster tightly
      
      // Collision force using the calculated radius
      .force("collide", d3.forceCollide()
        .radius((d: any) => d.radius)
        .strength(1)
        .iterations(4) // More iterations for stability in tight packs
      )
      // INCREASED GRAVITY: Stronger X and Y pull to the center to mimic the reference image
      .force("x", d3.forceX(0).strength(0.3))
      .force("y", d3.forceY(0).strength(0.3));

    // Render the text elements
    const textElements = g.selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text(d => d.text)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .style("font-family", "'Inter', sans-serif")
      .style("font-weight", "800")
      .style("fill", (_, i) => getColor(i))
      .style("font-size", d => `${d.size}px`)
      .style("opacity", 0)
      .style("cursor", "default")
      .style("text-shadow", "0px 4px 12px rgba(0,0,0,0.3)"); // Add shadow for readability

    // Fade in animation
    textElements.transition().duration(600).style("opacity", 1);

    // Update positions on each tick
    simulation.on("tick", () => {
      textElements
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [words]); // Re-run when words change

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-pulse px-4 text-center">
        <p className="text-xl md:text-2xl font-bold mb-2 text-slate-400">{t.host.waitingTitle}</p>
        <p className="text-sm md:text-base text-slate-500">{t.host.waitingDesc}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden select-none">
      <svg ref={svgRef} className="w-full h-full block" />
    </div>
  );
};

export default RealtimeCloud;