import { useDispatch } from "react-redux";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { AdminService } from "services";
import * as AuthStore from "store/slice/authentication";

function useSubmitProfile(userProfile, values) {
  const fetcher = useFetcher();
  const fetcherProfile = useFetcher();
  const dispatch = useDispatch();

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

  const submit = (options = {}) => {
    const putFunction = () => {
      const payload = {
        admin_id: userProfile.id,
        name_organizer: values.name,
        phone_number: values.phone,
        province_id: values.provinceId,
        city_id: values.cityId,
      };
      return AdminService.updateProfile(payload);
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

export { useSubmitProfile };
