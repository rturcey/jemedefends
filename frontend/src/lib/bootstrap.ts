export function bootstrapServerOnce() {
  try {
    hydrateLEGAL_TEXTSFromGenerated();
    console.log('[legal] LEGAL_TEXTS hydraté depuis legal_texts.generated.json');
  } catch {
    /* no-op */
  }
}
