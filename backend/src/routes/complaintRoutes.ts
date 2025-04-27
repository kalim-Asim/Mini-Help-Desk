import { Router } from "express";
const router = Router();
import {submitComplaint, getAllComplaints, getComplaints, assign, resolvedComplaint, track, complaintTypes} from "../controllers/complaintController";
import upload from "../middleware/upload";

router.post("/complaints",  upload.array("attachments"), submitComplaint);
router.get("/complaints", getAllComplaints);
router.post("/complaints/track", track);
router.patch("/complaints/:id", resolvedComplaint);
router.put("/complaints/:id/assign", assign);
router.get("/complaints/user/:email",getComplaints);
router.get("/complaint_types", complaintTypes);

export default router;