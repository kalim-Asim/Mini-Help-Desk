import prisma from '../config/db';

// Find a user by email
export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// Create a new user
export const createUser = async (
  name: string,
  email: string,
  hashedPassword: string,
  role: string | any
) => {
  return await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });
};

// Get user details (only name and email) by email
export const getUserDetailsByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      name: true,
      email: true,
    },
  });
};

// Check if feedback exists for a complaint
export const checkExistingFeedback = async (complaint_id: number) => {
  return await prisma.feedback.findFirst({
    where: { complaint_id },
    select: { id: true },
  });
};

// Insert feedback
export const insertFeedback = async (
  complaint_id: number,
  user_id: number,
  assigned_personnel_id: number,
  rating: number,
  comment: string
) => {
  return await prisma.feedback.create({
    data: {
      complaint_id,
      user_id,
      assigned_personnel_id,
      rating,
      comment,
    },
  });
};

// Mark feedback as given in complaints table
export const markFeedbackGiven = async (complaint_id: number) => {
  return await prisma.complaint.update({
    where: { id: complaint_id },
    data: { feedback_given: true },
  });
};
