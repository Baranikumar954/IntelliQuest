// import React, { useState } from 'react';
import { Header } from '../Components/Header';
import { Footer } from '../Components/Footer';
import { Outlet, useNavigate } from 'react-router-dom';
import {useContext} from 'react';
import DataContext from '../Context/DataProvider';
import '../PageStyles/Home.css';

export const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Header />
      
      <div class="homePage">
        <div class='homeContainer'>
          <h1 style={{ margin: '0px' }}>Welcome to IntelliQuest 🚀</h1>
          <h2>Your Personalized Interview Preparation Assistant</h2>
          <h3>🎯 Ace Your Next Interview with Confidence!</h3>
          <p style={{padding:'20px',paddingLeft:'40px',paddingRight:'40px'}}>Are you preparing for your dream job? IntelliQuest is here to make your journey smoother and smarter! We analyze your resume, role, experience level, and company selection to generate tailored interview questions—helping you practice with precision and focus.</p>
          
          <h2>Why Choose IntelliQuest?</h2>
          <ul>
            <li style={{display:'flexStart'}}>✅ Personalized Question Bank :Get interview questions tailored to your experience and job role.</li>
            <li style={{display:'flexStart'}}>✅ Company-Specific Insights : Select a company to receive relevant questions matching their hiring trends.</li>
            <li style={{display:'flexStart'}}>✅ Resume-Based Analysis : No company selected? No worries! Our AI detects key skills and prepares the best questions for you.</li>
            <li style={{display:'flexStart'}}>✅ Stay Ahead in Your Preparation : Improve your confidence and get interview-ready with structured practice.</li>
          </ul>
          <br /><br />
          <section class="how-it-works">
            <h2>🔍 How It Works?</h2>
            <div class="steps-container">
              <div class="step">
                <img src="https://img.icons8.com/external-vectorslab-flat-vectorslab/100/external-File-Upload-files-and-folders-vectorslab-flat-vectorslab.png" alt="upload resume" />
                <p><strong>Upload your Resume</strong></p>
                <p class="desc">AI will generate interview questions using your resume and experience as key references.</p>
              </div>
              <div class="step">
                <img src="https://img.icons8.com/stickers/100/choose.png" alt="choose role" />
                <p><strong>Choose Role & Experience</strong></p>
                <p class="desc">Select your preferred role and experience level to tailor the question complexity.</p>
              </div>
              <div class="step">
                <img src="https://img.icons8.com/bubbles/100/company.png" alt="select company" />
                <p><strong>Select a Company</strong></p>
                <p class="desc">(Optional) Pick a company to align questions with their expectations.</p>
              </div>
              <div class="step">
                <img src="https://img.icons8.com/stickers/100/test-results.png" alt="get questions" />
                <p><strong>Get Tailored Questions</strong></p>
                <p class="desc">Receive smart interview questions along with sample answers and strategies.</p>
              </div>
            </div>
          </section>
<br /><br />
          <h4>💡 Prepare Smarter. Perform Better. Land Your Dream Job.</h4>
          
        </div>
      
        <h3>🚀 Start Your Journey with IntelliQuest Today!</h3>
        <button 
            onClick={() => {
              navigate('/question');
            }}
          >
          Start your preparation
          </button>
        
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
