import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import Pradzia from "./puslapiai/Pradzia";
import Stebejimai from "./puslapiai/Stebejimai";
import NaujasStebejimas from "./puslapiai/NaujasStebejimas";
import RedaguotiStebejima from "./puslapiai/RedaguotiStebejima";
import NaujasPapludimys from "./puslapiai/NaujasPapludimys";
import RedaguotiPapludimys from "./puslapiai/RedaguotiPapludimys";

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>Paplūdimių vandens stebėjimas</h1>

        <nav>
          <Link to="/">Pradžia</Link>
          {" | "}
          <Link to="/stebejimai">Vandens stebėjimai</Link>
          {" | "}
          <Link to="/stebejimai/naujas">Naujas stebėjimas</Link>
          {" | "}
          <Link to="/papludimiai/naujas">Pridėti paplūdimį</Link>
        </nav>

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
      </div>
    </BrowserRouter>
  );
}

export default App;
