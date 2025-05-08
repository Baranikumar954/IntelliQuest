import { createContext, useState ,useEffect} from "react";
import { supabase } from "../Api/supabaseClient";
const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const [responseData, setResponseData] = useState(null); // ✅ Shared state
    const [cmpny, setCmpny] = useState("");
    const [qnType, setQnType] = useState("Technical");
    const [role,setRole] = useState("");
    const [Experience,setExperience] = useState("fresher");
    const [user, setUser] = useState(null);
    const [loading,setLoading] =useState(true);
    const [resumeText,setResumeText] = useState(null);
    const [isTaggled,setIsTaggled] = useState(true);
    const [analyseResponseData,setAnalyseResponseData]= useState(null);
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
    

  return (
    <DataContext.Provider value={{user,analyseResponseData,setAnalyseResponseData,user,setUser,loading,setLoading,responseData, resumeText,setResumeText,setResponseData,cmpny,setCmpny,qnType,setQnType ,role,setRole,Experience,setExperience,isTaggled,setIsTaggled
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;