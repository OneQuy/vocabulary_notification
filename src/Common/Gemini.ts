import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { GeminiKey } from "../../Keys";
import { ToCanPrint } from "./UtilsTS";

const IsLog = __DEV__

const Key = GeminiKey
const ModelName = "gemini-1.5-flash"

var model: GenerativeModel | undefined = undefined

const InitGemini = (): void => {
    if (model)
        return

    const genAI = new GoogleGenerativeAI(Key)

    model = genAI.getGenerativeModel({ model: ModelName })
}

export const PromptGeminiAsync = async (prompt: string): Promise<string> => {
    InitGemini()

    if (!model)
        throw new Error('[PromptGeminiAsync] inited fail')

    // const result = await model.generateContent([prompt, image]);

    const result = await model.generateContent(prompt)

    // console.log(result.response.text());
    // console.log(result.response.promptFeedback)

    if (IsLog) {
        console.log('[Gemini] prompt: ' + prompt,
            'usageMetadata: ' + ToCanPrint(result?.response?.usageMetadata))
    }

    return result.response.text()
}