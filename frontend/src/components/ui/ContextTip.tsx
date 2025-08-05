import * as React from 'react';

function ContextTip({ children }: React.PropsWithChildren) {
  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
      {children}
    </div>
  );
}

export default ContextTip;
