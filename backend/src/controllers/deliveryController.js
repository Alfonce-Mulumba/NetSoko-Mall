import { prisma } from "../config/db.js";

// ✅ Get all addresses
export const getAddresses = async (req, res) => {
  try {
    const addresses = await prisma.deliveryAddress.findMany({
      where: { userId: req.user.id },
    });
    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Error fetching addresses" });
  }
};

// ✅ Add new address
export const addAddress = async (req, res) => {
  try {
    const { address, city, country, phone } = req.body;
    const newAddress = await prisma.deliveryAddress.create({
      data: {
        address,
        city,
        country,
        phone,
        userId: req.user.id,
      },
    });
    res.json(newAddress);
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).json({ message: "Error saving address" });
  }
};

// ✅ Set default address
export const setDefaultAddress = async (req, res) => {
  try {
    const addressId = parseInt(req.params.id);
    await prisma.deliveryAddress.updateMany({
      where: { userId: req.user.id },
      data: { isDefault: false },
    });
    await prisma.deliveryAddress.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
    res.json({ message: "Default address updated" });
  } catch (error) {
    res.status(500).json({ message: "Error setting default address" });
  }
};

// ✅ Delete address
export const deleteAddress = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.deliveryAddress.delete({
      where: { id },
    });
    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting address" });
  }
};
