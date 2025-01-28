const CHANNEL_TYPES = Object.freeze({
		SMS: 'SMS',
		EMAIL: 'EMAIL',
});

const PERSONA_GROUPS = Object.freeze({
		BROKER: 'BROKER',
		RO: 'RO',
		UW: 'UW',
});

const PLATFORM_PERSONA_TYPES = Object.freeze({
		COMPANY: 'COMPANY',
		INDIVIDUAL: 'INDIVIDUAL',
});

const PLATFORM_ACTIONS = Object.freeze({
		VALIDATE_BROKER: 'VALIDATE_BROKER',
		APPROVE_BROKER: 'APPROVE_BROKER',
});

const PERSONA_TYPES = Object.freeze({
		UNLICENSED_INDIVIDUAL: 'UNLICENSED_INDIVIDUAL',
		LICENSED_INDIVIDUAL: 'LICENSED_INDIVIDUAL',
		COMPANY: 'COMPANY',
		ONBOARDING_RO: 'ONBOARDING_RO',
		CLEARANCE: 'CLEARANCE',
});

const CLIENT_STATE = Object.freeze({
		ACTIVE: 'ACTIVE',
		DELETED: 'DELETED',
});

const CLIENT_TYPE = Object.freeze({
		COMPANY: 'COMPANY',
		INDIVIDUAL: 'INDIVIDUAL',
});

const COMPANY_TYPES = Object.freeze({
		BANKERS: 'BANKERS',
		AIAW: 'AIAW',
});

const GENDER = Object.freeze({
		MALE: 'MALE',
		FEMALE: 'FEMALE',
});

const PROFILE_STATUSES = Object.freeze({
		ACTIVE: 8,
		SUSPENDED: 10,
		DEACTIVATED: 11,
});

const EMPLOYEE_STATUS_TYPES = Object.freeze({
		INVITED: 'Invited',
		NOT_INVITED: 'Not Invited',
		ACTIVE: 'Active',
		DEACTIVATED: 'Deactivated',
		DELETED: 'Deleted',
});

const CATEGORY_CODE = Object.freeze({
		INDIVIDUAL: 'IND',
});

const LINE_CODE = Object.freeze({
		HEALTH: 'HP',
		MOTOR: 'MV',
});

const ADDRESS_FIELDS = [
		{
				NATIONALITY_CODE: 'LBN',
				COUNTRY_DESC: 'LEBANON',
				FIELDS: ['street', 'building', 'addressLines', 'city', 'caza', 'mouhafaza', 'country'],
		},
		{
				NATIONALITY_CODE: 'USA',
				COUNTRY_DESC: 'U.S.A.',
				FIELDS: ['addressLines', 'city', 'state', 'country'],
		},
		{
				NATIONALITY_CODE: 'CAN',
				COUNTRY_DESC: 'CANADA',
				FIELDS: ['addressLines', 'city', 'state', 'country'],
		},
		{
				NATIONALITY_CODE: 'ARE',
				COUNTRY_DESC: 'UAE',
				FIELDS: ['addressLines', 'city', 'emirate', 'country'],
		},
		{
				NATIONALITY_CODE: null,
				COUNTRY_DESC: 'DEFAULT',
				FIELDS: ['addressLines', 'city', 'region', 'country'],
		},
];

const PERSONA_TYPE_CODE = {
		INDIVIDUAL: 'IND',
		COMPANY: 'COMP',
};

module.exports = {
		PERSONA_GROUPS,
		PERSONA_TYPES,
		PLATFORM_ACTIONS,
		PLATFORM_PERSONA_TYPES,
		CLIENT_STATE,
		CLIENT_TYPE,
		GENDER,
		COMPANY_TYPES,
		PROFILE_STATUSES,
		EMPLOYEE_STATUS_TYPES,
		CHANNEL_TYPES,
		ADDRESS_FIELDS,
		LINE_CODE,
		PERSONA_TYPE_CODE,
		CATEGORY_CODE,
};
