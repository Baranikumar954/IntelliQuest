import React, { useState ,useContext,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetResponse } from '../Api/useGetResponse';
import DataContext from '../Context/DataProvider';
import { Header } from '../Components/Header';
import { Footer } from '../Components/Footer';
import '../PageStyles/Question.css';
import { supabase } from '../Api/supabaseClient';

export const Question = () => {

  const { setResponseData ,cmpny,setCmpny,qnType,setQnType,role,setRole,Experience,setExperience,setResumeText} = useContext(DataContext);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user); 
      } else {
        console.error("User is not logged in.");
      }
    };

    fetchUser();
  }, []);

  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [fileError, setFileError] = useState("");
  
  const [isProcessing, setIsProcessing] = useState(false); // ✅ Add loading state

  const { loading1, error, extractText, generateQuestions } = useGetResponse();

  const handleFileCheck = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);

    if (!file) {
      setFileError("No file selected");
      return;
    }

    const fileSize = file.size / (1024 * 1024);
    const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (isPDF && fileSize < 5) {
      setTimeout(() => setFileError(""), 500);
    } else {
      setFileError("File must be a PDF and less than 5MB.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true); // ✅ Start loading state

    if (fileError || !resumeFile) {
      alert("Please fix the file format issue before submitting.");
      setIsProcessing(false); // ✅ Stop loading state on error
      return;
    }

    if (loading1) {
      console.log("Loading...");
      return;
    }

    if (error) {
      alert(error);
      setIsProcessing(false);
      return;
    }

    try {
      const extractedText = await extractText(resumeFile);
      if (!extractedText) {
        // alert("Failed to extract text. Please try again.");
        setIsProcessing(false);
        return;
      }
      setResumeText(extractedText);
      const response = await generateQuestions(extractedText);
      if (response) {
        setResponseData(response);

        const gmail = user?.email;
        await supabase
  .from('users')
  .upsert([{ gmail_id: gmail }], { onConflict: ['gmail_id'] });
        

        const { data, error: insertError } = await supabase
          .from('interview_questions')
          .insert([{
            gmail_id: gmail, 
            company_name: cmpny,
            role_name: role,
            question_type: qnType,
            experience: Experience,
            response: JSON.stringify(response)
          }]);

        if (insertError) {
          console.error("Supabase insert error:", insertError);
          // alert("Failed to save data to database.");
        }

        navigate('/response', { state: { responseData: response } });
      } else {
        alert("Failed to fetch data. Please try again.");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false); // ✅ Stop loading state after API call
    }
  };

  return (
    <div className='QuestionPage'>
      <Header />
      <form onSubmit={handleSubmit} className='getResume'>
      <label htmlFor="resumeInput">
        <img src="https://cdn-icons-png.flaticon.com/512/337/337946.png" alt="Upload" className="form-icon" />
        Upload Your Resume
      </label>
      <input type="file" name="resumeInput" id="resumeInput" onChange={handleFileCheck} required />
      <p>File must be less than 5MB</p>
        {fileError && <p style={{ color: 'red' }} className='errorMessage'>{fileError}</p>}

        <br /><br />

        <label htmlFor='companiesPreDef'>
          <img src="https://cdn-icons-png.flaticon.com/512/2920/2920315.png" alt="Company" className="form-icon" />
          Select predefined companies
        </label>
        <select name="companiesPreDef" value={cmpny} id="companyList" onChange={(event) => setCmpny(event.target.value)}>
          <option value="zoho">Zoho</option>
          <option value="Amazon">Amazon</option>
          <option value="Facebook">Facebook</option>
          <option value="Google">Google</option>
          <option value="TCS">TCS</option>
          <option value="Accenture">Accenture</option>
          <option value="">Others</option>
        </select>

        <br /><br />

        <label htmlFor="jobRole">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Role" className="form-icon" />
          Select Job Role
        </label>
        <select name="jobRole" id="roleList" value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="Software Developer">Software Developer</option>
          <option value="Software Engineer">Software Engineer</option>
          <option value="Data Scientist">Data Scientist</option>
          <option value="Data Analyst">Data Analyst</option>
          <option value="Software Testing">Software Testing</option>
          <option value="Dev Ops">Dev Ops</option>
          <option value="other">others</option>
        </select>

        <br /><br />
        
        <label htmlFor="questionType">
          <img src="	https://cdn-icons-png.flaticon.com/512/2659/2659980.png" alt="Question Type" className="form-icon" />
          Select Question Type
        </label>
        <select name="questionType" value={qnType} id="questionTypeList" onChange={(event) => setQnType(event.target.value)}>
          <option value="Non-Technical">Non-Technical</option>
          <option value="Technical">Technical</option>
          <option value="Both">Both</option>
        </select>

        <br /><br />

        <label htmlFor="ExpOrFresh">
          <img src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png" alt="Experience" className="form-icon" />
          Select Your Experience
        </label>
        <select name="ExpOrFresh" id="experienceLevel" value={Experience} onChange={(event) => setExperience(event.target.value)}>
          <option value="Freshers">Fresher</option>
          <option value="1 to 5 years Experience"> 1 to 5</option>
          <option value="5+ years Experience"> 5+ years</option>
        </select>

        <br /><br />

        {isProcessing ? (
          <p style={{ color: "#00FFD1", fontWeight: "bold" }}>
            <img src="https://i.gifer.com/ZZ5H.gif" alt="Loading" width="40" /> Processing... Please wait
          </p>
        ) : (
          <button type='submit'>Generate Question</button>
        )}
      </form>
      <Footer />
    </div>
  );
};
