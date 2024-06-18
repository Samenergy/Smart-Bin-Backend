import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HouseholdUser from "../models/HouseholdUser.js";
import WasteCollectionService from "../models/WasteCollectionService.js";
import Admin from "../models/Admin.js";
import dotenv from "dotenv";

dotenv.config();

const signupHouseholdUser = async (req, res) => {
  try {
    const { username, email, password, street, district, phonenumber } =
      req.body;

    // Validate request body
    if (
      !username ||
      !email ||
      !password ||
      !street ||
      !district ||
      !phonenumber
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await HouseholdUser.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new HouseholdUser instance
    const newUser = new HouseholdUser({
      username,
      email,
      password: hashedPassword,
      street,
      district,
      phonenumber,
      // Add other fields as needed
    });

    // Save user to database
    const savedUser = await newUser.save();

    res.status(201).json(savedUser); // Respond with saved user details
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register household user" });
  }
};

const signupWasteCollectionService = async (req, res) => {
  const {
    serviceName,
    contactPerson,
    email, // Ensure this corresponds to contactEmail
    contactPhone,
    district,
    password,
  } = req.body;

  try {
    
    const existingService = await WasteCollectionService.findOne({ email: email });
    if (existingService) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );

    const newService = new WasteCollectionService({
      serviceName,
      contactPerson,
       email, // Use email field provided from frontend
      contactPhone,
      district,
      password: hashedPassword,
    });

    await newService.save();
    res.status(201).json({ message: "Service provider registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const signupAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
    });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user in all collections
    let user = await HouseholdUser.findOne({ email });
    if (!user) {
      user = await WasteCollectionService.findOne({ email: email });
    }
    if (!user) {
      user = await Admin.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Determine user role
    const userType = determineUserRole(user);

    // Extract company name if the user is a waste collection service
    let serviceName = null;
    if (userType === "wasteCollectionService") {
      serviceName = user.serviceName;
    }

    // Generate JWT
    const tokenPayload = { id: user._id, role: userType };
    if (serviceName) {
      tokenPayload.serviceName = serviceName;
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send back token and user type
    res.json({ token, userType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to determine user role based on instance type
const determineUserRole = (user) => {
  if (user instanceof HouseholdUser) {
    return "household";
  } else if (user instanceof WasteCollectionService) {
    return "service";
  } else if (user instanceof Admin) {
    return "admin";
  }
  return "";
};
export {
  signupHouseholdUser,
  signupWasteCollectionService,
  signupAdmin,
  login,
};
