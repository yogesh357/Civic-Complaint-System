import { useState, useEffect } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    const handleSuccess = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      });
      setIsLoading(false);
    };

    const handleError = (err) => {
      let errorMessage;
      switch(err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = "Location access was denied. Please enable it in your browser settings.";
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable.";
          break;
        case err.TIMEOUT:
          errorMessage = "The request to get location timed out.";
          break;
        default:
          errorMessage = "An unknown error occurred.";
      }
      setError(errorMessage);
      setIsLoading(false);
    };

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        ...options
      }
    );
  }, []);

  return { location, error, isLoading };
};