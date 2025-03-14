exports.getErrorMessageForMissingData = (param) => {
  return { status: 400, msg: `Incomplete data provided: missing ${param}` };
};
