import * as React from "react";

function useLongWait(isWaiting, waitTimeThreshold) {
  const [waitTimeIsExceeded, setWaitTimeIsExceeded] = React.useState(false);

  React.useEffect(() => {
    if (isWaiting) {
      const timer = setTimeout(() => {
        setWaitTimeIsExceeded(true);
      }, waitTimeThreshold);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isWaiting]);

  return waitTimeIsExceeded;
}

export { useLongWait };
