import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

function MovieDetails({ movie, onClose, comments, addComment }) {
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const detailsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=0c9408fb0c7908c0ad7066d910ff54c2`
        );
        const detailsData = await detailsRes.json();

        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=0c9408fb0c7908c0ad7066d910ff54c2`
        );
        const creditsDate = await creditsRes.json();

        const videosRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=0c9408fb0c7908c0ad7066d910ff54c2`
        );
        const videosData = await videosRes.json();

        setDetails(detailsData);
        setCredits(creditsDate);
        setVideos(videosData.results);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [movie.id]);

  if (loading) return <div>Loading details...</div>;

  // const haneleSubmit = (e) => {
  //   e.preventDefault();
  //   if (newComment.trim()) {
  //     addComment(movie.id, {
  //       text: newComment,
  //       timestamp: new Date().toISOString(),
  //     });
  //     setNewComment("");
  //   }
  // };
  //overflow-y-auto：当内容超出高度时，自动显示垂直滚动条。
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        {/* 头部基本信息 */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold dark:text-white">{movie.title}</h2>
          <button
            onClick={onClose}
            className="text-2xl p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            ×
          </button>
        </div>

        {/* 图片和基本信息 */}
        <div className="grid md:grid-cols-2 gap-6">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            loading="lazy"
            className="w-full rounded-xl shadow-lg"
          />
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">{movie.overview}</p>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-blue-600">
                ★ {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-500">
                {new Date(movie.release_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* 其他详细信息 */}
        <div className="p-6 space-y-6">
          {/* 头部基本信息 */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
            <span>⏳ {details.runtime} mins</span>
            <span>🎭 {details.genres.map((g) => g.name).join(", ")}</span>
            <span>⭐ IMDB: {details.vote_average.toFixed(1)}</span>
            <a
              href={`https://www.imdb.com/title/${details.imdb_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              IMDB页面
            </a>
          </div>

          {/* 预告片展示 */}
          {videos.length > 0 && (
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${videos[0].key}`}
                width="100%"
                height="100%"
                controls
              />
            </div>
          )}

          {/* 剧情简介 */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold">剧情简介</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {details.overview}
            </p>
          </div>

          {/* 主要演员 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">主要演员</h3>
            <div className="flex overflow-x-auto gap-4 pb-4">
              {credits.cast.slice(0, 10).map((actor) => (
                <div key={actor.id} className="flex-shrink-0 w-32 text-center">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                        : "/placeholder-avatar.jpg"
                    }
                    alt={actor.name}
                    className="w-32 h-32 rounded-full object-cover mb-2"
                  />
                  <p className="font-medium">{actor.name}</p>
                  <p className="text-sm text-gray-500">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 额外信息表格 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="font-medium">导演</p>
              <p>
                {credits.crew.find((m) => m.job === "Director")?.name || "-"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">编剧</p>
              <p>
                {credits.crew
                  .filter((m) => m.job === "Screenplay")
                  .map((w) => w.name)
                  .join(", ") || "-"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">制片国家</p>
              <p>
                {details.production_countries.map((c) => c.name).join(", ")}
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">上映日期</p>
              <p>{new Date(details.release_date).toLocaleDateString()}</p>
            </div>
          </div>

          {/* 评论部分 */}
          {/* <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">
              Comment({comments.length})
            </h3>
            <form onSubmit={haneleSubmit} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add Comment..."
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
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    {comment.text}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(comment.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
