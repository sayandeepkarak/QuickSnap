export function validateNumber(
  value: unknown,
  fieldName: string,
  defaultValue: number
): number {
  if (typeof value === "number" && !isNaN(value) && value > 0) {
    return value;
  }

  if (typeof value === "string" && !isNaN(Number(value)) && Number(value) > 0) {
    return Number(value);
  }

  console.warn(
    `⚠️ Warning: Invalid ${fieldName}. Expected a positive number, but received "${value}". Using default: ${defaultValue}.`
  );

  return defaultValue;
}

export function validateBoolean(
  value: unknown,
  fieldName: string,
  defaultValue: boolean
): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const lowerValue = value.toLowerCase();
    if (lowerValue === "true") return true;
    if (lowerValue === "false") return false;
  }

  console.warn(
    `⚠️ Warning: Invalid ${fieldName}. Expected "true" or "false", but received "${value}". Using default: ${defaultValue}.`
  );

  return defaultValue;
}

export function validateEnum<T extends Record<string, string>>(
  value: unknown,
  fieldName: string,
  enumType: T,
  defaultValue: T[keyof T]
): T[keyof T] {
  // Ensure we only get the string values, excluding numeric keys
  const validValues = Object.values(enumType);

  if (validValues.includes(value as T[keyof T])) {
    return value as T[keyof T];
  }

  console.warn(
    `⚠️ Warning: Invalid ${fieldName}. Expected one of [${validValues.join(
      ", "
    )}], but received "${value}". Using default: "${defaultValue}".`
  );

  return defaultValue;
}
