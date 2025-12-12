const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

// Run from 'server' directory
dotenv.config();

console.log("API Key loaded:", process.env.GEMINI_API_KEY ? "Yes (starts with " + process.env.GEMINI_API_KEY.substring(0, 4) + ")" : "No");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModel(modelName) {
    console.log(`\nTesting ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello?");
        const response = await result.response;
        console.log(`✅ Success with ${modelName}:`, response.text().substring(0, 50));
    } catch (err) {
        console.log(`❌ Failed with ${modelName}:`, err.message);
    }
}

async function main() {
    await testModel("gemini-1.5-flash");
    await testModel("gemini-pro");
    await testModel("gemini-1.0-pro");
    await testModel("gemini-1.5-pro");
}

main();
