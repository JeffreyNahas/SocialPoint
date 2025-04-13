import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import AuthHeader from './AuthHeader';
import './EventDetailsPage.css';

interface Review {
  id: number;
  rating: number;
  comment: string;
  userId: number;
  userName: string;
  createdAt: string;
  replies: Reply[];
}

interface Reply {
  id: number;
  comment: string;
  userId: number;
  userName: string;
  createdAt: string;
}

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venueLocation: string;
  category: string;
  organizer: {
    id: number;
    fullName: string;
  };
}

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const showReviewForm = queryParams.get('action') === 'review';
  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [replyTexts, setReplyTexts] = useState<{[key: number]: string}>({});
  const [expandedReview, setExpandedReview] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<'organizer' | 'attendee' | 'visitor'>('visitor');
  const reviewTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch event details
        const eventResponse = await axios.get(`${API_URL}/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setEvent(eventResponse.data);
        
        // Mock reviews for demo purposes
        const mockReviews = [
          {
            id: 1,
            rating: 5,
            comment: "This was an amazing event! The speakers were knowledgeable and the venue was fantastic.",
            userId: 2,
            userName: "Jane Smith",
            createdAt: "2023-10-25T14:30:00",
            replies: [
              {
                id: 101,
                comment: "Thank you for your kind words! We're glad you enjoyed it.",
                userId: 1,
                userName: "Event Organizer",
                createdAt: "2023-10-26T09:15:00"
              }
            ]
          },
          {
            id: 2,
            rating: 4,
            comment: "Great event overall, but the food options were limited. Would love to see more variety next time.",
            userId: 3,
            userName: "Michael Johnson",
            createdAt: "2023-10-24T18:45:00",
            replies: []
          },
          {
            id: 3,
            rating: 5,
            comment: "The networking opportunities were invaluable. I made several important connections.",
            userId: 4,
            userName: "Sara Wilson",
            createdAt: "2023-10-23T11:20:00",
            replies: [
              {
                id: 102,
                comment: "We're happy to hear that! Creating networking opportunities was one of our main goals.",
                userId: 1,
                userName: "Event Organizer",
                createdAt: "2023-10-23T16:40:00"
              }
            ]
          }
        ];
        
        setReviews(mockReviews);
        
        // Determine user role (demo version)
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id;
        
        if (eventResponse.data.organizer && eventResponse.data.organizer.id === userId) {
          setUserRole('organizer');
        } else if (eventResponse.data.attendees && 
                  eventResponse.data.attendees.some((a: any) => a.id === userId)) {
          setUserRole('attendee');
        } else {
          setUserRole('visitor');
        }
        
        setLoading(false);
      } catch (_) {
        console.error('Error fetching event details');
        setError('Failed to load event details');
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  useEffect(() => {
    if (showReviewForm && reviewTextAreaRef.current) {
      reviewTextAreaRef.current.focus();
      reviewTextAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showReviewForm]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewText.trim()) return;
    
    // For demo purposes, we'll just add the review to the local state
    const newReview: Review = {
      id: Math.floor(Math.random() * 1000) + 10,
      rating,
      comment: reviewText,
      userId: 5, // Mock user ID
      userName: "Current User",
      createdAt: new Date().toISOString(),
      replies: []
    };
    
    setReviews([newReview, ...reviews]);
    setReviewText('');
    setRating(5);
  };

  const handleSubmitReply = (reviewId: number) => {
    const replyText = replyTexts[reviewId];
    if (!replyText?.trim()) return;
    
    // Find the review to reply to
    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        const newReply: Reply = {
          id: Math.floor(Math.random() * 1000) + 200,
          comment: replyText,
          userId: 5, // Mock user ID
          userName: "Current User",
          createdAt: new Date().toISOString()
        };
        
        return {
          ...review,
          replies: [...review.replies, newReply]
        };
      }
      return review;
    });
    
    setReviews(updatedReviews);
    
    // Clear the reply text for this review
    const newReplyTexts = {...replyTexts};
    delete newReplyTexts[reviewId];
    setReplyTexts(newReplyTexts);
    
    // Collapse the review
    setExpandedReview(null);
  };

  const toggleReviewExpand = (reviewId: number) => {
    setExpandedReview(expandedReview === reviewId ? null : reviewId);
  };

  const handleReplyTextChange = (reviewId: number, text: string) => {
    setReplyTexts({
      ...replyTexts,
      [reviewId]: text
    });
  };

  if (loading) {
    return (
      <div className="event-details-page">
        <AuthHeader />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details-page">
        <AuthHeader />
        <div className="error-container">
          <h2>Event Not Found</h2>
          <p>Sorry, we couldn't find the event you're looking for.</p>
          <button onClick={() => navigate('/events')} className="back-button">
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="event-details-page">
      <AuthHeader />
      <div className="event-details-container">
        <button onClick={() => navigate('/events')} className="back-button">
          &larr; Back to Events
        </button>
        
        <div className="event-details-card">
          <div className="event-header">
            <h1>{event.name}</h1>
            <span className="event-category">{event.category}</span>
          </div>
          
          <div className="event-info">
            <div className="info-item">
              <span className="info-label">Date:</span>
              <span className="info-value">{new Date(event.date).toLocaleDateString()}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Time:</span>
              <span className="info-value">{event.startTime} - {event.endTime}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Location:</span>
              <span className="info-value">{event.venueLocation || 'No location specified'}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Organized by:</span>
              <span className="info-value">{event.organizer.fullName}</span>
            </div>
          </div>
          
          <div className="event-description">
            <h3>About this event</h3>
            <p>{event.description}</p>
          </div>
        </div>
        
        <div className="reviews-section">
          <h2>Reviews and Feedback</h2>
          
          {(userRole === 'attendee' || showReviewForm) && (
            <div className="add-review-form">
              <h3>Share Your Experience</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="rating-input">
                  <label>Rating:</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= rating ? "star filled clickable" : "star clickable"}
                        onClick={() => setRating(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                
                <textarea
                  ref={reviewTextAreaRef}
                  placeholder="Write your review here..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                ></textarea>
                
                <button type="submit" className="submit-review-btn">
                  Submit Review
                </button>
              </form>
            </div>
          )}
          
          {userRole === 'organizer' && (
            <div className="organizer-message">
              <p>As an organizer, you can reply to reviews but cannot review your own event.</p>
            </div>
          )}
          
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <div className="no-reviews">
                <p>No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-name">{review.userName}</div>
                      <div className="review-date">{formatDate(review.createdAt)}</div>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  
                  <div className="review-content">
                    <p>{review.comment}</p>
                  </div>
                  
                  <div className="review-actions">
                    <button 
                      onClick={() => toggleReviewExpand(review.id)}
                      className="reply-button"
                    >
                      {expandedReview === review.id ? 'Cancel Reply' : 'Reply'}
                    </button>
                  </div>
                  
                  {expandedReview === review.id && (
                    <div className="reply-form">
                      <textarea
                        placeholder="Write your reply..."
                        value={replyTexts[review.id] || ''}
                        onChange={(e) => handleReplyTextChange(review.id, e.target.value)}
                      ></textarea>
                      <button 
                        onClick={() => handleSubmitReply(review.id)}
                        className="submit-reply-btn"
                      >
                        Post Reply
                      </button>
                    </div>
                  )}
                  
                  {review.replies.length > 0 && (
                    <div className="replies-section">
                      <h4>Replies</h4>
                      {review.replies.map(reply => (
                        <div key={reply.id} className="reply-card">
                          <div className="reply-header">
                            <div className="replier-name">{reply.userName}</div>
                            <div className="reply-date">{formatDate(reply.createdAt)}</div>
                          </div>
                          <div className="reply-content">
                            <p>{reply.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage; 