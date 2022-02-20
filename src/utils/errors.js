function interpretServerErrors(result) {
  let errors = null;
  if (!result.errors?.length || !result.errors) {
    errors = result.message;
  } else {
    errors = result.errors;
  }
  return errors;
}

export default { interpretServerErrors };
