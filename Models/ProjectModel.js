const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProjectSchema = new Schema(
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
        offerId:{
            type: Schema.Types.ObjectId,
            ref: 'offers',
            required:true,
        },
        projectCode:{type:String,required:true},
        //projectNumber:{type:String,required:false},
        isActive:{type:Boolean,default:true},
        projectType:[{type:String, required:true}],
        orderDate:{type:Date, required:true},
        orderValue:{type:Number, required:true},
        shortDescription:{type:String, required:true},
        longDescription:{type:String, required:true},
        projectCorrespondence:[{
            name:{type:String,required:true},
            designation:{type:String},
            contactNo:{type:String},
            email:{type:String}
        }],
        siteLocation:{type:String, required:true},
        mapLocations:[{
            name:{type:String,required:true},
            googleCordinate:{type:String, required:true}
        }],
        gstNo:{type:String,required:true},
        billToAddress:{
            addressLine1: { type: String, required: true },
            addressLine2: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
        },
        shipToAddress:{
            addressLine1: { type: String, required: true },
            addressLine2: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
        },
        attachedDocument: {
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

const Project = mongoose.model("project", ProjectSchema);
module.exports = Project;
