'use client';

import { useState, useEffect, useRef } from 'react';

interface GalleryImage {
  image: string;
  title: string;
  description: string;
}

interface GalleryCarouselProps {
  images: GalleryImage[];
}

export default function GalleryCarousel({ images }: GalleryCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isAutoScrolling || focusedIndex !== null || !scrollContainerRef.current) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        
        if (scrollContainerRef.current) {
          const cardWidth = scrollContainerRef.current.offsetWidth / 2.5;
          scrollContainerRef.current.scrollTo({
            left: (nextIndex * (cardWidth + 32)),
            behavior: 'smooth',
          });
        }
        
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoScrolling, focusedIndex, images.length]);

  const handlePrevClick = () => {
    const nextIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(nextIndex);
    setIsAutoScrolling(false);
    
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth / 2.5;
      scrollContainerRef.current.scrollTo({
        left: (nextIndex * (cardWidth + 32)),
        behavior: 'smooth',
      });
    }

    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  const handleNextClick = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setIsAutoScrolling(false);

    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth / 2.5;
      scrollContainerRef.current.scrollTo({
        left: (nextIndex * (cardWidth + 32)),
        behavior: 'smooth',
      });
    }

    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  const handleContainerClick = () => {
    setIsAutoScrolling(!isAutoScrolling);
  };

  const handleCardClick = (index: number) => {
    setFocusedIndex(index);
    setIsAutoScrolling(false);
  };

  const handleCloseFocus = () => {
    setFocusedIndex(null);
    setTimeout(() => setIsAutoScrolling(true), 1000);
  };

  return (
    <div className="gallery-carousel-wrapper">
      <div 
        className="gallery-carousel-container" 
        ref={scrollContainerRef}
        onClick={handleContainerClick}
      >
        {images.map((item, index) => (
          <div 
            key={index} 
            className={`gallery-card-slide ${focusedIndex === index ? 'focused' : ''}`}
            data-aos="fade-left" 
            data-aos-duration="800" 
            data-aos-delay={index * 100}
            onClick={() => handleCardClick(index)}
          >
            <div className="gallery-card-image">
              <img 
                src={item.image} 
                alt={item.title}
                onError={(e) => {
                  console.log('Image failed to load:', item.image);
                  (e.target as HTMLImageElement).src = '/image/placeholder.jpg';
                }}
              />
              <div className="gallery-card-overlay">
                <p className="click-to-focus-hint">Click to focus</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="gallery-nav-btn gallery-prev-btn" onClick={handlePrevClick} title="Previous">
        <i className="fas fa-chevron-left"></i>
      </button>
      <button className="gallery-nav-btn gallery-next-btn" onClick={handleNextClick} title="Next">
        <i className="fas fa-chevron-right"></i>
      </button>

      <div className="gallery-status">
        <span className="status-text">{isAutoScrolling ? '▶ Auto-scrolling' : '⏸ Paused - Click to resume'}</span>
        <div className="gallery-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`gallery-dot ${index === currentIndex ? 'active' : ''} ${focusedIndex === index ? 'focused' : ''}`}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoScrolling(false);
                
                if (scrollContainerRef.current) {
                  const cardWidth = scrollContainerRef.current.offsetWidth / 2.5;
                  scrollContainerRef.current.scrollTo({
                    left: (index * (cardWidth + 20)),
                    behavior: 'smooth',
                  });
                }

                setTimeout(() => setIsAutoScrolling(true), 5000);
              }}
            ></button>
          ))}
        </div>
      </div>

      {focusedIndex !== null && (
        <div className="gallery-modal-overlay" onClick={handleCloseFocus}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseFocus}>
              <i className="fas fa-times"></i>
            </button>
            <div className="modal-image">
              <img 
                src={images[focusedIndex].image} 
                alt={images[focusedIndex].title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/image/placeholder.jpg';
                }}
              />
            </div>
            <div className="modal-info">
              <h2>{images[focusedIndex].title}</h2>
              <p>{images[focusedIndex].description}</p>
              <p className="modal-hint">Click outside or press X to close</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
