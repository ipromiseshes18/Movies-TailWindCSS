import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import MovieDetails from "./MovieDetails";
import { motion } from "framer-motion";

const categories = ["All", "Action", "Comedy", "Drama", "Horror", "Romance"];

function Movies() {
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
  const [watchList, setWatchList] = useState([]);
  const [comments, setComments] = useState({});
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [filters, setFilters] = useState({
    year: "",
    rating: "",
    language: "en", // default English
  });
  const [sortWeights, setSortWeights] = useState({
    popularity: 0.7,
    rating: 0.3,
  });

  const toggleTheme = () => {
    const newTheme = theme === "Light" ? "Dark" : "Light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "Dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const saveTheme = localStorage.getItem("theme") || "Light";
    setTheme(saveTheme);
    document.documentElement.setAttribute("data-theme", saveTheme);
    document.documentElement.classList.toggle("dark", saveTheme === "Dark");
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=0c9408fb0c7908c0ad7066d910ff54c2&page=${currentPage}`
    )
      .then((result) => result.json())
      .then((data) => {
        setMovies(data.results);
        setSearchFilter(data.results);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Failed to load movies");
        console.log("Fetch wrong", error);
        setIsLoading(false);
      });
  }, [currentPage]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" && currentPage < 500) nextPage();
      if (e.key === "ArrowLeft" && currentPage > 1) previousPage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage]);

  function handleDelete(id) {
    setSearchFilter(searchFilter.filter((movie) => movie.id !== id));
  }

  const debouncedSearch = debounce((value) => {
    const moviesSearch = searchFilter.filter((movie) =>
      movie.title.toLowerCase().includes(value.toLowerCase())
    );
    setSearchFilter(moviesSearch);
    setCurrentPage(1);
  }, 300);

  function searchMovie(e) {
    e.preventDefault();
    if (searchMovies === "") {
      setSearchFilter(movies);
    } else {
      debouncedSearch(searchMovies);
    }
  }

  const sortedMovies = [...movies]
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 5);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const previousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const firstPage = () => {
    setCurrentPage(1);
  };
  const lastPage = () => {
    setCurrentPage(500);
  };
  const handleClick = (movieId) => {
    setIsClicked((prev) => ({
      ...prev,
      [movieId]: !prev[movieId],
    }));
  };
  const handleLiked = (movieId) => {
    setIsLiked((prev) => ({
      ...prev,
      [movieId]: !prev[movieId],
    }));
  };

  const hanlePageChange = (e) => {
    const input = e.target.value;
    // if (/^[0-9]*$/.test(number) && number.trim() !== "" && number <= 500) {
    //   setCurrentPage(number);
    // }
    if (!/^\d*$/.test(input)) return;

    if (input === "") {
      setCurrentPage(1);
      return;
    }

    const number = parseInt(input);

    if (number < 1) {
      setCurrentPage(1);
    } else if (number > 500) {
      setCurrentPage(500);
    } else {
      setCurrentPage(number);
    }
  };

  function getRandomMovies() {
    const shuffled = [...movies].sort(() => 0.5 - Math.random()).slice(0, 5);
    setRandom(shuffled);
  }

  // const sortedMovie = useCallback(() => {
  //   let sorted = [...searchFilter];
  //   switch (sortOption) {
  //     case "release_date":
  //       sorted.sort(
  //         (a, b) => new Date(b.release_date) - new Date(a.release_date)
  //       );
  //       break;
  //     case "popularity":
  //       sorted.sort((a, b) => b.popularity - a.popularity);
  //       break;
  //     case "vote_average":
  //       sorted.sort((a, b) => b.vote_average - a.vote_average);
  //       break;
  //     default:
  //       sorted.sort((a, b) => b.popularity - a.popularity);
  //   }
  //   setSearchFilter(sorted);
  // }, [sortOption, searchFilter]);

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
  }, [sortOption, searchFilter, sortWeights]); // 添加 sortWeights 依赖

  // 然后才是使用 sortedMovie 的 useEffect
  useEffect(() => {
    sortedMovie();
  }, [sortOption, movies, searchFilter, sortedMovie]);

  const getGenreId = (category) => {
    const genreMap = {
      Action: 28,
      Comedy: 35,
      Drama: 18,
      Horror: 27,
      Romance: 10749,
    };
    return genreMap[category] || null;
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredMovies =
    selectedCategory === "All"
      ? searchFilter
      : searchFilter.filter((movie) =>
          movie.genre_ids.includes(getGenreId(selectedCategory))
        );

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const addComment = (movieId, text) => {
    setComments((prev) => ({
      ...prev,
      [movieId]: [...(prev[movieId] || []), text],
    }));
    localStorage.setItem("comments", JSON.stringify(comments));
  };

  useEffect(() => {
    const savedWatchList = localStorage.getItem("watchList");
    if (savedWatchList) setWatchList(JSON.parse(savedWatchList));

    const savedComments = localStorage.getItem("comments");
    if (savedComments) setComments(JSON.parse(savedComments));
  }, []);

  useEffect(() => {
    localStorage.setItem("watchList", JSON.stringify(watchList));
  }, [watchList]);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  const filterMovies = searchFilter.filter((movie) => {
    if (
      filters.year &&
      new Date(movie.release_date).getFullYear() !== parseInt(filters.year)
    )
      return false;

    if (filters.rating && movie.vote_average < parseInt(filters.rating))
      return false;

    if (filters.language && movie.original_language !== filters.language)
      return false;

    return true;
  });

  const hybridSort = (a, b) => {
    const normalize = (value, max, min) => (value - min) / (max - min);

    const maxPopularity = Math.max(...movies.map((m) => m.popularity));
    const minPopularity = Math.min(...movies.map((m) => m.popularity));
    const maxRating = 10;

    const scoreA =
      normalize(a.popularity, maxPopularity, minPopularity) *
      (sortWeights.popularity +
        (a.vote_average / maxRating) * sortWeights.rating);
    const scoreB =
      normalize(b.popularity, maxPopularity, minPopularity) *
      (sortWeights.popularity +
        (b.vote_average / maxRating) * sortWeights.rating);
    return scoreB - scoreA;
  };

  const addToWachList = (movie) => {
    setWatchList((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      const newList = exists
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie];
      localStorage.setItem("watchList", JSON.stringify(newList));
      return newList;
    });
  };

  return (
    <>
      {/* <div className="fixed top-4 right-4 z-50">
        <button onClick={() => setShowWatchlist(true)}>我的收藏</button>
      </div> */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-50 p-4">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center"></div>
        </header>
      </div>
      <div className={`container ${theme}`}>
        <div className="top-side">
          <div className="flex items-center gap-2">
            <span className="text-sm">{theme === "Light" ? "☀️" : "🌙"}</span>
            <label className="theme-switch relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={theme === "Dark"}
                onChange={toggleTheme}
                className="opacity-0 w-0 h-0"
              />
              <span className="slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 transition-all rounded-full before:absolute before:content-[''] before:h-5 before:w-5 before:left-1 before:bottom-0.5 before:bg-white before:transition-all before:rounded-full before:transform before:translate-y-[-50%] dark:before:translate-x-6"></span>
            </label>
          </div>
          <p>Current Theme: {theme}</p>
          <input
            type="text"
            placeholder="Enter movies"
            value={searchMovies}
            onChange={(e) => setSearchMovies(e.target.value)}
            className="flex-1 px-4 py-2 bg-white dark:bg-slate-700 rounded-full border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={searchMovie}
            className="px-3 py-1 rounded-full bg-rose-300 hover:bg-slate-500 dark:hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
          >
            Search
          </button>
          <div className="flex items-center gap-1 text-sm p-4 ml-100">
            <button
              onClick={firstPage}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-full bg-rose-300 hover:bg-slate-500 dark:hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              &lt;&lt;
            </button>
            <button
              onClick={previousPage}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-full bg-rose-300 hover:bg-slate-500 dark:hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              Previous
            </button>
            <span>Page</span>
            <input
              type="text"
              placeholder={`1-500`}
              title="Enter page number (1-500)"
              value={currentPage}
              onChange={hanlePageChange}
              onBlur={(e) => {
                const num = parseInt(e.target.value) || 1;
                setCurrentPage(Math.min(Math.max(num, 1), 500));
              }}
              className="w-12 px-2 py-1 border rounded text-center bg-white dark:bg-slate-700"
            />
            <span>of 500</span>
            <button
              onClick={nextPage}
              disabled={currentPage === 500}
              className="px-3 py-1 rounded-full bg-rose-300 hover:bg-slate-500 dark:hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer relative"
            >
              Next
            </button>
            <button
              onClick={lastPage}
              disabled={currentPage === 500}
              className="px-3 py-1 rounded-full bg-rose-300 hover:bg-slate-500 dark:hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              &gt;&gt;
            </button>
          </div>

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
        <select value={selectedCategory} onChange={handleCategoryChange}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {error && <div>Error: {error}</div>}
      </div>
      {isLoading ? (
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
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full overflow-x-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 sm:p-6 w-full">
            {filteredMovies.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, u: 30 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full"
              >
                <div
                  onClick={() => handleMovieClick(movie)}
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
                      handleClick(movie.id);
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
                      handleLiked(movie.id);
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
                      handleDelete(movie.id);
                    }}
                    className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-gray-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      {filteredMovies.length === 0 && (
        <div className="text-center py-8">
          🎬 No movies found. Try adjusting your filters!
        </div>
      )}
      <div className="inline-block">
        <h1 className="font-bold text-4xl mt-16">Top Rates</h1>
        <div className=" flex flex-row h-[400px]">
          {sortedMovies.map((movie, id) => (
            <div key={id} className="rate-inner">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                loading="lazy"
                alt={movie.title}
                className="w-full h-auto aspect-[2/3] object-cover rounded-lg"
              />
              <span className="number">{id + 1}.</span>
              <span className="text-red-500 text-lg font-bold text-center line-clamp-2">
                {movie.title}
              </span>
              <span
                className={`rating ${
                  movie.vote_average >= 7.5
                    ? "text-green-500"
                    : movie.vote_average >= 6
                    ? "text-amber-300"
                    : "text-red-500"
                }`}
              >
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="randomMovies">
        <h1 className="font-bold text-4xl mt-16">Random 5 Movies</h1>
        <button
          onClick={getRandomMovies}
          className="px-3 py-1 rounded-full bg-rose-300 hover:bg-slate-500 dark:hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
        >
          Refresh
        </button>
        <div className="flex flex-row">
          {random.map((random) => (
            <div key={random.id} className="random-inner">
              <img
                src={`https://image.tmdb.org/t/p/w500${random.poster_path}`}
                loading="lazy"
                alt={random.title}
                className="w-full h-auto aspect-[2/3] object-cover rounded-lg"
              />
              <span className="text-red-500 text-lg font-bold text-center line-clamp-2">
                {random.title}
              </span>
              <span
                className={`text-lg ${
                  random.vote_average >= 7.5
                    ? "text-green-500"
                    : random.vote_average >= 6
                    ? "text-amber-300"
                    : "text-red-500"
                }`}
              >
                {random.vote_average.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedMovie && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full mx-4 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <MovieDetails movie={selectedMovie} onClose={closeModal} />
          </div>
        </div>
      )}
    </>
  );
}

export default Movies;
