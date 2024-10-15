import { DatePicker, Select, Table, Tag, Image, Flex } from "antd";
import React, { useEffect, useState } from "react";
import "./styles/mostrarAsistencias.css"; // Importa tus estilos aquí

const MostrarAsistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [data, setData] = useState({ id: "", fecha: "" });

  useEffect(() => {
    getEmpleados();
    getAsistencias();
  }, []);

  useEffect(() => {
    if (data.id !== "" || data.fecha !== "") {
      getAsistencias();
    } else {
      getAsistencias();
    }
  }, [data]);

  const getAsistencias = async () => {
    const params = new URLSearchParams();
    if (data.id) {
      params.append("id", data.id);
    }
    if (data.fecha) {
      params.append("fecha", data.fecha);
    }
    const url = `http://localhost:3001/api/v1/asistencia?${params.toString()}`;
    try {
      const response = await fetch(url);
      const info = await response.json();
      if (info) setAsistencias(info.data);
    } catch (error) {
      console.error("Error al obtener asistencias:", error);
    }
  };

  const getEmpleados = async () => {
    const response = await fetch("http://localhost:3001/api/v1/empleados");
    const info = await response.json();
    if (info) setEmpleados(info);
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      align: "center",
    },
    {
      title: "Empleado",
      render: (_, record) => record?.empleado?.nombre,
      align: "center",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      align: "center",
    },
    {
      title: "Ingreso",
      render: (_, record) => (
        <Flex justify="center" align="center" gap={"4px"}>
          <Image
            src={record?.foto_ingreso}
            style={{ height: "30px", width: "30px" }}
            preview
          />
          <Tag>{record?.estado_ingreso}</Tag>
        </Flex>
      ),
      align: "center",
    },
    {
      title: "Salida",
      render: (_, record) => (
        <Flex justify="center" align="center" gap={"4px"}>
          <Image
            src={record?.foto_salida}
            style={{ height: "30px", width: "30px" }}
          />
          <Tag>{record?.estado_salida}</Tag>
        </Flex>
      ),
      align: "center",
    },
    {
      title: "Ubicación Ingreso",
      render: (_, record) => (
        <Flex justify="center" align="center" gap={"4px"}>
          {record?.latitud_ingreso ? (
            <a
              href={record.latitud_ingreso} // URL a la que deseas redirigir
              target="_blank" // Abre el enlace en una nueva pestaña
              rel="noopener noreferrer" // Seguridad adicional para prevenir vulnerabilidades
            >
              Ver Ubicación
            </a>
          ) : (
            <p>Sin ubicación</p> // Mostrar un mensaje si no hay latitud_ingreso
          )}
        </Flex>
      ),
      align: "center",
    },
    {
      title: "Ubicación Salida",
      render: (_, record) => (
        <Flex justify="center" align="center" gap={"4px"}>
          {record?.latitud_salida ? (
            <a
              href={record.latitud_salida} // URL a la que deseas redirigir
              target="_blank" // Abre el enlace en una nueva pestaña
              rel="noopener noreferrer" // Seguridad adicional para prevenir vulnerabilidades
            >
              Ver Ubicación
            </a>
          ) : (
            <p>Sin ubicación</p> // Mostrar un mensaje si no hay latitud_ingreso
          )}
        </Flex>
      ),
      align: "center",
    },
    {
      title: "Estado día",
      render: (_, record) => (
        <Tag
          color={
            record?.estado_dia === "Falta"
              ? "volcano"
              : record?.estado_dia === "Asistencia"
              ? "green"
              : "processing"
          }
        >
          {record?.estado_dia || "Pendiente"}
        </Tag>
      ),
      align: "center",
    },
  ];

  return (
    <div className="historial">
      <div className="container-historial">
        <Select
          className="input-form"
          placeholder={"Empleados"}
          onChange={(e) => setData((value) => ({ ...value, id: e }))}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          allowClear
          options={empleados?.map((item) => {
            return {
              value: item.id,
              label: item.nombre,
            };
          })}
        />
        <DatePicker
          className="input-form"
          onChange={(e) => setData((value) => ({ ...value, fecha: e }))}
          format={"DD/MM/YYYY"}
          placeholder="Fecha"
        />

        <div className="table-container">
          <Table
            columns={columns}
            dataSource={asistencias}
            style={{ marginTop: "10px" }}
            scroll={{ x: 800 }} // Scroll horizontal si la tabla se sale de la pantalla
          />
        </div>
      </div>
    </div>
  );
};

export default MostrarAsistencias;
