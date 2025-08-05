function GradientBlobs({ variant = 'blue' as const }: { variant?: 'blue' | 'green' }) {
  const isBlue = variant === 'blue';
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      <div
        className={`absolute -top-24 -left-16 w-[28rem] h-[28rem] ${isBlue ? 'bg-blue-200/40' : 'bg-green-200/40'} rounded-full blur-3xl`}
      />
      <div
        className={`absolute -bottom-32 -right-24 w-[32rem] h-[32rem] ${isBlue ? 'bg-indigo-200/40' : 'bg-emerald-200/40'} rounded-full blur-3xl`}
      />
      <div
        className={`absolute inset-0 ${isBlue ? 'bg-gradient-to-b from-white via-white/60 to-blue-50' : 'bg-gradient-to-b from-white via-white/60 to-green-50'}`}
      />
    </div>
  );
}
export default GradientBlobs;
