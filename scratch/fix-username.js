const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in env!");
  process.exit(1);
}

// Define User schema model inline so we don't need imports
const userSchema = new mongoose.Schema({
  school_id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  username: String,
  role: String,
  is_active: Boolean
}, { collection: "users" });

const schoolSchema = new mongoose.Schema({
  slug: String
}, { collection: "schools" });

const User = mongoose.models.User || mongoose.model("User", userSchema);
const School = mongoose.models.School || mongoose.model("School", schoolSchema);

async function run() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!");

    const allUsers = await User.find({});
    console.log(`Found ${allUsers.length} total users.`);

    let updatedCount = 0;

    for (const u of allUsers) {
      const email = u.email || "";
      const cleanedEmail = email.toLowerCase().trim();
      const domain = "myschoollife";
      let correctUsername = "";

      if (cleanedEmail.endsWith(`.${domain}`)) {
        correctUsername = cleanedEmail;
      } else {
        const localPart = email.split("@")[0].toLowerCase().trim().replace(/[^a-z0-9.]/g, "");
        if (u.school_id) {
          const school = await School.findById(u.school_id).lean();
          if (school && school.slug) {
            const slug = school.slug.toLowerCase().trim().replace(/[^a-z0-9.]/g, "");
            if (localPart === slug) {
              correctUsername = `${slug}.${domain}`;
            } else if (localPart.endsWith(`.${slug}`)) {
              correctUsername = `${localPart}.${domain}`;
            } else {
              correctUsername = `${localPart}.${slug}.${domain}`;
            }
          } else {
            correctUsername = `${localPart}.${domain}`;
          }
        } else {
          correctUsername = `${localPart}.${domain}`;
        }
      }

      if (!u.username || u.username !== correctUsername) {
        console.log(`Updating ${u.name} username: "${u.username}" -> "${correctUsername}" (email: ${u.email})`);
        u.username = correctUsername;
        await u.save();
        updatedCount++;
      }
    }

    console.log(`Done! Corrected ${updatedCount} usernames.`);
  } catch (err) {
    console.error("Error during username correction:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
