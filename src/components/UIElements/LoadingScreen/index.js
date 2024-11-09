import React from "react";
import FadeLoader from "react-spinners/FadeLoader";
import "./style.css";

// Functional Component untuk LoadingScreen
const LoadingScreen = React.memo(({ loading }) => {
  return (
    <div className={loading ? "loading" : ""}>
      <FadeLoader color="white" loading={loading} />
    </div>
  );
});

export default LoadingScreen;
