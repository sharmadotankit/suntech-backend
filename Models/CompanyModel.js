const mongoose = require("mongoose");
const { Schema } = mongoose;

const CompanySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    gSTNo: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    bankDetails:[{
        accountNumber:{type: String, required: true},
        accountName:{type: String, required: true},
        ifscCode:{type: String, required: true},
        bankName:{type: String, required: true},
        panNumber:{type: String, required: true},
    }]
  },
  { timestamp: true }
);

const Company = mongoose.model("company", CompanySchema);
module.exports = Company;
