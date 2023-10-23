import express from 'express';
import getRoute from './get';
import postRoute from './post';
import sharingRoute from './sharing';
const router = express.Router();

router.use('/', getRoute);
router.use('/', postRoute);
router.use('/', sharingRoute);

export default router;
