import 'dotenv/config';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env['OPENAI_TOKEN']
});

function getAISummary(input, model) {
  console.log('Fetching AI summary for:', input, "with", model || "gpt-5-nano");
  return new Promise(async (resolve, reject) => {
    try {
      const response = await client.responses.create({
        model: model || 'gpt-5-nano',
        instructions: 'Generate a summary of the object provided in the input, basically like the summary section of a Wikipedia page. Your repsponse should be concise. Do not include links, bulletpoints, or markdown formatting. Respond in about 70-120 words.',
        input: input,
      });
      resolve(response.output_text);
    } catch (error) {
      console.error('Error fetching AI summary:', error);
      reject(error);
    }
  });
}

export default getAISummary;