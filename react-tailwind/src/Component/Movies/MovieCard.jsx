// components/Movies/components/MovieCard.jsx
import React from "react";
import { motion } from "framer-motion";

export const MovieCard = ({
  movie,
  isClicked,
  isLiked,
  onDelete,
  onLike,
  onSave,
  onMovieClick,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full"
  >
    <div
      onClick={() => onMovieClick(movie)}
      className="flex flex-col items-center space-y-2 flex-grow p-3 cursor-pointer"
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        loading="lazy"
        alt={movie.title}
        className="w-full h-auto aspect-[2/3] object-cover rounded-lg"
      />
      <p className="text-red-500 text-lg font-bold text-center line-clamp-2">
        {movie.title}
      </p>
      <p className="text-gray-400 text-sm">{movie.release_date}</p>
      <p
        className={`text-lg ${
          movie.vote_average >= 7.5
            ? "text-green-500"
            : movie.vote_average >= 6
            ? "text-amber-300"
            : "text-red-500"
        }`}
      >
        ★ {movie.vote_average.toFixed(1)}
      </p>
    </div>

    <div className="flex gap-1 p-2 bg-slate-900/50">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSave(movie.id);
        }}
        className={`flex-1 py-2 rounded-lg transition-all duration-300 ${
          isClicked[movie.id]
            ? "bg-green-600 text-white"
            : "bg-slate-700 hover:bg-green-500"
        }`}
      >
        {isClicked[movie.id] ? "Saved" : "Save"}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onLike(movie.id);
        }}
        className={`flex-1 py-2 rounded-lg transition-all duration-300 ${
          isLiked[movie.id]
            ? "bg-red-500 text-white"
            : "bg-slate-700 hover:bg-red-400"
        }`}
      >
        {isLiked[movie.id] ? "Liked" : "Like"}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(movie.id);
        }}
        className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-gray-600 transition-all duration-300"
      >
        Delete
      </button>
    </div>
  </motion.div>
);
