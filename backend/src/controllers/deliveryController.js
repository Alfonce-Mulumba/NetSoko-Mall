import { prisma } from "../config/db.js";

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, city, country, phone } = req.body;

    const newAddress = await prisma.deliveryAddress.create({
      data: { userId, address, city, country, phone },
    });

    res.status(201).json({ message: "Address added", address: newAddress });
  } catch (error) {
    res.status(500).json({ message: "Error adding address", error: error.message });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await prisma.deliveryAddress.findMany({ where: { userId } });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching addresses", error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { address, city, country, phone } = req.body;

    const updated = await prisma.deliveryAddress.updateMany({
      where: { id: Number(id), userId },
      data: { address, city, country, phone },
    });

    if (!updated.count) {
      return res.status(404).json({ message: "Address not found or unauthorized" });
    }

    res.json({ message: "Address updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating address", error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await prisma.deliveryAddress.deleteMany({
      where: { id: Number(id), userId },
    });

    if (!deleted.count) {
      return res.status(404).json({ message: "Address not found or unauthorized" });
    }

    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting address", error: error.message });
  }
};
