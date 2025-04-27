import prisma from '../config/db';
import { sendComplaintConfirmation } from '../middleware/mailer';

const generateCode = (): string => Math.floor(1000 + Math.random() * 9000).toString();

interface ComplaintInput {
  name: string;
  email: string;
  priority: string | any;
  location: string;
  type: string;
  message: string;
  attachments: string;
}

export const getAll = async () => {
  return await prisma.complaint.findMany({
    include: {
      assignedPersonnel: true, // Fetching the assigned personnel related to the complaint
      complaintType: true,     // Fetching the complaint type related to the complaint
    },
  });
};

export const createComplaint = async ({
  name,
  email,
  priority,
  location,
  type,
  message,
  attachments,
}: ComplaintInput) => {
  const code = generateCode();

  const complaintType = await prisma.complaintType.findFirst({ where: { type_name: type } });
  console.log(complaintType);
  if (!complaintType) throw new Error("Invalid complaint type");

  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) throw new Error("User not found");

  const complaint = await prisma.complaint.create({
    data: {
      priority,
      location,
      complaint_type_id: complaintType.id,
      message,
      attachments,
      code: code.toString(),
      user_id: user.id,
    },
  });

  await sendComplaintConfirmation(email, name, type, code);
  return complaint;
};

export const getUserComplaints = async (email: string) => {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) throw new Error("User not found");

  return await prisma.complaint.findMany({
    where: { user_id: user.id },
  });
};

export const assignPersonnel = async (complaintId: number, assignedName: string, assignedContact: string) => {
  const personnel = await prisma.personnel.findFirst({
    where: { name: assignedName, contact: assignedContact },
  });
  if (!personnel) return null;

  await prisma.complaint.update({
    where: { id: complaintId },
    data: {
      assigned_personnel_id: personnel.id,
      status: "Assigned",
    },
  });

  await prisma.personnel.update({
    where: { id: personnel.id },
    data: { available: false },
  });

  return true;
};

export const markResolved = async (complaintId: number) => {
  const complaint = await prisma.complaint.findUnique({
    where: { id: complaintId },
  });

  if (!complaint) throw new Error("Complaint not found");

  await prisma.complaint.update({
    where: { id: complaintId },
    data: { status: "Resolved" },
  });

  if (complaint.assigned_personnel_id) {
    await prisma.personnel.update({
      where: { id: complaint.assigned_personnel_id },
      data: { available: true },
    });
  }

  return true;
};

export const trackTicket = async (email: string, code: string) => {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) throw new Error("User not found");

  const complaint = await prisma.complaint.findFirst({
    where: {
      user_id: user.id,
      code,
    },
    include: {
      assignedPersonnel: true,
    },
  });

  if (!complaint) throw new Error("Complaint not found");

  return {
    status: complaint.status,
    personnel_name: complaint.assignedPersonnel?.name || null,
    personnel_contact: complaint.assignedPersonnel?.contact || null,
  };
};

export const getComplaintTypes = async () => {
  return await prisma.complaintType.findMany({
    select: { 
      id: true, 
      type_name: true 
    },
  });
};
