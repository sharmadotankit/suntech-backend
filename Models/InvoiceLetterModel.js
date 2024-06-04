const mongoose = require("mongoose");
const { Schema } = mongoose;

const InvoiceLetterSchema = new Schema(
    {
        companyId:{
            type: Schema.Types.ObjectId,
            ref: 'company',
            required:true, 
        },
        invoiceId:{
            type: Schema.Types.ObjectId,
            ref: 'invoice',
            required:true,
        },
        invoiceLetterDate:{type:Date, required:true},
        kindAttn:{type:String, required:true},
        Ref:{type:String, required:true},
        signatureDocument: {
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
        },
    },
    { timestamp: true }
);

const InvoiceLetter = mongoose.model("invoiceLetter", InvoiceLetterSchema);
module.exports = InvoiceLetter;
