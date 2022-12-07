import * as React from "react";

function useSubmitFormRuleSetting(dataForm, setFormData) {

  React.useEffect(() => {
    setFormData(dataForm);
  },[dataForm]);

  return;

}

export { useSubmitFormRuleSetting };
