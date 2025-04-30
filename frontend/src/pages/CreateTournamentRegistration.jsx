import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginPage.css';
import Checkbox from '../components/Checkbox';

const CreateTournamentRegistration = () => {
  const [formData, setFormData] = useState({
    deadline: '',
    availability: '',
    divisionsType: '',
    numDivisons: 1,
    divisions: [{
      divisionName: '',
      playersPerTeam: 1,
      maxTeams: ''
    }]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
    
  //   setFormData((prev) => {
  //     let updatedData = {
  //       ...prev,
  //       [name]: name === 'numDivisons' ? parseInt(value) : value
  //     };
  
  //     // Handle updating divisions array only when numDivisons changes
  //     if (name === 'numDivisons') {
  //       const num = parseInt(value) || 1;
  //       updatedData.divisions = Array.from({ length: num }, (_, i) =>
  //         prev.divisions[i] || { divisionName: '', playersPerTeam: '', maxTeams: '' }
  //       );
  //     }
  
  //     return updatedData;
  //   });

  //   if (formData.divisionsType == "usar") {
  //     // Use formData.divisionsType == "usar" && "html"
  //     // Create usar Divisions checkbox component to display
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Match inputs like "divisionName-0", "playersPerTeam-1", etc.
    const divisionMatch = name.match(/^(divisionName|playersPerTeam|maxTeams)-(\d+)$/);
  
    if (divisionMatch) {
      const field = divisionMatch[1]; // e.g., "divisionName"
      const index = parseInt(divisionMatch[2]); // e.g., 0, 1, 2
  
      setFormData((prev) => {
        const updatedDivisions = [...prev.divisions];
        updatedDivisions[index] = {
          ...updatedDivisions[index],
          [field]: value
        };
        return { ...prev, divisions: updatedDivisions };
      });
    } else {
      setFormData((prev) => {
        const updated = {
          ...prev,
          [name]: name === 'numDivisons' ? parseInt(value) : value
        };
  
        if (name === 'numDivisons') {
          const num = parseInt(value) || 1;
          updated.divisions = Array.from({ length: num }, (_, i) =>
            prev.divisions[i] || { divisionName: '', playersPerTeam: 1, maxTeams: '' }
          );
        }
  
        return updated;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!formData.deadline ) {
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
        <h2>Registration Info</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>

          {/* Option 1: Registration Deadline */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="deadline">Registration Deadline</label>
              <select
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              >
                <option value="">Select deadline</option>
                <option value="1day">1 Day before tournament</option>
                <option value="2day">2 Days before tournament</option>
                <option value="1week">1 Week before tournament</option>
                <option value="2week">2 Weeks before tournament</option>
                <option value="1month">1 Month before tournament</option>
                <option value="2month">2 Months before tournament</option>
                <option value="other">other</option>
              </select>
            </div>

            {/* Option 2: Tournament Availability */}
            <div className="form-group">
              <label htmlFor="availability">Tournament Availability</label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required
              >
                <option value="">Select availability</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          {/* Divsions for Registration */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="divisionsType">USAR Divisons or Custom Divisions</label>
              <select
                id="divisionsType"
                name="divisionsType"
                value={formData.divisionsType}
                onChange={handleChange}
                required
              >
                <option value="">Select type</option>
                <option value="custom">Custom Divisions</option>
                <option value="usar">USAR Divisions</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="numDivisons"># of Divisions</label>
              <input
                type="number"
                id="numDivisons"
                name="numDivisons"
                value={formData.numDivisons}
                onChange={handleChange}
                placeholder="# of Divisions"
                required
              />
            </div>
          </div>

          {/* <pre>{JSON.stringify(formData.divisions, null, 2)}</pre> */}

          {/* Display once for each division*/}
          {formData.divisions.map((division, index) => (
            <div key={index}>
              <h2>Division #{index + 1}</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`divisionName-${index}`}>Division Name</label>
                  <input
                    type="text"
                    id={`divisionName-${index}`}
                    name={`divisionName-${index}`}
                    value={division.divisionName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`playersPerTeam-${index}`}>Players per Team</label>
                  <input
                    type="number"
                    id={`playersPerTeam-${index}`}
                    name={`playersPerTeam-${index}`}
                    value={division.playersPerTeam}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`maxTeams-${index}`}>Max # of Teams</label>
                  <input
                    type="number"
                    id={`maxTeams-${index}`}
                    name={`maxTeams-${index}`}
                    value={division.maxTeams}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          <button type="next" disabled={isLoading}>
            {isLoading ? 'Next...' : 'Next'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTournamentRegistration;