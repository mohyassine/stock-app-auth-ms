const ErrorResponseModel = require('../../db/models/error-response');

const createErrorResponseByQuotationId = async ({ quotationId, type, content }) =>
  ErrorResponseModel.create({ quotationId, type, content });

module.exports = {
  createErrorResponseByQuotationId,
};
