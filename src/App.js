import './App.css';
import { Route,Routes } from 'react-router-dom';
import { Home } from './Pages/Home';
import { About } from './Pages/About';
import { Question } from './Pages/Question';
import { Contact } from './Pages/Contact';
import { MissingPage } from './Pages/MissingPage';
import { Response } from './Pages/Response';
import { DataProvider } from './Context/DataProvider';
function App() {
  return (
    <div className="App">
      <DataProvider>
        <Routes>
          {/* <Route path='/' element={<Home/>}>
              <Route path='question' element={<Question/>}></Route>
              <Route path='response' element={<Response/>}></Route>
          </Route> */}
          <Route path='/' element={<Home/>}></Route>
          <Route path='/question' element={<Question/>} />
          <Route path='/response' element={<Response/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/*' element={<MissingPage/>}/>
        </Routes>
      </DataProvider>
    </div>
  );
}

export default App;
