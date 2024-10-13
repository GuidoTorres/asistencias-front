import React, { useState, useRef } from "react";
import { message } from "antd";
import "./styles/asistencias.css";

const Asistencias = () => {
  const [dni, setDni] = useState("");
  const [foto, setFoto] = useState(null);
  const fileInputRef = useRef(null); // Crear una referencia para el campo de archivo

  const handleDniChange = (e) => setDni(e.target.value);
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5000000) { // Si la imagen es mayor a 5MB
      message.error("La imagen es demasiado grande. Máximo 5MB.");
      return;
    }
    setFoto(file);
  };
  const registrarAsistencia = () => {
    const formData = new FormData();
    formData.append("dni", dni);
    formData.append("foto", foto);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitud = position.coords.latitude;
          const longitud = position.coords.longitude;
          formData.append("latitud", latitud);
          formData.append("longitud", longitud);
          await enviarDatos(formData);
        },
        async (error) => {
          console.log("Geolocalización no disponible, se procederá sin ubicación.");
          formData.append("latitud", "");
          formData.append("longitud", "");
          await enviarDatos(formData);
        },
        { timeout: 2000 } // Timeout de 10 segundos
      );
    } else {
      console.log("Geolocalización no es soportada por este navegador.");
      formData.append("latitud", "");
      formData.append("longitud", "");
      enviarDatos(formData);
    }
  };

  const enviarDatos = async (formData) => {
    try {
      const response = await fetch("http://3.145.205.44/api/v1/asistencia", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.status === 200) {
        message.success(data.mensaje);
        setDni(""); // Limpiar el campo de DNI
        setFoto(null); // Limpiar el estado de la imagen
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Limpiar el campo de archivo
        }
      } else {
        message.error(data.mensaje);
      }
    } catch (error) {
      console.log("Error registrando la asistencia:", error);
      message.error("Ocurrió un error al registrar la asistencia.");
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
      <input
        type="file"
        ref={fileInputRef} // Añadir la referencia al campo de archivo
        onChange={handleFotoChange}
        accept="image/*"
      />
      <button onClick={registrarAsistencia}>Registrar Asistencia</button>
    </div>
  );
};

export default Asistencias;
