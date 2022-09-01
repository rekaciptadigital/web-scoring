import * as React from "react";
import { GeneralService } from "services";
import { useLocation } from "utils/hooks/location";

import { AsyncPaginate } from "react-select-async-paginate";
import { customSelectStyles } from "./select-options";

const FETCHING_LIMIT = 30;

function SelectProvince({ name, placeholder, value, onChange, errors, disabled }) {
  const { getProvinceById } = useLocation();
  const [localOptions, setLocalOptions] = React.useState([]);

  const optionValue =
    _getOptionByValue(localOptions, value) || _makeOptionFromStore(getProvinceById(value));

  const loadOptions = async (searchQuery, loadedOptions, { page }) => {
    const result = await GeneralService.getProvinces({
      limit: FETCHING_LIMIT,
      page: page,
      name: searchQuery,
    });
    const options = result.data.map((province) => ({
      label: province.name,
      value: parseInt(province.id),
    }));
    setLocalOptions([...loadedOptions, ...options]);
    return {
      options: options,
      hasMore: result.data.length >= FETCHING_LIMIT,
      additional: { page: page + 1 },
    };
  };

  return (
    <AsyncPaginate
      styles={computeCustomStylesWithValidation(errors)}
      name={name}
      loadOptions={loadOptions}
      placeholder={placeholder}
      value={optionValue}
      onChange={(opt) => onChange?.(opt.value)}
      isSearchable
      debounceTimeout={200}
      additional={{ page: 1 }}
      isDisabled={disabled}
    />
  );
}

const computeCustomStylesWithValidation = (errors) => {
  if (errors?.length) {
    return {
      ...customSelectStyles,
      control: (provided) => ({
        ...provided,
        border: "solid 1px var(--ma-red)",
      }),
    };
  }
  return customSelectStyles;
};

const _getOptionByValue = (numberList, value) => {
  const foundOption = numberList.find((option) => option.value === value);
  return foundOption || null;
};

function _makeOptionFromStore(data) {
  if (!data?.id) {
    return null;
  }
  return { value: data.id, label: data.name };
}

export { SelectProvince };
