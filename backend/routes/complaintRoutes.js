 
import express from 'express';
import authUser from '../middlewares/authUser.js';
import {
    addComplaint,
    getUserComplaints,
    getComplaintDetails,
    updateComplaint,
    deleteComplaint
} from '../controllers/complaintController.js';
import { upload } from '../config/multer.js';
import { validateComplaint } from '../validators/complaintValidator.js';

const router = express.Router();

router.post('/', authUser, upload.single('image'), validateComplaint, addComplaint);
router.get('/', authUser, getUserComplaints);
router.get('/:id', authUser, getComplaintDetails);
router.patch('/:id', authUser, validateComplaint, updateComplaint);
router.delete('/:id', authUser, deleteComplaint);

export default router;