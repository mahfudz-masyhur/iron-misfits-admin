import { FC, ReactNode, useState } from 'react'
import NumberStep from './NumberStep'

interface StepperProps {
  steps: string[]
  children: (props: {
    step: string
    steps: { label: string; complite: boolean }[]
    button: { prevStep: () => void; nextStep: () => void; complite: () => void }
  }) => ReactNode
}

const Stepper: FC<StepperProps> = ({ steps, children }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [stepss, setStepss] = useState(steps.map(v => ({ label: v, complite: false })))

  const nextStep = () => {
    setCurrentStep(prevStep => Math.min(prevStep + 1, stepss.length - 1))
  }

  const prevStep = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 0))
  }

  const complite = () => {
    setStepss(prevSteps => prevSteps.map((step, index) => (index === currentStep ? { ...step, complite: true } : step)))
    nextStep()
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='flex items-center justify-center space-x-4'>
        {stepss?.map((step, index) => (
          <NumberStep
            stepName={step.label}
            complite={step.complite}
            currentStep={currentStep}
            index={index}
            key={step + '-' + index}
            lastNumber={index === stepss.length - 1}
          />
        ))}
      </div>

      <div className='mt-8'>
        {children({
          step: stepss[currentStep].label,
          steps: stepss,
          button: { prevStep, nextStep, complite }
        })}
      </div>
    </div>
  )
}

export default Stepper
