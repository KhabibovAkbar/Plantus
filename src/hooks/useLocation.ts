import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useAppStore } from '../store/appStore';
import { fetchWeather, fetchLocation } from '../services/api';

interface LocationData {
  latitude: number;
  longitude: number;
}

export function useLocation() {
  const { location, setLocation, weather, setWeather, temperature } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<LocationData | null>(null);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (err) {
      console.error('Request permission error:', err);
      return false;
    }
  };

  const getCurrentPosition = async (): Promise<LocationData | null> => {
    try {
      setLoading(true);
      setError(null);

      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setError('Location permission denied');
        return null;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setCoords(locationData);
      return locationData;
    } catch (err) {
      console.error('Get current position error:', err);
      setError('Failed to get location');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationData = async (lat: number, lon: number) => {
    try {
      const result = await fetchLocation(lat, lon);
      if (result.success && result.data) {
        setLocation({
          name: result.data.country,
          code: result.data.countryCode,
          lat,
          lon,
        });
      }
    } catch (err) {
      console.error('Fetch location data error:', err);
    }
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      // Always fetch in Celsius; display layer converts to °F when user prefers imperial
      const result = await fetchWeather(lat, lon, 'metric');
      if (result.success && result.data) {
        setWeather({
          temp: result.data.temp,
          location: result.data.location,
          icon: result.data.icon,
          description: result.data.description,
        });
      }
    } catch (err) {
      console.error('Fetch weather data error:', err);
    }
  };

  const refreshLocationAndWeather = async () => {
    const position = await getCurrentPosition();
    if (position) {
      await Promise.all([
        fetchLocationData(position.latitude, position.longitude),
        fetchWeatherData(position.latitude, position.longitude),
      ]);
    }
  };

  return {
    location,
    weather,
    coords,
    loading,
    error,
    getCurrentPosition,
    fetchLocationData,
    fetchWeatherData,
    refreshLocationAndWeather,
  };
}

export default useLocation;
