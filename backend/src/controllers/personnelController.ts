import { Request, Response, RequestHandler } from "express";
import { getAll, getAvailableByRole, addPersonnel } from "../models/PersonnelModel";

export const getPersonnels: RequestHandler = async (req, res) => {
  try {
    const result = await getAll();
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error fetching personnel:", err);
    res.status(500).json({ success: false, message: "Error fetching personnel" });
  }
};

export const getAvailablePersonnels: RequestHandler = async (req, res) => {
  const role = req.params.role;

  try {
    const result = await getAvailableByRole(role);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error fetching available personnel:", err);
    res.status(500).json({ success: false, message: "Error fetching available personnel" });
  }
};

export const addPersonnels: RequestHandler = async (req, res) => {
  const { name, contact, role } = req.body;

  if (!name || !contact || !role) {
    res.status(400).json({ success: false, message: "All fields are required" });
    return;
  }

  try {
    await addPersonnel(name, contact, role);
    res.json({ success: true, message: "Personnel added successfully" });
  } catch (err) {
    console.error("Error adding personnel:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
