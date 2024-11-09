import React, { useEffect, useState, useCallback } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { get, map } from "lodash";
import { withTranslation } from "react-i18next";

// i18n
import i18n from "../../i18n";
import languages from "../../translations/languages";

// Functional Component untuk LanguageDropdown
const LanguageDropdown = React.memo(() => {
  // State untuk bahasa yang dipilih dan status menu
  const [selectedLang, setSelectedLang] = useState("");
  const [menu, setMenu] = useState(false);

  // Menggunakan useEffect untuk mengatur bahasa saat ini dari localStorage
  useEffect(() => {
    const currentLanguage = localStorage.getItem("I18N_LANGUAGE");
    setSelectedLang(currentLanguage);
  }, []);

  // Menggunakan useCallback untuk memoization fungsi changeLanguageAction
  const changeLanguageAction = useCallback((lang) => {
    i18n.changeLanguage(lang);  // Mengubah bahasa dengan i18n
    localStorage.setItem("I18N_LANGUAGE", lang);  // Menyimpan bahasa baru di localStorage
    setSelectedLang(lang);  // Mengatur state bahasa yang dipilih
  }, []);

  // Menggunakan useCallback untuk memoization fungsi toggle
  const toggle = useCallback(() => {
    setMenu((prevMenu) => !prevMenu);  // Membalikkan status menu
  }, []);

  return (
    <>
      <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block">
        <DropdownToggle className="btn header-item waves-effect" tag="button">
          <img
            src={get(languages, `[${selectedLang}].flag`)}
            alt="Selected Language"
            height="16"
            className="mr-1"
          />
          <span className="align-middle">{get(languages, `[${selectedLang}].label`)}</span>
        </DropdownToggle>
        <DropdownMenu className="language-switch" right>
          {map(Object.keys(languages), (key) => (
            <DropdownItem
              key={key}
              tag="a"
              href="#"
              onClick={() => changeLanguageAction(key)}
              className={`notify-item ${selectedLang === key ? "active" : "none"}`}
            >
              <img
                src={get(languages, `[${key}].flag`)}
                alt="Language"
                className="mr-1"
                height="12"
              />
              <span className="align-middle">{get(languages, `[${key}].label`)}</span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  );
});

export default withTranslation()(LanguageDropdown);
