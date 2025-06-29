// import express from 'express'
// import authUser from '../middlewares/authUser.js'
// import { addComplaint, deleteComplaint, getComplaintById, getUserComplaints } from '../controllers/complaintController.js'
// import { upload } from '../config/multer.js'

// const complaintRouter = express.Router()

// complaintRouter.post('/add-complaint', upload.single(), authUser, addComplaint)
// complaintRouter.get('/my-complaints', authUser, getUserComplaints)
// complaintRouter.get('/:complaintId', authUser, getComplaintById) //Get a single complaint by ID (details + status)
// complaintRouter.delete('/:complaintId', deleteComplaint) ///delete complaint

// export default complaintRouter

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
router.put('/:id', authUser, validateComplaint, updateComplaint);
router.delete('/:id', authUser, deleteComplaint);

export default router;