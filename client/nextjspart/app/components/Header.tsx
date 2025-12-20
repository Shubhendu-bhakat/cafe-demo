'use client';

import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div 
          id="menu-btn" 
          className={`fas fa-bars ${isMenuOpen ? 'fa-times' : ''}`}
          onClick={toggleMenu}
        ></div>

        <a href="#" className="logo">
          <span className="logo-icon">☕</span>
          <span className="logo-text">brew & bean</span>
        </a>

        <nav className={`navbar ${isMenuOpen ? 'active' : ''}`}>
          <a href="#home" onClick={() => setIsMenuOpen(false)}>home</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)}>about</a>
          <a href="#menu" onClick={() => setIsMenuOpen(false)}>menu</a>
          <a href="#gallery" onClick={() => setIsMenuOpen(false)}>gallery</a>
          <a href="#book" onClick={() => setIsMenuOpen(false)}>contact</a>
        </nav>

        <a href="#book" className="btn btn-header">book now</a>
      </header>

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-background">
          <img src="/image/back1.jpg" alt="Coffee Shop" className="hero-bg-image" />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="hero-text" data-aos="fade-down" data-aos-duration="1000">
            <h1 className="hero-title">Welcome to Brew & Bean</h1>
            <p className="hero-subtitle">Discover the Perfect Blend of Taste & Atmosphere</p>
          </div>

          <div className="hero-image" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
            <img src="/image/home-img-1.png" alt="Featured Coffee" className="featured-image" />
          </div>
        </div>

        <div className="hero-cards">
          <div className="hero-card" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
            <i className="fas fa-leaf"></i>
            <h3>100% Pure</h3>
            <p>Organic & Fresh</p>
          </div>
          <div className="hero-card" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
            <i className="fas fa-fire"></i>
            <h3>Premium Quality</h3>
            <p>Handpicked Beans</p>
          </div>
          <div className="hero-card" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
            <i className="fas fa-heart"></i>
            <h3>Crafted with Love</h3>
            <p>Expert Baristas</p>
          </div>
        </div>

        <a href="#about" className="scroll-indicator">
          <span></span>
          <span></span>
          <span></span>
        </a>
      </section>
    </>
  );
}
