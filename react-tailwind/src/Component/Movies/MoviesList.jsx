// components/Movies/components/MoviesList.jsx
import React from "react";
import { motion } from "framer-motion";
import { MovieCard } from "./MovieCard";

export const MoviesList = ({
  movies,
  saveList,
  isLoading,
  isClicked,
  isLiked,
  onDelete,
  onLike,
  onSave,
  onMovieClick,
}) => {
  if (isLoading) {
    return (
      <div className="w-full overflow-x-hidden animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 sm:p-6 w-full">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg overflow-hidden animate-pulse"
            >
              <div className="w-full aspect-[2/3] bg-gray-600"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                <div className="h-3 bg-gray-600 rounded w-1/4"></div>
              </div>
              <div className="flex gap-1 p-2 bg-gray-800">
                <div className="flex-1 h-8 bg-gray-600 rounded"></div>
                <div className="flex-1 h-8 bg-gray-600 rounded"></div>
                <div className="flex-1 h-8 bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full overflow-x-hidden"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 sm:p-6 w-full">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isInSaveList={saveList.some((m) => m.id === movie.id)}
            isClicked={isClicked}
            isLiked={isLiked}
            onDelete={onDelete}
            onLike={onLike}
            onSave={onSave}
            onMovieClick={onMovieClick}
          />
        ))}
      </div>
      {movies.length === 0 && (
        <div className="text-center py-8">
          🎬 No movies found. Try adjusting your filters!
        </div>
      )}
    </motion.div>
  );
};
