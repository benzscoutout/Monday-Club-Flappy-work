import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import LandingComponent from "./component/landing";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactGA from "react-ga4";
import LeaderBoardComponent from "./component/leader-board/leader-board";
function App()  {

 
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<LandingComponent />} />
        <Route path="/leaderboard" element={<LeaderBoardComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
ReactGA.initialize("G-WETKB53SN1");