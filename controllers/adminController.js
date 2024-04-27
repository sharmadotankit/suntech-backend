const CompanyModel = require('../Models/CompanyModel');
const ClientModel = require('../Models/ClientModel');
const OfferLetterModel = require('../Models/OfferModel');
const { default: mongoose } = require('mongoose');
const moment = require('moment')


const getCompanyData = async (req, res) => {
    try {
        let companyName = req.params.companyName;
        let companyResponse = await CompanyModel.findOne({ companyName });

        if (!companyResponse) {
            res.status(400).json({
                status: false,
                statusCode: 400,
                message: "Company not found",
                data: null,
            });
            return;
        }

        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Fetch company Successful",
            data: companyResponse,
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            statusCode: 400,
            message: err.message,
            error: err,
        });
    }
};


const updateCompany = async (req, res) => {
    try {
        let data = req.body;
        let companyId = data._id;
        delete data._id;
        let companyResponse = await CompanyModel.findByIdAndUpdate(companyId, { ...data }, { new: true });

        if (!companyResponse) {
            res.status(400).json({
                status: false,
                statusCode: 400,
                message: "Company not found",
                data: null,
            });
            return;
        }

        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Update company details Successful",
            data: companyResponse,
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            statusCode: 400,
            message: err.message,
            error: err,
        });
    }
};


const getClientCodeForNewClient = async (req, res) => {
    try {
        const highestClient = await ClientModel.findOne().sort({ clientCodeNumber: -1 }).limit(1);
        let maxClientCode = 1;
        if (highestClient) {
            maxClientCode = highestClient.clientCodeNumber + 1;
        }
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Client code fetched successfully",
            data: maxClientCode,
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            statusCode: 400,
            message: err.message,
            error: err,
        });
    }
};

const createUpdateClient = async (req, res) => {
    try {
        let files = req.files;
        let {
            _id,
            clientCode,
            clientName,
            gstNo,
            allAddress,
            clientDocumentsData,
            additionalData,
            companyId,
            clientCodeNumber
        } = req.body;

        allAddress = JSON.parse(allAddress)
        clientDocumentsData = JSON.parse(clientDocumentsData)


        clientDocumentsData.forEach(item => {
            let filteredFile = files.filter(fileItem => fileItem.originalname == item.name);
            if (filteredFile.length > 0) {
                item.file = filteredFile[0];
            }
        })

        let dataToInsert = {
            clientCode,
            clientName,
            gstNo,
            allAddress,
            clientDocuments: clientDocumentsData,
            additionalData,
            companyId,
            clientCodeNumber: parseInt(clientCodeNumber),
        }

        let clientResponse;
        if (_id) {
            clientResponse = await ClientModel.findByIdAndUpdate(_id, dataToInsert, { new: true });
        } else {
            clientResponse = await ClientModel.create(dataToInsert)
        }

        if (!clientResponse) {
            res.status(400).json({
                status: false,
                statusCode: 400,
                message: `Field to ${_id ? "update" : "create"} client`,
                data: null,
            });
            return;
        }

        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Created client successfully",
            data: clientResponse,
        });
    } catch (err) {
        console.log('err', err)
        res.status(400).json({
            status: false,
            statusCode: 400,
            message: err.message,
            error: err,
        });
    }
};


const fetchClientsForCompany = async (req, res) => {
    try {
        const { companyId, sortField, sortOrder, clientNameFilter } = req.query;
        let sortQuery = {};
        if (sortField) {
            sortQuery[sortField] = sortOrder === "asc" ? 1 : -1;
        }

        let fetchQuery = { companyId: companyId };
        if (clientNameFilter) {
            fetchQuery.clientName = new RegExp(clientNameFilter, 'i');
        }


        const clients = await ClientModel.find({ ...fetchQuery })
            .select('_id clientName clientCode gstNo allAddress')
            .sort(sortQuery)
            .lean();

        if (!clients) {
            res.status(400).json({
                status: false,
                statusCode: 400,
                message: "Company not found",
                data: null,
            });
            return;
        }
        res.status(200).json({
            status: true,
            statusCode: 200,
            data: clients,
            message: "Fetch clients Successful",
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            statusCode: 400,
            message: err.message,
            error: err,
        });
    }
};

const getClientById = async (req, res) => {
    try {
        let clientId = req.params.clientId;
        let clientResponse = await ClientModel.findById(clientId);

        if (!clientResponse) {
            res.status(400).json({
                status: false,
                statusCode: 400,
                message: "Client not found",
                data: null,
            });
            return;
        }

        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Fetch client Successful",
            data: clientResponse,
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            statusCode: 400,
            message: err.message,
            error: err,
        });
    }
};


const getOfferCodeForNewOffer = async (req, res) => {
    try {
        const highestOffer = await OfferLetterModel.findOne().sort({ offerCodeNumber: -1 }).limit(1);
        let maxOfferCode = 1;
        if (highestOffer) {
            maxOfferCode = highestOffer.offerCodeNumber + 1;
        }
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Offer code fetched successfully",
            data: maxOfferCode,
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            statusCode: 400,
            message: err.message,
            error: err,
        });
    }
};


