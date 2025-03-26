import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage.jsx';
import CreateAccountPage from './components/CreateAccountPage.jsx';
import Grid from './components/Grid.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} /> {/* New route */}
        <Route path="/dashboard" element=
        {<div>
          <Navbar />
          <Hero />
          <Grid />
        </div>} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
