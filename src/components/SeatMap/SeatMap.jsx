import './SeatMap.css';
import { LuMonitor } from 'react-icons/lu'; 

function SeatMap({ computers, selectedSeat, onSelect }) {
  // computers - массив компов с бэка
  // selectedSeat - ID выбранного сейчас компа
  // onSelect - функция, которая срабатывает при клике на комп

  return (
    <div className="seat-map-container">
      
      
      <div className="seat-map-legend">
        <div className="legend-item">
          <span className="legend-color free"></span> Можно выбрать
        </div>
        <div className="legend-item">
          <span className="legend-color busy"></span> Недоступно
        </div>
        <div className="legend-item">
          <span className="legend-color selected"></span> Выбрано
        </div>
      </div>

      
      <div className="seat-map-grid">
        {computers.map((pc) => {
          const isBusy = pc.status !== 'AVAILABLE';
          const isSelected = String(selectedSeat) === String(pc.id);

          return (
            <button
              type="button"
              aria-pressed={isSelected}
              title={pc.status === 'MAINTENANCE' ? 'На обслуживании' : pc.status === 'DISABLED' ? 'Отключено' : pc.name}
              key={pc.id}
              className={`seat-card ${isBusy ? 'busy' : 'free'} ${isSelected ? 'selected' : ''}`}
              disabled={isBusy}
              onClick={() => onSelect(pc.id)}
            >
              <div className="seat-monitor">
               
                <LuMonitor />
              </div>
              <span className="seat-number">{pc.name || ('Место ' + pc.number)}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}

export default SeatMap;
