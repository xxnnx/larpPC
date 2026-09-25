import { useState } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import './Gallery.css';

import gallery1 from '../../assets/gallery-1.jpg';
import gallery2 from '../../assets/gallery-2.jpg';
import gallery3 from '../../assets/gallery-3.jpg';
import gallery4 from '../../assets/gallery-4.jpg';

function Gallery() {
  const images = [
    {
      src: gallery1,
      alt: 'Игровая зона компьютерного клуба',
    },
    {
      src: gallery2,
      alt: 'Игровые компьютеры',
    },
    {
      src: gallery3,
      alt: 'Игровое место',
    },
    {
      src: gallery4,
      alt: 'Зона отдыха',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % images.length
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const getImageIndex = (offset) => {
    return (
      (currentIndex + offset + images.length) %
      images.length
    );
  };

  const currentImage = images[currentIndex];
  const previousImage = images[getImageIndex(-1)];
  const nextImage = images[getImageIndex(1)];

  return (
    <section className="gallery" id="gallery">
      <div className="gallery__container">

        <div className="gallery__header">
          <span className="gallery__eyebrow">
            НАША АТМОСФЕРА
          </span>

          <h2 className="gallery__title">
            ПОСМОТРИ,
            <br />
            <span>ГДЕ ТЫ БУДЕШЬ ИГРАТЬ</span>
          </h2>
        </div>

        <div className="gallery__slider">

          <button
            className="gallery__arrow gallery__arrow--left"
            type="button"
            onClick={goToPrevious}
            aria-label="Предыдущее фото"
          >
            <LuChevronLeft />
          </button>

          <div className="gallery__side gallery__side--left">
            <img
              src={previousImage.src}
              alt={previousImage.alt}
            />
          </div>

          <div className="gallery__main">
            <img
              src={currentImage.src}
              alt={currentImage.alt}
            />
          </div>

          <div className="gallery__side gallery__side--right">
            <img
              src={nextImage.src}
              alt={nextImage.alt}
            />
          </div>

          <button
            className="gallery__arrow gallery__arrow--right"
            type="button"
            onClick={goToNext}
            aria-label="Следующее фото"
          >
            <LuChevronRight />
          </button>

        </div>

        <div className="gallery__bottom">

          <div className="gallery__dots">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`gallery__dot ${
                  index === currentIndex
                    ? 'gallery__dot--active'
                    : ''
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Открыть фото ${index + 1}`}
              />
            ))}
          </div>

          <span className="gallery__counter">
            {String(currentIndex + 1).padStart(2, '0')}
            {' / '}
            {String(images.length).padStart(2, '0')}
          </span>

        </div>

      </div>
    </section>
  );
}

export default Gallery;