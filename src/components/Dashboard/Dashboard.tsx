import React from 'react';
import { Users, Apple, Droplets, DollarSign, AlertTriangle, Calendar, Target, Shield } from 'lucide-react';
import { usePrepper } from '../../context/PrepperContext';
import { calculateSustainabilityMetrics, calculateWaterNeedsWithSafetyMargin, calculatePreparednessStatus, getPreparednessStatusColor, getPreparednessStatusBgColor } from '../../utils/calculations';
import MetricCard from './MetricCard';
import WarningsList from './WarningsList';
import HouseholdSummary from './HouseholdSummary';

export default function Dashboard() {
  const { state } = usePrepper();
  const { inventory, household, settings, rationingScenarios } = state;

  const metrics = calculateSustainabilityMetrics(inventory, household, rationingScenarios, settings);
  
  const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.cost || 0) * item.quantity, 0);
  const totalItems = inventory.length;
  
  const foodItems = inventory.filter(item => item.category.startsWith('Food'));
  const waterItems = inventory.filter(item => item.category === 'Water');
  const totalWaterGallons = waterItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate water needs with safety margin
  const dailyWaterWithMargin = calculateWaterNeedsWithSafetyMargin(household, settings);
  const baseDailyWater = household.reduce((sum, member) => sum + member.dailyWaterLiters, 0);
  
  // Convert gallons to liters for calculation
  const totalWaterLiters = totalWaterGallons * 3.78541;
  const waterDaysWithMargin = dailyWaterWithMargin > 0 ? Math.floor(totalWaterLiters / dailyWaterWithMargin) : 0;
  const waterDaysWithoutMargin = baseDailyWater > 0 ? Math.floor(totalWaterLiters / baseDailyWater) : 0;
  
  // Calculate preparedness status
  const preparednessStatus = calculatePreparednessStatus(metrics.normalUsageDays, settings.preparednessGoalDays);
  
  const getStatusColor = (days: number): 'green' | 'yellow' | 'red' => {
    if (days >= settings.preparednessGoalDays) return 'green';
    if (days >= settings.preparednessGoalDays * 0.5) return 'yellow';
    return 'red';
  };

  const selectedScenario = rationingScenarios.find(s => s.id === state.selectedRationingScenario);
  const rationedDays = metrics.rationedUsageDays[state.selectedRationingScenario] || 0;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Preparedness Dashboard</h1>
        <p className="text-slate-600">Monitor your survival readiness and supply sustainability</p>
      </div>

      {/* Preparedness Goal Status */}
      <div className={`rounded-xl border-2 p-6 mb-8 ${getPreparednessStatusBgColor(preparednessStatus.status)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-white/50">
              <Target className={`h-8 w-8 ${getPreparednessStatusColor(preparednessStatus.status)}`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Preparedness Goal Status</h2>
              <p className="text-slate-600">
                {metrics.normalUsageDays} of {settings.preparednessGoalDays} days target
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getPreparednessStatusColor(preparednessStatus.status)}`}>
              {preparednessStatus.percentage.toFixed(1)}%
            </div>
            <div className={`text-sm font-medium capitalize ${getPreparednessStatusColor(preparednessStatus.status)}`}>
              {preparednessStatus.status}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-white/50 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all ${
                preparednessStatus.status === 'excellent' || preparednessStatus.status === 'good' ? 'bg-green-500' :
                preparednessStatus.status === 'adequate' ? 'bg-yellow-500' :
                preparednessStatus.status === 'poor' ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, preparednessStatus.percentage)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Sustainability"
          value={`${metrics.normalUsageDays} days`}
          subtitle={`Goal: ${settings.preparednessGoalDays} days`}
          icon={Users}
          color={getStatusColor(metrics.normalUsageDays)}
        />
        
        <MetricCard
          title="Food Supply"
          value={`${Math.min(...foodItems.map(item => {
            const totalCalories = item.quantity * (item.caloriesPerUnit || 0);
            const dailyNeeds = household.reduce((sum, member) => sum + member.dailyCalories, 0);
            return dailyNeeds > 0 ? Math.floor(totalCalories / (dailyNeeds * (item.usageRatePerPersonPerDay || 1))) : 0;
          }))} days`}
          icon={Apple}
          color={getStatusColor(Math.min(...foodItems.map(item => {
            const totalCalories = item.quantity * (item.caloriesPerUnit || 0);
            const dailyNeeds = household.reduce((sum, member) => sum + member.dailyCalories, 0);
            return dailyNeeds > 0 ? Math.floor(totalCalories / (dailyNeeds * (item.usageRatePerPersonPerDay || 1))) : 0;
          })))}
        />
        
        <MetricCard
          title="Water Supply"
          value={`${waterDaysWithMargin} days`}
          subtitle={`${totalWaterGallons} gallons (${settings.waterSafetyMargin}x margin)`}
          icon={Droplets}
          color={getStatusColor(waterDaysWithMargin)}
        />
        
        <MetricCard
          title="Inventory Value"
          value={`$${totalInventoryValue.toFixed(0)}`}
          subtitle={`${totalItems} total items`}
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Water Safety Margin Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-800">Water Safety Analysis</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-1">Base Water Need</p>
            <p className="text-2xl font-bold text-slate-800">{baseDailyWater.toFixed(1)}L/day</p>
            <p className="text-xs text-slate-500">Without safety margin</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-1">With Safety Margin</p>
            <p className="text-2xl font-bold text-blue-600">{dailyWaterWithMargin.toFixed(1)}L/day</p>
            <p className="text-xs text-blue-500">{settings.waterSafetyMargin}x multiplier</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-1">Safety Buffer</p>
            <p className="text-2xl font-bold text-green-600">{waterDaysWithoutMargin - waterDaysWithMargin} days</p>
            <p className="text-xs text-green-500">Emergency reserve</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Safety Margin:</strong> Your {settings.waterSafetyMargin}x water safety margin accounts for 
            increased consumption during stress, potential contamination, and emergency situations. 
            Without this margin, your water would last {waterDaysWithoutMargin} days instead of {waterDaysWithMargin} days.
          </p>
        </div>
      </div>

      {/* Current Rationing Scenario */}
      {selectedScenario && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Current Scenario: {selectedScenario.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Duration</p>
              <p className="text-2xl font-bold text-slate-800">{rationedDays} days</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Calories per Person</p>
              <p className="text-2xl font-bold text-slate-800">
                {Math.round(metrics.dailyCaloriesPerPerson[state.selectedRationingScenario] || 0)}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Reduction</p>
              <p className="text-2xl font-bold text-slate-800">{selectedScenario.reductionPercentage}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Warnings and Household Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WarningsList warnings={metrics.warningFlags} />
        <HouseholdSummary members={household} />
      </div>
    </div>
  );
}