import * as React from "react";
import PropTypes from "prop-types";
import { GeneralService } from "services";

import { AsyncPaginate } from "react-select-async-paginate";
import { customSelectStyles } from "./select-options";

const FETCHING_LIMIT = 30;

function SelectProvince({ name, placeholder, value, onChange, errors, disabled }) {
  const [localOptions, setLocalOptions] = React.useState([]);

  const loadOptions = async (searchQuery, loadedOptions, { page }) => {
    const result = await GeneralService.getProvinces({
      limit: FETCHING_LIMIT,
      page: page,
      name: searchQuery,
    });
    const options = result.data.map((city) => ({
      label: city.name,
      value: parseInt(city.id),
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
      value={_getOptionByValue(localOptions, value)}
      onChange={(opt) => onChange?.(opt.value)}
      isSearchable
      debounceTimeout={200}
      additional={{ page: 1 }}
      isDisabled={disabled}
    />
  );
}

SelectProvince.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func,
  errors: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool
};

SelectProvince.defaultProps = {
  placeholder: "Pilih Provinsi",
  disabled: false,
  errors: []
};

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
  return foundOption;
};

export { SelectProvince };
