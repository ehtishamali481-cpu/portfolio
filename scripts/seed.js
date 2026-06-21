require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function main() {
  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Missing MONGODB_URI, ADMIN_EMAIL, or ADMIN_PASSWORD in .env.local");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);

  const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
  });
  const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await Admin.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase() },
    { email: ADMIN_EMAIL.toLowerCase(), passwordHash },
    { upsert: true, new: true }
  );

  console.log(`Admin account ready for ${ADMIN_EMAIL}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
