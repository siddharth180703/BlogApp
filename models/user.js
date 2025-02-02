const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  salt: {
    type: String,
  },
  password: { type: String, required: true },
  profileImageURL: {
    type: String,
    default: "/images/default",
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hash = createHmac("sha256", salt).update(user.password).digest("hex");
  user.salt = salt;
  user.password = hash;
  next();
});
userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User Not Found");
  const salt = user.salt;
  const hashedPassword = user.password;
  const hash = createHmac("sha256", salt).update(password).digest("hex");
  if (hash != hashedPassword) throw new Error("Incorrect Password");
  return user;
});
const Users = model("user", userSchema);
module.exports = Users;
