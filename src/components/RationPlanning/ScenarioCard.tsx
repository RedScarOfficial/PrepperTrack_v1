import React from 'react';
import { Clock, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { RationingScenario, SustainabilityMetrics } from '../../types';

interface ScenarioCardProps {
  scenario: RationingScenario;
  metrics: SustainabilityMetrics;
  isSelected: boolean;
  onSelect: (scenarioId: string) => void;
  householdSize: number;
  minCalories: number;
}

export default function ScenarioCard({
  scenario,
  metrics,
  isSelected,
  onSelect,
  householdSize,
  minCalories,
}: ScenarioCardProps) {
  const duration = metrics.rationedUsageDays[scenario.id] || 0;
  const caloriesPerPerson = metrics.dailyCaloriesPerPerson[scenario.id] || 0;
  const isSafe = caloriesPerPerson >= minCalories;
  
  const getScenarioColor = () => {
    if (scenario.reductionPercentage === 0) return 'border-green-300 bg-green-70';
    if (scenario.reductionPercentage <= 25) return 'border-yellow-300 bg-yellow-70';
    if (scenario.reductionPercentage <= 50) return 'border-orange-300 bg-orange-70';
    return 'border-red-300 bg-red-70';
  };

  return (
    <div
      onClick={() => onSelect(scenario.id)}
      className={`
        p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg
        ${isSelected ? 'ring-2 ring-green-500 ring-offset-2' : ''}
        ${getScenarioColor()}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{scenario.name}</h3>
          <p className="text-sm text-slate-600 mt-1">{scenario.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          {isSafe ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          )}
          {isSelected && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-600">Duration</span>
          </div>
          <span className="font-semibold text-slate-800">{duration} days</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-600">Calories/Person</span>
          </div>
          <span className={`font-semibold ${isSafe ? 'text-green-600' : 'text-red-600'}`}>
            {Math.round(caloriesPerPerson)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Reduction</span>
          <span className="font-semibold text-slate-800">{scenario.reductionPercentage}%</span>
        </div>
      </div>

      {!isSafe && (
        <div className="mt-4 p-3 bg-red-100 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Below Safe Minimum</span>
          </div>
          <p className="text-xs text-red-700 mt-1">
            Caloric intake is below {minCalories} calories per day
          </p>
        </div>
      )}
    </div>
  );
}