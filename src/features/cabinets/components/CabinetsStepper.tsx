import { cn } from '@/lib/utils';
import React from 'react';
import type { StepperProps } from '../types/addCabinet';

export const CabinetsStepper: React.FC<StepperProps> = ({ step, setStep, stepList }) => {
  // Find the index of the active step to determine past/present/future states
  const activeIndex = stepList.findIndex((s) => s.id === step);

  return (
    <div className="flex flex-col items-start font-sans">
      {stepList.map((step, index) => {
        const isCompleted = index < activeIndex;
        const isActive = index === activeIndex;
        const isLast = index === stepList.length - 1;

        // Visual configurations based on current state
        let circleClass = "";
        let lineClass = "bg-border";

        if (isCompleted) {
          // Completed State: Filled Red
          circleClass = "bg-error text-white border-error";
          lineClass = "bg-error"; 
        } else if (isActive) {
          // Active State: Outline Red
          circleClass = "bg-white text-error border-2 border-error font-semibold";
        } else {
          // Upcoming State: Light Grey Outline
          circleClass = "bg-white border-2 border-border";
        }

        return (
          <div 
            key={step.id} 
            className={cn(`flex flex-col w-full text-xs text-accent-dark ${setStep ? 'cursor-pointer select-none' : ''}`)}
            onClick={() => setStep?.(step.id)}
          >
            {/* Step Row */}
            <div className="flex items-center gap-2.5">
              {/* Indicator Circle */}
              <div className={cn(`flex items-center justify-center size-7.5 rounded-full transition-colors duration-200 ${circleClass}`)}>
                {index + 1}
              </div>
              
              {/* Label */}
              <span>{step.label}</span>
            </div>

            {/* Connecting Vertical Line */}
            {!isLast && (
              <div className="pl-3.5">
                <div className={`w-[2px] h-6 transition-colors duration-200 ${lineClass}`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};