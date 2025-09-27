import { prisma } from "../config/db.js";

// User: submit complaint
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

    res.status(201).json({ message: "Complaint submitted", complaint });
  } catch (err) {
    res.status(500).json({ message: "Error submitting complaint", error: err.message });
  }
};

// Admin: view all complaints
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

// Admin: update complaint status
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
