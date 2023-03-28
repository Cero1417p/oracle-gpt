import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from server AI!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.post('/oracle', async (req, res) => {
  console.log("==================== ",req.body);
  if (!configuration.apiKey) {
    res.status(500).json({
      message: "OpenAI API key not configured, please follow instructions in README.md"
    })
  }
  const name = req.body.name || '';
  if (name.trim().length === 0) {
    res.status(400).json({ message: "Please enter a valid name" })
  }
  const date = req.body.date || '';
  if (date.split("-").length !== 3) {
    res.status(400).json({ message: "Please enter a valid date" })
  }
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePromptPrediction(name, date),
      temperature: 0.7,
      max_tokens: 1507,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text })
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
})
function generatePromptPrediction(name, date) {
  const capitalizedName = name[0].toUpperCase() + name.slice(1).toLowerCase();
  return `simula ser un tarotista y dime que me depara el destino para hoy interpretando los movimientos planetarios y posiciones astrales, sabiendo que he nacido el  ${date} y me llamo ${capitalizedName}, primero deduce mi signo de zodiaco y dame un saludo incluyendo mi nombre,  primero dame una lectura general, luego en amor y relaciones, carrera y finanzas,salud y bienestar,espiritualidad y crecimiento personal.`
}

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))
