import { Router } from 'express';
import { register, login, getMe, updatePreferences } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);
router.patch('/me/preferences', updatePreferences);

export default router;
