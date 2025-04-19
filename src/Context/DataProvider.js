import { createContext, useState } from "react";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const [responseData, setResponseData] = useState(null); // ✅ Shared state
    const [cmpny, setCmpny] = useState("");
    const [qnType, setQnType] = useState("Technical");
    const [role,setRole] = useState("");
    const [Experience,setExperience] = useState("fresher");
    const [isTaggled,setIsTaggled] = useState(true);

  return (
    <DataContext.Provider value={{ responseData, setResponseData,cmpny,setCmpny,qnType,setQnType ,role,setRole,Experience,setExperience,isTaggled,setIsTaggled
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;