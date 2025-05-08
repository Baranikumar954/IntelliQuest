import React, { useEffect, useState, useContext } from "react";
import DataContext from "../Context/DataProvider";
import { Header } from "../Components/Header";
import { Footer } from "../Components/Footer";
import '../PageStyles/Response.css';
import { supabase } from "../Api/supabaseClient";
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useGetResponse } from "../Api/useGetResponse";

export const Response = () => {
    const { responseData } = useContext(DataContext);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [question,setQuestion] = useState("");
    const [userAnswer,setUserAnswer] = useState("");
    const [correctAnswer,setCorrectAnswer] = useState("");
    const {loading3,error,getImprovedAnswer} = useGetResponse();
    const navigate = useNavigate();

    const[isFetching,setIsFetching] = useState(false);
    const handlePracticeClick= async (e)=>{
        e.preventDefault();
        setIsFetching(true);

        if (!question || !userAnswer) {
            alert("Please enter both a question and an answer.");
            setIsFetching(false);
            return;
        }
        try {
            const response = await getImprovedAnswer(question, userAnswer);
            if (response) {
                const resultText = response?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (resultText) {
                    const match = resultText.match(/{[\s\S]*}/);
                    if (match) {
                        const parsed = JSON.parse(match[0]);
                        setCorrectAnswer(parsed.answer);
                        console.log(parsed.answer);
                    } else {
                        alert("Model did not return valid JSON format.");
                    }
                }
            }
        } catch (err) {
            alert("Correct answer cannot be fetched");
        }
        
        finally{
            setIsFetching(false);
        }
        
    };
    

    useEffect(() => {
        const fetchResponse = async () => {
            let text = "No response received.";

            try {
                const { data: { user } } = await supabase.auth.getUser();
                const { data, error } = await supabase
                    .from("interview_questions")
                    .select("response")
                    .eq("gmail_id", user.email)
                    .single();

                if (error) {
                    console.error("Error fetching from Supabase:", error);
                } else if (data && data.response) {
                    try {
                        const parsed = JSON.parse(data.response);
                        text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || text;
                    } catch (err) {
                        text = data.response;
                    }
                }

            } catch (err) {
                console.error("Error retrieving user or response:", err);
            }

            // If no stored response, fall back to context
            if (responseData) {
                text =
                    responseData?.candidates?.[0]?.content?.parts?.[0]?.text || text;
            }

            setContent(text);
            setLoading(false);
        };

        fetchResponse();
    }, [responseData]);

    const formatContent = (text) => {
        // Convert bold (**text**) to <strong>
        text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        // Convert unordered lists (* item)
        text = text.replace(
            /(?:^|\n)(\* .+(?:\n\* .+)*)/g,
            (match) => {
                const items = match
                    .trim()
                    .split("\n")
                    .map((line) => `<li>${line.replace(/^\*\s/, "")}</li>`)
                    .join("");
                return `<ul>${items}</ul>`;
            }
        );

        // Convert numbered lists (1. item)
        text = text.replace(
            /(?:^|\n)((?:\d+\.\s.+\n?)+)/g,
            (match) => {
                const items = match
                    .trim()
                    .split("\n")
                    .map((line) => `<li>${line.replace(/^\d+\.\s/, "")}</li>`)
                    .join("");
                return `<ul>${items}</ul>`;
            }
        );

        // Replace remaining newlines with <br>
        text = text.replace(/\n/g, "<br/>");

        return text;
    };

    return (
        <div className="responsePage">
            <Header />
            <div className="response-container">
                <h1>Interview Questions</h1>
                {loading ? (
                    <p><img src="https://i.gifer.com/ZZ5H.gif" alt="Loading" width="40" /><br/>Loading response...</p>
                ) : (
                    <div
                        style={{ whiteSpace: "pre-wrap", textAlign: "left" }}
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(formatContent(content)),
                        }}
                    />
                )}
            </div>
            <div className="practice-form">
                <h2>Practice Your Answers</h2>
                <form onSubmit={handlePracticeClick} className="practiceForm">
                    <label htmlFor="questionInput">Paste a Question:</label>
                    <textarea
                        id="questionInput"
                        className="practice-input"
                        value={question}
                        onChange={(e)=>{setQuestion(e.target.value)}}
                        rows="3"
                        placeholder="Copy & Paste your question here..."
                    ></textarea>

                    <label htmlFor="userAnswer">Your Answer (max 256 chars):</label>
                    <textarea
                        id="userAnswer"
                        className="practice-input"
                        value={userAnswer}
                        onChange={(e)=>{setUserAnswer(e.target.value)}}
                        rows="5"
                        maxLength={500}
                        placeholder="Write your answer..."
                    ></textarea>
                    {
                        isFetching ? (
                            <p style={{ color: "#00FFD1", fontWeight: "bold" }}>
                                <img src="https://i.gifer.com/ZZ5H.gif" alt="Loading" width="40" /> <br/>Processing... Please wait
                          </p>
                          ):(
                            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
    <button className="btn-practice" type="submit">Practice</button>
    {correctAnswer && (
      <button
        type="button"
        className="btn-clear"
        onClick={() => {
          setQuestion("");
          setUserAnswer("");
          setCorrectAnswer("");
        }}
      >
        Clear
      </button>
    )}
  </div>
                        )
                    }
                    
                </form>
                

                <label htmlFor="correctedAnswer">Corrected Answer:</label>
                <div id="correctedAnswer" className="corrected-box">{correctAnswer}</div>
            </div>

            <button className="btn-feedback" onClick={() => { navigate('/feedbacks'); }}>Share your commands</button>
            <br /><br />
            <Footer />
        </div>
    );
};
