
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
  ): React.FC<React.ComponentProps<T>> {
    // Create a proper wrapper component that follows React rules
    const WrappedComponent = React.forwardRef<unknown, React.ComponentProps<T>>((props, ref) => {
      // Use layout effect to measure performance as soon as possible
      React.useLayoutEffect(() => {
        PerformanceMonitor.startMeasurement(name);
        return () => {
          PerformanceMonitor.endMeasurement(name);
        };
      }, []);
      
      return React.createElement(Component, { ...props, ref });
    });
    
    WrappedComponent.displayName = `Measured(${name})`;
    return React.memo(WrappedComponent) as React.FC<React.ComponentProps<T>>;
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
