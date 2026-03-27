import express from "express";
import {
  getPlantas,
  getPlantaById,
  createPlanta,
  updatePlanta,
  deletePlanta
} from "../controllers/plantas.js";

const router = express.Router();

router.get("/", getPlantas);
router.get("/:id", getPlantaById);
router.post("/", createPlanta);
router.put("/:id", updatePlanta);
router.delete("/:id", deletePlanta);

export default router;