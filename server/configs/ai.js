import dotenv from "dotenv"
import { OpenAI } from "openai/client.js";

dotenv.config();
const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export default ai;