import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { motion } from "framer-motion";

const categories = ["All", "Action", "Comedy", "Drama", "Horror", "Romance"];

function Movies() {
  // 状态管理
  const [movies, setMovies] = useState([]);
  const [searchMovies, setSearchMovies] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("Light");
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [comments, setComments] = useState({});
  const [sortOption, setSortOption] = useState("popularity");
  const [sortWeights, setSortWeights] = useState({
    popularity: 0.7,
    rating: 0.3,
  });
  const [filters, setFilters] = useState({
    year: "",
    rating: "",
    language: "en",
  });

  // 数据持久化
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("watchlist");
    const savedComments = localStorage.getItem("comments");
    const savedTheme = localStorage.getItem("theme") || "Light";

    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    if (savedComments) setComments(JSON.parse(savedComments));
    setTheme(savedTheme);
  }, []);

  // 电影数据获取
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=0c9408fb0c7908c0ad7066d910ff54c2&page=${currentPage}`
        );
        const data = await response.json();
        setMovies(data.results);
        setSearchFilter(data.results);
      } catch (err) {
        setError("Failed to load movies");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [currentPage]);

  // ...后续代码...
  // 分类ID映射
  const getGenreId = (category) =>
    ({
      Action: 28,
      Comedy: 35,
      Drama: 18,
      Horror: 27,
      Romance: 10749,
    }[category] || null);

  // 混合排序算法
  const hybridSort = (a, b) => {
    const normalize = (value, max, min) => (value - min) / (max - min);
    const maxPopularity = Math.max(...movies.map((m) => m.popularity));
    const minPopularity = Math.min(...movies.map((m) => m.popularity));

    const scoreA =
      normalize(a.popularity, maxPopularity, minPopularity) *
        sortWeights.popularity +
      (a.vote_average / 10) * sortWeights.rating;
    const scoreB =
      normalize(b.popularity, maxPopularity, minPopularity) *
        sortWeights.popularity +
      (b.vote_average / 10) * sortWeights.rating;
    return scoreB - scoreA;
  };

  // 排序逻辑
  const sortedMovie = useCallback(() => {
    let sorted = [...searchFilter];
    switch (sortOption) {
      case "release_date":
        sorted.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
        break;
      case "vote_average":
        sorted.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case "popularity_and_rating":
        sorted.sort(hybridSort);
        break;
      default:
        sorted.sort((a, b) => b.popularity - a.popularity);
    }
    setSearchFilter(sorted);
  }, [sortOption, searchFilter, sortWeights]);

  useEffect(() => {
    sortedMovie();
  }, [sortOption, movies, sortedMovie]);

  // 用户互动功能
  const toggleWatchlist = (movie) => {
    setWatchlist((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      const newList = exists
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie];
      localStorage.setItem("watchlist", JSON.stringify(newList));
      return newList;
    });
  };

  const addComment = (movieId, text) => {
    setComments((prev) => {
      const newComments = {
        ...prev,
        [movieId]: [
          ...(prev[movieId] || []),
          { text, date: new Date().toISOString() },
        ],
      };
      localStorage.setItem("comments", JSON.stringify(newComments));
      return newComments;
    });
  };

  // 事件处理
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  const searchMovie = (e) => {
    e.preventDefault();
    const searchTerm = searchMovies.toLowerCase();
    setSearchFilter(
      searchTerm
        ? movies.filter((movie) =>
            movie.title.toLowerCase().includes(searchTerm)
          )
        : movies
    );
  };
  // 子组件：电影卡片
  const MovieCard = ({ movie, isInWatchlist, toggleWatchlist, onClick }) => (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg truncate">{movie.title}</h3>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(movie);
            }}
            className={`px-3 py-1 rounded ${
              isInWatchlist
                ? "bg-yellow-400 text-black"
                : "bg-gray-200 hover:bg-yellow-400"
            }`}
          >
            {isInWatchlist ? "❤️ Saved" : "♡ Save"}
          </button>
          <span className="text-sm">★ {movie.vote_average}</span>
        </div>
      </div>
    </motion.div>
  );

  // 子组件：收藏夹模态框
  const WatchlistModal = ({
    showWatchlist,
    setShowWatchlist,
    watchlist,
    toggleWatchlist,
  }) =>
    showWatchlist && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full mx-4 overflow-hidden shadow-2xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">My Watchlist</h2>
              <button
                onClick={() => setShowWatchlist(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {watchlist.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isInWatchlist={true}
                  toggleWatchlist={toggleWatchlist}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );

  // ...其他子组件...
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 顶部控制栏 */}
      <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-50 p-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center">
          {/* 主题切换 */}
          <div className="flex items-center gap-2">
            <label className="switch">
              <input
                type="checkbox"
                checked={theme === "Dark"}
                onChange={() =>
                  setTheme((prev) => (prev === "Light" ? "Dark" : "Light"))
                }
              />
              <span className="slider"></span>
            </label>
            <span>{theme} Mode</span>
          </div>

          {/* 搜索框 */}
          <form onSubmit={searchMovie} className="flex-1">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchMovies}
              onChange={(e) => setSearchMovies(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>

          {/* 筛选控制 */}
          <div className="flex gap-4">
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="px-3 py-1 border rounded"
            >
              <option value="">All Years</option>
              {Array.from({ length: 30 }, (_, i) => 2024 - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={filters.rating}
              onChange={(e) =>
                setFilters({ ...filters, rating: e.target.value })
              }
              className="px-3 py-1 border rounded"
            >
              <option value="">All Ratings</option>
              {[5, 6, 7, 8, 9].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}+
                </option>
              ))}
            </select>
          </div>

          {/* 收藏夹按钮 */}
          <button
            onClick={() => setShowWatchlist(true)}
            className="px-4 py-2 bg-yellow-400 rounded-lg hover:bg-yellow-500"
          >
            📃 My Watchlist ({watchlist.length})
          </button>
        </div>
      </header>

      {/* 电影列表 */}
      <main className="max-w-7xl mx-auto p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
              >
                <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded-t-lg"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {searchFilter.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isInWatchlist={watchlist.some((m) => m.id === movie.id)}
                toggleWatchlist={toggleWatchlist}
                onClick={() => handleMovieClick(movie)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 收藏夹模态框 */}
      <WatchlistModal
        showWatchlist={showWatchlist}
        setShowWatchlist={setShowWatchlist}
        watchlist={watchlist}
        toggleWatchlist={toggleWatchlist}
      />

      {/* 电影详情模态框 */}
      {isModalOpen && selectedMovie && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full mx-4 overflow-hidden shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedMovie.title}</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <img
                  src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                  alt={selectedMovie.title}
                  className="w-full h-auto rounded-lg"
                />
                <div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedMovie.overview}
                  </p>
                  <div className="mt-4">
                    <h3 className="text-lg font-bold">Comments</h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const comment = e.target.comment.value;
                        if (comment.trim()) {
                          addComment(selectedMovie.id, comment);
                          e.target.reset();
                        }
                      }}
                      className="mt-2"
                    >
                      <textarea
                        name="comment"
                        placeholder="Write a comment..."
                        className="w-full p-2 border rounded mb-2"
                        rows="3"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Submit
                      </button>
                    </form>
                    <div className="mt-4 space-y-2">
                      {(comments[selectedMovie.id] || []).map(
                        (comment, index) => (
                          <div
                            key={index}
                            className="border-l-4 border-blue-500 pl-2"
                          >
                            <p className="text-gray-600 dark:text-gray-300">
                              {comment.text}
                            </p>
                            <p className="text-sm text-gray-400">
                              {new Date(comment.date).toLocaleString()}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movies;
