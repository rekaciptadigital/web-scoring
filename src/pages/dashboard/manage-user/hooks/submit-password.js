import { useFetcher } from "utils/hooks/alt-fetcher";
import { AdminService } from "services";

function useSubmitPassword(values) {
  const fetcher = useFetcher();

  const submit = (options = {}) => {
    const putFunction = () => {
      const payload = {
        password_old: values.password_old,
        password: values.password,
        password_confirmation: values.password_confirmation,
      };
      return AdminService.updatePassword(payload);
    };
    fetcher.runAsync(putFunction, options);
  };

  return { ...fetcher, submit };
}

export { useSubmitPassword };
