function SrOnly({ children }: React.PropsWithChildren) {
  return <span className="sr-only">{children}</span>;
}

export default SrOnly;
