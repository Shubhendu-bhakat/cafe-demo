'use client';

import { useState, useEffect, useRef } from 'react';
import ReviewCard from './ReviewCard';

interface Review {
  name: string;
  role: string;
  review: string;
  rating: number;
}

interface ReviewsCarouselProps {
  reviews: Review[];
}

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    if (!isAutoScrolling || !scrollContainerRef.current) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % reviews.length;
        
        // Smooth scroll to next card
        if (scrollContainerRef.current) {
          const cardWidth = scrollContainerRef.current.offsetWidth / 2; // 2 cards visible
          scrollContainerRef.current.scrollTo({
            left: (nextIndex * cardWidth) + (nextIndex * 20), // 20px gap
            behavior: 'smooth',
          });
        }
        
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoScrolling, reviews.length]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
    setIsAutoScrolling(false);
    
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth / 2;
      const nextIndex = (currentIndex - 1 + reviews.length) % reviews.length;
      scrollContainerRef.current.scrollTo({
        left: (nextIndex * cardWidth) + (nextIndex * 20),
        behavior: 'smooth',
      });
    }

    // Resume auto-scroll after 5 seconds
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    setIsAutoScrolling(false);

    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth / 2;
      scrollContainerRef.current.scrollTo({
        left: (currentIndex + 1) * cardWidth + ((currentIndex + 1) * 20),
        behavior: 'smooth',
      });
    }

    // Resume auto-scroll after 5 seconds
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  return (
    <div className="reviews-carousel-wrapper">
      <div 
        className="reviews-carousel-container" 
        ref={scrollContainerRef}
      >
        {reviews.map((review, index) => (
          <div key={index} className="carousel-slide">
            <ReviewCard
              name={review.name}
              role={review.role}
              review={review.review}
              rating={review.rating}
              delay={0}
            />
          </div>
        ))}
      </div>

      <button className="carousel-nav carousel-prev" onClick={handlePrevClick} title="Previous review">
        <i className="fas fa-chevron-left"></i>
      </button>
      <button className="carousel-nav carousel-next" onClick={handleNextClick} title="Next review">
        <i className="fas fa-chevron-right"></i>
      </button>

      <div className="carousel-indicators">
        {reviews.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            title={`Go to review ${index + 1}`}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoScrolling(false);
              
              if (scrollContainerRef.current) {
                const cardWidth = scrollContainerRef.current.offsetWidth / 2;
                scrollContainerRef.current.scrollTo({
                  left: (index * cardWidth) + (index * 20),
                  behavior: 'smooth',
                });
              }

              setTimeout(() => setIsAutoScrolling(true), 5000);
            }}
          ></button>
        ))}
      </div>
    </div>
  );
}