const createUpdateOffer = async (req, res) => {
    try {
        let offerData = req.body;
        let offerId = offerData._id;
        delete offerData.__v;
        delete offerData._id;
        let offerResponse;
        if(offerId){
            console.log('came her0',offerId)
            console.log('offerData',offerData)
            offerResponse = await OfferLetterModel.findByIdAndUpdate(offerId,offerData);
        }else{
            offerResponse= await OfferLetterModel.create(offerData);
        }

        if (!offerResponse) {
            res.status(400).json({
                status: false,
                statusCode: 400,
                message: `Field to ${offerId ? "update" : "create"} offer`,
                data: null,
            });
            return;
        }

        res.status(200).json({
            status: true,
            statusCode: 200,
            message: `Offer  ${offerId ? "updated" : "created"} successfully`,
            data: offerResponse,
        });
    } catch (err) {
        console.log('err', err)
        res.status(400).json({
            status: false,
            statusCode: 400,
            message: err.message,
            error: err,
        });
    }
};

const fetchOfferForCompany = async (req, res) => {
    try {
        const { createdFrom,createdTo, companyId, sortField, sortOrder, clientNameFilter, projectNumberFilter } = req.query;
       
        console.log(createdFrom,createdTo, companyId, sortField, sortOrder, clientNameFilter, projectNumberFilter)
        let offerResponse = await OfferLetterModel.aggregate([
            {
                $match: {
                    companyId: new mongoose.Types.ObjectId(companyId),
                }
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "clientId",
                    foreignField: "_id",
                    as: "clientId"
                }
            },
            {
                $unwind: "$clientId"
            },
            {
                $lookup: {
                    from: "projects",
                    localField: "_id",
                    foreignField: "offerId",
                    as: "project"
                }
            },
            {
                $match: {
                    $or: [
                        { "clientId.clientName": { $regex: clientNameFilter, $options: "i" } } // If clientNameFilter exists
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    offerCode: 1,
                    description:1,
                    "clientId.clientName":1,
                    offerDate:1,
                    offerTotal:1,
                }
            },
             {
                $sort: {
                    [sortField]: sortOrder === "asc" ? 1 : -1
                }
            }
        ]);

        if(createdFrom){
            offerResponse = offerResponse.filter(offerItem=> moment(offerItem.offerDate).isSameOrAfter(moment(createdFrom)))
        }

        if(createdTo){
            offerResponse = offerResponse.filter(offerItem=> moment(offerItem.offerDate).isSameOrBefore(moment(createdTo)))
        }


        if (!offerResponse) {
            res.status(400).json({
                status: false,
                statusCode: 400,
                message: "No Offers found",
                data: null,
            });
            return;
        }
        res.status(200).json({
            status: true,
            statusCode: 200,
            data: offerResponse,
            message: "Fetch offers Successful",
        });
    } catch (err) {
        console.log('err',err)
        res.status(500).json({
            status: false,
            statusCode: 400,
            message: err.message,
            error: err,
        });
    }
};


const getOfferById = async (req, res) => {
    try {
        let offerId = req.params.offerId;
        let offerLetterResponse = await OfferLetterModel.findById(offerId)

        if (!offerLetterResponse) {
            res.status(400).json({
                status: false,
                statusCode: 400,
                message: "Offer not found",
                data: null,
            });
            return;
        }

        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Fetch offer Successful",
            data: offerLetterResponse,
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            statusCode: 400,
            message: err.message,
            error: err,
        });
    }
};




const createUpdateAssociate = async (req, res) => {
    try {
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Created client successfully",
            data: null,
        });
    } catch (err) {
        console.log('err', err)
        res.status(400).json({
            status: false,
            statusCode: 400,
            message: err.message,
            error: err,
        });
    }
};

const createUpdateInvoice = async (req, res) => {
    try {
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Created client successfully",
            data: null,
        });
    } catch (err) {
        console.log('err', err)
        res.status(400).json({
            status: false,
            statusCode: 400,
            message: err.message,
            error: err,
        });
    }
};

const createUpdateExpenses = async (req, res) => {
    try {
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Created client successfully",
            data: null,
        });
    } catch (err) {
        console.log('err', err)
        res.status(400).json({
            status: false,
            statusCode: 400,
            message: err.message,
            error: err,
        });
    }
};

const createUpdateOutward = async (req, res) => {
    try {
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Created client successfully",
            data: null,
        });
    } catch (err) {
        console.log('err', err)
        res.status(400).json({
            status: false,
            statusCode: 400,
            message: err.message,
            error: err,
        });
    }
};

const createUpdateSiteVisits = async (req, res) => {
    try {
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Created client successfully",
            data: null,
        });
    } catch (err) {
        console.log('err', err)
        res.status(400).json({
            status: false,
            statusCode: 400,
            message: err.message,
            error: err,
        });
    }
};

const createUpdateProject = async (req, res) => {
    try {
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Created client successfully",
            data: null,
        });
    } catch (err) {
        console.log('err', err)
        res.status(400).json({
            status: false,
            statusCode: 400,
            message: err.message,
            error: err,
        });
    }
};

const createUpdateLeaveRecord = async (req, res) => {
    try {
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Created client successfully",
            data: null,
        });
    } catch (err) {
        console.log('err', err)
        res.status(400).json({
            status: false,
            statusCode: 400,
            message: err.message,
            error: err,
        });
    }
};


module.exports = {
    getCompanyData,
    updateCompany,
    getClientCodeForNewClient,
    createUpdateClient,
    fetchClientsForCompany,
    fetchOfferForCompany,
    getClientById,
    getOfferCodeForNewOffer,
    createUpdateOffer,
    createUpdateAssociate,
    createUpdateInvoice,
    createUpdateExpenses,
    createUpdateOutward,
    createUpdateSiteVisits,
    createUpdateProject,
    createUpdateLeaveRecord,
    getOfferById,
};