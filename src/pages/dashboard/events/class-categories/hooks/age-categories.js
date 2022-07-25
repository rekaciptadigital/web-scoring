import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { CategoryService } from "services";

function useAgeCategories() {
  const fetcher = useFetcher();

  const fetchAgeCategories = () => {
    const getFunction = () => CategoryService.getMasterAgeCategories();
    return fetcher.runAsync(getFunction);
  };

  React.useEffect(() => {
    fetchAgeCategories();
  }, []);

  return { ...fetcher, fetchAgeCategories };
}

export { useAgeCategories };
