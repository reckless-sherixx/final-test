import { Request, Response } from 'express';
import User from '../model/user.model.js';
import jwt from 'jsonwebtoken';
import ResetToken from '../model/resetToken.model.js';

// Extend Express Request interface to include role property
declare global {
  namespace Express {
    interface Request {
      role?: string;
    }
  }
}

// Generate a reset token and URL for a specific user
export const generateResetUrl = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Generate a token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    // Save the token in database (overwrite if exists)
    await ResetToken.findOneAndUpdate(
      { userId: user._id },
      { token, createdAt: new Date() },
      { upsert: true, new: true }
    );

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    return res.status(200).json({
      success: true,
      message: 'Reset URL generated successfully',
      resetUrl,
      userName: user.username
    });
  } catch (error) {
    console.error('Error generating reset URL:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate reset URL'
    });
  }
};

// Validate a reset token
export const validateResetToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token is required' 
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { userId: string };
    
    // Check if token exists in database
    const resetToken = await ResetToken.findOne({ 
      userId: decoded.userId,
      token 
    });

    if (!resetToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }

    // Check if token is expired (24 hours)
    const tokenCreationTime = new Date(resetToken.createdAt).getTime();
    const currentTime = new Date().getTime();
    const tokenAge = currentTime - tokenCreationTime;
    const tokenExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (tokenAge > tokenExpiry) {
      await ResetToken.deleteOne({ _id: resetToken._id });
      return res.status(401).json({ 
        success: false, 
        message: 'Token has expired' 
      });
    }

    // Token is valid
    return res.status(200).json({
      success: true,
      message: 'Token is valid',
      userId: decoded.userId
    });
  } catch (error) {
    console.error('Error validating reset token:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Update/Reset the password using token
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token and new password are required' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { userId: string };
    
    // Find token in database
    const resetToken = await ResetToken.findOne({ 
      userId: decoded.userId,
      token 
    });

    if (!resetToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }

    // Update user's password
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    user.password = newPassword;
    user.firstLogin = false; // Update firstLogin status
    await user.save();

    // Delete the used token
    await ResetToken.deleteOne({ _id: resetToken._id });

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};

// For admins to edit/customize reset links
export const customizeResetLink = async (req: Request, res: Response) => {
  try {
    const { userId, expiry } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Default expiry is 24 hours, but can be customized
    const expiryTime = expiry || '24h';
    
    // Generate a token with custom expiry
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: expiryTime }
    );

    // Save or update token in database
    await ResetToken.findOneAndUpdate(
      { userId: user._id },
      { 
        token, 
        createdAt: new Date(),
        customExpiry: expiryTime
      },
      { upsert: true, new: true }
    );

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    return res.status(200).json({
      success: true,
      message: 'Custom reset URL generated successfully',
      resetUrl,
      userName: user.username,
      expiry: expiryTime
    });
  } catch (error) {
    console.error('Error customizing reset URL:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to customize reset URL'
    });
  }
};

// Get all active reset tokens (for admin view)
export const getActiveResetTokens = async (req: Request, res: Response) => {

  try {
    if (req.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can view active reset tokens'
      });
    }
    
    const resetTokens = await ResetToken.find()
      .populate('userId', 'username name surname');
      
    return res.status(200).json({
      success: true,
      tokens: resetTokens
    });
  } catch (error) {
    console.error('Error fetching reset tokens:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch reset tokens'
    });
  }
};

// Delete a specific reset token
export const deleteResetToken = async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.params;
    
    if (!tokenId) {
      return res.status(400).json({
        success: false,
        message: 'Token ID is required'
      });
    }
    
    await ResetToken.findByIdAndDelete(tokenId);
    
    return res.status(200).json({
      success: true,
      message: 'Reset token deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting reset token:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete reset token'
    });
  }
};