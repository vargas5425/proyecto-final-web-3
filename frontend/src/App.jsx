import React from "react";
import AppRouter from "./routes/appRouter.jsx";
import Navbar from "./components/navBar.jsx";

export default function App() {
  return (
    <div className="container-fluid">
      <Navbar />
      <main className="mt-5 pt-3">
        <AppRouter />
      </main>
    </div>
  );
}
