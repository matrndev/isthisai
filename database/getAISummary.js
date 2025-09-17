import 'dotenv/config';
import OpenAI from 'openai';
import fetch from "node-fetch";

const client = new OpenAI({
  apiKey: process.env['OPENAI_TOKEN']
});

function getAISummary(input, model, platform) {
  if (platform === "openai" || !platform) {
    console.log('Fetching AI summary for:', input, "with", model || "gpt-5-nano");
    return new Promise(async (resolve, reject) => {
      try {
        const response = await client.responses.create({
          model: model || 'gpt-5-nano',
          instructions: 'Generate a summary of the object provided in the input, basically like the summary section of a Wikipedia page. Your repsponse should be concise. Do not include links, bulletpoints, or markdown formatting. Do not encase words in asterisks, this does not make the text bold. Respond in about 70-120 words.',
          input: input,
        });
        resolve(response.output_text);
      } catch (error) {
        console.error('Error fetching AI summary:', error);
        reject(error);
      }
    });
  } else if (platform === "hc") {
    console.log("platform is HC")
    console.log('Fetching AI summary for:', input, "with", model || "qwen/qwen3-32b");
    return new Promise(async (resolve, reject) => {
      try {
      const response = await fetch("https://ai.hackclub.com/chat/completions", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        messages: [{ role: "user", content: `Generate a summary of an object with this title: "${input}", basically like the summary section of a Wikipedia page. Your repsponse should be concise. Do not include links, bulletpoints, or markdown formatting. Do not encase words in asterisks, this does not make the text bold. Respond in about 70-120 words.` }],
        model: model || "qwen/qwen3-32b"
        })
      });
      if (!response.ok) {
        throw new Error(`Hack Club AI API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();

      let summary = data.choices?.[0]?.message?.content || "";
      summary = summary.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
      resolve(summary);
      } catch (error) {
      console.error('Error fetching AI summary from Hack Club:', error);
      reject(error);
      }
    });
  }
}

export default getAISummary;