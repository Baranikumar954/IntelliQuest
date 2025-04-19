import { useState,useContext } from "react";
import axios from "axios";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import DataContext from "../Context/DataProvider";

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

export const useGetResponse = () => {
  const [loading, setLoading] = useState(false);
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
            {text: `Extracted Resume Text:\n${extractedText}\n\nGenerate ${
                  qnType === "Both" ? "Technical and Non-Technical" 
                  : qnType === "Non-Technical" ? "Non-Technical" 
                  : "Technical"
                } interview questions based on my resume as i am HR and role for ${role} and generate Questions for ${Experience} .`
            }
          ]
        }
      ]
    };

    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  return { loading, error, extractText, generateQuestions };
};
