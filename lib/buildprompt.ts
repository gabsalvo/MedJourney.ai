export function buildPrompt({
                                manifest,
                                clusters,
                                xai,
                            }: {
    manifest: unknown;
    clusters: unknown;
    xai: unknown;
}): string {
    const manifestStr = JSON.stringify(manifest, null, 2);
    const clustersStr = JSON.stringify(clusters, null, 2);
    const xaiStr = JSON.stringify(xai, null, 2);

    return `
You are MedAI, an expert biomedical assistant specialized in bioinformatics and omics data analysis.

Below is the summary of a gene expression clustering analysis from a microarray dataset. Please provide a clear and comprehensive interpretation of the results, including insights into possible biological meaning, data quality, and experimental implications.

---

🧬 Manifest (summary of the experiment):
${manifestStr}

🧪 Clustering results:
${clustersStr}

🧠 Explainable AI insights (optional):
${xaiStr}

---

Please explain:
1. The main structure of the clusters.
2. How they relate to the biological experiment.
3. Any pattern or anomaly you can detect.
4. Suggestions for follow-up analysis or validation.

Respond in clear scientific English for a researcher audience.
`;
}
