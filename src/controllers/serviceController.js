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

    // Find household users in the same district and populate their wasteCollectionSchedules
    const householdUsers = await HouseholdUser.find({ district }).populate(
      "wasteCollectionSchedules"
    );

    // Prepare response data
    const schedulesWithUsers = householdUsers.map((user) => ({
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
  try {
    const service = await WasteCollectionService.findById(req.user.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service.performanceLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addPerformanceLog = async (req, res) => {
  const { houseNumber, wasteType, days } = req.body;

  try {
    const service = await WasteCollectionService.findById(req.user.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const newLog = {
      houseNumber,
      wasteType,
      days,
    };

    service.performanceLog.push(newLog);
    await service.save();

    res.status(201).json({ message: "Performance log added", log: newLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updatePerformanceLog = async (req, res) => {
  const { logId } = req.params;
  const { houseNumber, wasteType, days } = req.body;

  try {
    const service = await WasteCollectionService.findById(req.user.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const logToUpdate = service.performanceLog.id(logId);
    if (!logToUpdate) {
      return res.status(404).json({ message: "Performance log not found" });
    }

    logToUpdate.houseNumber = houseNumber || logToUpdate.houseNumber;
    logToUpdate.wasteType = wasteType || logToUpdate.wasteType;
    logToUpdate.days = days || logToUpdate.days;

    await service.save();

    res.json({ message: "Performance log updated", log: logToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deletePerformanceLog = async (req, res) => {
  const { logId } = req.params;

  try {
    const service = await WasteCollectionService.findById(req.user.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const logToRemove = service.performanceLog.id(logId);
    if (!logToRemove) {
      return res.status(404).json({ message: "Performance log not found" });
    }

    logToRemove.remove();
    await service.save();

    res.json({ message: "Performance log deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
