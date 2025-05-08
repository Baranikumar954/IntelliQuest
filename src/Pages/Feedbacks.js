import React, { useEffect, useState } from 'react';
import '../PageStyles/Feedbacks.css';
import { supabase } from '../Api/supabaseClient'; 
import { Header } from '../Components/Header';
import { Footer } from '../Components/Footer';

export const Feedbacks = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("Guest");
  const [email, setEmail] = useState("");

  const fetchFeedbacks = async () => {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false }); // latest feedbacks first
  
    if (error) {
      console.error('Error fetching feedbacks:', error.message);
    } else {
      setFeedbacks(data);
    }
  };
  
  // Fetch user session info
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error.message);
        return;
      }

      if (session) {
        const currentUser = session.user;
        setUser(currentUser);
        setEmail(currentUser.email);

        const displayName =
          currentUser.user_metadata?.display_name ||
          currentUser.user_metadata?.full_name ||
          currentUser.user_metadata?.name || 'Guest';

        setUsername(displayName);
      } else {
        console.error("User is not logged in.");
      }
    };

    fetchUser();
  }, []);

  // Fetch feedbacks and calculate average rating
  const fetchAverageRating = async () => {
    const { data, error } = await supabase
      .from("feedbacks")
      .select("rating");

    if (error) {
      console.error("Error fetching ratings:", error);
    } else if (data && data.length > 0) {
      const total = data.reduce((sum, item) => sum + item.rating, 0);
      const average = Math.round(total / data.length);
      setAvgRating(average);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchAverageRating();
  }, [setFeedback]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback || rating === 0) {
      alert("Please fill out all fields and select a rating.");
      return;
    }
    // await supabase.from("users").insert([{ email: email, name: username }]);


    const { error } = await supabase.from('feedbacks')
  .upsert([
    {
      gmail_id: email,
      username,
      feedback,
      rating,
    },
  ], { onConflict: ['gmail_id'] });


    if (error) {
      console.error("Error inserting feedback:", error.message);
    } else {
      alert("Feedback submitted successfully!");
      setFeedback('');
      setRating(0);
      fetchFeedbacks();
    }
  };

  const handleLike = async (id) => {
    await supabase.rpc('increment_like', { feedback_id: id });
    fetchFeedbacks();
  };
  
  const handleDislike = async (id) => {
    await supabase.rpc('increment_dislike', { feedback_id: id });
    fetchFeedbacks();
  };
  
  return (
    <div className="container">
      <Header />
      <div className="feedback-container">
  <div className="left-column">
    <div className="rating-summary">
      <h2>⭐ {avgRating} / 5</h2>
      <p>{feedbacks.length} Ratings</p>
    </div>

    <div className="add-review">
      <h3>Add a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="star-select">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= (hover || rating) ? 'filled-star' : 'empty-star'}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write your review..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>

  <div className="recent-feedbacks-scrollable">
    <h3>Recent Feedbacks</h3>
    <div className="feedback-list">
      {feedbacks.map((fb, index) => (
        <div key={index} className="feedback-card-box">
          <div className="feedback-header">
            <h4>{fb.username}</h4>
            <span className="timestamp">{new Date(fb.created_at).toLocaleDateString()}</span>
          </div>
          <div className="stars">
            {'★'.repeat(fb.rating)}
            {'☆'.repeat(5 - fb.rating)}
          </div>
          <p className="feedback-text">{fb.feedback}</p>
          <div className="feedback-actions">
            <button onClick={() => handleLike(fb.id)}>👍 {fb.like_count || 0}</button>
            <button onClick={() => handleDislike(fb.id)}>👎 {fb.dislike_count || 0}</button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
      <Footer />
    </div>
  );
};
