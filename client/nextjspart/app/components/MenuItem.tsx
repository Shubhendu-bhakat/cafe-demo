'use client';

import { useEffect, useRef } from 'react';

interface MenuItemProps {
  image: string;
  title: string;
  description: string;
  price: string;
  delay?: number;
}

export default function MenuItem({ 
  image, 
  title, 
  description,
  price,
  delay = 0 
}: MenuItemProps) {
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
      className="menu-item" 
      data-aos="zoom-in" 
      data-aos-duration="1000"
      data-aos-delay={delay}
    >
      <div className="menu-item-image">
        <img src={image} alt={title} />
        <span className="price-badge">${price}</span>
      </div>
      <div className="menu-item-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <button className="add-btn">
          <i className="fas fa-plus"></i> Add to Order
        </button>
      </div>
    </div>
  );
}
