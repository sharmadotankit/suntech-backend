const CompanyModel = require('../Models/CompanyModel');
const ClientModel =  require('../Models/ClientModel');


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
    let data = req.body;
    let files = req.files;
    console.log(data)
    console.log(files)
    return;
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

module.exports = {
  getCompanyData,
  updateCompany,
  getClientCodeForNewClient,
  createUpdateClient,
};