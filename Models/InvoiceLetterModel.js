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
        invoiceLetterNumber:{type:String, required:true},
        invoiceLetterDate:{type:Date, required:true},
        kindAttn:{type:String, required:true},
        Ref:{type:String, required:true},
        subject:{type:String, required:true},
    },
    { timestamp: true }
);

const InvoiceLetter = mongoose.model("invoiceLetter", InvoiceLetterSchema);
module.exports = InvoiceLetter;
