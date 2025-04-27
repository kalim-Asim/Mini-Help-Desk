import express from 'express';
const router = express.Router();
import { signup, login, userDetails, feedback } from '../controllers/userController';

router.post('/login', login);
router.post('/signup', signup);
router.get("/users/:email", userDetails);
router.post("/feedback", feedback);

export default router;