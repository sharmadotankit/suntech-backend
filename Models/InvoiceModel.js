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
    },
    { timestamp: true }
);

const Invoice = mongoose.model("invoice", InvoiceSchema);
module.exports = Invoice;
