import { useState,useContext } from "react";
import axios from "axios";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import DataContext from "../Context/DataProvider";

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

export const useGetResponse = () => {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [error, setError] = useState("");

  const {cmpny,qnType,role,Experience} = useContext(DataContext);

  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  // ✅ Extract text from PDF
  const extractText = async (file) => {
    if (!file) {
      setError("No file selected.");
      return null;
    }

    if (file.type !== "application/pdf") {
      setError("Invalid file format. Please upload a PDF file.");
      return null;
    }

    try {
      const fileReader = new FileReader();
      return new Promise((resolve, reject) => {
        fileReader.onload = async (e) => {
          try {
            const typedArray = new Uint8Array(e.target.result);
            const pdf = await getDocument({ data: typedArray }).promise;
            let textContent = "";

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
              const page = await pdf.getPage(pageNum);
              const content = await page.getTextContent();
              const pageText = content.items.map((item) => item.str).join(" ");
              textContent += pageText + "\n";
            }

            resolve(textContent);
          } catch (err) {
            reject("Failed to extract text from the PDF.");
          }
        };

        fileReader.readAsArrayBuffer(file);
      });
    } catch (err) {
      setError("Error reading the file.");
      return null;
    }
  };

  const generateQuestions = async (extractedText) => {
    if (!extractedText || !apiKey) return null;

    const requestData = {
      contents: [
        {
          parts: [
            {
              text: `You are an HR interview expert.
    
    Here is the candidate's resume text:
    ${extractedText}
    
    Your task:
    Generate ${
      qnType === "Both" ? "a mix of technical and non-technical"
      : qnType === "Non-Technical" ? "non-technical (HR-related)"
      : "technical"
    } interview questions tailored to the candidate's resume for the role of **${role}**.
    
    Consider that the candidate has **${Experience}** of experience.
    
    Please generate 8–10 relevant interview questions.`
            }
          ]
        }
      ]
    };
    

    try {
      setLoading1(true);
      setError("");
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data;
    } catch (err) {
      setError("Failed to fetch data from the API.");
      return null;
    } finally {
      setLoading1(false);
    }
  };
  const getImprovedAnswer = async(question, userAnswer)=>{
      if(!question || !userAnswer) return null;
      const requestData = {
        contents: [
          {
            parts: [
              {
                text: `Here's a candidate's answer to an interview question. Please improve it.

                Question: ${question}
                Answer: ${userAnswer}
                
                Respond with a corrected and improved answer only in the following JSON format — no extra explanation, no markdown, no text before or after — just plain JSON:
                
                {
                  "answer": "Your improved and corrected response here."
                }
                `
                
              }
            ]
          }
        ]
      };
      try{
        setLoading3(true);
        setError("");
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          requestData,
          { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
      }catch(err){
        setError("Failed to fetch Answer from the API");
        return null;
      }finally{
        setLoading3(false);
      }  
  };

  const generateSuggestions = async (extractedText) => {
    if (!extractedText || !apiKey) return null;

    const requestData = {
      contents: [
        {
          parts: [
            {
              text: `You are an expert Applicant Tracking System (ATS) evaluator and resume coach.

Given the resume and the job description below:

1. Analyze the resume for ATS-friendliness.
2. Score it out of 100 based on:
   - Keyword match (40 points)
   - Structure & formatting (20 points)
   - Clarity & readability (20 points)
   - Overall relevance to the job (20 points)
3. List the strengths in the resume.
4. List the weaknesses or red flags (e.g., use of tables, uncommon fonts, graphics).
5. Give actionable improvement suggestions (e.g., missing keywords, format changes).
6. Output in structured JSON format:
   {
     "ats_score": 87,
     "strengths": [...],
     "weaknesses": [...],
     "suggestions": [...]
   }

Resume:${extractedText}`
            }
          ]
        }
      ]
    };
    

    try {
      setLoading2(true);
      setError("");
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data;
    } catch (err) {
      setError("Failed to fetch data from the API.");
      return null;
    } finally {
      setLoading2(false);
    }
  };

  return { loading1,loading2,loading3, error, extractText, generateQuestions,generateSuggestions,getImprovedAnswer };
};
