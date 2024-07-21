import axios from "axios";
import { LogStringify } from "../../Common/UtilsTS";

const API_KEY = 'AIzaSyAjANPMZ7mK3TyH916nUbo84CN1opqGERk';
const PROJECT_ID = 'gen-lang-client-0326266496';
const MODEL = 'gemini-1.5-pro';  // Replace with your desired model

export const makeRequestGeminiAsync = async (prompt: string) => {
    const data = {
        contents: [
            {
                parts: [
                    {
                        text: "generate a graphic (image or vector) that visualizes the word 'hello'"
                    }
                ]
            }
        ]
    };

    axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            LogStringify(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

};

// export const makeRequestGeminiAsync = async (prompt: string) => {
//     const url = `https://language.googleapis.com/v1/projects/${PROJECT_ID}/locations/global/models/${MODEL}:predict`;

//     const data = {
//         inputs: [{ text: prompt }],
//     };

//     try {
//         const response = await axios.post(url, data, {
//             headers: {
//                 Authorization: `Bearer ${API_KEY}`,
//                 'Content-Type': 'application/json',
//             },
//         });

//         return response.data.outputs[0].text;
//     } catch (error) {
//         console.error(error);
//         return 'Error: Failed to call Gemini API';
//     }
// };
