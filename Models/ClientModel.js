const mongoose = require("mongoose");
const { Schema } = mongoose;

const ClientSchema = new Schema(
    {
        clientName: {
            type: String,
            required: true,
        },
        clientCode: {
            type: String,
            required: true,
            unique: true,
        },
        clientCodeNumber:{
            type: Number,
            required: true,
            unique: true,
        },
        gstNo: {
            type: String,
            required: true,
            unique: true,
        },
        allAddress: [{
            billingAddress: {
                addressLine1: { type: String, required: true },
                addressLine2: { type: String, required: true },
                city: { type: String, required: true },
                state: { type: String, required: true },
                country: { type: String, required: true },
                zipCode: { type: String, required: true },
            },
            shippingAddress: {
                addressLine1: { type: String, required: true },
                addressLine2: { type: String, required: true },
                city: { type: String, required: true },
                state: { type: String, required: true },
                country: { type: String, required: true },
                zipCode: { type: String, required: true },
            },
            isDefault: {
                type: Boolean,
                default: false,
            }
        }],
        clientDocuments: [{
            file: {
                fieldname: { type: String },
                originalname: { type: String },
                encoding: { type: String },
                mimetype: { type: String },
                destination: { type: String },
                filename: { type: String },
                path: { type: String },
                size: { type: Number },
            },
            description: {
                type: String,
            }
        }],
        additionalData:{
            type:String,
        }
    },
    { timestamp: true }
);

const Client = mongoose.model("client", ClientSchema);
module.exports = Client;
