
import './App.css';
import Registration from './Pages/Registration/Registration';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Pages/Login/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route  path="/" element= {<Registration/>}>
           
          </Route>
          <Route path="/login" element= {  <Login />}>
          
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
