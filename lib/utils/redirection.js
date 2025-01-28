const dotenv = require('dotenv');

dotenv.config({ silent: true });

const { BASE_URL } = process.env;

function docusignRedirectionLink({ process, processKeyId }) {
  return `${BASE_URL}/webhooks/sign/save/${process}/${processKeyId}/envelopes`;
}

module.exports = {
  docusignRedirectionLink,
};
