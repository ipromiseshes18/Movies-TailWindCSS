// components/Movies/components/SortControls.jsx
import React from "react";

export const SortControls = ({
  sortOption,
  setSortOption,
  sortWeights,
  setSortWeights,
}) => (
  <div className="space-y-4">
    <div className="space-y-4">
      <button
        onClick={() => setSortOption("popularity")}
        className={`px-3 py-1 rounded ${
          sortOption === "popularity"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Popularity
      </button>
      <button
        onClick={() => setSortOption("vote_average")}
        className={`px-3 py-1 rounded ${
          sortOption === "vote_average"
            ? "bg-green-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Rating
      </button>
      <button
        onClick={() => setSortOption("popularity_and_rating")}
        className={`px-3 py-1 rounded ${
          sortOption === "popularity_and_rating"
            ? "bg-purple-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        综合排序
      </button>
    </div>

    {sortOption === "popularity_and_rating" && (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              人气权重：{Math.round(sortWeights.popularity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={sortWeights.popularity}
              onChange={(e) =>
                setSortWeights({
                  popularity: parseFloat(e.target.value),
                  rating: 1 - parseFloat(e.target.value),
                })
              }
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              评分权重：{Math.round(sortWeights.rating * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={sortWeights.rating}
              onChange={(e) =>
                setSortWeights({
                  rating: parseFloat(e.target.value),
                  popularity: 1 - parseFloat(e.target.value),
                })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>
    )}
  </div>
);
