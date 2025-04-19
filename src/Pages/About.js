import React from 'react'
import { Header } from '../Components/Header'
import { Footer } from '../Components/Footer'
import './About.css';
export const About = () => {
  return (
    <div>
        <Header/>
        <div class='aboutPage'>
            <h2>About IntelliQuest 🎯</h2>
            <h3>Empowering Job Seekers with Smart Interview Preparation</h3>
            <p>In today’s competitive job market, preparing for interviews isn’t just about revising common questions—it’s about practicing the right questions. That’s where IntelliQuest comes in.</p>
            <br />
            <h3>Who We Are</h3>
            <p>IntelliQuest is a smart interview preparation platform designed to help job seekers practice efficiently. Our AI-driven system analyzes your resume, role, experience level, and company selection to generate tailored interview questions, ensuring that your preparation is focused and effective.</p>
            <br />
            <h3>Our Mission</h3>
            <p>We believe that everyone deserves the best chance to succeed in their career. Our goal is to eliminate generic interview prep and provide a customized learning experience that matches your unique skills and career aspirations.</p>
            <br />
            <h3>What We Offer</h3>
            <ul>
              <li>✅ AI-Powered Interview Questions – Questions tailored to your resume and selected job role.</li>
              <li>✅ Company-Specific Preparation – Get questions relevant to a specific company’s hiring trends.</li>
              <li>✅ Smart Resume Analysis – No company selected? We analyze your resume to suggest the best practice questions.</li>
              <li>✅ User-Friendly & Accessible – A seamless experience for all job seekers, whether freshers or experienced professionals.</li>
            </ul>
            
            <br />
            <h3>Why IntelliQuest?</h3>
            <ul>
              <li>🔹 Personalized Learning: No more one-size-fits-all interview preparation.</li>
              <li>🔹 Data-Driven Approach: AI-based question generation for precise preparation.</li>
              <li>🔹 Confidence Boosting: Structured practice leads to better performance in real interviews.</li>
              <li>🔹 Career Success: Helping you land your dream job faster and with confidence.</li>
            </ul>
            <br />
            <h3>Join Us on This Journey!</h3>
            <p>At IntelliQuest, we are committed to revolutionizing interview preparation.<br/>Get ready with confidence, and take the next step towards your career goals.</p>
            <br />
            <h3>🚀 Let’s prepare smarter, together!</h3>
        </div>
        <Footer/>
    
    </div>
  )
}
