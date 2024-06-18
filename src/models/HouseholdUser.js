import mongoose from "mongoose";

const { Schema, model } = mongoose;

const householdUserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  street: { type: String, required: true },
  district: { type: String, required: true },
  phonenumber: { type: String, required: true },

  wasteCollectionSchedules: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      wasteType: [
        {
          type: String,
          enum: ["general", "recyclables", "organic"],
          required: true,
        },
      ],
      schedule: {
        type: String,
        enum: ["weekly", "bi-weekly", "monthly"],
        required: true,
      },
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
    },
  ],
  recyclingLog: [
    {
      materialType: { type: String, required: true },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

householdUserSchema.index({ location: "2dsphere" }); // Index for geospatial queries

const HouseholdUser = model("HouseholdUser", householdUserSchema);

export default HouseholdUser;
