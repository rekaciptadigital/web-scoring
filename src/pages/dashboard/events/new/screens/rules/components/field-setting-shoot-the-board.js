import * as React from "react";
import styled from "styled-components";
import Switch from "react-switch";
import IconPlus from "components/ma/icons/mono/plus";
import IconTrash from "components/ma/icons/mono/trash";
import { FieldSelect } from "pages/dashboard/events/components/form-fields";
import { Button } from "components/ma";
import { FieldSelectCategories } from "./field-select-categories";
import { useSubmitFormRuleSetting } from "../hooks/form-rule-shoot-setting";

function SettingShootTheBoard({ eventDetail, form, shootSettings }) {
  const numberKategori = [1, 2, 3, 4, 5, 6].map((item) => {
    return { label: item, value: item };
  });

  const numberRambahan = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => {
    return { label: item, value: item };
  });

  const categoryDetails = eventDetail?.eventCategories;
  const optionsCategories = React.useMemo(
    () => _makeOptionsCategory(categoryDetails),
    [categoryDetails]
  );

  const dataShootRule = {
    session: 2,
    rambahan: 6,
    child_bow: 6,
    have_special_category: 0,
    category: [],
  };

  const initialData = {
    event_id: eventDetail.id,
    active_setting: null,
    shootRule: [dataShootRule],
  };

  const [dataOption, setDataOption] = React.useState([]);
  const [dataForm, setFormData] = React.useState(initialData);
  const [originOption, setOriginOption] = React.useState(optionsCategories);
  const [isDeleteShootSetting, setIsDeleteShootSetting] = React.useState(false);
  useSubmitFormRuleSetting(dataForm, form.setSubmitRule);

  const handleSelect = (value, index) => {
    let shootRule = dataForm.shootRule;
    shootRule[index].category = value;
    setFormData({
      ...dataForm,
      value,
    });
    if (value.length < 1) {
      setDataOption(originOption);
    } else {
      value.map((val) => {
        setDataOption(originOption.filter((el) => el !== val));
      });
    }
  };

  const handleAdd = () => {
    setFormData((prevData) => ({
      ...prevData,
      shootRule: [...prevData.shootRule, dataShootRule],
    }));
  };

  const handleDelete = (index) => {
    let tempCategory = dataOption;
    dataForm.shootRule[index].category.map((val) => {
      tempCategory.push(val);
    });

    setDataOption(tempCategory);

    setFormData((prevData) => ({
      ...prevData,
      shootRule: [...prevData.shootRule.filter((el, i) => i !== index)],
    }));
  };

  const handleChangeSpecialCategory = (val, index) => {
    if (dataForm) {
      let setShootRule = [];
      dataForm.shootRule.map((valData, key) => {
        if (index !== key) {
          setShootRule.push({
            category: valData.category,
            child_bow: valData.child_bow,
            have_special_category: valData.have_special_category,
            rambahan: valData.rambahan,
            session: valData.session,
          });
        } else {
          setShootRule.push({
            category: valData.category,
            child_bow: valData.child_bow,
            have_special_category: val ? 1 : 0,
            rambahan: valData.rambahan,
            session: valData.session,
          });
        }
      });

      setFormData((prevState) => ({
        ...prevState,
        shootRule: setShootRule,
      }));
    }
  };

  const handleSelectRule = (name, event, index) => {
    let shootRule = dataForm.shootRule;
    shootRule[index][name] = event.value;

    setFormData((prevData) => ({
      ...prevData,
      shootRule: shootRule,
    }));
  };

  const checkNextIndex = (index) => {
    if (dataForm.shootRule.length > 0) {
      let checkingNextIndex = dataForm.shootRule[index + 1];
      let getDataFromIndex = dataForm.shootRule[index];
      if (getDataFromIndex.have_special_category && !checkingNextIndex) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  React.useEffect(() => {
    if (shootSettings) {
      const mappingOldDataCategories = (paramOldDataCategory) => {
        return {
          data: {
            label: paramOldDataCategory.label,
            competitionCategoryId: paramOldDataCategory.competitionCategoryId,
            ageCategoryId: paramOldDataCategory.ageCategoryId,
            distanceId: parseInt(paramOldDataCategory.distanceId),
          },
          label: paramOldDataCategory.label,
          value: paramOldDataCategory.label,
        };
      };

      let optionCategories = [];
      if (shootSettings.shootRule.length < 1) {
        optionCategories.push({
          session: 2,
          rambahan: 6,
          child_bow: 6,
          have_special_category: 0,
          category: [],
        });
      } else {
        if (shootSettings.activeSetting) {
          shootSettings.shootRule.map((valShootSetting) => {
            optionCategories.push({
              session: valShootSetting.session,
              rambahan: valShootSetting.rambahan,
              child_bow: valShootSetting.arrow,
              have_special_category: valShootSetting.haveSpecialCategory,
              category:
                valShootSetting.categories.length < 1
                  ? []
                  : valShootSetting.categories.map(mappingOldDataCategories),
            });
          });
        } else {
          optionCategories.push({
            session: 2,
            rambahan: 6,
            child_bow: 6,
            have_special_category: 0,
            category: [],
          });
        }
      }

      setFormData({
        event_id: eventDetail.id,
        active_setting: shootSettings?.activeSetting,
        shootRule: optionCategories,
      });

      let tempCategory = [];
      optionCategories?.map((option) => {
        option?.category.map((val) => {
          tempCategory.push(val);
        });
      });

      setDataOption(dataOption.filter((el) => !tempCategory.includes(el)));
    }
  }, [shootSettings]);

  React.useEffect(() => {
    setDataOption(optionsCategories);
    setOriginOption(optionsCategories);
  }, [optionsCategories]);

  React.useEffect(() => {
    if (dataForm.shootRule.length > 1) {
      setIsDeleteShootSetting(false);
    } else {
      setIsDeleteShootSetting(true);
    }
  }, [dataForm]);

  return (
    <SettingContainer>
      <SpacedVertical>
        <div>
          <h5>Aturan Menembak Perpani</h5>
          <p>
            Aturan dasar pertandingan panahan dari Perpani, yaitu setiap 1 sesi
            terdiri dari 6 rambahan dan tiap rambahan terdiri dari 6 anak panah.
            Anda dapat membuat aturan pertandingan yang berbeda dengan
            mengaktifkan pengaturan dibawah ini.
          </p>
        </div>
        <EarlyBirdActivationBar>
          <div>Aktifkan Pengaturan Menembak Custom</div>
          <ToggleSwitch
            checked={dataForm?.active_setting}
            onChange={(val) => {
              setFormData((prevState) => ({
                ...prevState,
                active_setting: val ? 1 : 0,
              }));
            }}
          />
        </EarlyBirdActivationBar>
        {dataForm?.active_setting ? (
          <Section>
            <SettingContentContainer>
              {dataForm?.shootRule?.map((rule, index) => {
                return (
                  <CategoryBlock key={index}>
                    <Section>
                      <SettingContentContainer>
                        <h5>Aturan Menembak</h5>
                        <FourColumnsInputsGrid>
                          <FieldSelect
                            value={{ label: rule.session, value: rule.session }}
                            onChange={(event) =>
                              handleSelectRule("session", event, index)
                            }
                            options={numberKategori}
                          >
                            <LabelRules>Jumlah Sesi per Kategori</LabelRules>
                          </FieldSelect>
                          <FieldSelect
                            value={{
                              label: rule.rambahan,
                              value: rule.rambahan,
                            }}
                            onChange={(event) =>
                              handleSelectRule("rambahan", event, index)
                            }
                            options={numberRambahan}
                          >
                            <LabelRules>Jumlah Rambahan</LabelRules>
                          </FieldSelect>
                          <FieldSelect
                            value={{
                              label: rule.child_bow,
                              value: rule.child_bow,
                            }}
                            onChange={(event) =>
                              handleSelectRule("child_bow", event, index)
                            }
                            options={numberRambahan}
                          >
                            <LabelRules>
                              Jumlah Anak Panah per-Rambahan
                            </LabelRules>
                          </FieldSelect>
                        </FourColumnsInputsGrid>
                        <EarlyBirdActivationBar>
                          <div>Terapkan ke kategori tertentu</div>
                          {/* <ToggleSwitch
                            checked={dataForm?.implementAll ? 0 : 1}
                            onChange={(val) => handleImplemen(val, index)}
                          /> */}
                          <ToggleSwitch
                            checked={rule.have_special_category ? 1 : 0}
                            onChange={(val) =>
                              handleChangeSpecialCategory(val, index)
                            }
                          />
                        </EarlyBirdActivationBar>
                        <HelpDesk className="mt-2 mb-4">
                          Apabila Anda mengaktifkan fitur ini maka aturan
                          menembak hanya akan berlaku pada kategori tertentu
                          yang Anda pilih.
                        </HelpDesk>
                        {rule.have_special_category ? (
                          <FieldSelectCategories
                            label="Kategori"
                            placeholder="Pilih opsi"
                            required
                            options={dataOption}
                            value={rule?.category}
                            onChange={(value) =>
                              handleSelect(value ?? [], index)
                            }
                          />
                        ) : undefined}
                      </SettingContentContainer>
                    </Section>
                    <div style={{ marginTop: "20px" }}>
                      <Button
                        disabled={checkNextIndex(index)}
                        flexible
                        onClick={handleAdd}
                      >
                        <IconPlus size={12} />
                      </Button>
                      <br />
                      <Button
                        disabled={isDeleteShootSetting}
                        flexible
                        onClick={() => handleDelete(index)}
                      >
                        <IconTrash size={12} />
                      </Button>
                    </div>
                  </CategoryBlock>
                );
              })}
            </SettingContentContainer>
          </Section>
        ) : undefined}
      </SpacedVertical>
    </SettingContainer>
  );
}

// styles
const Section = styled.section`
  border: 1px solid var(--ma-gray-200);
  border-radius: 0.5rem;
  background-clip: border-box;
  margin-bottom: 10px;
`;

const SettingContainer = styled.div`
  padding: 1.25rem;
`;

const SettingContentContainer = styled.div`
  padding: 0.5rem;
  > * + * {
    margin-top: 1.5rem;
  }
`;

const SpacedVertical = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const EarlyBirdActivationBar = styled.div`
  min-height: 3rem;
  padding: 0.5rem;
  padding-left: 1.25rem;
  border-radius: 0.5rem;
  background-color: var(--ma-gray-50);

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FourColumnsInputsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 1rem;
  margin-top: 20px;
`;

const CategoryBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.3rem;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;

    > * {
      margin-top: 1rem;
    }
  }
