export function buildLabel(metadata: Record<string, string>): string {
    const preferredFields = ["characteristics_ch1", "disease", "age", "gender", "source_name_ch1"];

    const availableFields = preferredFields.filter(field => metadata[field]);
    const summaryFields = availableFields.length > 0 ? availableFields : Object.keys(metadata).slice(0, 3);

    return summaryFields
        .map((field) => `${field}: ${metadata[field]}`)
        .join(" | ") || "—";
}
