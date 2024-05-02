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
        projectNumber:{type:String,required:true},
        isActive:{type:Boolean,default:true},
        projectType:{type:String, required:true},
        orderDate:{type:Date, required:true},
        projectCorrespondence:{
            name:{type:String,required:true},
            designation:{type:String},
            contactNo:{type:String},
            email:{type:String}
        },
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
        }
 

    },
    { timestamp: true }
);

const Project = mongoose.model("project", ProjectSchema);
module.exports = Project;
