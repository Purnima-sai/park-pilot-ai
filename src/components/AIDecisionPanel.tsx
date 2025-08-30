import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface AIDecisionPanelProps {
  isActive: boolean;
  currentPhase: 'scanning' | 'planning' | 'executing' | 'completed';
  scenario: 'parallel' | 'perpendicular' | 'angled';
}

export const AIDecisionPanel: React.FC<AIDecisionPanelProps> = ({ 
  isActive, 
  currentPhase, 
  scenario 
}) => {
  const [decisions, setDecisions] = useState<{
    id: string;
    action: string;
    confidence: number;
    timestamp: string;
    status: 'processing' | 'completed' | 'warning';
  }[]>([]);

  const [aiMetrics, setAIMetrics] = useState({
    processingSpeed: 0,
    confidence: 0,
    accuracy: 0,
    riskAssessment: 0
  });

  useEffect(() => {
    if (isActive) {
      const phaseDecisions = {
        scanning: [
          { action: 'Analyzing parking environment', confidence: 92 },
          { action: 'Detecting available spaces', confidence: 88 },
          { action: 'Identifying obstacles', confidence: 95 },
          { action: 'Measuring space dimensions', confidence: 87 }
        ],
        planning: [
          { action: 'Calculating optimal trajectory', confidence: 94 },
          { action: 'Planning steering angles', confidence: 91 },
          { action: 'Optimizing approach speed', confidence: 89 },
          { action: 'Validating safety constraints', confidence: 97 }
        ],
        executing: [
          { action: 'Initiating steering maneuver', confidence: 93 },
          { action: 'Adjusting vehicle position', confidence: 88 },
          { action: 'Monitoring clearance distances', confidence: 96 },
          { action: 'Fine-tuning final position', confidence: 91 }
        ],
        completed: [
          { action: 'Parking maneuver completed', confidence: 98 },
          { action: 'Final position validated', confidence: 95 },
          { action: 'Safety checks passed', confidence: 99 },
          { action: 'System ready for next task', confidence: 97 }
        ]
      };

      const currentDecisions = phaseDecisions[currentPhase];
      
      currentDecisions.forEach((decision, index) => {
        setTimeout(() => {
          setDecisions(prev => [...prev, {
            id: `${currentPhase}-${index}`,
            action: decision.action,
            confidence: decision.confidence,
            timestamp: new Date().toLocaleTimeString(),
            status: decision.confidence > 95 ? 'completed' : 
                   decision.confidence < 90 ? 'warning' : 'processing'
          }]);
        }, index * 800);
      });

      // Update AI metrics
      setAIMetrics({
        processingSpeed: Math.floor(Math.random() * 20) + 80,
        confidence: Math.floor(Math.random() * 15) + 85,
        accuracy: Math.floor(Math.random() * 10) + 90,
        riskAssessment: Math.floor(Math.random() * 25) + 10
      });
    } else {
      setDecisions([]);
      setAIMetrics({
        processingSpeed: 0,
        confidence: 0,
        accuracy: 0,
        riskAssessment: 0
      });
    }
  }, [currentPhase, isActive]);

  const scenarioComplexity = {
    parallel: { difficulty: 'High', score: 85 },
    perpendicular: { difficulty: 'Medium', score: 65 },
    angled: { difficulty: 'Low', score: 45 }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'warning': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-sensor-active';
      case 'warning': return 'text-sensor-warning';
      default: return 'text-primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Metrics Card */}
      <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Decision Engine</h2>
          {isActive && (
            <Badge variant="default" className="ml-auto animate-pulse">
              PROCESSING
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing Speed</span>
              <span className="font-mono">{aiMetrics.processingSpeed}%</span>
            </div>
            <Progress value={aiMetrics.processingSpeed} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Confidence</span>
              <span className="font-mono">{aiMetrics.confidence}%</span>
            </div>
            <Progress value={aiMetrics.confidence} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Accuracy</span>
              <span className="font-mono">{aiMetrics.accuracy}%</span>
            </div>
            <Progress value={aiMetrics.accuracy} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Risk Level</span>
              <span className="font-mono">{aiMetrics.riskAssessment}%</span>
            </div>
            <Progress value={aiMetrics.riskAssessment} className="h-2" />
          </div>
        </div>

        {/* Scenario Analysis */}
        <div className="p-3 bg-secondary/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Scenario Complexity</span>
            <Badge variant="outline">
              {scenarioComplexity[scenario].difficulty}
            </Badge>
          </div>
          <Progress value={scenarioComplexity[scenario].score} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Simple</span>
            <span>Complex</span>
          </div>
        </div>
      </Card>

      {/* Decision Log Card */}
      <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Decision Log</h2>
          <Badge variant="outline" className="ml-auto">
            {decisions.length} Decisions
          </Badge>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {decisions.length === 0 && !isActive ? (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">AI system ready for parking task</p>
            </div>
          ) : (
            decisions.map((decision) => {
              const StatusIcon = getStatusIcon(decision.status);
              return (
                <div
                  key={decision.id}
                  className="flex items-start gap-3 p-3 bg-secondary/20 rounded-lg border border-border/30"
                >
                  <StatusIcon className={`w-4 h-4 mt-0.5 ${getStatusColor(decision.status)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{decision.action}</p>
                      <span className="text-xs text-muted-foreground ml-2">
                        {decision.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1">
                        <Progress value={decision.confidence} className="h-1" />
                      </div>
                      <span className="text-xs font-mono">{decision.confidence}%</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Performance Summary */}
        {isActive && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <TrendingUp className="w-4 h-4 mx-auto mb-1 text-sensor-active" />
                <div className="text-sm font-medium">Success Rate</div>
                <div className="text-xs text-muted-foreground">
                  {Math.floor(decisions.filter(d => d.status === 'completed').length / Math.max(decisions.length, 1) * 100)}%
                </div>
              </div>
              <div>
                <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
                <div className="text-sm font-medium">Avg Response</div>
                <div className="text-xs text-muted-foreground">0.2s</div>
              </div>
              <div>
                <AlertCircle className="w-4 h-4 mx-auto mb-1 text-sensor-warning" />
                <div className="text-sm font-medium">Warnings</div>
                <div className="text-xs text-muted-foreground">
                  {decisions.filter(d => d.status === 'warning').length}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};