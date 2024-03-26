
const getCompanyData = async (req, res) => {
    try {
      let userResponse = await UserModel.find({}, { password: 0 }).lean();
  
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Fetch user Successful",
        data: userResponse,
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
  };