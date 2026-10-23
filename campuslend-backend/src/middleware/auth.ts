import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import User, { IUserDocument } from '../models/User';

/* ── Extend Express Request ── */
declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
      userId?: string;
    }
  }
}

/** Strongly typed request with authenticated user */
export interface AuthenticatedRequest extends Request {
  user: IUserDocument;
  userId: string;
}

export interface JwtTokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Middleware: requires a valid JWT in the Authorization header.
 * Enforces algorithm check (HS256) to prevent algorithm confusion attacks.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required. Bearer token missing.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Authentication token missing.' });
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret, {
      algorithms: [config.jwt.algorithm],
    }) as JwtTokenPayload;

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: 'User associated with this token no longer exists.' });
      return;
    }

    req.user = user;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token has expired. Please authenticate again.' });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid authentication token.' });
      return;
    }
    res.status(500).json({ error: 'Authentication verification failure.' });
  }
};

/**
 * Middleware: optionally attaches user if a valid JWT is present, but does not block.
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, config.jwt.secret, {
          algorithms: [config.jwt.algorithm],
        }) as JwtTokenPayload;

        const user = await User.findById(decoded.userId);
        if (user) {
          req.user = user;
          req.userId = decoded.userId;
        }
      }
    }
  } catch {
    // Continue silently for optional auth
  }
  next();
};

/**
 * Generate a signed JWT for the given user with strict typing.
 */
export const generateToken = (user: IUserDocument): string => {
  const payload: JwtTokenPayload = {
    userId: user._id.toString(),
    email: user.email,
  };

  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
    algorithm: config.jwt.algorithm,
  };

  return jwt.sign(payload, config.jwt.secret, options);
};
