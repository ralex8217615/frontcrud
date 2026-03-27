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

  //get
  const obtenerPlantas = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      console.log("DATA", data);
      setPlantas(data);
    } catch (error) {
      console.error("Error al obtener plantas:", error);
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

  // post put
  const guardarPlanta = async () => {
    try {
      if (plantaActual.id) {
        await fetch(`${API}/${plantaActual.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(plantaActual)
        });
      } else {
        await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(plantaActual)
        });
      }

      await obtenerPlantas();
      setModalVisible(false);
      setPlantaActual({ id: null, nombre: "", dificultad: "", descripcion: "" });

    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  // delete
  const eliminarPlanta = async () => {
    try {
      await fetch(`${API}/${plantaActual.id}`, {
        method: "DELETE"
      });

      await obtenerPlantas();
      setAlertaVisible(false);

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
        datos={plantas || []}
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