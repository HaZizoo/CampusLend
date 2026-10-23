import { Router } from 'express';
import authRoutes from './auth';
import itemRoutes from './items';
import transactionRoutes from './transactions';
import messageRoutes from './messages';

const router = Router();

router.use('/auth', authRoutes);
router.use('/items', itemRoutes);
router.use('/transactions', transactionRoutes);
router.use('/messages', messageRoutes);

export default router;

