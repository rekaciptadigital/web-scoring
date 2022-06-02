import * as React from "react";

function useAdminTotal(playerDetail) {
  const [isDirty, setIsDirty] = React.useState(false);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (!playerDetail) {
      return;
    }
    setIsDirty(false);
    setValue(playerDetail.adminTotal);
  }, [playerDetail]);

  const setTotal = (value) => {
    !isDirty && setIsDirty(true);
    setValue(value);
  };

  return { isDirty, value, setTotal };
}

export { useAdminTotal };
