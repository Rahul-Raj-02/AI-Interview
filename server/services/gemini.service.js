import axios from 'axios';

const askAi = async (messages) => {
    const apiKey = process.env.GEMINI_API_KEY.replace(/['"]+/g, '').trim();
    const promptText = messages.map(m => m.content).join("\n\n");
    const primaryUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(primaryUrl, {
            contents: [{ parts: [{ text: promptText }] }]
        });
        return response.data.candidates[0].content.parts[0].text;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            try {
                const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
                const fallbackRes = await axios.post(fallbackUrl, {
                    contents: [{ parts: [{ text: promptText }] }]
                });
                return fallbackRes.data.candidates[0].content.parts[0].text;
            } catch (fallbackErr) {
                console.error("Fallback Model failed:", fallbackErr.response?.data?.error?.message || fallbackErr.message);
            }
        }
        console.error("Google Server Error:", err.response?.data?.error?.message || err.message);
        throw new Error(err.response?.data?.error?.message || "AI Service Connectivity Issue");
    }
}

export default askAi;