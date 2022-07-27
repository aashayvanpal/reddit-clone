import LoginForm from './components/LoginPage';
import HomeComponent from './components/HomeComponent';

import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

// 1. Login page
// Use the login API to redirect the user to Reddit’s authorization page.Use a local storage mechanism to store the OAuth token returned by Reddit.


function App() {
  return (
    <div>
      for reddit clone application<br />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LoginForm />} />
          <Route exact path="/home" element={<HomeComponent />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
