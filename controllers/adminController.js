const CompanyModel = require("../Models/CompanyModel");
const ClientModel = require("../Models/ClientModel");
const ProjectModel = require("../Models/ProjectModel");
const OfferLetterModel = require("../Models/OfferModel");
const InvoiceModel = require("../Models/InvoiceModel");
const { default: mongoose } = require("mongoose");
const moment = require("moment");

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

    console.log(
      createdFrom,
      createdTo,
      companyId,
      sortField,
      sortOrder,
      clientNameFilter,
      projectNumberFilter
    );
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
    let stampDocumentFile = files.filter(file => file.fieldname === 'stampDocumentFile')[0] || null;
    let signedAttachDocumentFile = files.filter(file => file.fieldname === 'signedCopyDocument')[0] || null;

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
    } = req.body;

    feesBreakup = JSON.parse(feesBreakup);
    tax = JSON.parse(tax);


    let stampDocument = stampDocumentFile;
    let signedCopyDocument = signedAttachDocumentFile;

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
      stampDocument,
      signedCopyDocument
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
      message: "Created invoice successfully",
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

    console.log("dataToInsert", dataToInsert.projectType);
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

    console.log("req.query", req.query);
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
    console.log("hasvcjvsckahbsv", err);
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
    // console.log("req.query", req.query);
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

    // console.log("projectNumberArray", projectNumberArray);
    const clientNameArray = Array.isArray(clientNameFilter)
      ? clientNameFilter
      : clientNameFilter.length
      ? [clientNameFilter]
      : [];

    let matchConditions = {
      companyId: new mongoose.Types.ObjectId(companyId),
    };

    //console.log("Received query parameters:", req.query);

    let orConditions = [];

    // if (clientNameFilter) {
    //   orConditions.push({
    //     "clientId.clientName": {
    //       $regex: clientNameFilter,
    //       $options: "i",
    //     },
    //   });
    // }

    // if (projectNumberFilter) {
    //   orConditions.push({
    //     "projectId.projectCode": {
    //       $regex: projectNumberFilter,
    //       $options: "i",
    //     },
    //   });
    //}

    // if (locationFilter) {
    //   orConditions.push({
    //     siteLocation: {
    //       $regex: locationFilter,
    //       $options: "i",
    //     },
    //   });
    // }

    // if (projectTypeArray.length) {
    //   orConditions.push({
    //     "projectId.projectType": {
    //       $in: projectTypeArray,
    //     },
    //   });
    // }

    // if (invoiceTypeFilter) {
    //   orConditions.push({
    //     invoiceType: {
    //       $regex: invoiceTypeFilter,
    //       $options: "i",
    //     },
    //   });
    // }

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
        orderItem.projectId.projectType.some((type) => projectTypeArray.includes(type))
        // console.log("orderItem.projectId.projectType", orderItem.projectId.projectType, orderItem.projectId)
);
      // console.log("invoiceResponse after projectType", projectTypeArray);
    }
     // console.log("invoiceResponse before location", invoiceResponse);
    if (locationFilter) {
      invoiceResponse = invoiceResponse.filter((orderItem) =>
        orderItem.projectId.siteLocation.includes(locationFilter)
      );
    }

    console.log("invoiceResponse after Filter", invoiceTypeFilter);
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
    console.log("came hererrererererererererererere");
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
  fetchProjectsForCompany,
  getProjectById,
  getInvoiceById,
  fetchInvoiceForCompany,
  getProjectFilters,
  getInvoiceFilters,
};
