const STRINGS = Object.freeze({
  BROKER_APPROVAL_TRUE: 'approved',
  BROKER_APPROVAL_FALSE: 'rejected',
  DOWN_PAYMENT: 'Down Payment',
  INSTALLMENT: 'Installment',
  TENANT: 'TENANT',
  CASH_PAYMENT_DESCRIPTION: {
    BANKERS: ({
      isPaymentByCreditCard,
      creditCardNumber,
      payer,
      mode,
      totalAmount,
      singlePayment,
      currency,
    }) =>
      isPaymentByCreditCard
        ? `Payment(s) will be made by ${payer} in cash of total amount ${totalAmount} ${currency.code} with card ending with ${creditCardNumber}.`
        : `Payment(s) will be made by ${payer} in cash of total amount ${totalAmount} ${currency.code} on ${singlePayment.dueDate} with ${mode}.`,
    AIAW: ({ totalAmount, currency }) =>
      `Payment(s) will be made in cash of total amount ${totalAmount} ${currency.code}.`,
  },

  INSTALLMENTS_PAYMENT_DESCRIPTION: ({
    isPaymentByCreditCard,
    creditCardNumber,
    payer,
    mode,
    installments,
  }) =>
    isPaymentByCreditCard
      ? `Payment(s) will be made by ${payer} in ${installments.length} installments with card ending with ${creditCardNumber}.`
      : `Payment(s) will be made by ${payer} in ${
          installments.length - 1
        } installments with ${mode}.`,

  OTHER_PAYMENT_DESCRIPTION: {
    BANKERS: ({ type, payer, mode, totalAmount, currency }) =>
      `Payment(s) will be made by ${payer} by ${type} of total amount ${totalAmount} ${currency.code} with ${mode}.`,
    AIAW: ({ type, totalAmount, currency }) =>
      `Payment(s) will be made by ${type} of total amount ${totalAmount} ${currency.code}.`,
  },

  PAYMENT_AMOUNT_DESCRIPTION: ({ amount, currency, dueDate }) =>
    `${amount} ${currency.code} on ${dueDate}`,

  TO_BE_REQUESTED_AGAIN: 'To be requested again',
});

module.exports = { STRINGS };
