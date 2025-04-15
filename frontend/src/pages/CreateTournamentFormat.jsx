import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginPage.css';

const CreateTournamentFormat = () => {
  const [formData, setFormData] = useState({
    format: '',
    bracketStyle: '',
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

    if (!formData.format || !formData.bracketStyle) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }

    if (formData.format != 'traditional') {
      setError('Only Traditional Format is currently supported.');
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

          <div className="form-row">
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
                <option value="traditional">Tradional (Pool play + Bracket)</option>
                {/*<option value="swiss">Swiss</option>*/}
                <option value="custom">Custom</option>
                <option value="other">other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            {/* Format 2: Bracket Style */}
            <div className="form-group">
              <label htmlFor="bracketStyle">Bracket Style</label>
              <select
                id="bracketStyle"
                name="bracketStyle"
                value={formData.bracketStyle}
                onChange={handleChange}
                required
              >
                <option value="">Select Bracket</option>
                <option value="single">Single Elimination</option>
                <option value="double">Double Elimination</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            {/* Row 3: Tournament Rules */}
            <div className="form-group">
              <label htmlFor="rules">Rules</label>
              <input
                type="longText"
                id="rules"
                name="rules"
                value={formData.rules}
                onChange={handleChange}
                placeholder="Ruleset"
                optional
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