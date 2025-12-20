import Script from "next/script";
import GalleryCard from "@/components/GalleryCard";
import MenuItem from "@/components/MenuItem";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import BookingForm from "@/components/BookingForm";
import Header from "@/components/Header";

export default function HomePage() {
  return (
    <>
      {/* External CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/swiper@7/swiper-bundle.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />
      <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
      <link rel="stylesheet" href="/css/style.css" />

      {/* HEADER */}
      <Header />

      {/* ABOUT */}
      <section className="about" id="about">
        <h1 className="heading">
          about us <span>why choose us</span>
        </h1>

        <div className="row">
          <div className="image">
            <img src="/image/about-img.png" alt="" />
          </div>

          <div className="content">
            <h3 className="title">what's make our coffee special!</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
            <a href="#" className="btn">read more</a>
          </div>
        </div>
      </section>

      {/* MENU SECTION */}
      <section className="menu" id="menu">
        <h1 className="heading">
          our menu <span>taste the best</span>
        </h1>

        <div className="menu-grid">
          <MenuItem 
            image="/image/menu-1.png"
            title="Espresso"
            description="Bold and rich single shot of pure coffee"
            price="3.99"
            delay={0}
          />
          <MenuItem 
            image="/image/menu-2.png"
            title="Cappuccino"
            description="Creamy espresso with velvety steamed milk"
            price="4.99"
            delay={100}
          />
          <MenuItem 
            image="/image/menu-3.png"
            title="Latte"
            description="Smooth espresso with hot milk and foam"
            price="4.99"
            delay={200}
          />
          <MenuItem 
            image="/image/menu-4.png"
            title="Mocha"
            description="Rich chocolate blended with espresso"
            price="5.49"
            delay={300}
          />
          <MenuItem 
            image="/image/menu-5.png"
            title="Americano"
            description="Espresso shots diluted with hot water"
            price="3.49"
            delay={400}
          />
          <MenuItem 
            image="/image/menu-6.png"
            title="Cold Brew"
            description="Smooth and chilled coffee perfection"
            price="4.49"
            delay={500}
          />
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="reviews" id="reviews">
        <h1 className="heading">
          customer reviews <span>what they say</span>
        </h1>

        <ReviewsCarousel 
          reviews={[
            {
              name: "Sarah Johnson",
              role: "Regular Customer",
              review: "The best coffee shop in town! The atmosphere is cozy and the baristas are incredibly friendly. I come here every morning!",
              rating: 5,
            },
            {
              name: "Michael Chen",
              role: "Coffee Enthusiast",
              review: "Outstanding quality! Their beans are fresh and the latte art is absolutely beautiful. Worth every penny.",
              rating: 5,
            },
            {
              name: "Emma Williams",
              role: "Business Owner",
              review: "Perfect place for business meetings. Great WiFi, comfortable seating, and amazing pastries. Highly recommended!",
              rating: 5,
            },
            {
              name: "David Martinez",
              role: "Food Blogger",
              review: "Their espresso has the perfect crema and the food pairs beautifully with every drink. A gem of a cafe!",
              rating: 4,
            },
          ]}
        />
      </section>

      {/* GALLERY SECTION */}
      <section className="gallery" id="gallery">
        <h1 className="heading">
          our cafe <span>gallery</span>
        </h1>

        <div className="gallery-container">
          <GalleryCard 
            image="/image/pic-1.png"
            title="Cozy Ambiance"
            description="Experience our warm and welcoming café atmosphere"
            delay={0}
          />
          <GalleryCard 
            image="/image/pic-2.png"
            title="Artisan Coffee"
            description="Freshly brewed with premium quality beans"
            delay={100}
          />
          <GalleryCard 
            image="/image/pic-3.png"
            title="Delicious Treats"
            description="Perfectly paired pastries and snacks"
            delay={200}
          />
          <GalleryCard 
            image="/image/pic-4.png"
            title="Great Company"
            description="Perfect place to meet friends and relax"
            delay={300}
          />
        </div>
      </section>

      {/* BOOKING SECTION */}
      <BookingForm />

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>about us</h3>
            <p>We serve the finest coffee and pastries in town, crafted with passion and dedication to quality.</p>
            <div className="social-links">
              <a href="#" className="fab fa-facebook-f"></a>
              <a href="#" className="fab fa-twitter"></a>
              <a href="#" className="fab fa-instagram"></a>
              <a href="#" className="fab fa-linkedin-in"></a>
            </div>
          </div>

          <div className="footer-section">
            <h3>quick links</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#menu">Menu</a></li>
              <li><a href="#review">Reviews</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>opening hours</h3>
            <ul>
              <li>Monday - Friday: 7:00 AM - 9:00 PM</li>
              <li>Saturday: 8:00 AM - 10:00 PM</li>
              <li>Sunday: 8:00 AM - 8:00 PM</li>
              <li>Closed on Public Holidays</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>contact info</h3>
            <ul>
              <li><i className="fas fa-phone"></i> +1 (555) 123-4567</li>
              <li><i className="fas fa-envelope"></i> info@coffee.com</li>
              <li><i className="fas fa-map-marker-alt"></i> 123 Coffee Street, City, Country</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Coffee Shop. All rights reserved. | Designed with ☕ by Your Team</p>
        </div>
      </footer>
      
      {/* Swiper Script */}
      <Script
        src="https://unpkg.com/swiper@7/swiper-bundle.min.js"
        strategy="afterInteractive"
      />
      {/* Swiper Script */}
      <Script
        src="https://unpkg.com/swiper@7/swiper-bundle.min.js"
        strategy="afterInteractive"
      />
      <Script src="/js/script.js" strategy="afterInteractive" />
    </>
  );
}
