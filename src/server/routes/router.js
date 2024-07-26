import express from 'express';
import { productRoutes } from './products.js';
import { router as contentRouter } from './content.js';


const router = express.Router();

router.use('/api', productRoutes);
router.use('/', contentRouter);

export { router };
