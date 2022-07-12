import { useFetcher } from "utils/hooks/alt-fetcher";
import { useSelector, useDispatch } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { AdminService } from "services";

function useSubmitAvatar() {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  const dispatch = useDispatch();
  const fetcher = useFetcher();
  const fetcherProfile = useFetcher();

  const fetchProfile = () => {
    const getFunction = () => {
      return AdminService.profile();
    };
    const options = {
      onSuccess: (data) => {
        dispatch(AuthStore.profile(data));
      },
    };
    fetcherProfile.runAsync(getFunction, options);
  };

  const submit = (imgBase64, options = {}) => {
    const putFunction = () => {
      const payload = { admin_id: userProfile.id, avatar: imgBase64 };
      return AdminService.updateAvatar(payload);
    };
    const customOptions = {
      ...options,
      onSuccess: () => {
        fetchProfile();
        options.onSuccess?.();
      },
    };
    fetcher.runAsync(putFunction, customOptions);
  };

  return { ...fetcher, submit };
}

export { useSubmitAvatar };
