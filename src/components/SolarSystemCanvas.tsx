import { useRef, useEffect, useState, useCallback } from 'react';
import { planets, Planet } from '../data/planets';

interface ProbeState {
  active: boolean;
  target: Planet | null;
  progress: number;
}

interface SolarSystemCanvasProps {
  isPaused: boolean;
  speed: number;
  showOrbits: boolean;
  showLabels: boolean;
  onPlanetClick: (planet: Planet) => void;
  onPlanetHover: (planet: Planet | null) => void;
  hoveredPlanet: Planet | null;
  selectedPlanet: Planet | null;
  sphereMusicEnabled: boolean;
  onPlanetPositionUpdate: (angles: number[]) => void;
  onAlignmentDetected: (alignedPlanets: Planet[]) => void;
  probe: ProbeState;
}

export function SolarSystemCanvas({
  isPaused,
  speed,
  showOrbits,
  showLabels,
  onPlanetClick,
  onPlanetHover,
  hoveredPlanet,
  selectedPlanet,
  sphereMusicEnabled,
  onPlanetPositionUpdate,
  onAlignmentDetected,
  probe
}: SolarSystemCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const anglesRef = useRef<number[]>(planets.map(() => Math.random() * Math.PI * 2));
  const timeRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCenter = useCallback(() => {
    return { x: dimensions.width / 2, y: dimensions.height / 2 };
  }, [dimensions]);

  const getScale = useCallback(() => {
    const minDim = Math.min(dimensions.width, dimensions.height);
    return minDim / 850;
  }, [dimensions]);

  const getPlanetPosition = useCallback((planet: Planet, angle: number) => {
    const center = getCenter();
    const scale = getScale();
    const orbitR = planet.orbitRadius * scale;
    return {
      x: center.x + Math.cos(angle) * orbitR,
      y: center.y + Math.sin(angle) * orbitR
    };
  }, [getCenter, getScale]);

  const checkAlignment = useCallback((angles: number[]) => {
    const threshold = 0.15;
    const alignedPlanets: Planet[] = [];
    
    for (let i = 0; i < angles.length; i++) {
      const normAngle = ((angles[i] % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      for (let j = i + 1; j < angles.length; j++) {
        const otherNorm = ((angles[j] % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const diff = Math.abs(normAngle - otherNorm);
        const minDiff = Math.min(diff, Math.PI * 2 - diff);
        if (minDiff < threshold) {
          if (!alignedPlanets.includes(planets[i])) alignedPlanets.push(planets[i]);
          if (!alignedPlanets.includes(planets[j])) alignedPlanets.push(planets[j]);
        }
      }
    }
    
    if (alignedPlanets.length >= 3) {
      onAlignmentDetected(alignedPlanets);
    }
  }, [onAlignmentDetected]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const { width, height } = dimensions;
    const center = getCenter();
    const scale = getScale();

    // Clear with deep space gradient
    const bgGradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, Math.max(width, height) * 0.7);
    bgGradient.addColorStop(0, '#0d0d2b');
    bgGradient.addColorStop(1, '#050510');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Stars background
    for (let i = 0; i < 250; i++) {
      const sx = ((42 * (i + 1) * 7919) % width);
      const sy = ((42 * (i + 1) * 6271) % height);
      const brightness = ((i * 3571) % 100) / 100;
      const twinkle = Math.sin(timeRef.current * 0.001 + i) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(255, 255, 255, ${(0.3 + brightness * 0.7) * twinkle})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 0.5 + brightness * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sun glow layers
    const outerGlow = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 60 * scale);
    outerGlow.addColorStop(0, 'rgba(255, 200, 50, 0.3)');
    outerGlow.addColorStop(0.5, 'rgba(255, 150, 0, 0.1)');
    outerGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(center.x, center.y, 60 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Sun corona animation
    const coronaSize = 35 * scale + Math.sin(timeRef.current * 0.002) * 3 * scale;
    const coronaGradient = ctx.createRadialGradient(center.x, center.y, 15 * scale, center.x, center.y, coronaSize);
    coronaGradient.addColorStop(0, '#fff7e0');
    coronaGradient.addColorStop(0.4, '#ffcc00');
    coronaGradient.addColorStop(0.8, '#ff880088');
    coronaGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = coronaGradient;
    ctx.beginPath();
    ctx.arc(center.x, center.y, coronaSize, 0, Math.PI * 2);
    ctx.fill();

    // Sun core
    const sunCoreGradient = ctx.createRadialGradient(center.x - 5 * scale, center.y - 5 * scale, 0, center.x, center.y, 18 * scale);
    sunCoreGradient.addColorStop(0, '#ffffff');
    sunCoreGradient.addColorStop(0.4, '#ffee88');
    sunCoreGradient.addColorStop(1, '#ffaa00');
    ctx.fillStyle = sunCoreGradient;
    ctx.beginPath();
    ctx.arc(center.x, center.y, 18 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Orbits
    if (showOrbits) {
      planets.forEach(planet => {
        const orbitR = planet.orbitRadius * scale;
        ctx.strokeStyle = `rgba(255, 255, 255, 0.08)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        ctx.beginPath();
        ctx.arc(center.x, center.y, orbitR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }

    // Habitable zone visualization
    const habitableInner = 120 * scale;
    const habitableOuter = 155 * scale;
    const habGradient = ctx.createRadialGradient(center.x, center.y, habitableInner, center.x, center.y, habitableOuter);
    habGradient.addColorStop(0, 'rgba(0, 255, 100, 0)');
    habGradient.addColorStop(0.3, 'rgba(0, 255, 100, 0.03)');
    habGradient.addColorStop(0.7, 'rgba(0, 255, 100, 0.03)');
    habGradient.addColorStop(1, 'rgba(0, 255, 100, 0)');
    ctx.fillStyle = habGradient;
    ctx.beginPath();
    ctx.arc(center.x, center.y, habitableOuter, 0, Math.PI * 2);
    ctx.arc(center.x, center.y, habitableInner, 0, Math.PI * 2, true);
    ctx.fill();

    // Planets
    planets.forEach((planet, index) => {
      const angle = anglesRef.current[index];
      const pos = getPlanetPosition(planet, angle);
      const radius = planet.displayRadius * scale;
      const isHovered = hoveredPlanet?.id === planet.id;
      const isSelected = selectedPlanet?.id === planet.id;

      // Sound wave visualization
      if (sphereMusicEnabled) {
        const wavePhase = (timeRef.current * 0.002 * (88 / planet.orbitalPeriod)) % 1;
        const waveRadius = radius + wavePhase * 25 * scale;
        const alpha = Math.floor((1 - wavePhase) * 40).toString(16).padStart(2, '0');
        ctx.strokeStyle = planet.color + alpha;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, waveRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Second wave
        const wavePhase2 = ((timeRef.current * 0.002 * (88 / planet.orbitalPeriod)) + 0.5) % 1;
        const waveRadius2 = radius + wavePhase2 * 25 * scale;
        const alpha2 = Math.floor((1 - wavePhase2) * 30).toString(16).padStart(2, '0');
        ctx.strokeStyle = planet.color + alpha2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, waveRadius2, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Planet glow
      if (isHovered || isSelected) {
        const glowRadius = radius * 3;
        const glow = ctx.createRadialGradient(pos.x, pos.y, radius, pos.x, pos.y, glowRadius);
        glow.addColorStop(0, planet.glowColor + '60');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Planet body with shadow
      const planetGradient = ctx.createRadialGradient(
        pos.x - radius * 0.3, pos.y - radius * 0.3, 0,
        pos.x, pos.y, radius
      );
      planetGradient.addColorStop(0, lightenColor(planet.color, 40));
      planetGradient.addColorStop(0.5, planet.color);
      planetGradient.addColorStop(1, darkenColor(planet.glowColor, 30));
      ctx.fillStyle = planetGradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Saturn rings
      if (planet.id === 'saturn') {
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(-0.3);
        
        // Outer ring
        ctx.strokeStyle = '#e8d5a388';
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 2.2, radius * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner ring
        ctx.strokeStyle = '#c4b08066';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.7, radius * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
      }

      // Earth's moon
      if (planet.id === 'earth') {
        const moonAngle = timeRef.current * 0.005;
        const moonDist = radius * 2.5;
        const moonX = pos.x + Math.cos(moonAngle) * moonDist;
        const moonY = pos.y + Math.sin(moonAngle) * moonDist;
        ctx.fillStyle = '#cccccc';
        ctx.beginPath();
        ctx.arc(moonX, moonY, 1.5 * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      // Labels
      if (showLabels || isHovered || isSelected) {
        ctx.fillStyle = isHovered || isSelected ? '#ffffff' : '#aaaaaa';
        ctx.font = `${isHovered || isSelected ? 'bold ' : ''}${Math.max(10, 11 * scale)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(planet.nameRu, pos.x, pos.y - radius - 8 * scale);
        
        if (isSelected || isHovered) {
          ctx.fillStyle = '#888888';
          ctx.font = `${Math.max(8, 9 * scale)}px system-ui, sans-serif`;
          ctx.fillText(planet.name, pos.x, pos.y - radius - 20 * scale);
        }
      }

      // Hover ring
      if (isHovered) {
        ctx.strokeStyle = '#ffffff66';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius + 5 * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // Alignment lines
    const angles = anglesRef.current;
    const threshold = 0.15;
    for (let i = 0; i < angles.length; i++) {
      for (let j = i + 1; j < angles.length; j++) {
        const normA = ((angles[i] % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const normB = ((angles[j] % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const diff = Math.abs(normA - normB);
        const minDiff = Math.min(diff, Math.PI * 2 - diff);
        if (minDiff < threshold) {
          const posA = getPlanetPosition(planets[i], angles[i]);
          const posB = getPlanetPosition(planets[j], angles[j]);
          const alpha = 0.4 * (1 - minDiff / threshold);
          ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 4]);
          ctx.beginPath();
          ctx.moveTo(posA.x, posA.y);
          ctx.lineTo(posB.x, posB.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    // Space Probe
    if (probe.active && probe.target) {
      const earthIdx = planets.findIndex(p => p.id === 'earth');
      const targetIdx = planets.findIndex(p => p.id === probe.target!.id);
      
      if (earthIdx >= 0 && targetIdx >= 0) {
        const earthPos = getPlanetPosition(planets[earthIdx], angles[earthIdx]);
        const targetPos = getPlanetPosition(planets[targetIdx], angles[targetIdx]);
        
        // Curved path using quadratic bezier
        const midX = (earthPos.x + targetPos.x) / 2;
        const midY = (earthPos.y + targetPos.y) / 2;
        const perpX = -(targetPos.y - earthPos.y) * 0.2;
        const perpY = (targetPos.x - earthPos.x) * 0.2;
        const cpX = midX + perpX;
        const cpY = midY + perpY;

        // Trail
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(earthPos.x, earthPos.y);
        ctx.quadraticCurveTo(cpX, cpY, targetPos.x, targetPos.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Probe position along curve
        const t = probe.progress;
        const px = (1-t)*(1-t)*earthPos.x + 2*(1-t)*t*cpX + t*t*targetPos.x;
        const py = (1-t)*(1-t)*earthPos.y + 2*(1-t)*t*cpY + t*t*targetPos.y;

        // Probe glow
        const probeGlow = ctx.createRadialGradient(px, py, 0, px, py, 8 * scale);
        probeGlow.addColorStop(0, 'rgba(100, 200, 255, 0.8)');
        probeGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = probeGlow;
        ctx.beginPath();
        ctx.arc(px, py, 8 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Probe body
        ctx.fillStyle = '#64c8ff';
        ctx.beginPath();
        ctx.arc(px, py, 3 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Engine trail
        const trailAngle = Math.atan2(py - earthPos.y, px - earthPos.x);
        for (let k = 0; k < 5; k++) {
          const trailDist = k * 3 * scale;
          const tx = px - Math.cos(trailAngle) * trailDist;
          const ty = py - Math.sin(trailAngle) * trailDist;
          ctx.fillStyle = `rgba(100, 200, 255, ${0.5 - k * 0.1})`;
          ctx.beginPath();
          ctx.arc(tx, ty, (2 - k * 0.3) * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Habitable zone label
    ctx.fillStyle = 'rgba(0, 255, 100, 0.15)';
    ctx.font = `${Math.max(8, 9 * scale)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('Обитаемая зона', center.x, center.y - habitableOuter - 5 * scale);

  }, [dimensions, getCenter, getScale, getPlanetPosition, showOrbits, showLabels, hoveredPlanet, selectedPlanet, sphereMusicEnabled, probe]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;

    const animate = () => {
      if (!isPaused) {
        timeRef.current += 16 * speed;
        planets.forEach((planet, i) => {
          const angularSpeed = (2 * Math.PI) / (planet.orbitalPeriod * 2);
          anglesRef.current[i] += angularSpeed * speed;
        });
        
        frameCount++;
        if (frameCount % 3 === 0) {
          onPlanetPositionUpdate([...anglesRef.current]);
        }
        
        if (frameCount % 60 === 0) {
          checkAlignment(anglesRef.current);
        }
      }

      draw(ctx);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPaused, speed, draw, onPlanetPositionUpdate, checkAlignment]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scale = getScale();

    let found: Planet | null = null;
    planets.forEach((planet, i) => {
      const pos = getPlanetPosition(planet, anglesRef.current[i]);
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      if (dist < planet.displayRadius * scale + 12) {
        found = planet;
      }
    });

    onPlanetHover(found);
    canvas.style.cursor = found ? 'pointer' : 'default';
  }, [getScale, getPlanetPosition, onPlanetHover]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scale = getScale();

    planets.forEach((planet, i) => {
      const pos = getPlanetPosition(planet, anglesRef.current[i]);
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      if (dist < planet.displayRadius * scale + 12) {
        onPlanetClick(planet);
      }
    });
  }, [getScale, getPlanetPosition, onPlanetClick]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      className="w-full h-full"
    />
  );
}

// Color utility functions
function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00FF) + amount);
  const b = Math.min(255, (num & 0x0000FF) + amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
  const b = Math.max(0, (num & 0x0000FF) - amount);
  return `rgb(${r}, ${g}, ${b})`;
}
