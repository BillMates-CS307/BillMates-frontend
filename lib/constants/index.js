export const NOTIFICATION_PREFERENCE = {
  BOTH: "both",
  ONLY_BILLMATES: "only billmates",
  ONLY_EMAIL: "only email",
};

export const PAYMENT_PREFERENCE = {
  VENMO: "venmo",
  CASH: "cash",
};

export const THEME = {
  LIGHT: "light",
  DARK: "dark",
};

export const LAMBDA_RESP = {
  SUCCESS : 0,
  EMAIL_TAKEN : 1,
  ERROR : 2,
  INVALID : 3,
  INVALID_TOKEN : 4,
  NO_SUCH_GROUP : 5,
  MALFORMED : 6,
  FOURHUNDREDERR : 400
}

export const SETTINGS_PAGE_TYPE = {
  USER_INFORMATION: 1,
  VENMO: 2,
}
