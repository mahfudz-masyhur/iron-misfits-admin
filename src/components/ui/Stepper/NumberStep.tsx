import IconCheck from '../Icon/IconCheck'

interface NumberStep {
  stepName: string
  lastNumber?: boolean
  currentStep: number
  index: number
  complite: boolean
}

const NumberStep = ({ stepName, index, lastNumber, currentStep, complite }: NumberStep) => {
  return (
    <>
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>
          <span
            className={`inline-flex items-center justify-center min-w-[2rem] w-8 h-8 border rounded-full ${
              index === currentStep || complite ? 'bg-blue-500 text-white' : 'border-gray-300'
            }`}
          >
            {complite ? <IconCheck /> : index + 1}
          </span>
        </span>
        <span style={{ width: '100%' }}>
          <span>{stepName}</span>
        </span>
      </span>
      {!lastNumber && (
        <div style={{ flex: '1 1 auto' }}>
          <hr />
        </div>
      )}
    </>
  )
}

export default NumberStep
