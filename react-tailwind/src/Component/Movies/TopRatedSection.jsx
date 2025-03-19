import React from "react";
import { MovieCard } from "./MovieCard";
import { motion } from "framer-motion";
const TopRatedSection = ({
  movies,
  isClicked,
  isLiked,
  onLike,
  onSave,
  onMovieClick,
}) => {
  const firstFive = movies.slice(0, 5);
  return (
    <section className="gap-4 p-1">
      <h2>Top Rated Movies</h2>
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 sm:p-6 w-full">
        {firstFive.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isClicked={isClicked}
            isLiked={isLiked}
            onLike={onLike}
            onSave={onSave}
            onMovieClick={onMovieClick}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default TopRatedSection;
