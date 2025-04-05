export async function uploadMedaiReport(
    userId: string,
    markdownResponse: string
): Promise<boolean> {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("markdown_response", markdownResponse);

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload_medai`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        return true;
    } catch (error) {
        console.error("Upload failed:", error);
        return false;
    }
}
