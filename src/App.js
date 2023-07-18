import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const App = () => {
  const [image, setImage] = useState('');
  const [result, setResult] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [noData, setNoData] = useState(false); // New state for handling no data message
  const [loading, setLoading] = useState(false); // New state for handling loading state
  const ACCESS_KEY = 'Fl7wuu1k9PFE0O5iSdj2NUhgwc4ovhTP4AttDt_-Uhk'; // unsplash access key

  const getValue = (event) => {
    const inputValue = event.target.value;
    setImage(inputValue);
    getSuggestions(inputValue);
  };

  const getImages = () => {
    setLoading(true); // Set loading state to true
    const urlApi = `https://api.unsplash.com/search/photos?page=1&query=${image}&client_id=${ACCESS_KEY}`;
    axios
      .get(urlApi)
      .then((response) => {
        setResult(response.data.results);
        setNoData(response.data.results.length === 0); // Update noData state based on response
        setSuggestions([]); // Clear suggestions when fetching new images
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      })
      .finally(() => {
        setLoading(false); // Set loading state to false after receiving the response
      });
  };

  const getSuggestions = (query) => {
    const urlApi = `https://api.unsplash.com/search/collections?query=${query}&client_id=${ACCESS_KEY}`;
    axios
      .get(urlApi)
      .then((response) => {
        const suggestedTitles = new Set();
        const filteredSuggestions = response.data.results.filter((suggestion) => {
          const lowercaseTitle = suggestion.title.toLowerCase();
          if (suggestedTitles.has(lowercaseTitle)) {
            return false;
          }
          suggestedTitles.add(lowercaseTitle);
          return lowercaseTitle.includes(query.toLowerCase());
        });
        setSuggestions(filteredSuggestions);
      })
      .catch((error) => {
        console.error('Error fetching suggestions:', error);
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      getImages();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setImage(suggestion.title);
    getImages();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={{ backgroundColor: '#4CAF50', padding: '20px', color: '#fff', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Image Search</h1>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', justifyContent: 'center' }}>
          <input
            type="text"
            name="image"
            placeholder="Type to Search"
            value={image}
            onChange={getValue}
            onKeyPress={handleKeyPress}
            style={{
              marginRight: '10px',
              padding: '8px',
              fontSize: '16px',
              borderRadius: '20px',
              border: 'none',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              width: '300px',
              display: 'block',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={getImages}
            type="submit"
            style={{
              padding: '8px 12px',
              fontSize: '16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#fff',
              color: '#4CAF50',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            Search
          </button>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                margin: '5px',
                fontSize: '14px',
                color: '#000',
                cursor: 'pointer',
                backgroundColor: 'rgba(173, 216, 230, 0.8)',
                padding: '8px',
                borderRadius: '4px',
              }}
            >
              {suggestion.title}
            </div>
          ))}
        </div>
      </header>

      <div
        style={{
          width: '100vw',
          minHeight: 'calc(100vh - 120px)',
          padding: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start',
          boxSizing: 'border-box',
          backgroundColor: '#f9f9f9',
        }}
      >
        {loading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: '#4CAF50',
              color: '#fff',
              fontSize: '20px',
            }}
          >
            Loading...
          </div>
        )}

        {!loading && result.length === 0 && noData && (
          <p style={{ width: '100%', textAlign: 'center', fontSize: '16px' }}>
            There is no data related to this keyword.
          </p>
        )}

        {result.map((image) => (
          <div key={image.id} style={{ width: '300px', margin: '10px' }}>
            <LazyLoadImage
              src={image.urls.small}
              effect="blur"
              delayTime="300"
              style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <img
                src={image.user.profile_image.small}
                alt={image.user.alt_description}
                style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
              />
              <div>
                <p style={{ fontSize: '16px' }}>{image.user.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer
        style={{
          backgroundColor: '#4CAF50',
          padding: '20px',
          color: '#fff',
          textAlign: 'center',
          marginTop: '20px',
        }}
      >
        <p style={{ margin: '0' }}>© 2023 All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
