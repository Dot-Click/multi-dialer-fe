

interface FieldMapping {
  [label: string]: string;
}

/**
 * Generates a CSV string from an array of objects based on selected fields.
 * Handles escaping of quotes and commas.
 */
export const generateCSV = (
  data: any[],
  selectedFields: string[],
  fieldMapping: FieldMapping,
): string => {
  // 1. Create Headers
  const headers = selectedFields.join(",");

  // 2. Create Rows
  const rows = data.map((item) => {
    return selectedFields
      .map((label) => {
        const key = fieldMapping[label];
        const value = item[key] ?? "-";

        // Handle special cases like arrays (e.g., tags)
        const formattedValue = Array.isArray(value)
          ? value.join("; ")
          : String(value);

        // Escape double quotes by doubling them and wrap in quotes
        const escapedValue = formattedValue.replace(/"/g, '""');
        return `"${escapedValue}"`;
      })
      .join(",");
  });

  return [headers, ...rows].join("\n");
};

/**
 * Triggers a browser download of a CSV file.
 */
export const downloadCSV = (
  data: any[],
  selectedFields: string[],
  fieldMapping: FieldMapping,
  filename: string = "export.csv",
): void => {
  const csvContent = generateCSV(data, selectedFields, fieldMapping);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
