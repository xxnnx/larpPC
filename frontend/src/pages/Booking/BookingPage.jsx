import { Link } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';
import './BookingPage.css';

import Booking from '../../components/Booking/Booking';

function BookingPage() {
  return (
    <main className="booking-page">

      <div className="booking-page__top">
        <Link
          to="/"
          className="booking-page__back"
        >
          <LuArrowLeft />
          <span>На главную</span>
        </Link>
      </div>

      <Booking />

    </main>
  );
}

export default BookingPage;