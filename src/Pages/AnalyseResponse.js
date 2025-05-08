import { useState, useContext, useEffect } from "react";
import DataContext from "../Context/DataProvider";
import { Header } from "../Components/Header";
import { Footer } from "../Components/Footer";
import '../PageStyles/AnalyseResponse.css';
import { supabase } from "../Api/supabaseClient";

export const AnalyseResponse = () => {
  const { analyseResponseData} = useContext(DataContext); // assuming `user` contains gmail_id & username
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [animatedScore, setAnimatedScore] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }

      if (user) {
        const gmail_id = user.email;
        const username = user.user_metadata?.full_name || "User";

        setUser({ gmail_id, username });
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (analyseResponseData) {
      let text = analyseResponseData.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";

      try {
        const match = text.match(/{[\s\S]*}/);
        if (!match) throw new Error("No valid JSON object found in response.");

        const jsonString = match[0];
        const parsed = JSON.parse(jsonString);

        setReport(parsed);
        setError("");

        // insert into Supabase
        insertToDatabase(parsed);
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        setError("Invalid JSON response");
      }
    }
  }, [analyseResponseData]);

  useEffect(() => {
    if (report?.ats_score) {
      let start = 0;
      const end = report.ats_score;
      const duration = 1500;
      const stepTime = Math.abs(Math.floor(duration / end));

      const timer = setInterval(() => {
        start += 1;
        setAnimatedScore(start);
        if (start === end) clearInterval(timer);
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [report?.ats_score]);

  const insertToDatabase = async (parsedReport) => {
    const { ats_score, strengths, weaknesses, suggestions } = parsedReport;

    if (!user?.gmail_id || !user?.username) {
      console.warn("User info missing. Cannot insert to DB.");
      return;
    }

    const { error } = await supabase
      .from('analysed_results')
      .insert([
        {
          gmail_id: user?.gmail_id,
          username: user?.username,
          ats_score,
          strengths,
          weaknesses,
          suggestions,
        },
      ]);

    if (error) {
      console.error("Supabase insert error:", error.message);
    } else {
      console.log("Inserted into DB successfully.");
    }
  };

  return (
    <div className="AnalyseResponsePage">
      <Header />
      <div className="AnalyseResponsePage-content" style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
        <h2>Analysed Report</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {report ? (
          <>
            <p><strong>ATS Score:</strong> <span className="ats-score">{animatedScore} / 100</span></p>

            <h3>Strengths</h3>
            <ul>
              {report.strengths?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <h3>Weaknesses</h3>
            <ul>
              {report.weaknesses?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <h3>Suggestions</h3>
            <ol>
              {report.suggestions?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ol>
          </>
        ) : (
          <p>Loading report...</p>
        )}
      </div>
      <Footer />
    </div>
  );
};
