import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { generateToken, authenticate, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Constant dummy hash used to neutralize timing attacks when an email does not exist
const DUMMY_HASH = '$2b$12$e8w8Yp7r83lWp2m8EaYIquGqK8aF.t5Rj9JjGkO37aI2nJz8tC/1W';

/* ── POST /api/auth/register ── */
router.post(
  '/register',
  validate([
    { field: 'email', required: true, type: 'email' },
    { field: 'password', required: true, type: 'string', minLength: 8 },
    { field: 'name', required: true, type: 'string', minLength: 2, maxLength: 100 },
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name, universityId } = req.body;

      // Validate password strength: must contain letters and numbers
      if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
        res.status(400).json({
          error: 'Password must contain at least one letter and one number.',
        });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        res.status(409).json({ error: 'An account with this email address already exists.' });
        return;
      }

      const user = new User({
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
        universityId: typeof universityId === 'string' ? universityId.trim() : undefined,
      });

      await user.save();

      const token = generateToken(user);

      res.status(201).json({
        message: 'Account registered successfully',
        token,
        user: user.toPublicJSON(),
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message || 'Registration processing failure' });
    }
  },
);

/* ── POST /api/auth/login ── */
router.post(
  '/login',
  validate([
    { field: 'email', required: true, type: 'email' },
    { field: 'password', required: true, type: 'string' },
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const cleanEmail = String(email).trim().toLowerCase();

      // Find user and explicitly select hidden password field
      const user = await User.findOne({ email: cleanEmail }).select('+password');

      if (!user) {
        // Prevent timing-attack account enumeration: execute bcrypt comparison against dummy hash
        await bcrypt.compare(password, DUMMY_HASH);
        res.status(401).json({ error: 'Invalid email or password.' });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid email or password.' });
        return;
      }

      const token = generateToken(user);

      res.json({
        message: 'Authentication successful',
        token,
        user: user.toPublicJSON(),
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message || 'Login processing failure' });
    }
  },
);

/* ── GET /api/auth/me ── */
router.get('/me', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    res.json({ user: authReq.user.toPublicJSON() });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to retrieve profile' });
  }
});

/* ── PUT /api/auth/verify ── */
router.put('/verify', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const user = authReq.user;

    if (user.is_verified) {
      res.json({ message: 'User is already verified', user: user.toPublicJSON() });
      return;
    }

    user.is_verified = true;
    user.verificationMethod = 'manual';
    await user.save();

    res.json({ message: 'User verification updated successfully', user: user.toPublicJSON() });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Verification update failure' });
  }
});

export default router;
