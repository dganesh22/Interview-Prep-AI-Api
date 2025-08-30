const { StatusCodes } = require('http-status-codes');
const { GoogleGenAI } = require('@google/genai')
const  { conceptExplainPrompt, questionAnswerPrompt} = require("../util/prompts")
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY})

// @desc generate ai questions
// @route get /api/ai/generate-questions
// @access private

const generateInteviewQuestions = async (req,res) => {
    try {
        const {role, experience , topicsToFocus, numberOfQuestions }     = req.body

        if(!role || !experience || !topicsToFocus || !numberOfQuestions)
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing fields are required"})

        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions)

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt
        })

        let rawTxt = response.text

        // clean it: remove ```json and ``` from beginning and ending
        const cleanedTxt = rawTxt.replace(/^```json\s*/, "")// remove string ``` json
            .replace(/```$/, "") // remove ending ```
            .trim(); // remove extra spaces

        // now date safe to parse
        let data = JSON.parse(cleanedTxt)

    res.status(StatusCodes.OK).json({ message: "interview questions and answers generated successfully", output: data })
    }catch(err){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : "failed to generate questions and answers", error: err.message });
    }
}


// @desc generate explanation for questions
// @route get /api/ai/generate-explanation
// @access private

const generateConceptExplanation = async (req,res) => {
    try {
        const { question } = req.body
        if(!question)
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing fields are required"})

        const prompt = conceptExplainPrompt(question)

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt
        })

        let rawTxt = response.text

        // clean it and remove the ```json and ``` from beginning to end
        const cleanedTxt = rawTxt
            .replace(/^```json\s*/, "") // remove the string ```json
            .replace(/```$/,"") // remove the ending ```
            .trim(); // remove the extra spaces

        // now safe to parse
        const data = JSON.parse(cleanedTxt)

    res.status(StatusCodes.OK).json({ message: "explanation generated",output: data })
    }catch(err){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "failed to generate explanations",error : err.message });
    }
}

module.exports = { generateInteviewQuestions, generateConceptExplanation }