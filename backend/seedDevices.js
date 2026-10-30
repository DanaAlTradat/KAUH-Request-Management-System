
require("dotenv").config();

const mongoose = require("mongoose");
const Department = require("./models/Department");
const Device = require("./models/Device");

const devices = [
  ["Patient Monitor", "Monitoring", "Nursing"],
  ["ECG Machine", "Monitoring", "Nursing"],
  ["Pulse Oximeter", "Monitoring", "Nursing"],
  ["Blood Pressure Monitor", "Monitoring", "Nursing"],
  ["Digital Thermometer", "Monitoring", "Nursing"],
  ["Holter Monitor", "Monitoring", "Cardiology"],
  ["Fetal Monitor", "Monitoring", "Maternity"],

  ["Mechanical Ventilator", "Emergency", "ICU"],
  ["Defibrillator", "Emergency", "Emergency"],
  ["AED", "Emergency", "Emergency"],
  ["Infusion Pump", "Medical Equipment", "Nursing"],
  ["Syringe Pump", "Medical Equipment", "ICU"],
  ["Suction Machine", "Medical Equipment", "Emergency"],
  ["Oxygen Concentrator", "Medical Equipment", "ICU"],
  ["Nebulizer", "Medical Equipment", "Nursing"],
  ["CPAP Machine", "Medical Equipment", "ICU"],
  ["Emergency Crash Cart", "Emergency", "Emergency"],

  ["Ultrasound Machine", "Diagnostic", "Radiology"],
  ["Digital X-Ray Machine", "Diagnostic", "Radiology"],
  ["CT Scanner", "Diagnostic", "Radiology"],
  ["MRI Scanner", "Diagnostic", "Radiology"],
  ["Mammography Machine", "Diagnostic", "Radiology"],
  ["C-Arm X-Ray", "Diagnostic", "Surgery"],
  ["Endoscopy System", "Diagnostic", "Endoscopy"],
  ["EEG Machine", "Diagnostic", "Neurology"],
  ["Spirometer", "Diagnostic", "Pulmonology"],

  ["Anesthesia Machine", "Surgical", "Surgery"],
  ["Operating Table", "Surgical", "Surgery"],
  ["Surgical Light", "Surgical", "Surgery"],
  ["Electrosurgical Unit", "Surgical", "Surgery"],
  ["Laparoscopy System", "Surgical", "Surgery"],
  ["Surgical Suction Unit", "Surgical", "Surgery"],
  ["Video Laryngoscope", "Surgical", "Surgery"],
  ["Patient Warming System", "Surgical", "Surgery"],

  ["Laboratory Centrifuge", "Laboratory", "Laboratory"],
  ["Microscope", "Laboratory", "Laboratory"],
  ["Hematology Analyzer", "Laboratory", "Laboratory"],
  ["Chemistry Analyzer", "Laboratory", "Laboratory"],
  ["Blood Gas Analyzer", "Laboratory", "Laboratory"],
  ["Laboratory Incubator", "Laboratory", "Laboratory"],
  ["Autoclave", "Sterilization", "Sterilization"],
  ["Laboratory Refrigerator", "Laboratory", "Laboratory"],
  ["Urine Analyzer", "Laboratory", "Laboratory"],

  ["Hemodialysis Machine", "Dialysis", "Dialysis"],
  ["RO Water Treatment System", "Dialysis", "Dialysis"],
  ["Washer Disinfector", "Sterilization", "Sterilization"],
  ["Ultrasonic Cleaner", "Sterilization", "Sterilization"],
  ["Endoscope Reprocessor", "Sterilization", "Endoscopy"],

  ["Hospital Bed", "Furniture", "Nursing"],
  ["ICU Bed", "Furniture", "ICU"],
  ["Patient Stretcher", "Transport", "Emergency"],
  ["Wheelchair", "Transport", "General Services"],
  ["Patient Lift", "Transport", "Nursing"],
  ["Examination Table", "Furniture", "Nursing"],
  ["IV Stand", "Furniture", "Nursing"],
  ["Medical Trolley", "Transport", "Nursing"],
  ["Infant Incubator", "Neonatal", "Maternity"],
  ["Infant Radiant Warmer", "Neonatal", "Maternity"],

  ["Desktop Computer", "IT Equipment", "IT"],
  ["Laptop", "IT Equipment", "IT"],
  ["Printer", "IT Equipment", "IT"],
  ["Barcode Scanner", "IT Equipment", "IT"],
  ["Network Switch", "Networking", "IT"],
  ["Wireless Access Point", "Networking", "IT"],
  ["UPS", "Power Equipment", "IT"],
  ["Label Printer", "IT Equipment", "IT"],
  ["Monitor Screen", "IT Equipment", "IT"],
  ["Network Router", "Networking", "IT"],
];

const statuses = [
  "Available",
  "Available",
  "Available",
  "Under Maintenance",
  "Out of Service",
];

async function seedDevices() {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("MongoDB connected");

    let added = 0;
    let skipped = 0;

    for (let i = 0; i < devices.length; i++) {
      const [name, category, departmentName] = devices[i];

      const department = await Department.findOneAndUpdate(
        { name: departmentName },
        {
          $setOnInsert: {
            name: departmentName,
            description: "Demo department for the project",
            isActive: true,
          },
        },
        { upsert: true, new: true }
      );

      const assetTag = `DEMO-${String(i + 1).padStart(3, "0")}`;

      const result = await Device.updateOne(
        { assetTag },
        {
          $setOnInsert: {
            name,
            category,
            assetTag,
            brand: "Demo Brand",
            model: "Demo Model",
            department: department._id,
            status: statuses[i % statuses.length],
            description: "Fictional demo record, not verified hospital inventory",
          },
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        added++;
      } else {
        skipped++;
      }
    }

    console.log(`Device types in file: ${devices.length}`);
    console.log(`New devices added: ${added}`);
    console.log(`Existing devices skipped: ${skipped}`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedDevices();
