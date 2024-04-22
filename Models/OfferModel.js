const mongoose = require("mongoose");
const { Schema } = mongoose;

const OfferSchema = new Schema(
    {
        companyId:{type: Schema.Types.ObjectId,
            ref: 'company'
        },
        clientId:{type: Schema.Types.ObjectId,
            ref: 'client'
        },
        offerRefNumber: {type:String, required: true},
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
        offerSubject: { type: String, required:true},
        offerCode: { type: String, required: true},
        offerReference: { type: String, required: true},
        offerCodeNumber: {
            type: Number,
            required: true,
            unique: true,
        },
    },
    { timestamp: true }
);

const Offers = mongoose.model("offer", OfferSchema);
module.exports = Offers;
