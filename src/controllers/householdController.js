import HouseholdUser from "../models/HouseholdUser.js";

const getHouseholdProfile = async (req, res) => {
  try {
    const user = await HouseholdUser.findById(req.user.id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateHouseholdProfile = async (req, res) => {
  try {
    const { username, email, street, district, phonenumber } = req.body;

    // Validate request body (basic validation)
    if (!username || !email || !street || !district || !phonenumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Update the user's profile
    const updatedUser = await HouseholdUser.findByIdAndUpdate(
      req.user.id,
      { username, email, street, district, phonenumber },
      { new: true, runValidators: true } // Ensure validators are run
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getHouseholdSchedules = async (req, res) => {
  try {
    const user = await HouseholdUser.findById(req.user.id);
    res.json(user.wasteCollectionSchedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addHouseholdSchedule = async (req, res) => {
  try {
    const user = await HouseholdUser.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { wasteType, schedule, longitude, latitude } = req.body;

    if (!longitude || !latitude) {
      return res
        .status(400)
        .json({ message: "Longitude and latitude are required" });
    }

    const newSchedule = {
      wasteType,
      schedule,
      longitude,
      latitude,
    };

    user.wasteCollectionSchedules.push(newSchedule);
    await user.save();

    res.json(user.wasteCollectionSchedules); // Respond with updated schedules array
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateHouseholdSchedule = async (req, res) => {
  try {
    const user = await HouseholdUser.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const schedule = user.wasteCollectionSchedules.id(req.params.scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    schedule.wasteType = req.body.wasteType;
    schedule.schedule = req.body.schedule;

    await user.save();

    res.json(schedule); // Respond with updated schedule object
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteHouseholdSchedule = async (req, res) => {
  try {
    const user = await HouseholdUser.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.wasteCollectionSchedules.findIndex(
      (schedule) => schedule._id.toString() === req.params.scheduleId
    );

    if (index === -1) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    user.wasteCollectionSchedules.splice(index, 1);
    await user.save();

    res.json(user.wasteCollectionSchedules); // Respond with updated schedules array
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getRecyclingLog = async (req, res) => {
  try {
    const user = await HouseholdUser.findById(req.user.id);
    res.json(user.recyclingLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addRecyclingLogEntry = async (req, res) => {
  try {
    const user = await HouseholdUser.findById(req.user.id);
    user.recyclingLog.push(req.body);
    await user.save();
    res.json(user.recyclingLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const editRecyclingLogEntry = async (req, res) => {
  try {
    const user = await HouseholdUser.findById(req.user.id);
    const logEntryIndex = user.recyclingLog.findIndex(
      (entry) => entry._id.toString() === req.params.entryId
    );

    if (logEntryIndex === -1) {
      return res.status(404).json({ message: "Log entry not found" });
    }

    // Update the log entry with new data
    user.recyclingLog[logEntryIndex].materialType = req.body.materialType;
    user.recyclingLog[logEntryIndex].amount = req.body.amount;
    user.recyclingLog[logEntryIndex].date = req.body.date; // Assuming you update date as well

    await user.save();
    res.json(user.recyclingLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteRecyclingLogEntry = async (req, res) => {
  try {
    const user = await HouseholdUser.findById(req.user.id);
    const logEntryIndex = user.recyclingLog.findIndex(
      (entry) => entry._id.toString() === req.params.entryId
    );

    if (logEntryIndex === -1) {
      return res.status(404).json({ message: "Log entry not found" });
    }

    user.recyclingLog.splice(logEntryIndex, 1); // Remove the entry from the array
    await user.save();
    res.json(user.recyclingLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export {
  getHouseholdProfile,
  updateHouseholdProfile,
  getHouseholdSchedules,
  addHouseholdSchedule,
  updateHouseholdSchedule,
  deleteHouseholdSchedule,
  getRecyclingLog,
  addRecyclingLogEntry,
  deleteRecyclingLogEntry,
  editRecyclingLogEntry,
};
