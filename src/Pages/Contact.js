import React, { useRef, useState } from "react";
import './Contact.css';
import emailjs from "@emailjs/browser";
import { toast, Toaster } from "react-hot-toast";
import { Header } from "../Components/Header";
import { Footer } from '../Components/Footer';

export const Contact = () => {
  const service_id = process.env.REACT_APP_EMAIL_JS_SERVICE_ID;
  const template_id = process.env.REACT_APP_EMAIL_JS_TEMPLATE_ID;
  const public_key = process.env.REACT_APP_EMAIL_JS_PUBLIC_KEY;

  const form = useRef();
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
    .sendForm(
      `${service_id}`,     // 🔁 Replace with your EmailJS Service ID
      `${template_id}`,    // 🔁 Replace with your EmailJS Template ID
      form.current,
      `${public_key}`      // 🔁 Replace with your EmailJS Public Key
    )
      .then(
        () => {
          window.alert("🎉 Your message has been sent successfully!");
          toast.success("🎉 Your message has been sent successfully!", {
            style: {
              borderRadius: "10px",
              background: "#1e293b",
              color: "#fff",
              padding: "16px",
            },
            icon: "📨",
          });
          form.current.reset();
          setLoading(false);
        },
        () => {
          window.alert("Oops! Something went wrong. Try again later.");
          toast.error("Oops! Something went wrong. Try again later.", {
            style: {
              borderRadius: "10px",
              background: "#dc2626",
              color: "#fff",
            },
          });
          setLoading(false);
        }
      );
  };

  return (
    <div>
      <Header/>
      <div className="contact-container">
        <div className="contact-box">
          <h1>📞 Contact Us</h1>

          <p><strong>We'd Love to Hear From You!</strong><br />
            We're a passionate team of students who created <strong>IntelliQuest</strong>...
          </p>

          <p>
            Whether you're a user looking for help or an HR professional curious to explore our platform — feel free to reach out!
          </p>

          <p>
            🧑‍💻 <strong>Built With Passion</strong><br />
            IntelliQuest is developed by a group of final-year Computer Science and Business Systems students...
          </p>

          <p>
            📬 <strong>Reach Out</strong><br />
            For any queries, suggestions, or support, you can contact us at:<br />
            📧 <a href="mailto:baranikumar952004@gmail.com">baranikumar952004@gmail.com</a><br />
            📧 <a href="mailto:dvishwa764@gmail.com">dvishwa764@gmail.com</a><br />
            📧 <a href="mailto:baranikumar952004@gmail.com">baranikumar952004@gmail.com</a><br />
            📧 <a href="mailto:kathirkathir7082@gmail.com">kathirkathir7082@gmail.com</a>
          </p>

          <p>
            🤝 <strong>Want to Connect?</strong><br />
            Whether you're a fellow student, a recruiter, or someone just curious — we’d love to hear your feedback or ideas.
          </p>

          <form ref={form} onSubmit={sendEmail} className="contact-form">
            <input type="text" name="from_name" placeholder="Your Name" required />
            <input type="email" name="reply_to" placeholder="Your Email" required />
            <textarea name="message" rows="5" placeholder="Your Message" required></textarea>
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
      <Footer/>
    </div>

  );
};