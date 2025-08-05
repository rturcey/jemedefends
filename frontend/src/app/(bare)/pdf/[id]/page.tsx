function PdfPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Prévisualisation PDF (bare)</h1>
      <p className="text-sm text-gray-600">Document #{params.id}</p>
    </div>
  );
}