`;

const LabelRules = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 140%;
`;

const HelpDesk = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  margin-bottom: 20px;
`;

//end styles

//function handling
function ToggleSwitch({ checked, onChange, disabled }) {
  const handleToggling = (event) => {
    onChange?.(event);
  };

  return (
    <Switch
      disabled={disabled}
      checked={Boolean(checked)}
      onChange={handleToggling}
      offColor="#eeeeee"
      onColor="#B4C6E2"
      onHandleColor="#0d47a1"
      height={16}
      width={40}
      handleDiameter={24}
      uncheckedIcon={false}
      checkedIcon={false}
      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
    />
  );
}

function _makeOptionsCategory(categoryDetails) {
  if (!categoryDetails?.length) {
    return [];
  }

  const grouped = _groupCategory(categoryDetails);
  return Object.keys(grouped).map((value) => ({
    value: value,
    label: grouped[value].label,
    data: grouped[value],
  }));
}

function _groupCategory(categoryDetails) {
  if (!categoryDetails?.length) {
    return {};
  }

  const grouped = {};
  for (const category of categoryDetails) {
    const competitionCat = category.competitionCategoryId;
    const classCat = category.ageCategoryId;
    const distanceCat = category.distanceId;
    const key = `${competitionCat.id} - ${classCat.id} - ${distanceCat.id}`;

    if (grouped[key]) {
      continue;
    }

    grouped[key] = {
      label: `${competitionCat.label} - ${classCat.label} - ${distanceCat.label}`,
      competitionCategoryId: competitionCat.id,
      ageCategoryId: classCat.id,
      distanceId: distanceCat.id,
    };
  }

  return grouped;
}

export { SettingShootTheBoard };
