/* eslint-disable no-unused-vars */
export enum GenerateTransactionIDEnum {
  Deposit = 'DEP',
  Withdrawal = 'WIT',
  Transfer = 'TRA',
  Mobile_Recharge='MBR'
}

export const generateTransactionId = (
  transactionType: GenerateTransactionIDEnum,
) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2);
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
  const day = currentDate.getDate().toString().padStart(2, '0'); // Add leading zero if needed

  const randomDigits = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');

  const transactionId = `${year}${month}${day}${transactionType}${randomDigits}`;

  return transactionId;
};