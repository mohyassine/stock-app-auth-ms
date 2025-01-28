function getFullNumber (phoneNumber) {
		return `${phoneNumber?.country?.code || ''}${phoneNumber?.nationalNumber || ''}`;
}

module.exports = {
		getFullNumber,
};
