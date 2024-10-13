import React, { useState, useRef } from "react";
import { message } from "antd";
import "./styles/asistencias.css";

const Asistencias = () => {
  const [dni, setDni] = useState("");
  const [foto, setFoto] = useState(null);
  const fileInputRef = useRef(null);

  const handleDniChange = (e) => setDni(e.target.value);
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    
    // Limitar el tamaño a 2 MB (2 * 1024 * 1024 bytes)
    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
    if (file && file.size > maxSizeInBytes) {
      message.error(`El tamaño del archivo no debe exceder los ${maxSizeInMB} MB.`);
      setFoto(null); // Opcional: limpiar el estado de la imagen si el tamaño es excesivo
      e.target.value = ""; // Limpiar el campo de archivo
      return;
    }
  
    setFoto(file);
  };  const registrarAsistencia = () => {
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
          // Si la geolocalización falla, asigna latitud y longitud vacías
          formData.append("latitud", ""); // O puedes usar "0" o algún valor por defecto
          formData.append("longitud", "");
          
          // Notificar al usuario que la ubicación fue bloqueada
          message.warning("Acceso a la ubicación fue bloqueado, se enviará sin ubicación.");
  
          await enviarDatos(formData);
        }
      );
    } else {
      console.log("Geolocalización no es soportada por este navegador.");
      formData.append("latitud", ""); // O puedes usar "0" o algún valor por defecto
      formData.append("longitud", "");
      
      // Notificar al usuario que la ubicación no está disponible
      message.warning("Geolocalización no soportada en este navegador, se enviará sin ubicación.");
      
      enviarDatos(formData);
    }
  };
  

  const enviarDatos = async (formData) => {
    message.info("Enviando datos...");

    const response = await fetch("http://3.145.205.44/api/v1/asistencia", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.status === 200) {
      message.success(data.mensaje);
      setDni(""); 
      setFoto(null); 
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Limpiar el campo de archivo
      }
    } else {
      message.error(data.mensaje);
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
