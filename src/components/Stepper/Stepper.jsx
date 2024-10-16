import React, { useEffect, useState } from "react";
import axios from "axios";
import { TiTick } from "react-icons/ti";
import "./stepper.css";
import footballA from '../../assets/footballA.jpg';
import footballB from '../../assets/footballB.jpg';
import footballC from '../../assets/footballC.jpg';

const Stepper = () => {
  const steps = ["Token Authorization", "Choisir Sport", "Choisir Match", "Réserver terrain"];
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [token, setToken] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [sports, setSports] = useState([]); // State to store sports
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const matchCategories = {
    Football: [
      { name: "Match A", image: footballA },
      { name: "Match B", image: footballB },
      { name: "Match C", image: footballC }
    ],
    Basketball: [
      { name: "Match A", image: "/images/basketballA.jpg" },
      { name: "Match B", image: "/images/basketballB.jpg" }
    ],
    Padel: [
      { name: "Match A", image: "/images/padelA.jpg" },
      { name: "Match B", image: "/images/padelB.jpg" }
    ],
    Tennis: [
      { name: "Match A", image: "/images/tennisA.jpg" },
      { name: "Match B", image: "/images/tennisB.jpg" }
    ],
    Musculation: []
  };

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
            <button onClick={validateToken} className="btn btn-primary mt-2">Validate Token</button>
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
              onChange={(e) => {
                setSelectedSport(e.target.value);
                setSelectedCategory("");
              }}
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
        {currentStep === 3 && selectedSport && matchCategories[selectedSport]?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Choisissez un match pour {selectedSport} :</h3>
            <div className="card-container">
              {matchCategories[selectedSport].map((category, index) => (
                <div
                  key={index}
                  className={`card ${selectedCategory === category.name ? "selected" : ""}`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-32 h-32 object-cover"
                  />
                  <p>{category.name}</p>
                </div>
              ))}
            </div>
            {selectedCategory && (
              <p className="mt-2 text-green-600">Match sélectionné : {selectedCategory}</p>
            )}
          </div>
        )}

        {/* Navigation buttons */}
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




