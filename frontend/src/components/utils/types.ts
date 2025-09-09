import type * as React from 'react';

export type WithClassName<T = unknown> = T & { className?: string };
export type ChildrenProps = React.PropsWithChildren<{ className?: string }>;
