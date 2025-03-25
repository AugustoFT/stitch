
import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const useCountdownTimer = (initialTimeLeft: TimeLeft) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(initialTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newSeconds = prev.seconds - 1;
        
        if (newSeconds < 0) {
          const newMinutes = prev.minutes - 1;
          
          if (newMinutes < 0) {
            const newHours = prev.hours - 1;
            
            if (newHours < 0) {
              const newDays = prev.days - 1;
              return {
                days: Math.max(0, newDays),
                hours: newDays < 0 ? 0 : 23,
                minutes: newDays < 0 && newHours < 0 ? 0 : 59,
                seconds: newDays < 0 && newHours < 0 && newMinutes < 0 ? 0 : 59
              };
            }
            
            return {
              ...prev,
              hours: newHours,
              minutes: 59,
              seconds: 59
            };
          }
          
          return {
            ...prev,
            minutes: newMinutes,
            seconds: 59
          };
        }
        
        return {
          ...prev,
          seconds: newSeconds
        };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return timeLeft;
};
