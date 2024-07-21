const CompanyModel = require("../Models/CompanyModel");
const ClientModel = require("../Models/ClientModel");
const ProjectModel = require("../Models/ProjectModel");
const OfferLetterModel = require("../Models/OfferModel");
const InvoiceModel = require("../Models/InvoiceModel");
const SiteVisitModel = require("../Models/SiteVisitsModel");
const OutwardModel = require("../Models/OutwardModel");
const { default: mongoose } = require("mongoose");
const moment = require("moment");
const InvoiceLetterModel = require("../Models/InvoiceLetterModel");

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
    let companyResponse = await CompanyModel.findByIdAndUpdate(
      companyId,
      { ...data },
      { new: true }
    );

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
    const highestClient = await ClientModel.findOne()
      .sort({ clientCodeNumber: -1 })
      .limit(1);
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
      clientCodeNumber,
    } = req.body;

    let exisingClientData = await ClientModel.find({gstNo: gstNo})
    if(exisingClientData.length){
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Client with GST No already exists",
        data: null,
      });
      return;
    }

    allAddress = JSON.parse(allAddress);
    clientDocumentsData = JSON.parse(clientDocumentsData);

    clientDocumentsData.forEach((item) => {
      let filteredFile = files.filter(
        (fileItem) => fileItem.originalname == item.name
      );
      if (filteredFile.length > 0) {
        item.file = filteredFile[0];
      }
    });

    let dataToInsert = {
      clientCode,
      clientName,
      gstNo,
      allAddress,
      clientDocuments: clientDocumentsData,
      additionalData,
      companyId,
      clientCodeNumber: parseInt(clientCodeNumber),
    };

    let clientResponse;
    if (_id) {
      clientResponse = await ClientModel.findByIdAndUpdate(_id, dataToInsert, {
        new: true,
      });
    } else {
      clientResponse = await ClientModel.create(dataToInsert);
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
    console.log("err", err);
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
      fetchQuery.clientName = new RegExp(clientNameFilter, "i");
    }

    const clients = await ClientModel.find({ ...fetchQuery })
      .select("_id clientName clientCode gstNo allAddress")
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

