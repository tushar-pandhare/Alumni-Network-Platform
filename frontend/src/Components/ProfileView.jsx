import React, { useEffect, useState } from 'react';
import axios from "axios";

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          setError('No user logged in');
          return;
        }
        
        const response = await axios.get(`/profile?email=${email}`);
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching profile');
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img 
          src={profile.profileImage || '/default-avatar.png'} 
          alt="Profile"
          className="profile-image"
        />
        <h1>{profile.name}</h1>
        <p className="email">{profile.email}</p>
      </div>

      <div className="profile-details">
        <div className="detail-item">
          <h3>Current Position</h3>
          <p>{profile.currentJob || 'Not specified'}</p>
        </div>
        
        <div className="detail-item">
          <h3>Location</h3>
          <p>{profile.location || 'Not specified'}</p>
        </div>

        <div className="detail-item">
          <h3>Graduation</h3>
          <p>{profile.graduationYear} - {profile.branch}</p>
        </div>

        <div className="detail-item">
          <h3>Skills</h3>
          <div className="skills-list">
            {profile.skills?.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>

        <div className="social-links">
          {profile.linkedIn && (
            <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          )}
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;