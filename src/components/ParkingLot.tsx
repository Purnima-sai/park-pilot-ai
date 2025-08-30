import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Square, Triangle, ArrowUp, ArrowDown } from 'lucide-react';

interface ParkingLotProps {
  isActive: boolean;
  currentPhase: 'scanning' | 'planning' | 'executing' | 'completed';
  scenario: 'parallel' | 'perpendicular' | 'angled';
}

interface CarPosition {
  x: number;
  y: number;
  rotation: number;
  speed: number;
  gear: 'forward' | 'reverse' | 'park';
}

interface TrajectoryPoint {
  x: number;
  y: number;
  rotation: number;
  speed: number;
  gear: 'forward' | 'reverse' | 'park';
  action: string;
}

export const ParkingLot: React.FC<ParkingLotProps> = ({ isActive, currentPhase, scenario }) => {
  const [carPosition, setCarPosition] = useState<CarPosition>({ 
    x: 20, y: 80, rotation: 0, speed: 0, gear: 'park' 
  });
  const [trajectoryPoints, setTrajectoryPoints] = useState<TrajectoryPoint[]>([]);
  const [currentTrajectoryIndex, setCurrentTrajectoryIndex] = useState(0);
  const [isReversing, setIsReversing] = useState(false);
  const [currentAction, setCurrentAction] = useState('');
  const animationRef = useRef<NodeJS.Timeout>();

  // Generate optimized trajectory with faster waypoints
  const generateAdvancedTrajectory = (scenario: string): TrajectoryPoint[] => {
    const trajectories = {
      parallel: [
        // Faster approach phase
        { x: 30, y: 70, rotation: 0, speed: 1.0, gear: 'forward' as const, action: 'Fast approach to parking area' },
        { x: 45, y: 55, rotation: 0, speed: 0.8, gear: 'forward' as const, action: 'Positioning for maneuver' },
        
        // Quick reverse phase with precise steering
        { x: 42, y: 50, rotation: -20, speed: 0.7, gear: 'reverse' as const, action: 'Beginning reverse maneuver' },
        { x: 35, y: 45, rotation: -30, speed: 0.6, gear: 'reverse' as const, action: 'Steering into space' },
        { x: 30, y: 42, rotation: -15, speed: 0.4, gear: 'reverse' as const, action: 'Straightening position' },
        
        // Quick final adjustment
        { x: 32, y: 40, rotation: 0, speed: 0.3, gear: 'forward' as const, action: 'Final positioning' },
        { x: 30, y: 40, rotation: 0, speed: 0, gear: 'park' as const, action: 'Parking complete' }
      ],
      
      perpendicular: [
        // Direct approach
        { x: 35, y: 70, rotation: 0, speed: 1.0, gear: 'forward' as const, action: 'Fast approach' },
        { x: 55, y: 65, rotation: 30, speed: 0.8, gear: 'forward' as const, action: 'Beginning turn' },
        { x: 65, y: 55, rotation: 70, speed: 0.6, gear: 'forward' as const, action: 'Turning into space' },
        { x: 70, y: 50, rotation: 90, speed: 0, gear: 'park' as const, action: 'Parking complete' }
      ],
      
      angled: [
        // Smooth angled approach - faster
        { x: 35, y: 70, rotation: 15, speed: 1.0, gear: 'forward' as const, action: 'Angled approach' },
        { x: 50, y: 60, rotation: 30, speed: 0.8, gear: 'forward' as const, action: 'Adjusting angle' },
        { x: 62, y: 48, rotation: 45, speed: 0.4, gear: 'forward' as const, action: 'Entering space' },
        { x: 65, y: 45, rotation: 45, speed: 0, gear: 'park' as const, action: 'Parking complete' }
      ]
    };
    
    return trajectories[scenario as keyof typeof trajectories] || trajectories.parallel;
  };

  // Advanced physics-based movement animation
  useEffect(() => {
    if (isActive && currentPhase === 'executing') {
      const trajectory = generateAdvancedTrajectory(scenario);
      setTrajectoryPoints(trajectory);
      setCurrentTrajectoryIndex(0);
      
      const animateMovement = () => {
        setCurrentTrajectoryIndex(prevIndex => {
          if (prevIndex >= trajectory.length - 1) {
            return prevIndex;
          }
          
          const currentTarget = trajectory[prevIndex + 1];
          setCurrentAction(currentTarget.action);
          setIsReversing(currentTarget.gear === 'reverse');
          
          // Enhanced physics-based interpolation with faster movement
          setCarPosition(prev => {
            const dx = currentTarget.x - prev.x;
            const dy = currentTarget.y - prev.y;
            const dr = currentTarget.rotation - prev.rotation;
            
            // Calculate distance to target
            const distance = Math.sqrt(dx * dx + dy * dy);
            const rotationDiff = Math.abs(dr);
            
            // Enhanced speed control - much faster movement
            const targetSpeed = currentTarget.speed;
            const acceleration = 0.25; // Increased from 0.05 for faster acceleration
            
            let newSpeed = prev.speed;
            if (Math.abs(newSpeed - targetSpeed) > 0.01) {
              newSpeed += (targetSpeed - newSpeed) * acceleration;
            }
            
            // Adaptive movement - faster when far, precise when close
            let moveMultiplier = 8; // Increased base movement speed
            if (distance < 5) {
              moveMultiplier = 12; // Even faster for close targets
            } else if (distance < 2) {
              moveMultiplier = 15; // Maximum speed for very close targets
            }
            
            const moveDistance = (newSpeed + 0.3) * moveMultiplier; // Minimum base speed
            
            // Direct movement towards target with improved accuracy
            let newX = prev.x;
            let newY = prev.y;
            
            if (distance > 0.5) { // Move if not very close
              const normalizedDx = (dx / distance) * moveDistance;
              const normalizedDy = (dy / distance) * moveDistance;
              
              // Prevent overshooting
              if (Math.abs(normalizedDx) > Math.abs(dx)) {
                newX = currentTarget.x;
              } else {
                newX = prev.x + normalizedDx;
              }
              
              if (Math.abs(normalizedDy) > Math.abs(dy)) {
                newY = currentTarget.y;
              } else {
                newY = prev.y + normalizedDy;
              }
            } else {
              // Snap to target when very close
              newX = currentTarget.x;
              newY = currentTarget.y;
            }
            
            // Enhanced rotation with adaptive speed
            let rotationSpeed = 0.4; // Increased from 0.15
            if (currentTarget.gear === 'reverse') {
              rotationSpeed = 0.35; // Slightly slower for reverse but still fast
            }
            
            // Faster rotation when difference is large
            if (rotationDiff > 20) {
              rotationSpeed = 0.6;
            } else if (rotationDiff < 5) {
              rotationSpeed = 0.8; // Very fast for small adjustments
            }
            
            let newRotation = prev.rotation;
            if (Math.abs(dr) > 1) {
              newRotation = prev.rotation + dr * rotationSpeed;
            } else {
              // Snap to target rotation when very close
              newRotation = currentTarget.rotation;
            }
            
            // Check if we've reached the current target
            const reachedPosition = distance < 1.5 && rotationDiff < 3;
            
            if (reachedPosition) {
              // Move to next waypoint immediately
              setTimeout(() => {
                setCurrentTrajectoryIndex(index => Math.min(index + 1, trajectory.length - 1));
              }, 50);
            }
            
            return {
              x: newX,
              y: newY,
              rotation: newRotation,
              speed: newSpeed,
              gear: currentTarget.gear
            };
          });
          
          return prevIndex;
        });
      };
      
      // Faster animation frame rate for smoother movement
      animationRef.current = setInterval(animateMovement, 60); // Reduced from 150ms
      
      return () => {
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
      };
    } else if (!isActive) {
      setCarPosition({ x: 20, y: 80, rotation: 0, speed: 0, gear: 'park' });
      setTrajectoryPoints([]);
      setCurrentTrajectoryIndex(0);
      setCurrentAction('');
      setIsReversing(false);
    }
  }, [isActive, currentPhase, scenario]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

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
    { 
      x: carPosition.x + Math.cos((carPosition.rotation - 90) * Math.PI / 180) * 12, 
      y: carPosition.y + Math.sin((carPosition.rotation - 90) * Math.PI / 180) * 12, 
      radius: isReversing ? 15 : 20, 
      type: 'front',
      active: !isReversing 
    },
    { 
      x: carPosition.x - Math.cos((carPosition.rotation - 90) * Math.PI / 180) * 12, 
      y: carPosition.y - Math.sin((carPosition.rotation - 90) * Math.PI / 180) * 12, 
      radius: isReversing ? 25 : 18, 
      type: 'rear',
      active: isReversing 
    },
    { 
      x: carPosition.x + Math.cos((carPosition.rotation) * Math.PI / 180) * 12, 
      y: carPosition.y + Math.sin((carPosition.rotation) * Math.PI / 180) * 12, 
      radius: 15, 
      type: 'left',
      active: true 
    },
    { 
      x: carPosition.x - Math.cos((carPosition.rotation) * Math.PI / 180) * 12, 
      y: carPosition.y - Math.sin((carPosition.rotation) * Math.PI / 180) * 12, 
      radius: 15, 
      type: 'right',
      active: true 
    }
  ];

  return (
    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Square className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Parking Environment</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={currentPhase === 'completed' ? 'default' : 'secondary'}>
            {scenario.toUpperCase()} PARKING
          </Badge>
          {isActive && (
            <Badge variant={isReversing ? 'destructive' : 'default'} className="animate-pulse">
              {carPosition.gear.toUpperCase()}
            </Badge>
          )}
        </div>
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

        {/* Advanced Sensor Ranges with realistic positioning */}
        {isActive && sensorRanges.map((sensor, index) => (
          <div
            key={index}
            className={`absolute rounded-full border-2 transition-all duration-300 ${
              sensor.active 
                ? 'border-primary/40 bg-primary/10 animate-pulse' 
                : 'border-muted/20 bg-muted/5'
            } ${
              currentPhase === 'scanning' ? 'animate-pulse-glow' : ''
            }`}
            style={{
              left: `${Math.max(0, Math.min(100, sensor.x - sensor.radius))}%`,
              top: `${Math.max(0, Math.min(100, sensor.y - sensor.radius))}%`,
              width: `${sensor.radius * 2}%`,
              height: `${sensor.radius * 2}%`,
            }}
          />
        ))}

        {/* Enhanced Trajectory Path with speed indicators */}
        {trajectoryPoints.length > 0 && (
          <svg className="absolute inset-0 w-full h-full">
            {/* Main trajectory line */}
            <path
              d={`M ${trajectoryPoints.map(p => `${p.x}% ${p.y}%`).join(' L ')}`}
              fill="none"
              stroke="hsl(var(--trajectory))"
              strokeWidth="3"
              strokeDasharray="8,4"
              className="animate-pulse opacity-70"
            />
            {/* Speed and direction indicators */}
            {trajectoryPoints.map((point, index) => (
              <g key={index}>
                <circle 
                  cx={`${point.x}%`} 
                  cy={`${point.y}%`} 
                  r="2" 
                  fill={point.gear === 'reverse' ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
                  className={index <= currentTrajectoryIndex ? 'animate-pulse' : 'opacity-30'}
                />
                {index < trajectoryPoints.length - 1 && point.gear === 'reverse' && (
                  <text 
                    x={`${point.x}%`} 
                    y={`${point.y - 3}%`} 
                    fontSize="8" 
                    fill="hsl(var(--destructive))" 
                    textAnchor="middle"
                    className="font-mono"
                  >
                    R
                  </text>
                )}
              </g>
            ))}
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

        {/* Enhanced AI Car with realistic movement */}
        <div
          className="absolute transition-all duration-200 ease-out"
          style={{
            left: `${carPosition.x}%`,
            top: `${carPosition.y}%`,
            transform: `translate(-50%, -50%) rotate(${carPosition.rotation}deg)`,
          }}
        >
          {/* Car body with enhanced styling */}
          <div className={`relative w-8 h-4 rounded-sm shadow-lg flex items-center justify-center transition-all duration-300 ${
            isActive ? 'animate-pulse-glow' : ''
          } ${
            isReversing 
              ? 'bg-destructive border-2 border-destructive-foreground' 
              : 'bg-primary border-2 border-primary-foreground'
          }`}>
            <Car className="w-3 h-3 text-white" />
            
            {/* Speed indicator */}
            {isActive && carPosition.speed > 0 && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-black/70 text-white text-xs px-1 rounded">
                  {(carPosition.speed * 10).toFixed(1)} km/h
                </div>
              </div>
            )}
          </div>
          
          {/* Direction indicators */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            {isReversing ? (
              <ArrowDown className="w-3 h-3 text-destructive animate-bounce" />
            ) : (
              <ArrowUp className="w-3 h-3 text-primary animate-bounce" />
            )}
          </div>
          
          {/* Tire marks for reverse maneuvers */}
          {isReversing && carPosition.speed > 0 && (
            <div className="absolute w-1 h-6 bg-muted-foreground/30 rounded"
                 style={{ 
                   left: '10%', 
                   top: '100%',
                   transform: 'rotate(45deg)'
                 }} 
            />
          )}
        </div>

        {/* Advanced Status Overlays */}
        <div className="absolute top-2 left-2 space-y-1">
          <Badge 
            variant={isActive ? "default" : "outline"}
            className={`text-xs ${isActive ? 'animate-pulse' : ''}`}
          >
            {currentPhase.toUpperCase()}
          </Badge>
          {currentAction && isActive && (
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded max-w-32">
              {currentAction}
            </div>
          )}
        </div>

        {/* Enhanced Distance and Movement Indicators */}
        {isActive && currentPhase === 'executing' && (
          <div className="absolute bottom-2 right-2 space-y-1">
            <div className="text-xs font-mono bg-black/70 text-white px-2 py-1 rounded">
              Speed: {(carPosition.speed * 10).toFixed(1)} km/h
            </div>
            <div className="text-xs font-mono bg-black/70 text-white px-2 py-1 rounded">
              Gear: {carPosition.gear.toUpperCase()}
            </div>
            <div className="text-xs font-mono bg-black/70 text-white px-2 py-1 rounded">
              Progress: {Math.floor((currentTrajectoryIndex / Math.max(trajectoryPoints.length - 1, 1)) * 100)}%
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Legend with movement indicators */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary rounded-sm"></div>
          <span>AI Vehicle (Forward)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-destructive rounded-sm"></div>
          <span>Reversing</span>
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
          <span>Active Sensors</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-1 bg-trajectory border-dashed border border-trajectory"></div>
          <span>Trajectory</span>
        </div>
      </div>
    </Card>
  );
};