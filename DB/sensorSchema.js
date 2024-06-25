const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  moisture: {
    type: Number,
    required: true,
  },
  water_quality: {
    type: Number,
    required: true,
  },
  temperature_sensor: {
    type: Number,
    required: true,
  },
  ph: {
    type: Number,
    required: true,
  },
  DateTime: {
    type: Date,
    default: Date.now,
  },
});

const Sensor = mongoose.model("Sensor", sensorSchema);

module.exports = Sensor;
