const mongoose = require("mongoose");
const { Schema } = mongoose;

const CompanySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    gstNo: {
      type: String,
      required: true,
    },
    address: {
      addressLine1: {type: String, required: true},
      addressLine2: {type: String, required: true},
      city: {type: String, required: true},
      state: {type: String, required: true},
      country: {type: String, required: true},
      zipCode: {type: String, required: true},
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
