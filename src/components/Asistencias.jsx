import React, { useState, useRef } from "react";
import { message } from "antd";
import "./styles/asistencias.css";

const Asistencias = () => {
  const [dni, setDni] = useState("");
  const [foto, setFoto] = useState(null);
  const fileInputRef = useRef(null);

  const handleDniChange = (e) => setDni(e.target.value);
  const handleFotoChange = (e) => setFoto(e.target.files[0]);

  const registrarAsistencia = () => {
    message.info("Botón de registrar presionado");
    const formData = new FormData();
    formData.append("dni", dni);
    formData.append("foto", foto);

    // Validar que se haya ingresado un DNI y una foto
    if (!dni || !foto) {
      message.error("Por favor ingrese el DNI y seleccione una foto.");
      return;
    }

    // Verificar si la geolocalización está disponible
    if (navigator.geolocation) {
      message.info("Obteniendo geolocalización...");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitud = position.coords.latitude;
          const longitud = position.coords.longitude;
          message.success(`Ubicación obtenida: Latitud ${latitud}, Longitud ${longitud}`);
          formData.append("latitud", latitud);
          formData.append("longitud", longitud);
          await enviarDatos(formData);  // Enviar los datos
        },
        async (error) => {
          message.error("No se pudo obtener la ubicación, se procederá sin ella.");
          formData.append("latitud", "");
          formData.append("longitud", "");
          await enviarDatos(formData);  // Enviar los datos
        }
      );
    } else {
      message.error("Geolocalización no es soportada por este navegador.");
      formData.append("latitud", "");
      formData.append("longitud", "");
      enviarDatos(formData);  // Enviar los datos
    }
  };

  const enviarDatos = async (formData) => {
    message.info("Enviando datos...");

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
        message.error(data.mensaje || "Error al registrar la asistencia.");
      }
    } catch (error) {
      message.error("Error al enviar los datos: " + error.message);
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
        ref={fileInputRef}
        onChange={handleFotoChange}
        accept="image/*"
      />
      <button onClick={registrarAsistencia}>Registrar Asistencia</button>
    </div>
  );
};

export default Asistencias;
