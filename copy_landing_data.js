const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const MONGO_URI = process.env.MONGODB_URI;

// Define flexible schemas to prevent validation errors on missing fields if any
const SchoolSchema = new mongoose.Schema({}, { strict: false });
const School = mongoose.models.School || mongoose.model("School", SchoolSchema);

const LandingContentSchema = new mongoose.Schema({}, { strict: false });
const LandingContent = mongoose.models.LandingContent || mongoose.model("LandingContent", LandingContentSchema, "landingcontents"); // Usually mongoose pluralizes

async function main() {
  console.log("\n🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected!\n");

  const sourceSchoolId = "6a2790ea0d99d9775d96be6a"; // Modern School
  const destSchoolId = "6a36672f894ca7368ab49e84";   // Greenwood Academy

  console.log(`🔍 Fetching source landing data for school ${sourceSchoolId}...`);
  const sourceData = await LandingContent.findOne({ school_id: new mongoose.Types.ObjectId(sourceSchoolId) }).lean();
  
  if (!sourceData) {
    console.error("❌ Source landing content not found!");
    process.exit(1);
  }

  console.log(`🔍 Fetching destination school details for ${destSchoolId}...`);
  const destSchool = await School.findById(destSchoolId).lean();
  
  if (!destSchool) {
    console.error("❌ Destination school not found!");
    process.exit(1);
  }

  console.log("📝 Preparing destination data...");
  const destData = { ...sourceData };
  delete destData._id;
  delete destData.createdAt;
  delete destData.updatedAt;
  delete destData.__v;
  
  destData.school_id = new mongoose.Types.ObjectId(destSchoolId);

  // Update basic details (contact info)
  if (destData.contact) {
    destData.contact.address = destSchool.address || destData.contact.address;
    destData.contact.phone = destSchool.phone || destData.contact.phone;
    destData.contact.email = destSchool.email || destData.contact.email;
  }

  // Update text mentions of the old school name with the new school name
  const oldName = "Modern School";
  const newName = destSchool.name || "Greenwood Academy";
  
  const replaceName = (str) => {
    if (typeof str === 'string') {
      return str.replace(new RegExp(oldName, 'gi'), newName);
    }
    return str;
  };

  if (destData.about) {
    destData.about.hero_description = replaceName(destData.about.hero_description);
    destData.about.history = replaceName(destData.about.history);
  }

  console.log(`🎯 Upserting landing content for school_id: ${destSchoolId}...`);
  const existing = await LandingContent.findOne({ school_id: new mongoose.Types.ObjectId(destSchoolId) });

  if (existing) {
    await LandingContent.updateOne(
      { school_id: new mongoose.Types.ObjectId(destSchoolId) },
      { $set: destData }
    );
    console.log("🔄 Landing content updated successfully!");
  } else {
    await LandingContent.create(destData);
    console.log("🆕 Landing content created successfully!");
  }

  console.log("\n🔍 Verifying database state...");
  const verifyDoc = await LandingContent.findOne({ school_id: new mongoose.Types.ObjectId(destSchoolId) }).lean();
  if (verifyDoc) {
    console.log("✅ Verification passed!");
    console.log(`    - New School Name in About Description: ${verifyDoc.about.hero_description.includes(newName) ? "Yes" : "No"}`);
    console.log(`    - Contact Email: ${verifyDoc.contact.email}`);
  } else {
    console.log("❌ Verification failed! Document not found.");
  }

  await mongoose.disconnect();
  console.log("\n🔌 Disconnected. Done!\n");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
