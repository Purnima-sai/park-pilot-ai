import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SensorPanel } from './SensorPanel';
import { ParkingLot } from './ParkingLot';
import { PEASFramework } from './PEASFramework';
import { AIDecisionPanel } from './AIDecisionPanel';
import { Car, Settings, Play, Pause, RotateCcw } from 'lucide-react';

export const ParkingAI = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'scanning' | 'planning' | 'executing' | 'completed'>('scanning');
  const [selectedScenario, setSelectedScenario] = useState<'parallel' | 'perpendicular' | 'angled'>('parallel');

  useEffect(() => {
    if (isActive) {
      const phases = ['scanning', 'planning', 'executing', 'completed'] as const;
      let phaseIndex = 0;
      
      const interval = setInterval(() => {
        phaseIndex = (phaseIndex + 1) % phases.length;
        setCurrentPhase(phases[phaseIndex]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentPhase('scanning');
  };

  const handleStop = () => {
    setIsActive(false);
    setCurrentPhase('scanning');
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase('scanning');
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Park Pilot AI
              </h1>
              <p className="text-muted-foreground">Autonomous Parking Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={isActive ? "default" : "secondary"}
              className={isActive ? "animate-pulse-glow" : ""}
            >
              {isActive ? "ACTIVE" : "STANDBY"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* Settings */}}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Control Panel */}
        <Card className="p-4 border-border/50 bg-card/50 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  onClick={isActive ? handleStop : handleStart}
                  variant={isActive ? "destructive" : "default"}
                  className="flex items-center gap-2"
                >
                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isActive ? "Stop" : "Start"} Parking
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Scenario:</span>
                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value as any)}
                  className="bg-secondary border border-border rounded px-3 py-1 text-sm"
                >
                  <option value="parallel">Parallel Parking</option>
                  <option value="perpendicular">Perpendicular Parking</option>
                  <option value="angled">Angled Parking</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current Phase</div>
                <div className="font-semibold capitalize text-primary">{currentPhase}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Sensors & PEAS */}
        <div className="space-y-6">
          <SensorPanel isActive={isActive} currentPhase={currentPhase} />
          <PEASFramework currentPhase={currentPhase} />
        </div>

        {/* Center Column - Parking Lot */}
        <div className="lg:col-span-1">
          <ParkingLot 
            isActive={isActive} 
            currentPhase={currentPhase} 
            scenario={selectedScenario}
          />
        </div>

        {/* Right Column - AI Decision Panel */}
        <div>
          <AIDecisionPanel 
            isActive={isActive} 
            currentPhase={currentPhase}
            scenario={selectedScenario}
          />
        </div>
      </div>
    </div>
  );
};