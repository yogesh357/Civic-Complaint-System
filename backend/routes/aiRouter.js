
import express from 'express'; 
import { analyzeComplaint } from '../controllers/aiController.js';
const router = express.Router();
 

router.post('/ai-estimator/:id',  analyzeComplaint);

export default router;
