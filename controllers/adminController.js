const CompanyModel = require('../Models/CompanyModel');
const ClientModel = require('../Models/ClientModel');
const OfferModel = require('../Models/OfferModel');


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
    let { _id, clientCode, clientName, gstNo, allAddress, clientDocumentsData, additionalData, companyId, clientCodeNumber } = req.body;

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
    const highestOffer = await OfferModel.findOne().sort({ offerCodeNumber: -1 }).limit(1);
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


module.exports = {
  getCompanyData,
  updateCompany,
  getClientCodeForNewClient,
  createUpdateClient,
  fetchClientsForCompany,
  getClientById,
  getOfferCodeForNewOffer,
};