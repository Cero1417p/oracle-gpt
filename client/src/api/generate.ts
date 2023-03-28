import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from './const';

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export interface IResponse {
    message: string
    status: number
    result?: string
}
export async function GenerateName(req: string) {
    console.log("REQUEST ", req)
    if (!configuration.apiKey) {
        return {
            message: "OpenAI API key not configured, please follow instructions in README.md",
            status: 500
        }
    }
    const animal = req || '';
    if (animal.trim().length === 0) {
        return {
            message: "Please enter a valid animal",
            status: 400
        }
    }
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: generatePromptToNickAnimal(animal),
            temperature: 0.7,
        });
        return { message: "Correct", status: 200, result: completion.data.choices[0].text }
    } catch (error:any) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            return { message: "error", status: error.response.status }
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            return { message: 'An error occurred during your request.', status: 500 }
        }
    }
}

export async function GeneratePrediction(req: { name: string, date: string }) {
    if (!configuration.apiKey) {
        return { message: "OpenAI API key not configured, please follow instructions in README.md", status: 500 }
    }
    const name = req.name || '';
    if (name.trim().length === 0) {
        return { message: "Please enter a valid name", status: 400 }
    }
    const date = req.date || '';
    if (date.split("-").length !== 3) {
        return { message: "Please enter a valid date", status: 400 }
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
        return { message: "Correct", status: 200, result: completion.data.choices[0].text }
    } catch (error:any) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            return { message: "error", status: error.response.status }
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            return { message: 'An error occurred during your request.', status: 500 }
        }
    }
}

function generatePromptToNickAnimal(animal: string) {
    const capitalizedAnimal = animal[0].toUpperCase() + animal.slice(1).toLowerCase();
    return `Sugiera tres nombres para un animal que sea un superhéroe
Animal: Gato
Nombres: Capitan Gatito, El increible felino, 
Animal: Perro
Names: Woof el protector, Super perro, Señor ladridos
Animal: ${capitalizedAnimal}
Nombres:`;
}
function generatePromptPrediction(name: string, date: string) {
    const capitalizedName = name[0].toUpperCase() + name.slice(1).toLowerCase();
    return `simula ser un tarotista y dime que me depara el destino para hoy interpretando los movimientos planetarios y posiciones astrales, sabiendo que he nacido el  ${date} y me llamo ${capitalizedName}, primero deduce mi signo de zodiaco y dame un saludo incluyendo mi nombre,  primero dame una lectura general, luego en amor y relaciones, carrera y finanzas,salud y bienestar,espiritualidad y crecimiento personal.`
}

