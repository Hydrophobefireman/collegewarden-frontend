export function getVariableValue(
  variable: string,
  computed?: CSSStyleDeclaration,
  element?: Element
) {
  computed = computed || getComputedStyle(element || document.documentElement);
  return computed.getPropertyValue(variable);
}
