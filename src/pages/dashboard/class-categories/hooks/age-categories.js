import * as React from "react";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { CategoryService } from "services";

function useAgeCategories() {
  const fetcher = useFetcher();

  const fetchAgeCategories = () => {
    const getFunction = () => CategoryService.getMasterAgeCategories();
    return fetcher.runAsync(getFunction, { transform });
  };

  React.useEffect(() => {
    fetchAgeCategories();
  }, []);

  return { ...fetcher, fetchAgeCategories };
}

function transform(data) {
  return data.filter((ageCategory) => !ageCategory.isHide);
}

export { useAgeCategories };
