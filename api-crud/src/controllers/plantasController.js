import { pool } from "../db.js";

// GET TODOS
export const getPlantas = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM plantas");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "error en servidor" });
  }
};

// GET POR ID
export const getPlantaById = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM plantas WHERE id = $1",
    [req.params.id]
  );
  res.json(result.rows[0]);
};

// POST
export const createPlanta = async (req, res) => {
  const { nombre, dificultad, descripcion } = req.body;

  const result = await pool.query(
    "INSERT INTO plantas(nombre, dificultad, descripcion) VALUES($1,$2,$3) RETURNING *",
    [nombre, dificultad, descripcion]
  );

  res.json(result.rows[0]);
};

// PUT
export const updatePlanta = async (req, res) => {
  const { nombre, dificultad, descripcion } = req.body;

  await pool.query(
    "UPDATE plantas SET nombre=$1, dificultad=$2, descripcion=$3 WHERE id=$4",
    [nombre, dificultad, descripcion, req.params.id]
  );

  res.json({ mensaje: "Actualizado" });
};

// DELETE
export const deletePlanta = async (req, res) => {
  await pool.query("DELETE FROM plantas WHERE id=$1", [req.params.id]);
  res.json({ mensaje: "Eliminado" });
};