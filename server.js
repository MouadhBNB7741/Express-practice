const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Sensor = require("./DB/sensorSchema");
const xlsx = require("xlsx");
const nodemailer = require("nodemailer");

const app = express();

app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost:27017/watering")
  .then(() => console.log("mouadh DB is ready"))
  .catch((err) => console.log("oop mouadh is not right, more details: " + err));

app.get("/", async (req, res) => {
  try {
    const sensors = await Sensor.find();
    res.status(200).json(sensors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/", async (req, res) => {
  const { id, moisture, water_quality, temperature_sensor, ph } = req.body;
  const newSensor = new Sensor({
    id,
    moisture,
    water_quality,
    temperature_sensor,
    ph,
  });

  try {
    const savedSensor = await newSensor.save();
    res.status(201).json(savedSensor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { moisture, water_quality, temperature_sensor, ph } = req.body;

  try {
    const updatedSensor = await Sensor.findByIdAndUpdate(
      { id },
      { moisture, water_quality, temperature_sensor, ph },
      { new: true }
    );
    if (!updatedSensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }
    res.status(200).json(updatedSensor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSensor = await Sensor.findByIdAndDelete(id);
    if (!deletedSensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }
    res.status(200).json({ message: "Sensor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/excel", async (req, res) => {
  try {
    const data = await Sensor.find();
    if (!data || data.length === 0) {
      throw Error("no data found");
    }
    const workBook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(
      JSON.parse(JSON.stringify(data))
    );
    xlsx.utils.book_append_sheet(workBook, worksheet, "Data");
    xlsx.writeFile(workBook, "./DB/Data.csv");
    res.status(200).json({ message: "Excel saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/mail", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 587,
      secure: false,
      auth: {
        user: "api",
        pass: "7661d59df020aa23bb45a475bb883b5f",
      },
    });
    const mailOptions = {
      from: "mailtrap@demomailtrap.com",
      to: "dahmanemoh18@gmail.com",
      subject: "Data",
      text: "This is the report of the day",
      attachments: [
        {
          path: "./DB/Data.csv",
        },
      ],
    };
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).json("Mail sended");
  } catch (error) {
    res.status(500).json("oops...");
  }
});

app.listen(8000, () => {
  console.log("mouadh in the back is ready");
});
