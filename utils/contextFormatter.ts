// File: utils/contextFormatter.ts
export function formatContextSummary(context: Record<string, any>): string {
  const overlay     = context?.overlay     || 'None';
  const philosophy  = context?.philosophy  || 'None';
  const mythos      = context?.mythos      || 'UNKNOWN';

  return `
Overlay: ${overlay}
Philosophy: ${philosophy}
Mythos Signature: ${mythos}
  `.trim();
}
