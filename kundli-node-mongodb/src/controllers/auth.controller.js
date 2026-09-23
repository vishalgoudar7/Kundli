import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


// ========================================
// REGISTER
// POST /api/auth/register
// ========================================

export async function register(req, res, next) {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    // ------------------------------------
    // VALIDATION
    // ------------------------------------

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          'Name, email and password are required'
      });
    }

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    if (password.length < 8) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters'
      });
    }


    // ------------------------------------
    // CHECK EXISTING USER
    // ------------------------------------

    const existingUser =
      await User.findOne({
        email: normalizedEmail
      });

    if (existingUser) {
      return res.status(409).json({
        message:
          'An account with this email already exists'
      });
    }


    // ------------------------------------
    // HASH PASSWORD
    // ------------------------------------

    const passwordHash =
      await bcrypt.hash(
        password,
        12
      );


    // ------------------------------------
    // CREATE USER
    // ------------------------------------

    const user =
      await User.create({
        name:
          name.trim(),

        email:
          normalizedEmail,

        passwordHash
      });


    // ------------------------------------
    // CREATE JWT
    // ------------------------------------

    const token =
      createToken(user._id);


    // ------------------------------------
    // RESPONSE
    // ------------------------------------

    return res.status(201).json({
      message:
        'Account created successfully',

      token,

      user: {
        id:
          user._id,

        name:
          user.name,

        email:
          user.email
      }
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// LOGIN
// POST /api/auth/login
// ========================================

export async function login(req, res, next) {
  try {
    const {
      email,
      password
    } = req.body;


    // ------------------------------------
    // VALIDATION
    // ------------------------------------

    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          'Email and password are required'
      });
    }


    const normalizedEmail =
      email
        .trim()
        .toLowerCase();


    // ------------------------------------
    // FIND USER
    // passwordHash is select:false
    // so explicitly request it here.
    // ------------------------------------

    const user =
      await User
        .findOne({
          email: normalizedEmail
        })
        .select('+passwordHash');


    if (!user) {
      return res.status(401).json({
        message:
          'Invalid email or password'
      });
    }


    // ------------------------------------
    // VERIFY PASSWORD
    // ------------------------------------

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.passwordHash
      );


    if (!passwordMatches) {
      return res.status(401).json({
        message:
          'Invalid email or password'
      });
    }


    // ------------------------------------
    // CREATE JWT
    // ------------------------------------

    const token =
      createToken(user._id);


    // ------------------------------------
    // RESPONSE
    // ------------------------------------

    return res.json({
      message:
        'Login successful',

      token,

      user: {
        id:
          user._id,

        name:
          user.name,

        email:
          user.email
      }
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// GET CURRENT USER
// GET /api/auth/me
// ========================================

export async function getMe(req, res, next) {
  try {

    const user =
      await User.findById(
        req.user.id
      );

    if (!user) {
      return res.status(404).json({
        message:
          'User not found'
      });
    }


    return res.json({
      user: {
        id:
          user._id,

        name:
          user.name,

        email:
          user.email,

        createdAt:
          user.createdAt
      }
    });

  } catch (error) {
    next(error);
  }
}


// ========================================
// CREATE JWT
// ========================================

function createToken(userId) {

  if (!process.env.JWT_SECRET) {
    throw new Error(
      'JWT_SECRET is not configured'
    );
  }

  return jwt.sign(
    {
      userId:
        userId.toString()
    },

    process.env.JWT_SECRET,

    {
      expiresIn:
        process.env.JWT_EXPIRES_IN ||
        '7d'
    }
  );
}