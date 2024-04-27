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
        description: {type:String, required: true},
        clientBillingAddress:{
            addressLine1: { type: String, required: true },
            addressLine2: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
        },
        offerDate:{ type: Date, required:true},
        offerKindAttention: { type: String, required: true},
        Projectsubject: { type: String, required:true},
        offerCode: { type: String, required: true},
        offerReference: { type: String, required: true},
        offerCodeNumber: {
            type: Number,
            required: true,
            unique: true,
        },
        offerTotal:{
            type:Number,
            required:true,
        }
    },
    { timestamp: true }
);

const Project = mongoose.model("project", ProjectSchema);
module.exports = Project;
