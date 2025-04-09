export function buildChatContextPrompt({
                                           manifest,
                                           clusters,
                                           xai,
                                           labels,
                                       }: {
    manifest: unknown;
    clusters: unknown;
    xai: unknown;
    labels?: Record<string, string> | null;
}): string {
    const manifestStr = JSON.stringify(manifest, null, 2);
    const clustersStr = JSON.stringify(clusters, null, 2);
    const xaiStr = JSON.stringify(xai, null, 2);

    let labelsSection = "";
    if (labels && Object.keys(labels).length > 0) {
        const formatted = Object.entries(labels)
            .map(([sample, group]) => `- ${sample}: ${group}`)
            .join("\n");

        labelsSection = `\n🧾 Original biological labels:\n${formatted}`;
    }

    return `
You are MedAI, a biomedical assistant specialized in gene expression data and clustering analysis. The user will now chat with you about the results of a clustering process.

Here is the context of the analysis, which you should keep in mind for the entire conversation:

---

🧬 Manifest:
${manifestStr}

🧪 Clusters:
${clustersStr}

🧠 Explainable AI insights:
${xaiStr}
${labelsSection}

---

The user will now ask you specific questions about these results. Reply in a clear, professional, and accessible way. When unsure, ask clarifying questions. Use markdown formatting where helpful.

Let’s begin.
`;
}
