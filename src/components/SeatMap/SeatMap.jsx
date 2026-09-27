import './SeatMap.css';
import { LuMonitor } from 'react-icons/lu'; // Если используешь lucide-react, или оставь просто текст/эмодзи

function SeatMap({ computers, selectedSeat, onSelect }) {
  // computers - массив компов с бэка
  // selectedSeat - ID выбранного сейчас компа
  // onSelect - функция, которая срабатывает при клике на комп

  return (
    <div className="seat-map-container">
      
      {/* Легенда цветов */}
      <div className="seat-map-legend">
        <div className="legend-item">
          <span className="legend-color free"></span> Свободно
        </div>
        <div className="legend-item">
          <span className="legend-color busy"></span> Занято
        </div>
        <div className="legend-item">
          <span className="legend-color selected"></span> Выбрано
        </div>
      </div>

      {/* Сама сетка компьютеров */}
      <div className="seat-map-grid">
        {computers.map((pc) => {
          const isBusy = pc.status === 'OCCUPIED';
          const isSelected = selectedSeat === pc.id;

          return (
            <button
              key={pc.id}
              className={`seat-card ${isBusy ? 'busy' : 'free'} ${isSelected ? 'selected' : ''}`}
              disabled={isBusy}
              onClick={() => onSelect(pc.id)}
            >
              <div className="seat-monitor">
               
                <LuMonitor />
              </div>
              <span className="seat-number">{pc.number}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}

export default SeatMap;