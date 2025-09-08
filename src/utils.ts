// Conversion factors based on 1 inch = 96 pixels (standard for web)
const DPI = 96; // Dots Per Inch

const conversionFactors: { [unit: string]: number } = {
  'px': 1,
  'pt': DPI / 72, // 1 inch = 72 points
  'mm': DPI / 25.4, // 1 inch = 25.4 millimeters
  'cm': DPI / 2.54, // 1 inch = 2.54 centimeters
  'in': DPI, // 1 inch = 1 inch
};

/**
 * Parses a string value with a unit (e.g., "100px", "10pt", "2.5cm") and converts it to pixels.
 * If no unit is specified, it assumes pixels.
 *
 * @param value The string value to parse.
 * @returns The value in pixels, or NaN if parsing fails.
 */
export function parseUnitValue(value: string): number {
  if (typeof value !== 'string') {
    return NaN;
  }

  const trimmedValue = value.trim();
  if (trimmedValue === '') {
    return 0; // Treat empty string as 0
  }

  // Regular expression to match a number followed by an optional unit
  const match = trimmedValue.match(/^(\d*\.?\d+)\s*(px|pt|mm|cm|in)?$/i);

  if (!match) {
    return NaN; // Invalid format
  }

  const numericPart = parseFloat(match[1]);
  const unitPart = (match[2] || 'px').toLowerCase(); // Default to 'px' if no unit specified

  if (isNaN(numericPart)) {
    return NaN;
  }

  const factor = conversionFactors[unitPart];
  if (factor === undefined) {
    return NaN; // Unknown unit
  }

  return numericPart * factor;
}
