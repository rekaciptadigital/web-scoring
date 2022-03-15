import * as React from "react";
import styled from "styled-components";
import { GeneralService } from "services";

import { AsyncPaginate } from "react-select-async-paginate";

const FieldSelectWrapper = styled.div`
  .field-label {
    display: inline-block;
    color: var(--ma-gray-600);
    font-size: 14px;
    font-weight: normal;
    margin-bottom: 4px;

    .field-required {
      color: var(--ma-red);
    }
  }
`;

const customSelectStyles = {
  valueContainer: (provided) => ({
    ...provided,
    padding: "8px 12px",
  }),
  input: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 14,
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 14,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 14,
    opacity: 0.6,
  }),
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

const FETCHING_LIMIT = 30;

function FieldSelect({
  children,
  label,
  name,
  placeholder,
  required,
  value,
  onChange,
  errors,
  disabled,
}) {
  const loadOptions = async (searchQuery, loadedOptions, { page }) => {
    const result = await GeneralService.getCities({
      limit: FETCHING_LIMIT,
      page: page,
      name: searchQuery,
    });
    return {
      options: result.data.map((city) => ({ label: city.name, value: city.id })),
      hasMore: result.data.length >= FETCHING_LIMIT,
      additional: { page: page + 1 },
    };
  };

  return (
    <FieldSelectWrapper>
      <label className="field-label">
        {children || label}
        {required && <span className="field-required">*</span>}
      </label>
      <AsyncPaginate
        styles={computeCustomStylesWithValidation(errors)}
        name={name}
        loadOptions={loadOptions}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        isSearchable
        debounceTimeout={200}
        additional={{ page: 1 }}
        isDisabled={disabled}
      />
    </FieldSelectWrapper>
  );
}

export default FieldSelect;
