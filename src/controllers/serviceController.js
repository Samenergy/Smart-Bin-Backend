import WasteCollectionService from "../models/WasteCollectionService.js";
import HouseholdUser from "../models/HouseholdUser.js";

const getServiceProfile = async (req, res) => {
  try {
    const service = await WasteCollectionService.findById(req.user.id);
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateServiceProfile = async (req, res) => {
  try {
    const updatedService = await WasteCollectionService.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    );
    res.json(updatedService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getServiceAreas = async (req, res) => {
  try {
    const service = await WasteCollectionService.findById(req.user.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json({ district: service.district });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCollectionSchedules = async (req, res) => {
  try {
    const service = await WasteCollectionService.findById(req.user.id);

    if (!service) {
      return res
        .status(404)
        .json({ message: "Waste collection service not found" });
    }

    const district = service.district;

    const householdUsers = await HouseholdUser.find({ district }).populate(
      "wasteCollectionSchedules"
    );

    const schedulesWithUsers = householdUsers
      .filter((user) => user.wasteCollectionSchedules.length > 0)
      .map((user) => ({
        username: user.username,
        phonenumber: user.phonenumber,
        street: user.street,
        schedules: user.wasteCollectionSchedules.map((schedule) => ({
          _id: schedule._id,
          wasteType: schedule.wasteType,
          schedule: schedule.schedule,
          coordinates: {
            longitude: schedule.longitude,
            latitude: schedule.latitude,
          },
        })),
      }));

    res.json(schedulesWithUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPerformanceLogs = async (req, res) => {
  const { _id } = req.params;

  try {
    // Find the waste collection service by _id
    const service = await WasteCollectionService.findById(_id);

    if (!service) {
      return res
        .status(404)
        .json({ error: "Waste collection service not found" });
    }

    // Return the performance logs
    res.json(service.performanceLog);
  } catch (error) {
    console.error("Error fetching performance logs:", error);
    res.status(500).json({ error: "Failed to fetch performance logs" });
  }
};
const addPerformanceLog = async (req, res) => {
  const { _id } = req.params;
  const { houseNumber, wasteType, days, time } = req.body;

  try {
    // Find the waste collection service by _id
    const service = await WasteCollectionService.findById(_id);

    if (!service) {
      return res
        .status(404)
        .json({ error: "Waste collection service not found" });
    }

    // Add new performance log
    service.performanceLog.push({ houseNumber, wasteType, days, time });
    await service.save();

    res.status(201).json(service.performanceLog);
  } catch (error) {
    console.error("Error adding performance log:", error);
    res.status(500).json({ error: "Failed to add performance log" });
  }
};

// PUT /api/waste-collection-services/:_id/performance-logs/:logId
const updatePerformanceLog = async (req, res) => {
  const { _id, logId } = req.params;
  const { houseNumber, wasteType, days, time } = req.body;

  try {
    // Find the waste collection service by _id
    const service = await WasteCollectionService.findById(_id);

    if (!service) {
      return res
        .status(404)
        .json({ error: "Waste collection service not found" });
    }

    // Find the performance log by logId
    const logToUpdate = service.performanceLog.id(logId);

    if (!logToUpdate) {
      return res.status(404).json({ error: "Performance log not found" });
    }

    // Update fields
    logToUpdate.houseNumber = houseNumber;
    logToUpdate.wasteType = wasteType;
    logToUpdate.days = days;
    logToUpdate.time = time;

    await service.save();

    res.json(logToUpdate);
  } catch (error) {
    console.error("Error updating performance log:", error);
    res.status(500).json({ error: "Failed to update performance log" });
  }
};

const deletePerformanceLog = async (req, res) => {
  const { _id, logId } = req.params;

  try {
    // Find the waste collection service by _id
    const service = await WasteCollectionService.findById(_id);

    if (!service) {
      return res
        .status(404)
        .json({ error: "Waste collection service not found" });
    }

    // Filter out the performance log to delete
    service.performanceLog = service.performanceLog.filter(
      (log) => log._id.toString() !== logId
    );

    // Save the updated service
    await service.save();

    res.json({ message: "Performance log deleted successfully" });
  } catch (error) {
    console.error("Error deleting performance log:", error);
    res.status(500).json({ error: "Failed to delete performance log" });
  }
};

export {
  getServiceProfile,
  updateServiceProfile,
  getServiceAreas,
  getCollectionSchedules,
  getPerformanceLogs,
  addPerformanceLog,
  updatePerformanceLog,
  deletePerformanceLog,
};
