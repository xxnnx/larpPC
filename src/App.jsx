import { Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ZonesSection from './components/Zones/ZonesSection';
import Gallery from './components/Gallery/Gallery';
import PopularGames from './components/PopularGames/PopularGames';
import Booking from './components/Booking/Booking';
import Footer from './components/Footer/Footer';

import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';

function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <ZonesSection />
      <Gallery />
      <PopularGames />
      <Booking />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/booking" element={<Booking />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;