const getProjectById = async (req, res) => {
  try {
    let projectId = req.params.projectId;
    let projectResponse = await ProjectModel.findById(projectId);
    if (!projectResponse) {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Project not found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Fetch project Successful",
      data: projectResponse,
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

const getInvoiceById = async (req, res) => {
  try {
    let invoiceId = req.params.invoiceId;
    let invoiceResponse = await InvoiceModel.findById(invoiceId);

    if (!invoiceResponse) {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invoice not found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Fetch invoice Successful",
      data: invoiceResponse,
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
    let companyId = req.params.companyId;
    const highestOffer = await OfferLetterModel.findOne({ companyId })
      .sort({ offerCodeNumber: -1 })
      .limit(1);
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
    if (offerId) {
      offerResponse = await OfferLetterModel.findByIdAndUpdate(
        offerId,
        offerData
      );
    } else {
      offerData = {...offerData, offerCode : offerData?.offerCode+"-" + offerData?.description};
      offerResponse = await OfferLetterModel.create(offerData);
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
    console.log("err", err);
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
    const {
      createdFrom,
      createdTo,
      companyId,
      sortField,
      sortOrder,
      clientNameFilter,
      projectNumberFilter,
    } = req.query;

    let offerResponse = await OfferLetterModel.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "clientId",
        },
      },
      {
        $unwind: "$clientId",
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "offerId",
          as: "project",
        },
      },
      {
        $match: {
          $or: [
            {
              "clientId.clientName": {
                $regex: clientNameFilter,
                $options: "i",
              },
            }, // If clientNameFilter exists
          ],
        },
      },
      {
        $project: {
          _id: 1,
          offerCode: 1,
          description: 1,
          "clientId.clientName": 1,
          "clientId._id": 1,
          offerDate: 1,
          offerTotal: 1,
          offerTotal: 1,
        },
      },
      {
        $sort: {
          [sortField]: sortOrder === "asc" ? 1 : -1,
        },
      },
    ]);

    if (createdFrom) {
      offerResponse = offerResponse.filter((offerItem) =>
        moment(offerItem.offerDate).isSameOrAfter(moment(createdFrom))
      );
    }

    if (createdTo) {
      offerResponse = offerResponse.filter((offerItem) =>
        moment(offerItem.offerDate).isSameOrBefore(moment(createdTo))
      );
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
    console.log("err", err);
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
    let offerLetterResponse = await OfferLetterModel.findById(offerId);

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
    console.log("err", err);
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
    let files = req.files;
    let stampDocumentFile =
      files.filter((file) => file.fieldname === "stampDocumentFile")[0] || null;
    let signedAttachDocumentFile =
      files.filter((file) => file.fieldname === "signedCopyDocument")[0] ||
      null;

    let {
      _id,
      invoiceNumber,
      companyId,
      clientId,
      projectId,
      invoiceType,
      invoiceDate,
      gstNo,
      totalFees,
      total,
      taxableValue,
      feesBreakup,
      tax,
      taxAmount,
      netTotal,
      amountReceivedTransactions,
    } = req.body;

    feesBreakup = JSON.parse(feesBreakup);
    tax = JSON.parse(tax);

    if (_id) {
      let existingInvoice = await InvoiceModel.findById(_id);
      if (existingInvoice.stampDocument && stampDocumentFile == null) {
        stampDocumentFile = existingInvoice.stampDocument;
      }

      if (
        existingInvoice.signedCopyDocument &&
        signedAttachDocumentFile == null
      ) {
        signedAttachDocumentFile = existingInvoice.signedCopyDocument;
      }
    }

    let dataToInsert = {
      invoiceNumber,
      companyId,
      clientId,
      projectId,
      invoiceType,
      invoiceDate,
      gstNo,
      totalFees,
      total,
      taxableValue,
      feesBreakup,
      tax,
      taxAmount,
      netTotal,
      stampDocument: stampDocumentFile,
      signedCopyDocument: signedAttachDocumentFile,
      amountReceivedTransactions: JSON.parse(amountReceivedTransactions),
    };

    let invoiceResponse;
    if (_id) {
      invoiceResponse = await InvoiceModel.findByIdAndUpdate(
        _id,
        dataToInsert,
        { new: true }
      );
    } else {
      invoiceResponse = await InvoiceModel.create(dataToInsert);
    }

    if (!invoiceResponse) {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Invoice not found",
        data: null,
      });
      return;
    }
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: `Invoice ${_id ? "updated" : "created"} successfully`,
      data: null,
    });
  } catch (err) {
    console.log("err", err);
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
    console.log("err", err);
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
    let files = req.files;
    let {
      companyId,
      clientId,
      projectId,
      docNo,
      docType,
      description,
      outwardDate,
      documents,
    } = req.body;
    let dataToInsert = {
      companyId,
      clientId,
      projectId,
      docNo,
      docType,
      description,
      outwardDate,
      documents,
    };

    let outwardResponse = await OutwardModel.create(dataToInsert);

    if (outwardResponse) {
      res.status(200).json({
        status: true,
        data: outwardResponse,
        statusCode: 200,
        message: "Create outward Successful",
      });
    }
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Created client successfully",
      data: null,
    });
  } catch (err) {
    console.log("err", err);
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
    console.log("err", err);
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
    let files = req.files;
    let {
      _id,
      companyId,
      clientId,
      offerId,
      projectCode,
      isActive,
      projectType,
      orderDate,
      orderValue,
      shortDescription,
      longDescription,
      projectCorrespondence,
      siteLocation,
      mapLocations,
      gstNo,
      billToAddress,
      shipToAddress,
      attachedDocumentData,
    } = req.body;

    attachedDocumentData.files = files[0];
    billToAddress = JSON.parse(billToAddress);
    shipToAddress = JSON.parse(shipToAddress);
    attachedDocumentData = JSON.parse(attachedDocumentData);
    projectCorrespondence = JSON.parse(projectCorrespondence);
    mapLocations = JSON.parse(mapLocations);
    projectType = JSON.parse(projectType);
    let attachedDocument = {
      file: files[0],
      description: attachedDocumentData.description,
    };
    let dataToInsert = {
      companyId,
      clientId,
      offerId,
      projectCode,
      isActive,
      projectType,
      orderDate,
      orderValue,
      shortDescription,
      longDescription,
      projectCorrespondence,
      siteLocation,
      mapLocations,
      gstNo,
      billToAddress,
      shipToAddress,
      attachedDocument,
    };

    let projectResponse;
    if (_id) {
      projectResponse = await ProjectModel.findByIdAndUpdate(
        _id,
        dataToInsert,
        { new: true }
      );
    } else {
      projectResponse = await ProjectModel.create(dataToInsert);
    }

    if (!projectResponse) {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: `Field to ${_id ? "update" : "create"} project`,
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Project created successfully",
      data: projectResponse,
    });
    return res;
  } catch (err) {
    console.log("err", err);
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
    console.log("err", err);
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: err.message,
      error: err,
    });
  }
};

