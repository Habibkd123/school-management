const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://gkd:gkd785625%40Kd02@cluster0.hxh3fpj.mongodb.net/schools";

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const user = await db.collection("users").findOne({ email: "kdhabib738@gmail.com" });
  console.log("User doc:", user);

  await mongoose.disconnect();
}

main().catch(console.error);
