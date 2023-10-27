import React from 'react';
import { useLocation } from 'react-router-dom';

const DetailView = () => {
  const location = useLocation();
  const petDetails = location.state.petDetails;

  return (
    <div className="DetailView">
      <h1>Pet Details</h1>
      {petDetails ? (
        <div>
          <h2>Name: {petDetails.name}</h2>
          <p>Species: {petDetails.species}</p>
          <p>Age: {petDetails.age}</p>
          <p>Description: {petDetails.description}</p>
          <p>Link: <a href={petDetails.url} target="_blank" rel="noopener noreferrer">{petDetails.name}</a></p>
          {petDetails.photos && petDetails.photos.map((photo, index) => (
            <img
              key={index}
              src={photo.small}
              alt={`Photo of ${petDetails.name}`}
            />
          ))}
        </div>
      ) : (
        <p>Loading pet details...</p>
      )}
    </div>
  );
};

export default DetailView;
