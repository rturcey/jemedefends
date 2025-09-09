interface ProcedureStep {
  number: number;
  title: string;
  description: string;
  duration?: string;
}

export default function ProcedureSteps({ steps }: { steps: ProcedureStep[] }) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
        >
          {/* Badge numéro custom */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {step.number}
            </div>
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            {step.duration && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  <Clock className="w-3 h-3" />
                  {step.duration}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
