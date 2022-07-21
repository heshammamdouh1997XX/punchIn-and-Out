const mongoose=require("mongoose")
const { Schema } = mongoose;

const users_schema = Schema(
  {
    username: { type: String, required: true, uniq: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
    job: { type: String, default: "worker" },
    punchtime: { type: Schema.Types.ObjectId , ref: "punchTime" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user",users_schema)