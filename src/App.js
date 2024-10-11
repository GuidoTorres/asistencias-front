import React, { useState } from "react";
import "./App.css";
import { message } from "antd";

const RegistroAsistencia = () => {

  const [dni, setDni] = useState("");
  const [foto, setFoto] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const handleDniChange = (e) => setDni(e.target.value);
  const handleFotoChange = (e) => setFoto(e.target.files[0]);

  const registrarAsistencia = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitud = position.coords.latitude;
        const longitud = position.coords.longitude;

        // Crear FormData para enviar datos al backend
        const formData = new FormData();
        formData.append("dni", dni);
        formData.append("foto", foto); // La foto seleccionada por el usuario
        formData.append("latitud", latitud);
        formData.append("longitud", longitud);
        
        const response = await fetch(
          "http://18.116.48.172:3001/api/v1/asistencia",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        if (response.status === 200) {
          message.success(data.mensaje);
          setDni("");
          setFoto(null);
        } else {
          message.error(data.mensaje);
        }
      });
    } else {
      console.log("Geolocalización no es soportada por este navegador.");
    }
  };


  return (
    <div className="container">
      <h2 className="h2">Registro de Asistencia</h2>
      <input
        type="text"
        placeholder="DNI"
        value={dni}
        onChange={handleDniChange}
      />
      <input type="file" onChange={handleFotoChange} accept="image/*" />
      <button onClick={registrarAsistencia}>Registrar Asistencia</button>
    </div>
  );
};

export default RegistroAsistencia;
