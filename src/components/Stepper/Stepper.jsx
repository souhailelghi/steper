import React, { useEffect, useState } from "react";
import axios from "axios";
import { TiTick } from "react-icons/ti";
import "./stepper.css";
import footballA from '../../assets/footballA.jpg'; // Example image imports

const Stepper = () => {
  const steps = ["Token Authorization", "Choisir Sport", "Choisir Match", "Réserver terrain"];
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [token, setToken] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState([]); // To store the matches for a category

  const handleInputChange = (e) => {
    setToken(e.target.value);
  };

  const validateToken = async () => {
    if (token) {
      try {
        setLoading(true);
        const response = await axios.get('https://localhost:7125/api/SportCategorys/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("validate Token is good ");

        setSports(response.data);
        setIsAuthorized(true);
        setTokenError("");
      } catch (error) {
        setIsAuthorized(false);
        setTokenError("Token invalide, veuillez réessayer.");
        setError(error.response ? error.response.data : 'Error fetching data');
      } finally {
        setLoading(false);
      }
    } else {
      setTokenError("Veuillez entrer un token.");
    }
  };
  //fetch data : 
  const validateData = async () => {

    try {
      setLoading(true);
      var tkn = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGFtQGpvYmludGVjaC11aXIubWEiLCJqdGkiOiIyZjc5NmIzMC05NGZlLTQzN2ItOTcyYi00NDI4ZDUxNzA3YmYiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzI5MzA1NDEwLCJpc3MiOiJGcmVlVHJhaW5lZCJ9.NurGeD1NqOXBIr0Qj3WmDleqL8oV6yZTALfjbO15AAg"

      var categoryId = "eee3c100-fde6-43b7-b40d-f38de2267be6"

      const response = await axios.get(`https://localhost:7125/api/Sports/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${tkn}`,
        },
      });
      console.log('res :!! ', response);
      console.log('res : ?', response.data);
      setSports(response.data);
      setIsAuthorized(true);
      setTokenError("");
    } catch (error) {
      setIsAuthorized(false);
      setTokenError("data not here today try tomorow .");
      setError(error.response ? error.response.data : 'Error fetching data ?!');
    } finally {
      setLoading(false);
    }

  };
  // Fetch the matches for the selected sport category
  const fetchMatchesForCategory = async (categoryId) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://localhost:7125/api/Sports/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('res for fetch CategoryId :!! ', response);
      console.log('res for fetch CategoryId :!! ', response.data.name);
      console.log("good ! ");


      setMatches(response.data); // Update matches based on response from the API
      setError("");
    } catch (error) {
      setError("Failed to fetch matches for the selected category.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetching of matches when a sport is selected
  const handleSportSelection = (e) => {
    const selectedSport = e.target.value;
    setSelectedSport(selectedSport);
    setSelectedCategory(""); // Reset the selected match

    const selectedSportObject = sports.find(sport => sport.name === selectedSport);
    if (selectedSportObject && selectedSportObject.id) {
      fetchMatchesForCategory(selectedSportObject.id); // Fetch matches using the sport's category id
    }
  };

  const handleFinishReservation = () => {
    setComplete(true);
  };

  return (
    <div className="container mx-auto mt-8 p-6 max-w-2xl bg-white">
      <div className="flex justify-between">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`step-item ${currentStep === i + 1 && "active"} ${(i + 1 < currentStep || complete) && "complete"
              }`}
          >
            <div className="step">
              {i + 1 < currentStep || complete ? <TiTick size={24} /> : i + 1}
            </div>
            <p className="text-gray-500">{step}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        {/* Step 1: Token Authorization */}
        {currentStep === 1 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Enter your token for authorization:</h3>
            <input
              type="text"
              className="select"
              value={token}
              onChange={handleInputChange}
              placeholder="Enter Token"
            />
            <div className="mt-10"> {/* Ajout d'une marge pour espacer */}
              <button onClick={validateToken} className="btn btn-primary">Validate Token</button>
              {/* <button onClick={validateData} className="btn btn-primary">fetch data</button> */}

            </div>
            {tokenError && <p className="text-red-600 mt-2">{tokenError}</p>}
          </div>
        )}

        {/* Step 2: Choose Sport */}
        {currentStep === 2 && isAuthorized && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Choisissez un sport :</h3>
            {loading && <p>Loading sports...</p>}
            {error && <p className="text-red-600">{error}</p>}
            <select
              className="select"
              value={selectedSport}
              onChange={handleSportSelection} // Call the handler to fetch matches
            >
              <option value="">-- Sélectionnez un sport --</option>
              {sports.map((sport, index) => (
                <option key={index} value={sport.name}>
                  {sport.name}
                </option>
              ))}
            </select>
            {selectedSport && (
              <p className="mt-2 text-green-600">Sport sélectionné : {selectedSport}</p>
            )}
          </div>
        )}

        {/* Step 3: Choose Match Category */}
        {currentStep === 3 && selectedSport && matches.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Choisissez un match pour {selectedSport} :</h3>
            <div className="card-container">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className={`card ${selectedCategory === match.title ? "selected" : ""}`}
                  onClick={() => setSelectedCategory(match.title)}
                >
                   <img 
              src={match.image ? `data:image/png;base64,${match.image}` : 'placeholder.png'} 
              alt={match.name} 
              style={{ width: '100px', height: '100px' }} 
            />
                  <p>{match.name}</p>
                </div>
              ))}
            </div>
            {selectedCategory && (
              <p className="mt-2 text-green-600">Match sélectionné : {selectedCategory}</p>

            )}



          </div>
        )}

        {/* Navigation buttons .*/}
        <div className="flex justify-between mt-6 -mx-6">
          {currentStep > 1 && !complete && (
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentStep((prev) => prev - 1)}
            >
              Précédent
            </button>
          )}
          {currentStep === steps.length ? (
            <button className="btn btn-success" onClick={handleFinishReservation}>
              Terminer
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={
                currentStep === 1 ? !token : currentStep === 2 && !selectedSport
              }
            >
              Suivant
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stepper;
