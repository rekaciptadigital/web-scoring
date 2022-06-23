function interpretServerErrors(result) {
  // Error dari message tanpa objek errors
  if (!result.errors) {
    return result.message;
  }
  // Error debug, biasanya error SQL
  if (result.errors.debug) {
    return result.message;
  }
  // Error validasi
  if (Array.isArray(result.errors) && !result.errors.length) {
    return result.message;
  }
  // Error generik, tanpa message
  return result.errors;
}

export default { interpretServerErrors };
