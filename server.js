import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const port = 5000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'The API server is up and running.',
    })
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        if (!prompt) {
            return res.status(400).send({
                error: "Prompt is required"
            });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            result: response.choices[0].message.content
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            error: "An error occurred while processing your request"
        });
    }
})

app.listen(port,
    () => console.log(`Server is running on http://localhost:${port}`)
);