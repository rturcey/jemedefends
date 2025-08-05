function FeatureGrid({
  items,
}: {
  items: { icon: React.ReactNode; title: string; desc: string }[];
}) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {items.map((b, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm hover:shadow-md transition text-left"
        >
          <div className="mb-6">{b.icon}</div>
          <h3 className="text-2xl font-black mb-2">{b.title}</h3>
          <p className="text-gray-600">{b.desc}</p>
        </div>
      ))}
    </div>
  );
}
export default FeatureGrid;
