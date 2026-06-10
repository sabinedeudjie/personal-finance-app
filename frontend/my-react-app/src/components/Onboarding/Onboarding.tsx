import React, { useState } from 'react';
import './Onboarding.css';
import logoImg from '../../assets/images/logo.jpg';
import phoneImg from '../../assets/images/phone.jpg';
import tabletImg from '../../assets/images/tablette.jpg';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-content">
        {currentStep === 0 && (
          <div className="step-fade-in splash-screen">
            <div className="logo-container">
              <img src={logoImg} alt="Nkapflow Logo" className="main-logo" />
            </div>
            <p className="tagline">Gérez votre argent, réalisez vos rêves</p>
            <button className="next-button" onClick={nextStep}>Commencer →</button>
          </div>
        )}

        {currentStep === 1 && (
          <div className="step-fade-in step-container">
            <header className="onboarding-header">
              <img src={logoImg} alt="Logo" className="mini-logo" />
            </header>
            <div className="image-frame">
              <img src={phoneImg} alt="Suivi des comptes" className="onboarding-image" />
              <div className="icon-badge">
                <div className="search-icon"></div>
              </div>
            </div>
            <div className="text-content">
              <h2>Suivi de tous vos comptes</h2>
              <p>Nkapflow centralise automatiquement vos comptes bancaires et vos investissements. Voyez votre situation globale en un clin d'œil.</p>
            </div>
            <div className="navigation-footer">
              <div className="pagination">
                <span className="dot inactive"></span>
                <span className="dot active"></span>
                <span className="dot inactive"></span>
              </div>
              <button className="next-button primary" onClick={nextStep}>Suivant →</button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-fade-in step-container">
            <header className="onboarding-header">
              <img src={logoImg} alt="Logo" className="mini-logo" />
            </header>
            <div className="image-frame">
              <img src={tabletImg} alt="Contrôle total" className="onboarding-image" />
              <div className="icon-badge">
                <div className="shield-icon"></div>
              </div>
            </div>
            <div className="text-content">
              <h2>Contrôle total sur vos finances</h2>
              <p>Suivez vos dépenses par catégorie, fixez des objectifs d'épargne clairs et contrôlez votre budget simplement.</p>
            </div>
            <div className="navigation-footer">
              <div className="pagination">
                <span className="dot inactive"></span>
                <span className="dot inactive"></span>
                <span className="dot active"></span>
              </div>
              <button className="next-button primary" onClick={nextStep}>Commencer →</button>
            </div>
          </div>
        )}
      </div>

      {currentStep === 0 && (
        <div className="pagination splash-pagination">
          <span className="dot active"></span>
          <span className="dot inactive"></span>
          <span className="dot inactive"></span>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
