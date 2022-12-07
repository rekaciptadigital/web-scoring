import * as React from "react";

function useSubmitFormClubRank(dataForm, setFormData) {

  React.useEffect(() => {
    setFormData(dataForm);
  },[dataForm]);

  return;

}

export { useSubmitFormClubRank };
