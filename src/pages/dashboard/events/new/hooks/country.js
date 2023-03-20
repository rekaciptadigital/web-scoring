import React from "react";
import { GeneralService } from "services";

const useCountry = (
  countryInput = "",
  provinceInput = "",
  selectedCountry,
  selectedProvince
) => {
  const [countryList, setCountryList] = React.useState([]);
  const [provinceList, setProvinceList] = React.useState([]);
  // const [cityList, setCityList] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState([]);
  const fetchCountry = async (keyword) => {
    try {
      const qs = {
        name: keyword.length ? keyword : "Indonesia",
        limit: 200,
        page: 1,
      };
      const data = await GeneralService.getCountry(qs);
      const convertData = data?.data?.map((country) => {
        return { ...country, label: country.name, value: country.name };
      });
      setCountryList(convertData);
      if (data?.message?.toLowerCase().includes("success")) {
        setErrorMessage("");
      } else {
        setErrorMessage(data?.error);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const fetchProvince = async (country, keyword) => {
    try {
      if (country?.id === 102 || country?.name === "Indonesia") {
        const qs = { page: 1, limit: 200 };
        const data = await GeneralService.getProvinces(qs);
        if (!data?.error) {
          setProvinceList(
            data?.data?.map((province) => ({
              ...province,
              label: province.name,
              value: province.name,
            }))
          );
          setErrorMessage("");
        } else {
          setErrorMessage(data?.error);
        }
      } else {
        const qs = {
          name: keyword,
          country_id: country.id,
          page: 1,
          limit: 200,
        };
        const data = await GeneralService.getProvinceCountry(qs);
        if (!data?.error) {
          setProvinceList(
            data?.data?.map((province) => ({
              ...province,
              label: province.name,
              value: province.name,
            }))
          );
          setErrorMessage("");
        } else {
          setErrorMessage(data?.error);
        }
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // const fetchCity = async (country, province) => {
  //   try {
  //     if (country?.id === 102 || country?.name === "Indonesia") {
  //       const qs = {
  //         limit: province?.id ? 200 : 2000,
  //         page: 1,
  //         province_id: province?.id,
  //       };
  //       const data = await GeneralService.getCities(qs);
  //       if (!data?.error) {
  //         setCityList(
  //           data?.data?.map((city) => ({
  //             ...city,
  //             label: city.name,
  //             value: city.name,
  //           }))
  //         );
  //         setErrorMessage("");
  //       } else {
  //         setErrorMessage(data?.error);
  //       }
  //     } else {
  //       const qs = {
  //         limit: 200,
  //         country_id: country?.id,
  //         page: 1,
  //         province_id: province?.id,
  //       };
  //       const data = await GeneralService.getCitiesCountry(qs);
  //       if (!data?.error) {
  //         setCityList(
  //           data?.data?.map((city) => ({
  //             ...city,
  //             label: city.name,
  //             value: city.name,
  //           }))
  //         );
  //         setErrorMessage("");
  //       } else {
  //         setErrorMessage(data?.error);
  //       }
  //     }
  //   } catch (error) {
  //     setErrorMessage(error.message);
  //   }
  // };

  React.useEffect(() => {
    fetchCountry(countryInput);
    fetchProvince(selectedCountry, provinceInput);
    // fetchCity(
    //   selectedCountry ?? {
    //     id: 102,
    //     name: "Indonesia",
    //     label: "Indonesia",
    //     value: "Indonesia",
    //   },
    //   selectedProvince
    // );
  }, [countryInput, provinceInput, selectedCountry, selectedProvince]);

  return [countryList, provinceList, errorMessage];
};

export { useCountry };
