import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import UserInformation from './components/dashboard/UserInformation';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage';
import NavBar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-information" element={<UserInformation />} />
      </Routes>
    </Router>
  );
}

export default App;
