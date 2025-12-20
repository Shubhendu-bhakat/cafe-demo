'use client';

import { useEffect, useRef } from 'react';

interface GalleryCardProps {
  image: string;
  title: string;
  description: string;
  delay?: number;
}

export default function GalleryCard({ 
  image, 
  title, 
  description,
  delay = 0 
}: GalleryCardProps) {
  const cardRef = useRef(null);

  useEffect(() => {
    // Dynamically import AOS to avoid hydration mismatch
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
      className="gallery-card" 
      data-aos="fade-up" 
      data-aos-duration="1000"
      data-aos-delay={delay}
    >
      <div className="card-image">
        <img src={image} alt={title} />
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}
