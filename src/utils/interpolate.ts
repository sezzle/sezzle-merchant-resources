// Tiny `{placeholder}` interpolation for translation strings. Mirrors the
// `{key}` convention already used by LTterms3 in PaymentTerms. Replaces every
// occurrence of each `{name}` token with its value; unknown tokens are left
// untouched so a missing var is visible rather than silently blanked.
export function interpolate(
  template: string,
  vars: Record<string, string | number>
): string {
  return Object.entries(vars).reduce(
    (out, [key, value]) =>
      out.replace(new RegExp(`\\{${key}\\}`, "g"), String(value)),
    template
  );
}
