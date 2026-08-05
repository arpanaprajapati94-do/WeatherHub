import { useState, useCallback } from 'react';

/**
 * useGeolocation — resolves the user's approximate city name from browser GPS
 * using the free BigDataCloud reverse-geocoding client API (no API key).
 *
 * Returns:
 *  - locating: boolean (in progress)
 *  - locateCity: async fn → city name string (rejects with a friendly Error)
 */
const useGeolocation = () => {
  const [locating, setLocating] = useState(false);

  const locateCity = useCallback(async () => {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser.');
    }

    setLocating(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const { latitude, longitude } = position.coords;

      // Free reverse-geocoding service (no key required).
      const url =
        `https://api.bigdatacloud.net/data/reverse-geocode-client?` +
        `latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Unable to resolve your location.');
      const data = await res.json();

      const city =
        data.city ||
        data.locality ||
        data.principalSubdivision ||
        data.countryName;

      if (!city) throw new Error('Could not determine your city.');

      return city;
    } finally {
      setLocating(false);
    }
  }, []);

  return { locating, locateCity };
};

export default useGeolocation;

