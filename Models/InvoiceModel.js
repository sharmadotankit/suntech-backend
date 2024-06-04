const mongoose = require("mongoose");
const { Schema } = mongoose;

const InvoiceSchema = new Schema(
    {
        companyId:{
            type: Schema.Types.ObjectId,
            ref: 'company',
            required:true, 
        },
        clientId:{
            type: Schema.Types.ObjectId,
            ref: 'client',
            required:true,
        },
        projectId:{
            type: Schema.Types.ObjectId,
            ref: 'projects',
            required:true,
        },
        invoiceNumber:{type:String,required:true},
        invoiceType:{type:String, required:true},
        invoiceDate:{type:Date, required:true},
        gstNo:{type:String,required:true},
        totalFees:{type:Number, required:true},
        total:{type:Number, required:true},
        taxableValue:{type:Number, required:true},
        feesBreakup:[{
            lineDescription:{type:String,required:true},
            percentValue:{type:Number, required:true},
            lineCost:{type:Number, required:true},
        }],
        tax:{
            taxType:{type:String, required:true},
            taxValue:{type:Number,required:true},
        },
        taxAmount:{type:Number, required:true},
        netTotal:{type:Number, required:true},
        stampDocument: {
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
        }
    },
    { timestamp: true }
);

const Invoice = mongoose.model("invoice", InvoiceSchema);
module.exports = Invoice;
