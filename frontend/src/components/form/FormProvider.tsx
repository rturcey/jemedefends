'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface FormContextValue {
  // Context values if needed
}

const FormContext = createContext<FormContextValue>({});

const useFormContext = () => useContext(FormContext);

const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <FormContext.Provider value={{}}>{children}</FormContext.Provider>;
};

export default FormProvider;
