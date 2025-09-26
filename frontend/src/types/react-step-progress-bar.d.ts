declare module 'react-step-progress-bar' {
    interface ProgressBarProps {
      startingStep: number;
      steps: number;
      stepWidth: number;
      labelAlignment: string;
      activeColor: string;
      completeColor: string;
      uncompletedColor: string;
      onChange: (step: number) => void; // Agregamos la propiedad 'onChange'
    }
  
    const ProgressBar: React.FC<ProgressBarProps>;
  
    export { ProgressBar };
  }
  