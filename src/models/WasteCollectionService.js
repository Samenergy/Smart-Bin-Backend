import mongoose from "mongoose";

const { Schema, model } = mongoose;

const performanceLogSchema = new Schema({
  houseNumber: { type: String, required: true },
  wasteType: { type: String, required: true },
  date: { type: Date, default: Date.now },
  days: { type: String, required: true },
  time: { type: String, required: true },
});

const wasteCollectionServiceSchema = new Schema({
  serviceName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactPhone: { type: String, required: true },
  district: { type: String, required: true },
  password: { type: String, required: true },
  performanceLog: [performanceLogSchema],
});

const WasteCollectionService = model(
  "WasteCollectionService",
  wasteCollectionServiceSchema
);

export default WasteCollectionService;
