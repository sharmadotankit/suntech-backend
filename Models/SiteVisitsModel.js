const mongoose = require("mongoose");
const { Schema } = mongoose;

const SiteVisitSchema = new Schema(
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
        documentNo:{type:String,required:true},
        placeOfVisit: {
            type: String,
            required: true,
        },
        expensesBySuntech:[{
            name:{type:String, required:true},
            from:{type:String, required:true},
            to:{type:String, required:true},
            numberOfDays:{type:Number, required:true},
            airFare:{type:Number, required:true},
            conveyence:{type:Number, required:true},
            loadingAndBoarding:{type:Number, required:true},
            professionalChanges:{type:Number, required:true},
            gst:{type:Number, required:true},
            total:{type:Number, required:true},
        }],
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

const SiteVisit = mongoose.model("sitevisit", SiteVisitSchema);
module.exports = SiteVisit;
