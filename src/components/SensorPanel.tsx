import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Radar, Camera, Waves, Eye } from 'lucide-react';

interface SensorPanelProps {
  isActive: boolean;
  currentPhase: 'scanning' | 'planning' | 'executing' | 'completed';
}

export const SensorPanel: React.FC<SensorPanelProps> = ({ isActive, currentPhase }) => {
  const sensors = [
    {
      name: 'Front Ultrasonic',
      icon: Waves,
      distance: isActive ? Math.floor(Math.random() * 200 + 50) : 0,
      status: isActive ? (currentPhase === 'executing' ? 'warning' : 'active') : 'inactive',
      range: 250
    },
    {
      name: 'Rear Camera',
      icon: Camera,
      distance: isActive ? Math.floor(Math.random() * 150 + 30) : 0,
      status: isActive ? 'active' : 'inactive',
      range: 200
    },
    {
      name: 'Side Radar',
      icon: Radar,
      distance: isActive ? Math.floor(Math.random() * 180 + 40) : 0,
      status: isActive ? (currentPhase === 'scanning' ? 'active' : 'monitoring') : 'inactive',
      range: 300
    },
    {
      name: 'Surround View',
      icon: Eye,
      distance: isActive ? Math.floor(Math.random() * 100 + 20) : 0,
      status: isActive ? 'active' : 'inactive',
      range: 150
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-sensor-active';
      case 'warning': return 'text-sensor-warning';
      case 'monitoring': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'warning': return 'destructive';
      case 'monitoring': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
      <div className="flex items-center gap-2 mb-4">
        <Radar className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Sensor Array</h2>
        {isActive && (
          <Badge variant="default" className="ml-auto animate-pulse">
            SCANNING
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        {sensors.map((sensor, index) => {
          const Icon = sensor.icon;
          const distancePercentage = (sensor.distance / sensor.range) * 100;
          
          return (
            <div key={sensor.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${getStatusColor(sensor.status)}`} />
                  <span className="text-sm font-medium">{sensor.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {sensor.distance}cm
                  </span>
                  <Badge 
                    variant={getStatusBadge(sensor.status)}
                    className="text-xs"
                  >
                    {sensor.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="relative">
                <Progress 
                  value={distancePercentage} 
                  className="h-2"
                />
                {isActive && sensor.status === 'active' && (
                  <div 
                    className="absolute top-0 h-2 w-8 bg-primary/30 animate-scan"
                    style={{ borderRadius: 'inherit' }}
                  />
                )}
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0cm</span>
                <span>{sensor.range}cm</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sensor Status Summary */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-sensor-active">
              {sensors.filter(s => s.status === 'active').length}
            </div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-sensor-warning">
              {sensors.filter(s => s.status === 'warning').length}
            </div>
            <div className="text-xs text-muted-foreground">Warnings</div>
          </div>
        </div>
      </div>
    </Card>
  );
};