declare module 'react-step-progress-bar' {
    interface ProgressBarProps {
      startingStep: number;
      steps: number;
      stepWidth: number;
      labelAlignment: string;
      activeColor: string;
      completeColor: string;
      uncompletedColor: string;
      onChange: (step: number) => void;
    }
  
    const ProgressBar: React.FC<ProgressBarProps>;
  
    export { ProgressBar };
  }
  