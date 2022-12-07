import * as React from "react";

function useSubmitFormRuleFaceSetting(dataForm, setFormData) {

  React.useEffect(() => {
    setFormData(dataForm);
  },[dataForm]);

  return;

}

export { useSubmitFormRuleFaceSetting };
