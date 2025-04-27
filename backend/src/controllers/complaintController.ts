import { Request, Response } from 'express';
import { getAll, createComplaint, getUserComplaints, assignPersonnel, markResolved, trackTicket, getComplaintTypes } from '../models/complaintModel';

export const submitComplaint = async (req: Request, res: Response) => {
  const { name, email, priority, location, type, message } = req.body;
  const attachments = (req.files as Express.Multer.File[] | undefined)?.map((file) => file.filename).join(",") || "";

  if (!name || !email || !priority || !location || !type || !message) {
    res.status(400).json({
      success: false,
      message: 'Please fill all required fields',
    });
    return;
  }

  const complaint = { name, email, priority, location, type, message, attachments };

  try {
    await createComplaint(complaint);
    res.status(201).json({
      success: true,
      message: "Ticket submitted and email sent.",
    });
  } catch (err : any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Error submitting complaint',
    });
  }
};

export const getAllComplaints = async (req: Request, res: Response) => {
  try {
    const results = await getAll();
    res.json({
      success: true,
      data: results,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
    });
  }
};

export const getComplaints = async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    const complaints = await getUserComplaints(email);
    res.json({
      success: true,
      complaints,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching user complaints",
    });
  }
};

export const assign = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { assignedName, assignedContact } = req.body;

  if (!assignedName || !assignedContact) {
    res.status(400).json({
      success: false,
      message: 'Please provide both name and contact of personnel',
    });
    return;
  }

  try {
    const success = await assignPersonnel(id, assignedName, assignedContact);
    if (!success) {
      res.status(404).json({
        success: false,
        message: "Personnel not found",
      });
      return;
    }
    res.json({
      success: true,
      message: "Personnel assigned successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to assign personnel",
    });
  }
};

export const resolvedComplaint = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await markResolved(parseInt(id));
    res.json({
      success: true,
      message: "Complaint marked as resolved",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to resolve complaint",
    });
  }
};

export const track = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400).json({
      success: false,
      message: "Email and ticket code are required",
    });
    return;
  }

  try {
    const results = await trackTicket(email, code);
    if (!results) {
      res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
      return;
    }

    const { status, personnel_name, personnel_contact } = results;
    const response: { success: boolean; status: string; personnel?: { name: string; contact: string } } = { success: true, status };

    if (status === 'Assigned') {
      response.personnel = {
        name: personnel_name || "",
        contact: personnel_contact || "",
      };
    }
    res.json(response);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err,
    });
  }
};

export const complaintTypes = async (req: Request, res: Response) => {
  try {
    const results = await getComplaintTypes();
    res.json({
      success: true,
      complaintTypes: results,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
