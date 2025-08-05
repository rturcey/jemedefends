function BareLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-white">{children}</body>
    </html>
  );
}
