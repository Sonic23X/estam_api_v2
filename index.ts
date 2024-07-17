import { OpenAI } from 'openai';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY as string,
});

app.post('/calcularInversores', async (req, res) => {
    const { wattsTotales, capacidadInversor } = req.body;
    const prompt = `Calcula cuántos inversores se necesitan para manejar un sistema que consume un total de ${wattsTotales} vatios (W), sabiendo que cada inversor puede manejar hasta ${capacidadInversor} W.`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: prompt },
            ],
        });

        const fullText = response.choices[0].message.content?.toString().trim();
        const numberPattern = /\d+/g; // Una expresión regular para encontrar números
        const numbers = fullText?.match(numberPattern); // Encuentra todos los números en el texto
        const result = numbers ? numbers[5] : "No se encontró un número"; // Extrae solo el primer número, que asumimos es la respuesta
        res.json({ resultado: result });
    } catch (error) {
        console.error("Error al llamar a la API de OpenAI:", error);
        res.status(500).send("Error al procesar la solicitud");
    }
});