import React from "react";
import Home from "./Pages/Home/Home";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./Pages/SignIn/SignIn";
import Gallery from "./Pages/Gallery/Gallery";
import Upload from "./Pages/Upload/Upload";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Gallery" element={<Gallery />} />
          <Route path="/Upload" element={<Upload />} />
          <Route path="/SignIn" element={<SignIn />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
