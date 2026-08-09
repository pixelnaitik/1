import express from 'express';
import { processAssistantMessage } from '../controllers/assistantController.js';

const router = express.Router();

router.post('/messages', processAssistantMessage);

export default router;
