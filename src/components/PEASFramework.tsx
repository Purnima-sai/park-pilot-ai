import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Globe, Settings, Radar, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';

interface PEASFrameworkProps {
  currentPhase: 'scanning' | 'planning' | 'executing' | 'completed';
}

export const PEASFramework: React.FC<PEASFrameworkProps> = ({ currentPhase }) => {
  const peasComponents = [
    {
      title: 'Performance',
      icon: Target,
      description: 'Measure success metrics',
      metrics: [
        { name: 'Parking Accuracy', value: currentPhase === 'completed' ? 95 : 0, unit: '%' },
        { name: 'Time Efficiency', value: currentPhase === 'completed' ? 88 : 0, unit: '%' },
        { name: 'Safety Score', value: currentPhase === 'completed' ? 98 : 0, unit: '%' }
      ],
      color: 'text-sensor-active'
    },
    {
      title: 'Environment',
      icon: Globe,
      description: 'Parking lot conditions',
      metrics: [
        { name: 'Space Detection', value: currentPhase !== 'scanning' ? 92 : 0, unit: '%' },
        { name: 'Obstacle Mapping', value: currentPhase !== 'scanning' ? 96 : 0, unit: '%' },
        { name: 'Weather Conditions', value: 85, unit: '%' }
      ],
      color: 'text-primary'
    },
    {
      title: 'Actuators',
      icon: Settings,
      description: 'Vehicle control systems',
      metrics: [
        { name: 'Steering Control', value: currentPhase === 'executing' ? 90 : 0, unit: '%' },
        { name: 'Speed Control', value: currentPhase === 'executing' ? 88 : 0, unit: '%' },
        { name: 'Brake System', value: currentPhase === 'executing' ? 100 : 0, unit: '%' }
      ],
      color: 'text-sensor-warning'
    },
    {
      title: 'Sensors',
      icon: Radar,
      description: 'Data collection systems',
      metrics: [
        { name: 'Camera Feed', value: currentPhase !== 'completed' ? 94 : 0, unit: '%' },
        { name: 'Ultrasonic Array', value: currentPhase !== 'completed' ? 91 : 0, unit: '%' },
        { name: 'Radar Coverage', value: currentPhase !== 'completed' ? 89 : 0, unit: '%' }
      ],
      color: 'text-accent'
    }
  ];

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'scanning': return Activity;
      case 'planning': return Target;
      case 'executing': return Settings;
      case 'completed': return CheckCircle2;
      default: return AlertTriangle;
    }
  };

  const PhaseIcon = getPhaseIcon(currentPhase);

  return (
    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
      <div className="flex items-center gap-2 mb-4">
        <PhaseIcon className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">PEAS Framework</h2>
        <Badge variant="outline" className="ml-auto">
          AI Agent Model
        </Badge>
      </div>

      <div className="space-y-4">
        {peasComponents.map((component, index) => {
          const Icon = component.icon;
          const isActive = 
            (component.title === 'Sensors' && ['scanning', 'planning', 'executing'].includes(currentPhase)) ||
            (component.title === 'Environment' && ['planning', 'executing', 'completed'].includes(currentPhase)) ||
            (component.title === 'Actuators' && currentPhase === 'executing') ||
            (component.title === 'Performance' && currentPhase === 'completed');

          return (
            <div 
              key={component.title}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                isActive 
                  ? 'border-primary/50 bg-primary/5 shadow-lg' 
                  : 'border-border/30 bg-secondary/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-4 h-4 ${isActive ? component.color : 'text-muted-foreground'}`} />
                <span className="font-semibold text-sm">{component.title}</span>
                {isActive && (
                  <Badge variant="default" className="ml-auto text-xs animate-pulse">
                    ACTIVE
                  </Badge>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mb-3">{component.description}</p>
              
              <div className="space-y-2">
                {component.metrics.map((metric) => (
                  <div key={metric.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{metric.name}</span>
                      <span className="font-mono">{metric.value}{metric.unit}</span>
                    </div>
                    <Progress 
                      value={metric.value} 
                      className="h-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Phase Progress */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm text-muted-foreground">
            {currentPhase === 'scanning' ? '25%' : 
             currentPhase === 'planning' ? '50%' : 
             currentPhase === 'executing' ? '75%' : '100%'}
          </span>
        </div>
        <Progress 
          value={
            currentPhase === 'scanning' ? 25 : 
            currentPhase === 'planning' ? 50 : 
            currentPhase === 'executing' ? 75 : 100
          } 
          className="h-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Start</span>
          <span>Parked</span>
        </div>
      </div>
    </Card>
  );
};