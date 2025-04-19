import React, { useEffect, useState, useContext } from "react";
import DataContext from "../Context/DataProvider";
import { Header } from "../Components/Header";
import { Footer } from "../Components/Footer";
import './Response.css';
export const Response = () => {
    const { responseData } = useContext(DataContext);
    const [content, setContent] = useState("");

    useEffect(() => {
        if (responseData) {
            const text =
                responseData?.candidates?.[0]?.content?.parts?.[0]?.text ||
                "No response received.";
            setContent(text);
        }
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
                return `<ol>${items}</ol>`;
            }
        );

        // Replace remaining newlines with <br>
        text = text.replace(/\n/g, "<br/>");

        return text;
    };
      
    
    return (
        <div>
            <Header/>
            <div className="response-container">
                <h1>Interview Questions</h1>
                {content ? (
                    <div
                        style={{ whiteSpace: "pre-wrap", textAlign: "left" }}
                        dangerouslySetInnerHTML={{ __html: formatContent(content) }}
                    />
                ) : (
                    <p>Loading response...</p>
                )}
            </div>
            <Footer/>
        </div>
        
    );
};
