const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const MONGO_URI = process.env.MONGODB_URI;

const SchoolSchema = new mongoose.Schema({}, { strict: false });
const School = mongoose.models.School || mongoose.model("School", SchoolSchema);

async function main() {
  await mongoose.connect(MONGO_URI);
  const greenwood = await School.findOne({ _id: "6a36672f894ca7368ab49e84" }).lean();
  console.log("Greenwood School basic details in School collection:");
  console.log(JSON.stringify(greenwood, null, 2));
  process.exit(0);
}

main().catch(console.error);
