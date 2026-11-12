import { Link, Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ZonesSection from './components/Zones/ZonesSection';
import Gallery from './components/Gallery/Gallery';
import PopularGames from './components/PopularGames/PopularGames';
import Booking from './components/Booking/Booking';
import Footer from './components/Footer/Footer';
import Prices from './components/Prices/Prices';
import './App.css';

import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import Admin from './pages/Admin/Admin';
import ZoneDetails from './pages/ZoneDetails/ZoneDetails';


function HomePage() {
  return (
    <>
      <a href="#home" className="skip-link">Перейти к содержимому</a>
      <Header />
      <main>
      <Hero />
      <ZonesSection />
      <Prices />
      <Gallery />
      <PopularGames />
      <section className="booking-cta" id="booking"><div><span className="section-kicker">Время играть</span><h2>Увидимся в GAMESENSE</h2><p>Выбери зону, удобное время и своё игровое место.</p></div><Link to="/booking" className="hero__button">Забронировать место <span aria-hidden="true">↗</span></Link></section>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><Admin /></ProtectedRoute>} />
      <Route path="/" element={<HomePage />} />

      <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      
      <Route path="/zones/:id" element={<ZoneDetails />} />

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
