// Tiny `{placeholder}` interpolation for translation strings. Mirrors the
// `{key}` convention already used by LTterms3 in PaymentTerms. Replaces every
// occurrence of each `{name}` token with its value; unknown tokens are left
// untouched so a missing var is visible rather than silently blanked.
export function interpolate(
  template: string,
  vars: Record<string, string | number>
): string {
  return Object.entries(vars).reduce(
    // split/join replaces every `{key}` literally — no dynamic RegExp, so keys
    // containing regex metacharacters can't cause mismatches or ReDoS.
    (out, [key, value]) => out.split(`{${key}}`).join(String(value)),
    template
  );
}
