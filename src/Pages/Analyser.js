import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../Components/Header";
import { Footer } from "../Components/Footer";
import { useGetResponse } from "../Api/useGetResponse";
import DataContext from "../Context/DataProvider";
import '../PageStyles/Analyser.css';

export const Analyser=()=>{
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false); 
    const [fileError,setFileError] = useState("");
    const [resumeFile,setResumeFile] = useState(null);

    const {setResumeText,setAnalyseResponseData} = useContext(DataContext);

    const {loading2,error,extractText,generateSuggestions} = useGetResponse();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setIsProcessing(true);
        if(fileError || !resumeFile){
            alert("Please fix the file format issue before submitting.");
            setIsProcessing(false); // ✅ Stop loading state on error
            return;
        }
        
        if (loading2) {
            console.log("Loading...");
            return;
        }
    
        if (error) {
            alert(error);
            setIsProcessing(false);
            return;
        }
        try{
            const extractedText = await extractText(resumeFile);
            if(!extractedText){
                alert("Failed to extract text. Please try again.");
                setIsProcessing(false);
                return;
            }
            setResumeText(extractedText);
            const response = await generateSuggestions(extractedText);
            if(response){
                setAnalyseResponseData(response);
                navigate('/analyserResponse',{state:{analyseResponseData:response}});
            }else{
                alert("Failed to fetch data. Please try again.no res");
            }
        }catch(err){
            alert("An error occured.Plase try again");
            console.error(err);
        }finally{
            setIsProcessing(false);
        }
    };
    const handleFileCheck = async(e)=>{
        const file = e.target.files[0];
        setResumeFile(file);
        if(!file){
            setFileError("No file selected");
            return;
        }
        const fileSize = file.size / (1024 * 1024);
        const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
        if(isPDF && fileSize<5){
            setTimeout(()=>setFileError(""),500);
        }else{
            setFileError("File must be a PDF and less than 5MB.");
        }
    };
    return(
        <div className='analyserPage'>
            <Header/>
            <div className='analyse-section'>
                <form onSubmit={handleSubmit} className="getResume">
                    <label htmlFor="resumeInput">Upload Your Resume</label>
                    <input type="file" name="resumeInput" id="resumeInput" onChange={handleFileCheck} required/>
                    <p>File must be less than 5MB</p>
                    {fileError && <p style={{color:'red'}} className="errorMessage">{fileError}</p>}
                    <br /><br />
                    {isProcessing ? (
                        <p style={{ color: "#00FFD1", fontWeight: "bold" }}>Processing...Please wait</p>
                    ):(
                        <button type='submit' style={{backgroundColor:'#2563eb'}}>Analyse Resume</button>
                    )}
                </form>
            </div>
            <Footer/>
        </div>
    );
};