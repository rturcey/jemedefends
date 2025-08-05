export type StepDef = { id: string; label: string };

function computeProgress(steps: StepDef[], currentId?: string) {
  const total = Math.max(steps.length, 1);
  const index = Math.max(
    0,
    steps.findIndex(s => s.id === currentId)
  );
  const safeIndex = index === -1 ? 0 : index;
  const current = Math.min(safeIndex + 1, total);
  const percent = Math.round((current / total) * 100);
  return { total, current, percent, index: safeIndex };
}

export default computeProgress;
