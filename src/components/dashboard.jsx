import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimalBarChart from './chart.jsx'; // Import your AnimalBarChart component

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function Dashboard() {
  const [animals, setAnimals] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');

  useEffect(() => {
    const apiUrl = 'https://api.petfinder.com/v2/animals';

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

  // Count the number of each animal
  const animalCounts = {};
  filteredAnimals.forEach((animal) => {
    if (animalCounts[animal.species]) {
      animalCounts[animal.species] += 1;
    } else {
      animalCounts[animal.species] = 1;
    }
  });

  // Prepare data for the bar chart
  const chartData = Object.keys(animalCounts).map((species) => ({
    name: species,
    count: animalCounts[species],
  }));

  return (
    <div className="Dashboard">
      <h1>PetJam</h1>
      <AnimalBarChart data={chartData} /> {/* Render the bar chart */}
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
      <ul>
        {filteredAnimals.map((animal) => (
          <li key={animal.id}>
            <Link to={`/${animal.name}`} state={{ petDetails: animal }}>
              <h2>{animal.name}</h2>
            </Link>
            <p>Species: {animal.species}</p>
            <p>Age: {animal.age}</p>

            <p>Link: <a href={animal.url} target="_blank" rel="noopener noreferrer">{animal.name}</a></p>
            {animal.photos && animal.photos.map((photo, index) => (
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

export default Dashboard;
