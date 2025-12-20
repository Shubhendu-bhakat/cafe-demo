'use client';

import { useState } from 'react';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/bookings/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          numberOfPeople: parseInt(formData.guests),
          specialRequest: formData.message || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      console.log('Booking successful:', data);
      setSubmitted(true);

      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          guests: '2',
          message: '',
        });
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="booking" id="book">
      <h1 className="heading">
        book a table <span>reserve your spot</span>
      </h1>

      <div className="booking-container">
        <div className="booking-info">
          <h3>Why Book With Us?</h3>
          <ul className="info-list">
            <li>
              <i className="fas fa-check"></i>
              <span>Guaranteed seating at your preferred time</span>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <span>Special welcome drinks for reservations</span>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <span>Personalized service experience</span>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <span>Perfect for celebrations and meetings</span>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <span>Free parking available</span>
            </li>
          </ul>

          <div className="contact-info">
            <div className="info-item">
              <i className="fas fa-phone"></i>
              <div>
                <h4>Call Us</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h4>Visit Us</h4>
                <p>123 Coffee Street, City, Country</p>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-clock"></i>
              <div>
                <h4>Hours</h4>
                <p>Mon-Fri: 7AM-9PM</p>
              </div>
            </div>
          </div>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          {submitted ? (
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              <h3>Booking Confirmed!</h3>
              <p>Thank you for your reservation. We&apos;ll contact you at {formData.email} shortly!</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="error-message" style={{ color: '#d32f2f', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#ffebee', borderRadius: '4px' }}>
                  <i className="fas fa-exclamation-circle"></i> {error}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Time *</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="guests">Number of Guests</label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                    <option value="6">6 Guests</option>
                    <option value="7">7+ Guests</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Special Requests (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any special requirements or occasion details..."
                  rows={4}
                ></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                <i className="fas fa-check"></i> {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
