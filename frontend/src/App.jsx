import "./App.css";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import Pradzia from "./puslapiai/Pradzia";
import Stebejimai from "./puslapiai/Stebejimai";
import NaujasStebejimas from "./puslapiai/NaujasStebejimas";
import RedaguotiStebejima from "./puslapiai/RedaguotiStebejima";
import NaujasPapludimys from "./puslapiai/NaujasPapludimys";
import RedaguotiPapludimys from "./puslapiai/RedaguotiPapludimys";
import logo from "./assets/Logo_new.png";

function App() {
  return (
    <BrowserRouter>
      <header className="virsus">
        <div className="virsaus-turinys">
          <Link to="/" className="papludimio-zenklas">
            <img
              src={logo}
              alt="Baltijos stebėsenos logotipas"
              className="logotipo-zenklas"
            />
            <span>
              <strong>Lietuvos paplūdimių stebėsena</strong>
              <small>Maudyklų vandens kokybė</small>
            </span>
          </Link>

          <nav className="navigacija">
            <Link to="/">Pradžia</Link>
            <Link to="/stebejimai">Stebėjimai</Link>
            <Link to="/stebejimai/naujas" className="navigacijos-mygtukas">
              + Naujas stebėjimas
            </Link>
            <Link to="/papludimiai/naujas">+ Paplūdimys</Link>
          </nav>
        </div>
      </header>

      <main className="puslapio-turinys">
        <Routes>
          <Route path="/" element={<Pradzia />} />
          <Route path="/stebejimai" element={<Stebejimai />} />
          <Route path="/stebejimai/naujas" element={<NaujasStebejimas />} />
          <Route
            path="/stebejimai/redaguoti/:id"
            element={<RedaguotiStebejima />}
          />
          <Route path="/papludimiai/naujas" element={<NaujasPapludimys />} />
          <Route
            path="/papludimiai/redaguoti/:id"
            element={<RedaguotiPapludimys />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
