const { updateSignedDocument } = require('./save');
const { redirectAfterSave } = require('./redirect');

module.exports = {
  redirectAfterSave,
  updateSignedDocument,
};
