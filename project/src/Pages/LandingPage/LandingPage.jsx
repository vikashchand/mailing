// LandingPage.js

import React from 'react';
import './LandingPage.css';
import emailImage from '../../assets/email.jpg'
import featureImage from '../../assets/features.jpg'

const LandingPage = () => {
  return (
    <div className="landing-page">
     
        <div className="feature-container">
          <div className="feature-description">
            <h2>Features</h2>
            <ul>
              <li>Create and customize email templates</li>
              <li>Manage subscriber lists and segments</li>
              <li>Schedule and send automated campaigns</li>
              <li>Track and analyze campaign performance</li>
            </ul>
          </div>
          <div className="feature-image">
            <img src={emailImage} alt="Feature" />
          </div>
        </div>
     
     
        
        <p>&copy; 2023 Email Marketing Management System. All rights reserved.</p>
     
    </div>
  );
}

export default LandingPage;
