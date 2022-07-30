import LoginForm from './components/LoginPage';
import HomeComponent from './components/HomeComponent';

import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

/*
  steps
  implement react-redux ,
  redux-saga -> just another action is dispatched after it is delayed
  css
  seperation of concerns
  */

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
