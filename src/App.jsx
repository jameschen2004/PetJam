import React, { useState, useEffect } from 'react';
import './App.css';

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function App() {
  const [animals, setAnimals] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all'); // Default filter
  const [ageFilter, setAgeFilter] = useState('all'); // Default filter

  useEffect(() => {
    // Define the API endpoint URL
    const apiUrl = 'https://api.petfinder.com/v2/animals';

    // Create a request to the Petfinder API with the Authorization header
    fetch(apiUrl, {
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const uniqueAnimals = [...new Set(data.animals)];
        setAnimals(uniqueAnimals);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Filter animals based on search text, species, and age
  const filteredAnimals = animals.filter((animal) => {
    const speciesMatches = animal.species.toLowerCase().includes(searchText.toLowerCase());
    const nameMatches = animal.name.toLowerCase().includes(searchText.toLowerCase());
    const ageMatches = ageFilter === 'all' || animal.age.toLowerCase() === ageFilter.toLowerCase();
    if (speciesFilter === 'all') {
      return (nameMatches || speciesMatches) && ageMatches;
    } else {
      return (nameMatches || speciesMatches) && animal.species.toLowerCase() === speciesFilter.toLowerCase() && ageMatches;
    }
  });

  // Calculate summary statistics
  const totalAnimals = filteredAnimals.length;

  const speciesCounts = filteredAnimals.reduce((counts, animal) => {
    counts[animal.species] = (counts[animal.species] || 0) + 1;
    return counts;
  }, {});

  const totalSpecies = Object.keys(speciesCounts).length;

  const totalDogs = speciesCounts['Dog'] || 0;
  const totalCats = speciesCounts['Cat'] || 0;

  // Calculate age statistics
  const ageCounts = filteredAnimals.reduce((counts, animal) => {
    counts[animal.age] = (counts[animal.age] || 0) + 1;
    return counts;
  }, {});

  return (
    <div className="App">
      <h1>PetJam</h1>
      <div>
        <h2>Search</h2>
        <input
          type="text"
          placeholder="Search animals..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div>
        <h2>Filter by Age</h2>
        <button onClick={() => setAgeFilter('all')}>All</button>
        <button onClick={() => setAgeFilter('Baby')}>Baby</button>
        <button onClick={() => setAgeFilter('Young')}>Young</button>
        <button onClick={() => setAgeFilter('Adult')}>Adult</button>
      </div>
      <div>
        <h2>Filter by Species</h2>
        <button onClick={() => setSpeciesFilter('all')}>All</button>
        <button onClick={() => setSpeciesFilter('Dog')}>Dogs</button>
        <button onClick={() => setSpeciesFilter('Cat')}>Cats</button>
      </div>
      <div>
        <h2>Summary Statistics</h2>
        <p>Total Animals: {totalAnimals}</p>
        <p>Total Species: {totalSpecies}</p>
        <p>Total Dogs: {totalDogs}</p>
        <p>Total Cats: {totalCats}</p>
      </div>
      <div>
        <h2>Age Statistics</h2>
        {Object.keys(ageCounts).map((age) => (
          <p key={age}>{age}: {ageCounts[age]}</p>
        ))}
      </div>
      <ul>
        {filteredAnimals.map((animal) => (
          <li key={animal.id}>
            <h2>{animal.name}</h2>
            <p>Species: {animal.species}</p>
            <p>Age: {animal.age}</p>
            <p>Description: {animal.description}</p>
            <p>Link: <a href={animal.url} target="_blank" rel="noopener noreferrer">{animal.url}</a></p>
            {animal.photos.map((photo, index) => (
              <img
                key={index}
                src={photo.small}
                alt={`Small photo of ${animal.name}`}
              />
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
