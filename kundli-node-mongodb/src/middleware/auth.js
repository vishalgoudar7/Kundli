import jwt from 'jsonwebtoken';
import User from '../models/User.js';


// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================

export async function requireAuth(
  req,
  res,
  next
) {
  try {

    // ------------------------------------
    // READ AUTHORIZATION HEADER
    // ------------------------------------

    const authHeader =
      req.headers.authorization;


    if (
      !authHeader ||
      !authHeader.startsWith(
        'Bearer '
      )
    ) {
      return res.status(401).json({
        message:
          'Authentication required'
      });
    }


    // ------------------------------------
    // EXTRACT TOKEN
    // ------------------------------------

    const token =
      authHeader
        .slice(7)
        .trim();


    if (!token) {
      return res.status(401).json({
        message:
          'Authentication required'
      });
    }


    if (!process.env.JWT_SECRET) {
      throw new Error(
        'JWT_SECRET is not configured'
      );
    }


    // ------------------------------------
    // VERIFY JWT
    // ------------------------------------

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    // ------------------------------------
    // FIND USER
    // ------------------------------------

    const user =
      await User.findById(
        decoded.userId
      );


    if (!user) {
      return res.status(401).json({
        message:
          'User account no longer exists'
      });
    }


    // ------------------------------------
    // ATTACH USER TO REQUEST
    // ------------------------------------

    req.user = {
      id:
        user._id.toString(),

      name:
        user.name,

      email:
        user.email
    };


    next();

  } catch (error) {

    if (
      error.name ===
        'JsonWebTokenError' ||
      error.name ===
        'TokenExpiredError'
    ) {

      return res.status(401).json({
        message:
          'Invalid or expired token'
      });
    }


    next(error);
  }
}