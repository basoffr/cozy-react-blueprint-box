
import React, { Profiler } from 'react';

export class PerformanceMonitor {
  private static measurements: Map<string, number> = new Map();
  
  static startMeasurement(name: string) {
    this.measurements.set(name, performance.now());
  }
  
  static endMeasurement(name: string): number {
    const start = this.measurements.get(name);
    if (!start) return 0;
    
    const duration = performance.now() - start;
    console.log(`⚡ Performance: ${name} took ${duration.toFixed(2)}ms`);
    this.measurements.delete(name);
    return duration;
  }
  
  static measureRender<T extends React.ComponentType<any>>(
    Component: T,
    name: string
  ): T {
    return React.memo(React.forwardRef<any, React.ComponentProps<T>>((props, ref) => {
      PerformanceMonitor.startMeasurement(name);
      
      React.useEffect(() => {
        PerformanceMonitor.endMeasurement(name);
      });
      
      return React.createElement(Component, { ...props, ref });
    })) as T;
  }
  
  static logPageLoad(pageName: string) {
    const loadTime = performance.now();
    console.log(`📄 Page Load: ${pageName} - ${loadTime.toFixed(2)}ms`);
  }
}

// React Profiler wrapper
export const ProfiledComponent: React.FC<{
  id: string;
  children: React.ReactNode;
}> = ({ id, children }) => {
  const onRender = (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => {
    console.log(`🔍 Profiler [${id}]:`, {
      phase,
      actualDuration: actualDuration.toFixed(2),
      baseDuration: baseDuration.toFixed(2),
      commitTime: commitTime.toFixed(2)
    });
  };

  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
};
