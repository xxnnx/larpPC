
import './SeatMap.css';
import { LuMonitor } from 'react-icons/lu';

function SeatMap({
  computers,
  selectedSeat,
  onSelect,
  availableComputerIds
}) {
  return (
    <div className="seat-map-container">

      <div className="seat-map-legend">
        <div className="legend-item">
          <span className="legend-color free"></span>
          Можно выбрать
        </div>

        <div className="legend-item">
          <span className="legend-color busy"></span>
          Недоступно
        </div>

        <div className="legend-item">
          <span className="legend-color selected"></span>
          Выбрано
        </div>
      </div>

      <div className="seat-map-grid">
        {computers.map((pc) => {
          const isSelected = String(selectedSeat) === String(pc.id);

          // Проверяем общий статус компьютера
          const hasAvailableStatus = pc.status === 'AVAILABLE';

          // Проверяем доступность на выбранное время
          const isAvailableForTime =
            availableComputerIds !== null &&
            availableComputerIds !== undefined &&
            availableComputerIds.includes(String(pc.id));

          // Компьютер недоступен, если не прошёл хотя бы одну проверку
          const isBusy = !hasAvailableStatus || !isAvailableForTime;

          return (
            <button
              type="button"
              key={pc.id}
              aria-pressed={isSelected}
              title={
                !hasAvailableStatus
                  ? 'Компьютер недоступен'
                  : !isAvailableForTime
                    ? 'Занято на выбранное время'
                    : pc.name
              }
              className={`seat-card ${isBusy ? 'busy' : 'free'} ${isSelected ? 'selected' : ''}`}
              disabled={isBusy}
              onClick={() => onSelect(pc.id)}
            >
              <div className="seat-monitor">
                <LuMonitor />
              </div>

              <span className="seat-number">
                {pc.name || `Место ${pc.number}`}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}

export default SeatMap;
