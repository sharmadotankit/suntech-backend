const mongoose = require("mongoose");
const { Schema } = mongoose;

const OutwardSchema = new Schema(
    {
        companyId:{
            type: Schema.Types.ObjectId,
            ref: 'company',
            required:true, 
        },
        projectId:{
            type: Schema.Types.ObjectId,
            ref: 'project',
            required:true,
        },
        clientId:{
            type: Schema.Types.ObjectId,
            ref: 'client',
            required:true,
        },
        docNo:{type:String,required:true},
        docType:{type:String,required:true},
        description: {
            type: String,
        },
        outwardDate:{ type:Date, required:true},
        documents: [{
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
        }],
    },
    { timestamp: true }
);

const Outward = mongoose.model("outward", OutwardSchema);
module.exports = Outward;
