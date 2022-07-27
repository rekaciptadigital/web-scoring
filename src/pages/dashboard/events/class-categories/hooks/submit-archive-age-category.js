import { useFetcher } from "utils/hooks/alt-fetcher";
import { CategoryService } from "services";

function useSubmitArchiveAgeCategory(ageCategoryId) {
  const fetcher = useFetcher();

  const submit = (options) => {
    const putFunction = () => CategoryService.archiveMasterAgeCategoryById(ageCategoryId);
    return fetcher.runAsync(putFunction, options);
  };

  return { ...fetcher, submit };
}

export { useSubmitArchiveAgeCategory };
