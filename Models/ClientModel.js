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
        clientCodeNumber: {
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
                addressLine2: { type: String},
                city: { type: String, required: true },
                state: { type: String, required: true },
                zipCode: { type: String, required: true },
            },
            shippingAddress: {
                addressLine1: { type: String, required: true },
                addressLine2: { type: String },
                city: { type: String, required: true },
                state: { type: String, required: true },
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
                size: { type: Number },
                bucket: { type: String },
                key: { type: String },
                acl: { type: String },
                contentType: { type: String },
                contentDisposition: { type: String },
                contentEncoding: { type: String },
                storageClass: { type: String },
                serverSideEncryption: { type: String },
                metadata: { type: Schema.Types.Mixed,default: null},
                location: { type: String },
                etag: { type: String },
            },
            description: {
                type: String,
            }
        }],
        additionalData: {
            type: String,
        },
        companyId:{type: Schema.Types.ObjectId,
            ref: 'company'
        }
    },
    { timestamp: true }
);

const Client = mongoose.model("client", ClientSchema);
module.exports = Client;
