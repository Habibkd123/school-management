import "dotenv/config";
import mongoose from "mongoose";
import connectToDatabase from "../lib/db";
import User from "../lib/models/User";
import Teacher from "../lib/models/Teacher";

async function main() {
  await connectToDatabase();
  const users = await User.find({}).lean();
  console.log("ALL USERS:", users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role })));

  const teachers = await Teacher.find({}).lean();
  console.log("ALL TEACHERS:", teachers.map(t => ({ id: t._id, name: t.name, userId: t.user_id })));

  mongoose.connection.close();
}

main().catch(console.error);
