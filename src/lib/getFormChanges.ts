/**
 * Compares current values against initial values and returns only changed fields.
 * Handles nested objects, primitives, dates, and arrays.
 */
export const getFormChanges = <T extends Record<string, any>>(
  initialValues: T,
  currentValues: T
): Partial<T> => {
  const changes: Record<string, any> = {};

  if (!initialValues || !currentValues) return currentValues;

  Object.keys(currentValues).forEach((key) => {
    const initialVal = initialValues[key];
    const currentVal = currentValues[key];

    // 1. Handle Date Objects comparison
    if (initialVal instanceof Date || currentVal instanceof Date) {
      const initialTime = initialVal instanceof Date ? initialVal.getTime() : new Date(initialVal).getTime();
      const currentTime = currentVal instanceof Date ? currentVal.getTime() : new Date(currentVal).getTime();

      if (initialTime !== currentTime) {
        changes[key] = currentVal;
      }
      return;
    }

    // 2. Handle Arrays (e.g., components array)
    if (Array.isArray(currentVal)) {
      if (!Array.isArray(initialVal) || currentVal.length !== initialVal.length) {
        changes[key] = currentVal;
      } else {
        const arrayChanges = currentVal.map((item, index) => {
          if (typeof item === "object" && item !== null) {
            return getFormChanges(initialVal[index] || {}, item);
          }
          return item !== initialVal[index] ? item : undefined;
        });

        // If any element inside array changed, include the array
        const hasArrayChanged = arrayChanges.some((change, idx) => {
          if (typeof change === "object" && change !== null) {
            return Object.keys(change).length > 0;
          }
          return change !== undefined;
        });

        if (hasArrayChanged) {
          changes[key] = currentVal;
        }
      }
      return;
    }

    // 3. Handle Nested Objects (e.g., asset object)
    if (
      typeof currentVal === "object" &&
      currentVal !== null &&
      typeof initialVal === "object" &&
      initialVal !== null
    ) {
      const nestedDiff = getFormChanges(initialVal, currentVal);
      if (Object.keys(nestedDiff).length > 0) {
        changes[key] = nestedDiff;
      }
      return;
    }

    // 4. Primitive values comparison (strings, numbers, booleans)
    if (initialVal !== currentVal) {
      changes[key] = currentVal;
    }
  });

  return changes as Partial<T>;
};