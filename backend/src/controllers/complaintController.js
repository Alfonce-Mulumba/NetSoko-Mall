import { prisma } from "../config/db.js";
import { sendMail } from "../utils/email.js";

export const createComplaint = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Complaint message required" });

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.user.id,
        message,
      },
    });

    try {
      await sendMail({
        to: process.env.ADMIN_EMAIL || "netsoko.care@gmail.com",
        subject: `New complaint from ${req.user.name}`,
        text: message,
      });
    } catch (err) {
      console.error("Failed to send admin email:", err.message);
    }

    try {
      await sendMail({
        to: req.user.email,
        subject: "Complaint received",
        text: `Hi ${req.user.name}, we received your complaint: ${message}`,
      });
    } catch (err) {
      console.error("Failed to send user confirmation email:", err.message);
    }

    res.status(201).json({ message: "Complaint submitted", complaint });
  } catch (err) {
    res.status(500).json({ message: "Error submitting complaint", error: err.message });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      include: { user: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Error fetching complaints", error: err.message });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "in_progress", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const complaint = await prisma.complaint.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json({ message: "Complaint updated", complaint });
  } catch (err) {
    res.status(500).json({ message: "Error updating complaint", error: err.message });
  }
};
