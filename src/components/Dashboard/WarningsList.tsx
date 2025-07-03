import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { WarningFlag } from '../../types';

interface WarningsListProps {
  warnings: WarningFlag[];
}

export default function WarningsList({ warnings }: WarningsListProps) {
  const getWarningIcon = (type: string) => {
    switch (type) {
      case 'critical': return AlertTriangle;
      case 'warning': return AlertCircle;
      default: return Info;
    }
  };

  const getWarningColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Alerts & Warnings</h2>
      
      {warnings.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-green-600 bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Info className="h-8 w-8" />
          </div>
          <p className="text-slate-600">All systems operational</p>
          <p className="text-sm text-slate-500">No warnings or alerts to display</p>
        </div>
      ) : (
        <div className="space-y-3">
          {warnings.map((warning, index) => {
            const IconComponent = getWarningIcon(warning.type);
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getWarningColor(warning.type)} flex items-start space-x-3`}
              >
                <IconComponent className="h-5 w-5 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">{warning.category}</p>
                  <p className="text-sm opacity-90">{warning.message}</p>
                  {warning.daysRemaining !== undefined && (
                    <p className="text-xs opacity-75 mt-1">
                      {warning.daysRemaining > 0 
                        ? `${warning.daysRemaining} days remaining`
                        : `Expired ${Math.abs(warning.daysRemaining)} days ago`
                      }
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}