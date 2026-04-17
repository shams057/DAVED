const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function test() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Using Key:", key ? key.substring(0, 5) + "..." : "MISSING");
    const genAI = new GoogleGenerativeAI(key);
    
    try {
        // List models
        // Note: listModels is not on genAI directly in some versions, but we can try to generate a tiny response
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hi");
        console.log("Response:", result.response.text());
    } catch (e) {
        console.error("Error Detail:", e);
    }
}

test();
