'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GoogleLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const googleApiKey = "AIzaSyAyM_msuU-Md8v61TfjDAOrgIGciz9vBS0";

  useEffect(() => {
    // Get the user's current location data (Wi-Fi, GPS, etc.)
    const getLocationFromBrowser = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            sendLocationToGoogle(latitude, longitude);
          },
          (err) => {
            setError('Failed to get location');
            setLoading(false);
          }
        );
      } else {
        setError('Geolocation not supported');
        setLoading(false);
      }
    };

    // Send geolocation data to Google's Geolocation API
    const sendLocationToGoogle = async (latitude, longitude) => {
      try {
        const response = await axios.post(
          'https://www.googleapis.com/geolocation/v1/geolocate?key=' + googleApiKey,
          {
            // You can pass additional data such as Wi-Fi and cell tower info here if needed
            location: {
              lat: latitude,
              lng: longitude
            }
          }
        );

        setLocation(response.data.location);
        setLoading(false);
      } catch (err) {
        setError('Error fetching location from Google');
        setLoading(false);
      }
    };

    getLocationFromBrowser();
  }, [googleApiKey]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Google Geolocation Result</h1>
      <p>Latitude: {location.lat}</p>
      <p>Longitude: {location.lng}</p>
    </div>
  );
};

export default GoogleLocation;
