import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI SDK with API key
const apiKey = process.env.GEMINI_API_KEY;
console.log(`API Key available: ${apiKey ? 'Yes' : 'No'}`);

if (!apiKey) {
  console.warn('Warning: GEMINI_API_KEY environment variable is not set. Rap generation will fail.');
}

// Create the Gemini API client
const genAI = new GoogleGenerativeAI(apiKey || 'dummy-key-placeholder');

// The correct model name for Gemini - using the latest model
// Update: for Gemini 1.5, we should use 'gemini-1.5-pro'
const MODEL_NAME = 'gemini-1.5-pro';

// Types
export interface RapGenerationOptions {
  topic: string;
  genre: string;
  stanzaCount: number;
  explicit: boolean;
}

// Mock rap generator - fallback in case API doesn't work
function generateSampleRap(topic: string, genre: string, explicit: boolean): string {
  return `
1. Flowing through life, chasing dreams like shadows
   Got the beat in my heart, rhythm in my soul

2. Words carry power, express what I feel inside
   Music is my language, on this lyrical ride

3. Each day a struggle, but I keep pushing forward
   Turning pain to poetry, my spirit won't be lowered

4. This is my story, written in rhymes and flow
   Standing in my truth, watching my talent grow
`;
}

// Generate rap lyrics
export async function generateRapLyrics(options: RapGenerationOptions): Promise<string> {
  console.log('Generating rap lyrics with options:', JSON.stringify(options));
  const { topic, genre, stanzaCount, explicit } = options;
  
  if (!topic || !genre) {
    throw new Error('Topic and genre are required for generating rap lyrics');
  }
  
  // Calculate line count based on stanzas (4 lines per stanza)
  const lineCount = stanzaCount || 8;
  
  // Decide on rhyme scheme
  const rhymeScheme = Math.random() > 0.5 ? "AABB" : "ABAB";
  
  // Explicit content option
  const explicitOption = explicit 
    ? "You can use explicit language appropriate for the genre" 
    : "Keep the content PG-13, no explicit language";
  
  const prompt = `You are a professional rap lyricist. Create a rap with ${lineCount} lines about "${topic}" in ${genre} style.
Rules:
- Use rhyme scheme: ${rhymeScheme}
- ${explicitOption}
- Keep each line to a maximum of 12 words
- Format as numbered stanzas
- Make it creative and original`;

  try {
    console.log(`Using Gemini API (model: ${MODEL_NAME}) to generate content`);
    
    // Log the API key status and model we're using
    console.log(`Using API key: ${apiKey ? 'Available' : 'Missing'}`);
    console.log(`Attempting to use model: ${MODEL_NAME}`);
    
    // Try with the updated model name
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
    
    // Generate content
    const result = await model.generateContent(prompt);
    
    if (!result || !result.response) {
      console.error('Received empty response from Gemini API');
      throw new Error('Failed to generate rap lyrics: empty response');
    }
    
    const text = result.response.text();
    console.log('Successfully generated rap lyrics');
    return text;
  } catch (error) {
    console.error("Error generating rap lyrics:", error);
    
    // Add detailed error logging
    if (error instanceof Error) {
      console.error(`Error name: ${error.name}, message: ${error.message}`);
      console.error(`Stack trace: ${error.stack}`);
      
      // If it's a model not found error, try with an alternative model
      if (error.message.includes('models/') && error.message.includes('not found')) {
        console.log('Trying with alternative model: gemini-pro...');
        try {
          const alternativeModel = genAI.getGenerativeModel({ 
            model: 'gemini-pro',
            generationConfig: {
              temperature: 0.9,
              maxOutputTokens: 1024,
            }
          });
          
          const alternativeResult = await alternativeModel.generateContent(prompt);
          if (alternativeResult && alternativeResult.response) {
            const text = alternativeResult.response.text();
            console.log('Successfully generated rap lyrics with alternative model');
            return text;
          }
        } catch (alternativeError) {
          console.error('Alternative model also failed:', alternativeError);
        }
      }
    }
    
    // Return a sample rap as a fallback to show something to the user
    console.log('Using fallback rap generation');
    return generateSampleRap(topic, genre, explicit);
  }
}