'use client';

import { useEffect, useRef } from 'react';

interface ReviewCardProps {
  name: string;
  role: string;
  review: string;
  rating: number;
  delay?: number;
}

export default function ReviewCard({ 
  name, 
  role, 
  review,
  rating,
  delay = 0 
}: ReviewCardProps) {
  const cardRef = useRef(null);

  useEffect(() => {
    const AOS = require('aos');
    
    if (cardRef.current) {
      AOS.init({
        duration: 1000,
        once: false,
        offset: 100,
      });
      AOS.refresh();
    }
  }, []);

  return (
    <div 
      ref={cardRef}
      className="review-card" 
      data-aos="fade-up" 
      data-aos-duration="1000"
      data-aos-delay={delay}
    >
      <div className="review-header">
        <div className="review-stars">
          {[...Array(5)].map((_, i) => (
            <i 
              key={i}
              className={`fas fa-star ${i < rating ? 'filled' : ''}`}
            ></i>
          ))}
        </div>
        <i className="fas fa-quote-left quote-icon"></i>
      </div>
      <p className="review-text">{review}</p>
      <div className="review-footer">
        <h4 className="review-name">{name}</h4>
        <span className="review-role">{role}</span>
      </div>
    </div>
  );
}
