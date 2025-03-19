import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Movies from "./Component/Movies/Movies";
import Login from "./Component/Movies/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/movies" element={<Movies />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
