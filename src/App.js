import React, { useState } from "react";
import "./App.css";
import { message } from "antd";

const RegistroAsistencia = () => {
  const [dni, setDni] = useState("");
  const [foto, setFoto] = useState(null);

  const handleDniChange = (e) => setDni(e.target.value);
  const handleFotoChange = (e) => setFoto(e.target.files[0]);

  const registrarAsistencia = () => {
    // Crear FormData para enviar datos al backend
    const formData = new FormData();
    formData.append("dni", dni);
    formData.append("foto", foto); // La foto seleccionada por el usuario

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitud = position.coords.latitude;
          const longitud = position.coords.longitude;
          
          // Agregar latitud y longitud si la geolocalización está disponible
          formData.append("latitud", latitud);
          formData.append("longitud", longitud);

          await enviarDatos(formData);
        },
        async (error) => {
          // Si no se puede obtener la geolocalización, continuar sin latitud/longitud
          console.log("Geolocalización no disponible, se procederá sin ubicación.");
          
          // Puedes usar valores predeterminados o dejar vacíos
          formData.append("latitud", "");
          formData.append("longitud", "");
          
          await enviarDatos(formData);
        }
      );
    } else {
      // Si el navegador no soporta geolocalización, proceder sin ella
      console.log("Geolocalización no es soportada por este navegador.");
      formData.append("latitud", "");
      formData.append("longitud", "");
      
      enviarDatos(formData);
    }
  };

  const enviarDatos = async (formData) => {
    try {
      const response = await fetch("http://localhost:3001/api/v1/asistencia", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      if (response.status === 200) {
        message.success(data.mensaje);
        setDni("");
        setFoto(null);
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
      <input type="file" onChange={handleFotoChange} accept="image/*" />
      <button onClick={registrarAsistencia}>Registrar Asistencia</button>
    </div>
  );
};

export default RegistroAsistencia;
