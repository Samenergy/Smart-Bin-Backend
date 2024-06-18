import HouseholdUser from "../models/HouseholdUser.js";
import WasteCollectionService from "../models/WasteCollectionService.js";
import Admin from "../models/Admin.js";
import mongoose from "mongoose";

const getUsers = async (req, res) => {
  try {
    const householdUsers = await HouseholdUser.find();
    const services = await WasteCollectionService.find();
    const admins = await Admin.find();
    res.json({ householdUsers, services, admins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const householdUser = await HouseholdUser.findById(req.params.userId);
    const service = await WasteCollectionService.findById(req.params.userId);
    const admin = await Admin.findById(req.params.userId);

    const user = householdUser || service || admin;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser =
      (await HouseholdUser.findByIdAndUpdate(req.params.userId, req.body, {
        new: true,
      })) ||
      (await WasteCollectionService.findByIdAndUpdate(
        req.params.userId,
        req.body,
        { new: true }
      )) ||
      (await Admin.findByIdAndUpdate(req.params.userId, req.body, {
        new: true,
      }));

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const deletedUser =
      (await HouseholdUser.findByIdAndDelete(req.params.userId)) ||
      (await WasteCollectionService.findByIdAndDelete(req.params.userId)) ||
      (await Admin.findByIdAndDelete(req.params.userId));

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getSystemStats = async (req, res) => {
  try {
    const householdCount = await HouseholdUser.countDocuments();
    const serviceCount = await WasteCollectionService.countDocuments();
    const adminCount = await Admin.countDocuments();

    res.json({ householdCount, serviceCount, adminCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getUsers, getUserById, updateUser, deleteUser, getSystemStats };
