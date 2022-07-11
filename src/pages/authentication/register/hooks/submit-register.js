import { useFetcher } from "utils/hooks/alt-fetcher";
import { AuthenticationService } from "services";

function useSubmitRegister() {
  const fetcher = useFetcher();

  const submit = (payload, options = {}) => {
    const postFunction = () => {
      return AuthenticationService.register(payload);
    };
    const customOptions = {
      ...options,
      onError: (errors) => {
        if (!options.onError) {
          return;
        }
        const messages = _makeErrorMessages(errors);
        options.onError(messages);
      },
    };
    fetcher.runAsync(postFunction, customOptions);
  };

  return { ...fetcher, submit };
}

function _makeErrorMessages(errors) {
  if (errors && typeof errors === "string") {
    return [errors];
  }
  if (errors) {
    const fields = Object.keys(errors);
    const messages = [];
    fields.forEach((field) => {
      errors[field].forEach((message) => {
        messages.push(message);
      });
    });
    if (messages.length) {
      return messages;
    }
  }
  return ["Error tidak diketahui."];
}

export { useSubmitRegister };
