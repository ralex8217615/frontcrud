import React, { useState, useEffect } from "react";
import BaseTabla from "../components/BaseTabla";
import BaseModal from "../components/BaseModal";
import BaseAlerta from "../components/BaseAlerta";

const API = "https://ultimo-nj94.onrender.com/api/plantas";

export default function Crud() {
  const [plantas, setPlantas] = useState([]); 
  const [modalVisible, setModalVisible] = useState(false);
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [plantaActual, setPlantaActual] = useState({
    id: null,
    nombre: "",
    dificultad: "",
    descripcion: ""
  });

  // GET 
  const obtenerPlantas = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      
      console.log("DATA recibida:", data);

      if (Array.isArray(data)) {
        setPlantas(data);
      } else {
        console.error("El servidor mandó un error, no una lista:", data);
        setPlantas([]); 
      }
    } catch (error) {
      console.error("Error al obtener plantas:", error);
      setPlantas([]); 
    }
  };

  useEffect(() => {
    obtenerPlantas();
  }, []);

  const columnas = [
    { label: "ID", key: "id" },
    { label: "Nombre", key: "nombre" },
    { label: "Dificultad", key: "dificultad" },
    { label: "Descripción", key: "descripcion" }
  ];

  // POST / PUT
  const guardarPlanta = async () => {
    try {
      const config = {
        method: plantaActual.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plantaActual)
      };

      const url = plantaActual.id ? `${API}/${plantaActual.id}` : API;
      
      const res = await fetch(url, config);
      
      if (res.ok) {
        await obtenerPlantas();
        setModalVisible(false);
        setPlantaActual({ id: null, nombre: "", dificultad: "", descripcion: "" });
      } else {
        alert("Error al guardar en el servidor");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  // DELETE
  const eliminarPlanta = async () => {
    try {
      const res = await fetch(`${API}/${plantaActual.id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        await obtenerPlantas();
        setAlertaVisible(false);
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">CRUD Plantas de Acuario</h2>

      <button
        className="btn btn-success mb-3"
        onClick={() => {
          setPlantaActual({ id: null, nombre: "", dificultad: "", descripcion: "" });
          setModalVisible(true);
        }}
      >
        Nueva Planta
      </button>

      <BaseTabla
        columnas={columnas}
        datos={Array.isArray(plantas) ? plantas : []} 
        onEditar={(planta) => {
          setPlantaActual(planta);
          setModalVisible(true);
        }}
        onEliminar={(planta) => {
          setPlantaActual(planta);
          setAlertaVisible(true);
        }}
      />

      <BaseModal
        visible={modalVisible}
        titulo="Planta"
        onClose={() => setModalVisible(false)}
        onGuardar={guardarPlanta}
      >
        <input
          className="form-control mb-2"
          placeholder="Nombre"
          value={plantaActual.nombre}
          onChange={(e) =>
            setPlantaActual({ ...plantaActual, nombre: e.target.value })
          }
        />

        <select
          className="form-control mb-2"
          value={plantaActual.dificultad}
          onChange={(e) =>
            setPlantaActual({ ...plantaActual, dificultad: e.target.value })
          }
        >
          <option value="">Selecciona dificultad</option>
          <option value="Fácil">Fácil</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Difícil">Difícil</option>
        </select>

        <textarea
          className="form-control"
          placeholder="Descripción"
          value={plantaActual.descripcion}
          onChange={(e) =>
            setPlantaActual({ ...plantaActual, descripcion: e.target.value })
          }
        />
      </BaseModal>

      <BaseAlerta
        visible={alertaVisible}
        mensaje="¿Seguro que quieres eliminar esta planta?"
        onConfirmar={eliminarPlanta}
        onCancelar={() => setAlertaVisible(false)}
      />
    </div>
  );
}