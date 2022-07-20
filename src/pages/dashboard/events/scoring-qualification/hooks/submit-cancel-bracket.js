import { useFetcher } from "utils/hooks/alt-fetcher";
import { EliminationService } from "services";

function useSubmitCancelBracket(categoryId) {
  const fetcher = useFetcher();

  const submitCancelBracket = (options) => {
    const postFunction = () => {
      return EliminationService.cancelTemplateScoring({ category_id: categoryId });
    };
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submitCancelBracket };
}

export { useSubmitCancelBracket };
