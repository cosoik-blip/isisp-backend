import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { Projects } from "./components/Projects";
import { News } from "./components/News";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { AdminDashboard } from "./components/admin/AdminDashboard";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <Projects />
      <News />
      <Contact />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;