const fetchProjectsForCompany = async (req, res) => {
  try {
    const {
      companyId,
      createdFrom,
      createdTo,
      sortField,
      sortOrder,
      clientNameFilter,
      projectNumberFilter,
      locationFilter,
      projectTypeFilter,
      projectStatusFilter,
    } = req.query;

    // Ensure projectTypeFilter is an array
    const projectTypeArray = Array.isArray(projectTypeFilter)
      ? projectTypeFilter
      : projectTypeFilter.length
      ? [projectTypeFilter]
      : [];

    const projectNumberArray = Array.isArray(projectNumberFilter)
      ? projectNumberFilter
      : projectNumberFilter.length
      ? [projectNumberFilter]
      : [];

    const clientNameArray = Array.isArray(clientNameFilter)
      ? clientNameFilter
      : clientNameFilter.length
      ? [clientNameFilter]
      : [];

    let matchConditions = {
      companyId: new mongoose.Types.ObjectId(companyId),
    };

    let orConditions = [];

    // if (clientNameFilter) {
    //   orConditions.push({
    //     "clientId.clientName": {
    //       $regex: clientNameFilter,
    //       $options: "i",
    //     },
    //   });
    // }

    if (projectNumberArray.length) {
      orConditions.push({
        projectCode: {
          $in: projectNumberArray,
        },
      });
    }

    if (locationFilter) {
      orConditions.push({
        siteLocation: {
          $regex: locationFilter,
          $options: "i",
        },
      });
    }

    if (projectTypeArray.length) {
      orConditions.push({
        projectType: {
          $in: projectTypeArray,
        },
      });
    }

    if (orConditions.length) {
      matchConditions.$or = orConditions;
    }

    if (projectStatusFilter !== "undefined") {
      matchConditions.isActive = projectStatusFilter === "true";
    }

    let projectResponse = await ProjectModel.aggregate([
      {
        $match: matchConditions,
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "clientId",
        },
      },
      {
        $unwind: "$clientId",
      },
      {
        $project: {
          _id: 1,
          "clientId._id": 1,
          "clientId.clientName": 1,
          orderDate: 1,
          attachedDocument: 1,
          projectCode: 1,
          projectType: 1,
          shortDescription: 1,
          orderValue: 1,
          siteLocation: 1,
          gstNo: 1,
          billToAddress: 1,
          shipToAddress: 1,
        },
      },
      {
        $sort: {
          [sortField]: sortOrder === "asc" ? 1 : -1,
        },
      },
    ]);

    if (clientNameArray.length) {
      projectResponse = projectResponse.filter((orderItem) =>
        orderItem.clientId.clientName.includes(clientNameArray)
      );
    }

    if (createdFrom) {
      projectResponse = projectResponse.filter((orderItem) =>
        moment(orderItem.orderDate).isSameOrAfter(moment(createdFrom))
      );
    }

    if (createdTo) {
      projectResponse = projectResponse.filter((orderItem) =>
        moment(orderItem.orderDate).isSameOrBefore(moment(createdTo))
      );
    }

    if (!projectResponse.length) {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "No Project found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: projectResponse,
      message: "Fetch projects Successful",
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

const fetchInvoiceForCompany = async (req, res) => {
  try {
    const {
      createdFrom,
      createdTo,
      companyId,
      sortField,
      sortOrder,
      projectNumberFilter,
      clientNameFilter,
      projectTypeFilter,
      locationFilter,
      invoiceTypeFilter,
    } = req.query;
    const projectTypeArray = Array.isArray(projectTypeFilter)
      ? projectTypeFilter
      : projectTypeFilter.length
      ? [projectTypeFilter]
      : [];

    const projectNumberArray = Array.isArray(projectNumberFilter)
      ? projectNumberFilter
      : projectNumberFilter.length
      ? [projectNumberFilter]
      : [];

    const clientNameArray = Array.isArray(clientNameFilter)
      ? clientNameFilter
      : clientNameFilter.length
      ? [clientNameFilter]
      : [];

    let matchConditions = {
      companyId: new mongoose.Types.ObjectId(companyId),
    };

    let orConditions = [];

    if (orConditions.length) {
      matchConditions.$or = orConditions;
    }

    let invoiceResponse = await InvoiceModel.aggregate([
      {
        $match: matchConditions,
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "clientId",
        },
      },
      {
        $unwind: "$clientId",
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "projectId",
        },
      },
      {
        $unwind: "$projectId",
      },
      {
        $project: {
          _id: 1,
          "clientId._id": 1,
          "clientId.clientName": 1,
          "projectId._id": 1,
          "projectId.projectCode": 1,
          "projectId.shortDescription": 1,
          "projectId.projectType": 1,
          "projectId.siteLocation": 1,
          invoiceType: 1,
          invoiceDate: 1,
          gstNo: 1,
          totalFees: 1,
          tax: 1,
          netTotal: 1,
          invoiceNumber: 1,
          invoiceStatus: 1,
          taxableValue: 1,
          taxAmount: 1,
          amountReceivedTransactions: 1,
        },
      },
      {
        $sort: {
          [sortField]: sortOrder === "asc" ? 1 : -1,
        },
      },
    ]);
    // console.log("response invoice after lookup", invoiceResponse);
    if (clientNameArray.length) {
      invoiceResponse = invoiceResponse.filter((orderItem) =>
        orderItem.clientId.clientName.includes(clientNameArray)
      );
    }

    if (projectNumberArray.length) {
      invoiceResponse = invoiceResponse.filter((orderItem) =>
        orderItem.projectId.projectCode.includes(projectNumberArray)
      );
    }

    if (projectTypeArray.length) {
      invoiceResponse = invoiceResponse.filter((orderItem) =>
        orderItem.projectId.projectType.some((type) =>
          projectTypeArray.includes(type)
        )
      );
    }
    if (locationFilter) {
      invoiceResponse = invoiceResponse.filter((orderItem) =>
        orderItem.projectId.siteLocation.includes(locationFilter)
      );
    }

    if (invoiceTypeFilter) {
      invoiceResponse = invoiceResponse.filter((orderItem) =>
        orderItem.invoiceType.includes(invoiceTypeFilter)
      );
    }

    if (createdFrom) {
      invoiceResponse = invoiceResponse.filter((offerItem) =>
        moment(offerItem.invoiceDate).isSameOrAfter(moment(createdFrom))
      );
    }

    if (createdTo) {
      invoiceResponse = invoiceResponse.filter((offerItem) =>
        moment(offerItem.invoiceDate).isSameOrBefore(moment(createdTo))
      );
    }

    if (!invoiceResponse.length) {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "No Invoice found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: invoiceResponse,
      message: "Fetch invoice Response Successful",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

const getProjectFilters = async (req, res) => {
  try {
    const { companyId } = req.query;
    const response = await ProjectModel.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "clientId",
        },
      },
      {
        $unwind: "$clientId",
      },
      {
        $project: {
          _id: 1,
          "clientId._id": 1,
          "clientId.clientName": 1,
          projectCode: 1,
        },
      },
    ]);

    if (!response) {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "No Filters found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: response,
      message: "Fetch Filters Response Successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

const getInvoiceFilters = async (req, res) => {
  try {
    const { companyId } = req.query;
    const response = await InvoiceModel.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "clientId",
        },
      },
      {
        $unwind: "$clientId",
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "projectId",
        },
      },
      {
        $unwind: "$projectId",
      },
      {
        $project: {
          _id: 1,
          invoiceType: 1,
          "clientId._id": 1,
          "clientId.clientName": 1,
          "projectId.projectCode": 1,
          "projectId._id": 1,
        },
      },
    ]);

    if (!response) {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "No Filters found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: response,
      message: "Fetch Filters Response Successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

const fetchInvoiceLetterByInvoiceId = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoiceResponse = await InvoiceModel.findById(invoiceId).populate(
      "projectId"
    );
    const invoiceLetterData = await InvoiceLetterModel.findOne({
      invoiceId: invoiceId,
    });

    let dataToReturn = {
      invoiceResponse,
      invoiceLetterData,
    };

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: dataToReturn,
      message: "Fetch Invoice Letter data Successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

const createUpdateInvoiceLetter = async (req, res) => {
  try {
    let data = req.body;
    console.log("data", data);

    let invoiceLetterResponse;
    if (data._id) {
      invoiceLetterResponse = await InvoiceLetterModel.findByIdAndUpdate(
        data._id,
        data
      );
    } else {
      invoiceLetterResponse = await InvoiceLetterModel.create(data);
    }

    if (invoiceLetterResponse) {
      res.status(200).json({
        status: true,
        statusCode: 200,
        data: invoiceLetterResponse,
        message: "Create Invoice Letter Successful",
      });
    } else {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Create Invoice Letter Failed",
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

const createUpdateSiteVisit = async (req, res) => {
  try {
    let files = req.files;
    let {
      companyId,
      projectId,
      clientId,
      documentNo,
      placeOfVisit,
      purposeOfVisit,
      expenseBySuntech,
      total,
      attachedDocumentData,
    } = req.body;

    attachedDocumentData.files = files[0];
    expenseBySuntech = JSON.parse(expenseBySuntech);

    let dataToInsert = {
      companyId,
      projectId,
      clientId,
      documentNo,
      placeOfVisit,
      purposeOfVisit,
      expenseBySuntech,
      total,
      attachedDocumentData,
    };

    let siteVisitResponse = await SiteVisitModel.create(dataToInsert);
    if (siteVisitResponse) {
      res.status(200).json({
        status: true,
        data: siteVisitResponse,
        statusCode: 200,
        message: "Create Site Visit Successful",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

const fetchSiteVisitsForCompany = async (req, res) => {
  try {
    const {
      createdFrom,
      createdTo,
      companyId,
      sortField,
      sortOrder,
      projectNumberFilter,
      clientNameFilter,
      locationFilter,
    } = req.query;
    const projectNumberArray = Array.isArray(projectNumberFilter)
    ? projectNumberFilter
    : projectNumberFilter.length
    ? [projectNumberFilter]
    : [];
    
    const clientNameArray = Array.isArray(clientNameFilter)
    ? clientNameFilter
    : clientNameFilter.length
    ? [clientNameFilter]
    : [];
    
    let matchConditions = {
      companyId: new mongoose.Types.ObjectId(companyId),
    };
    
    let orConditions = [];
  

    if (locationFilter) {
      orConditions.push({
        placeOfVisit: {
          $regex: locationFilter,
          $options: "i",
        },
      });
    }

    if (orConditions.length) {
      matchConditions.$or = orConditions;
    }
    
    let siteVisitResponse = await SiteVisitModel.aggregate([
      {
        $match: matchConditions,
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "clientId",
        },
      },
      {
        $unwind: "$clientId",
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "projectId",
        },
      },
      {
        $unwind: "$projectId",
      },
      {
        $project: {
          _id: 1,
          documentNo: 1,
          placeOfVisit: 1,
          purposeOfVisit: 1,
          expensesBySuntech: 1,
          "clientId._id": 1,
          "clientId.clientName": 1,
          "projectId._id": 1,
          "projectId.projectCode": 1,
        },
      },
      {
        $sort: {
          [sortField]: sortOrder === "asc" ? 1 : -1,
        },
      },
    ]);
    if (clientNameArray.length) {
      siteVisitResponse = siteVisitResponse.filter((item) =>
        item.clientId.clientName.includes(clientNameArray)
      );
    }

    if (createdFrom) {
      siteVisitResponse = siteVisitResponse.filter((item) =>
        moment(item.expensesBySuntech.from).isSameOrAfter(moment(createdFrom))
      );
    }

    if (createdTo) {
      siteVisitResponse = siteVisitResponse.filter((item) =>
        moment(item.expensesBySuntech.to).isSameOrBefore(moment(createdTo))
      );
    }

    if (createdTo) {
      siteVisitResponse = siteVisitResponse.filter((item) =>
        moment(item.expensesBySuntech.to).isSameOrBefore(moment(createdTo))
      );
    }

    if (!siteVisitResponse.length) {
      res.status(400).json({
        status: false,
        data: [],
        statusCode: 400,
        message: "No Site Visits Found",
      });
      return;
    }

    res.status(200).json({
      status: true,
      data: siteVisitResponse,
      statusCode: 200,
      message: "Fetch Site Visits Successful",
    });
  } catch (error) {
    console.log("fetch sitevisit error", error);
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

const fetchOutwardsForCompany = async (req, res) => {
  try {
    const {
      companyId,
      createdFrom,
      createdTo,
      sortField,
      sortOrder,
      clientNameFilter,
      docTypeFilter,
    } = req.query;

    const clientNameArray = Array.isArray(clientNameFilter)
      ? clientNameFilter
      : clientNameFilter.length
      ? [clientNameFilter]
      : [];

    // const docTypeArray = Array.isArray(docTypeFilter)
    //   ? docTypeFilter
    //   : docTypeFilter.length
    //   ? [docTypeFilter]
    //   : [];

    let matchConditions = {
      companyId: new mongoose.Types.ObjectId(companyId),
    };

    if (docTypeFilter.length) {
      orConditions.push({
        docType: {
          $regex: docTypeFilter,
          $options: "i",
        },
      });
    }

    let orConditions = [];

    let outwardsResponse = await OutwardModel.aggregate([
      {
        $match: matchConditions,
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "clientId",
        },
      },
      {
        $unwind: "$clientId",
      },
      {
        $project: {
          _id: 1,
          docNo: 1,
          docType: 1,
          description: 1,
          outwardDate: 1,
          "clientId._id": 1,
          "clientId.clientName": 1,
        },
      },
      {
        $sort: {
          [sortField]: sortOrder === "asc" ? 1 : -1,
        },
      },
    ]);

    if (clientNameArray.length) {
      outwardsResponse = outwardsResponse.filter((item) =>
        item.clientId.clientName.includes(clientNameArray)
      );
    }

    if (createdFrom) {
      outwardsResponse = outwardsResponse.filter((item) =>
        item.outwardDate.isSameOrAfter(createdFrom)
      );
    }

    if (createdTo) {
      outwardsResponse = outwardsResponse.filter((item) =>
        item.outwardDate.isSameOrBefore(createdTo)
      );
    }

    if (!outwardsResponse.length) {
      res.status(400).json({
        status: false,
        data: [],
        statusCode: 400,
        message: "No Outwards Found",
      });
      return;
    }

    res.status(200).json({
      status: true,
      data: outwardsResponse,
      statusCode: 200,
      message: "Fetch Outwards Successful",
    });
  } catch (error) {
    console.log("fetch outwards error", error);
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

const getSiteVisitFilters = async (req, res) => {
  try {
    const { companyId } = req.query;
    const response = await SiteVisitModel.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "clientId",
        },
      },
      {
        $unwind: "$clientId",
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "projectId",
        },
      },
      {
        $unwind: "$projectId",
      },
      {
        $project: {
          _id: 1,
          placeOfVisit: 1,
          "clientId._id": 1,
          "clientId.clientName": 1,
          "projectId.projectCode": 1,
          "projectId._id": 1,
        },
      },
    ]);

    if (!response) {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "No Filters Found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Fetch Filters Successful",
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

const getOutwardFilters = async (req, res) => {
  try {
    const { companyId } = req.query;
    const response = await OutwardModel.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "clientId",
        },
      },
      {
        $unwind: "$clientId",
      },
      {
        $project: {
          _id: 1,
          docType: 1,
          "clientId._id": 1,
          "clientId.clientName": 1,
        },
      },
    ]);

    if (!response) {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "No Filters found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: true,
      statusCode: 200,
      data: response,
      message: "Fetch Filters Response Successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

const getSiteVisitById = async (req, res) => {
  try {
    let siteVisitId = req.params.siteVisitId;
    let siteVisitResponse = await SiteVisitModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(siteVisitId),
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "clientId",
        },
      },
      {
        $unwind: "$clientId",
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "projectId",
        },
      },
      {
        $unwind: "$projectId",
      },
      {
        $project: {
          _id: 1,
          documentNo: 1,
          placeOfVisit: 1,
          purposeOfVisit: 1,
          expensesBySuntech: 1,
          "clientId._id": 1,
          "clientId.clientName": 1,
          "projectId.projectCode": 1,
          "projectId._id": 1,
          documents: 1,
          total: 1,
        },
      },
    ])

    if (!siteVisitResponse) {
      res.status(400).json({
        status: false,
        statusCode: 400,
        message: "SiteVisit not found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Fetch SiteVisit Successful",
      data: siteVisitResponse,
    });


  } catch (err) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: err.message,
      error: err,
    });
  }
}

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
  fetchProjectsForCompany,
  getProjectById,
  getInvoiceById,
  fetchInvoiceForCompany,
  getProjectFilters,
  getInvoiceFilters,
  fetchInvoiceLetterByInvoiceId,
  createUpdateInvoiceLetter,
  createUpdateSiteVisit,
  fetchSiteVisitsForCompany,
  fetchOutwardsForCompany,
  getSiteVisitFilters,
  getOutwardFilters,
  getSiteVisitById,
};
