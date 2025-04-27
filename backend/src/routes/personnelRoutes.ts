import express from "express";
const router = express.Router();
import {getPersonnels, 
      getAvailablePersonnels, 
      addPersonnels} from "../controllers/personnelController";

router.get("/", getPersonnels);
router.get("/available/:role", getAvailablePersonnels);
router.post("/", addPersonnels);

export default router;