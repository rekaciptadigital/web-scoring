import * as React from "react";

function useContainerOffsetWidth(containerDiv) {
  const [offsetWidth, setOffsetWidth] = React.useState();

  React.useEffect(() => {
    if (!containerDiv.current) {
      throw new Error(
        "Komponen yang menggunakan hook ini harus punya elemen kontainer yang sudah terender sejak awal di-mounting."
      );
    }
    setOffsetWidth(containerDiv.current.offsetWidth);
  }, []);

  return offsetWidth;
}

export { useContainerOffsetWidth };
