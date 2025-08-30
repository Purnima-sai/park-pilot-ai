import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Square, Triangle } from 'lucide-react';

interface ParkingLotProps {
  isActive: boolean;
  currentPhase: 'scanning' | 'planning' | 'executing' | 'completed';
  scenario: 'parallel' | 'perpendicular' | 'angled';
}

export const ParkingLot: React.FC<ParkingLotProps> = ({ isActive, currentPhase, scenario }) => {
  const [carPosition, setCarPosition] = useState({ x: 20, y: 80, rotation: 0 });
  const [trajectoryPoints, setTrajectoryPoints] = useState<{x: number, y: number}[]>([]);

  useEffect(() => {
    if (isActive && currentPhase === 'executing') {
      const targetPositions = {
        parallel: { x: 50, y: 40, rotation: 0 },
        perpendicular: { x: 70, y: 50, rotation: 90 },
        angled: { x: 65, y: 45, rotation: 45 }
      };

      const target = targetPositions[scenario];
      
      // Generate trajectory path
      const steps = 20;
      const trajectory = [];
      for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        const x = carPosition.x + (target.x - carPosition.x) * progress;
        const y = carPosition.y + (target.y - carPosition.y) * progress;
        trajectory.push({ x, y });
      }
      setTrajectoryPoints(trajectory);

      // Animate car movement
      const interval = setInterval(() => {
        setCarPosition(prev => {
          const dx = target.x - prev.x;
          const dy = target.y - prev.y;
          const dr = target.rotation - prev.rotation;
          
          if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(dr) < 5) {
            return target;
          }
          
          return {
            x: prev.x + dx * 0.1,
            y: prev.y + dy * 0.1,
            rotation: prev.rotation + dr * 0.1
          };
        });
      }, 100);

      return () => clearInterval(interval);
    } else if (!isActive) {
      setCarPosition({ x: 20, y: 80, rotation: 0 });
      setTrajectoryPoints([]);
    }
  }, [isActive, currentPhase, scenario]);

  const obstacles = [
    { x: 30, y: 20, width: 15, height: 8, type: 'car' },
    { x: 70, y: 20, width: 15, height: 8, type: 'car' },
    { x: 10, y: 60, width: 8, height: 8, type: 'post' },
    { x: 90, y: 60, width: 8, height: 8, type: 'post' }
  ];

  const parkingSpaces = [
    { x: 45, y: 35, width: 20, height: 12, available: true },
    { x: 65, y: 70, width: 15, height: 20, available: true },
    { x: 75, y: 35, width: 18, height: 15, available: false }
  ];

  const sensorRanges = [
    { x: carPosition.x, y: carPosition.y - 15, radius: 20, type: 'front' },
    { x: carPosition.x, y: carPosition.y + 15, radius: 25, type: 'rear' },
    { x: carPosition.x - 15, y: carPosition.y, radius: 18, type: 'left' },
    { x: carPosition.x + 15, y: carPosition.y, radius: 18, type: 'right' }
  ];

  return (
    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Square className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Parking Environment</h2>
        </div>
        <Badge variant={currentPhase === 'completed' ? 'default' : 'secondary'}>
          {scenario.toUpperCase()} PARKING
        </Badge>
      </div>

      {/* Parking Lot Visualization */}
      <div className="relative w-full h-80 bg-secondary/30 rounded-lg border border-border/30 overflow-hidden">
        
        {/* Grid Background */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Sensor Ranges */}
        {isActive && sensorRanges.map((sensor, index) => (
          <div
            key={index}
            className={`absolute rounded-full border-2 border-primary/20 bg-primary/5 ${
              currentPhase === 'scanning' ? 'animate-pulse' : ''
            }`}
            style={{
              left: `${sensor.x - sensor.radius}%`,
              top: `${sensor.y - sensor.radius}%`,
              width: `${sensor.radius * 2}%`,
              height: `${sensor.radius * 2}%`,
            }}
          />
        ))}

        {/* Trajectory Path */}
        {trajectoryPoints.length > 0 && (
          <svg className="absolute inset-0 w-full h-full">
            <path
              d={`M ${trajectoryPoints.map(p => `${p.x}% ${p.y}%`).join(' L ')}`}
              fill="none"
              stroke="hsl(var(--trajectory))"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          </svg>
        )}

        {/* Parking Spaces */}
        {parkingSpaces.map((space, index) => (
          <div
            key={index}
            className={`absolute border-2 border-dashed ${
              space.available 
                ? 'border-safe-zone/60 bg-safe-zone/10' 
                : 'border-destructive/60 bg-destructive/10'
            }`}
            style={{
              left: `${space.x}%`,
              top: `${space.y}%`,
              width: `${space.width}%`,
              height: `${space.height}%`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-mono opacity-60">
                {space.available ? 'FREE' : 'OCCUPIED'}
              </span>
            </div>
          </div>
        ))}

        {/* Obstacles */}
        {obstacles.map((obstacle, index) => (
          <div
            key={index}
            className={`absolute ${
              obstacle.type === 'car' 
                ? 'bg-obstacle/80 border border-obstacle rounded-sm' 
                : 'bg-muted border border-border rounded-full'
            }`}
            style={{
              left: `${obstacle.x}%`,
              top: `${obstacle.y}%`,
              width: `${obstacle.width}%`,
              height: `${obstacle.height}%`,
            }}
          >
            {obstacle.type === 'car' && (
              <div className="flex items-center justify-center h-full">
                <Car className="w-3 h-3 text-destructive-foreground" />
              </div>
            )}
          </div>
        ))}

        {/* AI Car */}
        <div
          className="absolute transition-all duration-300 ease-out"
          style={{
            left: `${carPosition.x}%`,
            top: `${carPosition.y}%`,
            transform: `translate(-50%, -50%) rotate(${carPosition.rotation}deg)`,
          }}
        >
          <div className={`w-8 h-4 bg-primary rounded-sm shadow-lg flex items-center justify-center ${
            isActive ? 'animate-pulse-glow' : ''
          }`}>
            <Car className="w-3 h-3 text-primary-foreground" />
          </div>
          
          {/* Direction indicator */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-primary" />
        </div>

        {/* Phase Status Overlay */}
        <div className="absolute top-2 left-2">
          <Badge 
            variant={isActive ? "default" : "outline"}
            className={`text-xs ${isActive ? 'animate-pulse' : ''}`}
          >
            {currentPhase.toUpperCase()}
          </Badge>
        </div>

        {/* Distance Indicators */}
        {isActive && currentPhase === 'executing' && (
          <div className="absolute bottom-2 right-2 text-xs font-mono bg-black/50 text-white px-2 py-1 rounded">
            Distance to target: {Math.floor(Math.sqrt(
              Math.pow(carPosition.x - 50, 2) + Math.pow(carPosition.y - 40, 2)
            ))}%
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary rounded-sm"></div>
          <span>AI Vehicle</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-safe-zone/60 border border-safe-zone border-dashed"></div>
          <span>Available Space</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-obstacle/80 rounded-sm"></div>
          <span>Obstacle</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border-2 border-primary/20 rounded-full"></div>
          <span>Sensor Range</span>
        </div>
      </div>
    </Card>
  );
};