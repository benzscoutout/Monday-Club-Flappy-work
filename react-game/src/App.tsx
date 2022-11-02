import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import LandingComponent from "./component/landing";
import 'bootstrap/dist/css/bootstrap.min.css';
function App()  {

 
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<LandingComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
