import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Anchor } from "antd";
import MostrarAsistencias from "./components/MostrarAsistencias";
import Asistencias from "./components/Asistencias";

const App = () => {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        {/* Ancla de navegación */}
        <Anchor
          direction="horizontal"
          items={[
            {
              key: "part-1",
              href: "/historial",
              title: "Historial de Asistencias",
            },
            {
              key: "part-2",
              href: "/asistencias",
              title: "Registrar Asistencia",
            },
          ]}
        />

        {/* Contenido de las rutas */}
        <Routes>
          {/* Redirigir desde la raíz ("/") hacia "/asistencias" */}
          <Route path="/" element={<Navigate to="/asistencias" />} />

          {/* Otras rutas */}
          <Route path="/historial" element={<MostrarAsistencias />} />
          <Route path="/asistencias" element={<Asistencias />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
