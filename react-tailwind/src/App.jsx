import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Movies from "./Component/Movies/Movies";

function App() {
  return (
    <>
      {/* <div className="overlay"></div>
      <video src={videoBg} autoPlay loop muted />
      <div className="content">
        <h2>
          <span>W</span>
          <span>e</span>
          <span>l</span>
          <span>c</span>
          <span>o</span>
          <span>m</span>
          <span>e</span>
        </h2>
        <p>To my site</p>
      </div> */}
      <BrowserRouter>
        <nav className="App">
          <ul>
            <li className="nav">
              <Link to="/movies">Movies</Link>
              {/* <Link to="/counter">Counter</Link>
              <Link to="/todo">Todo</Link> */}
            </li>
          </ul>
        </nav>
        <Routes>
          {/* <Route path="/homepage" element={<HomePage />} /> */}
          <Route path="/movies" element={<Movies />} />
          {/* <Route path="/counter" element={<Counter />} />
          <Route path="/todo" element={<Todo />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
