import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { motion } from "framer-motion";
import MovieDetails from "./MovieDetails";
import { Pagination } from "./Pagination";
import { MoviesList } from "./MoviesList";

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
  const [isClicked, setIsClicked] = useState({});
  const [isLiked, setIsLiked] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("popularity");
  const [random, setRandom] = useState([]);
  const [theme, setTheme] = useState("Light");
  const [sortWeights, setSortWeights] = useState({
    popularity: 0.7,
    rating: 0.3,
  });

  // 主题切换
  const toggleTheme = () => {
    const newTheme = theme === "Light" ? "Dark" : "Light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "Dark");
    localStorage.setItem("theme", newTheme);
  };

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "Light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "Dark");
  }, []);

  // 获取电影数据
  useEffect(() => {
    setIsLoading(true);
    fetch(
      `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=0c9408fb0c7908c0ad7066d910ff54c2&page=${currentPage}`
    )
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results);
        setSearchFilter(data.results);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Failed to load movies");
        console.error("Fetch error:", error);
        setIsLoading(false);
      });
  }, [currentPage]);

  // 键盘翻页
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" && currentPage < 500) nextPage();
      if (e.key === "ArrowLeft" && currentPage > 1) previousPage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage]);

  // 搜索功能
  const debouncedSearch = debounce((value) => {
    const results = searchFilter.filter((movie) =>
      movie.title.toLowerCase().includes(value.toLowerCase())
    );
    setSearchFilter(results);
    setCurrentPage(1);
  }, 300);

  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies === ""
      ? setSearchFilter(movies)
      : debouncedSearch(searchMovies);
  };

  // 分页控制
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, 500));
  const previousPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const firstPage = () => setCurrentPage(1);
  const lastPage = () => setCurrentPage(500);

  // 交互功能
  const handleInteraction = (setState) => (movieId) => {
    setState((prev) => ({ ...prev, [movieId]: !prev[movieId] }));
  };

  // 排序功能
  const hybridSort = useCallback(
    (a, b) => {
      const normalize = (value, max, min) => (value - min) / (max - min);
      const maxPop = Math.max(...movies.map((m) => m.popularity));
      const minPop = Math.min(...movies.map((m) => m.popularity));

      const scoreA =
        normalize(a.popularity, maxPop, minPop) * sortWeights.popularity +
        (a.vote_average / 10) * sortWeights.rating;
      const scoreB =
        normalize(b.popularity, maxPop, minPop) * sortWeights.popularity +
        (b.vote_average / 10) * sortWeights.rating;
      return scoreB - scoreA;
    },
    [movies, sortWeights]
  );

  const sortedMovie = useCallback(() => {
    let sorted = [...searchFilter];
    switch (sortOption) {
      case "release_date":
        sorted.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
        break;
      case "popularity":
        sorted.sort((a, b) => b.popularity - a.popularity);
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
  }, [sortOption, searchFilter, hybridSort]);

  useEffect(() => sortedMovie(), [sortedMovie]);

  // 分类过滤
  const getGenreId = (category) =>
    ({
      Action: 28,
      Comedy: 35,
      Drama: 18,
      Horror: 27,
      Romance: 10749,
    }[category]);

  const filteredMovies =
    selectedCategory === "All"
      ? searchFilter
      : searchFilter.filter((m) =>
          m.genre_ids.includes(getGenreId(selectedCategory))
        );

  // 电影详情模态框
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-50 p-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-between">
          {/* 主题切换 */}
          <div className="flex items-center gap-2">
            <span className="text-sm">{theme === "Light" ? "☀️" : "🌙"}</span>
            <label className="theme-switch">
              <input
                type="checkbox"
                checked={theme === "Dark"}
                onChange={toggleTheme}
                className="opacity-0 w-0 h-0"
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* 搜索框 */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchMovies}
              onChange={(e) => setSearchMovies(e.target.value)}
              className="flex-1 px-4 py-2 bg-white dark:bg-slate-700 rounded-full border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-rose-300 hover:bg-rose-400 transition-colors"
            >
              Search
            </button>
          </form>

          {/* 分页控制 */}
          <Pagination
            currentPage={currentPage}
            onPageChange={(e) => {
              const input = e.target.value;
              if (!/^\d*$/.test(input)) return;
              const num = Math.min(Math.max(parseInt(input) || 1, 1), 500);
              setCurrentPage(num);
            }}
            onFirstPage={firstPage}
            onLastPage={lastPage}
            onPreviousPage={previousPage}
            onNextPage={nextPage}
          />
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* 排序控制 */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded bg-white dark:bg-gray-700"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            {["popularity", "vote_average", "popularity_and_rating"].map(
              (opt) => (
                <button
                  key={opt}
                  onClick={() => setSortOption(opt)}
                  className={`px-3 py-2 rounded ${
                    sortOption === opt
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {opt.replace(/_/g, " ").toUpperCase()}
                </button>
              )
            )}
          </div>

          {sortOption === "popularity_and_rating" && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              {/* 权重滑动条 */}
            </div>
          )}
        </div>

        {/* 电影列表 */}
        <MoviesList
          movies={filteredMovies}
          isLoading={isLoading}
          isClicked={isClicked}
          isLiked={isLiked}
          onDelete={(id) =>
            setSearchFilter((prev) => prev.filter((m) => m.id !== id))
          }
          onLike={handleInteraction(setIsLiked)}
          onSave={handleInteraction(setIsClicked)}
          onMovieClick={handleMovieClick}
        />

        {/* 顶部评分电影 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Top Rated Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {movies
              .sort((a, b) => b.vote_average - a.vote_average)
              .slice(0, 5)
              .map((movie, index) => (
                <div key={movie.id} className="relative group">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 bg-gradient-to-t from-black to-transparent w-full p-4 rounded-b-lg">
                    <span className="text-white font-bold">
                      #{index + 1} {movie.title}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 随机电影 */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Random Picks</h2>
            <button
              onClick={() =>
                setRandom(
                  [...movies].sort(() => 0.5 - Math.random()).slice(0, 5)
                )
              }
              className="px-4 py-2 bg-rose-300 rounded-full hover:bg-rose-400 transition-colors"
            >
              Refresh
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {random.map((movie) => (
              <div
                key={movie.id}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-bold truncate">{movie.title}</h3>
                  <p className="text-sm text-gray-500">{movie.release_date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 电影详情模态框 */}
      {isModalOpen && selectedMovie && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full overflow-hidden shadow-xl">
            <MovieDetails
              movie={selectedMovie}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Movies;
