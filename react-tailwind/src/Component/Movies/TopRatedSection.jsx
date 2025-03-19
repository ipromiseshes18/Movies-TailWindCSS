import React from 'react';

const TopRatedSection = ({ movies }) => {
  return (
    <section className="top-rated-section">
      <h2>Top Rated Movies</h2>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </section>
  );
};

export default TopRatedSection; 