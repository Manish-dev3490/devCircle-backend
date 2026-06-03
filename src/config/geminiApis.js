require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main(msg) {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(
        msg
    );

    return result;
}

module.exports = main;