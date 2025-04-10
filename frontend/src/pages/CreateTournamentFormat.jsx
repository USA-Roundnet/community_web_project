import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginPage.css';

const CreateTournamentFormat = () => {
  const [formData, setFormData] = useState({
    generalFormat: '',
    teamSize: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!formData.tournamentName || !formData.date || !formData.address1 || !formData.city || 
        !formData.state || !formData.zipCode || !formData.country) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/tournaments/create/registration', { replace: true });
    } catch (err) {
      setError('Tournament creation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ minHeight: '100vh', backgroundColor: 'lightgray' }}>
      <div className="login-card">
        <h1>Create Tournament</h1>
        <h2>Format</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>

          {/* Drop down menu?: Traditional (Pool Play & Bracket), Swiss, etc.
                Talk to Ben - add as many tournament formats as possible */}
          
          {/* Option 1: Traditional Tournament format = Pool Play + Bracket
                Check Fwango for tournament options? */}

          {/* Format 1: General Format */}
          <div className="form-group">
            <label htmlFor="format">Format</label>
            <select
              id="format"
              name="format"
              value={formData.format}
              onChange={handleChange}
              required
            >
              <option value="">Select format</option>
              <option value="traditonal">Tradional</option>
              <option value="swiss">Swiss</option>
              <option value="custom">Custom</option>
              <option value="other">other</option>
            </select>
          </div>

            {/* Format 2: Team Format */}
            <div className="form-group">
              <label htmlFor="teamSize">Gender</label>
              <select
                id="teamSize"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                required
              >
                <option value="">Select team size</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="squad">squad</option>
              </select>
            </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tournamentName">Tournament Name</label>
              <input
                type="text"
                id="tournamentName"
                name="tournamentName"
                value={formData.tournamentName}
                onChange={handleChange}
                placeholder="Tournament Name"
                required
              />
            </div>
          </div>

          {/* Row 2: Tournament Description */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="longText"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                optional
              />
            </div>
          </div>

          {/* Row 3: Date and Time */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="Date"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="12:00"
                optional
              />
            </div>
          </div>

          {/* Row 4,5,6: Location */}
          <label htmlFor="location">Location</label>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                id="address1"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                placeholder="Address 1"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                id="address2"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                placeholder="Address 2"
                optional
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="Zip"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="United States"
                required
              />
            </div>
          </div>

          <button type="next" disabled={isLoading}>
            {isLoading ? 'Next...' : 'Next'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTournamentFormat;