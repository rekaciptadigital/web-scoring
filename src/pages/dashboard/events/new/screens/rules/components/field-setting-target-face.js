import * as React from "react";
import styled from "styled-components";
import Switch from "react-switch";
import IconPlus from "components/ma/icons/mono/plus";
import IconTrash from "components/ma/icons/mono/trash";
import {
  FieldInputText,
  FieldSelect,
} from "pages/dashboard/events/components/form-fields";
import { Button } from "components/ma";
import { FieldSelectCategories } from "./field-select-categories";
import { useSubmitFormRuleFaceSetting } from "../hooks/form-rule-face-setting";

function SettingTargetFace({ eventDetail, form, targetfacegSettings }) {
  const categoryDetails = eventDetail?.eventCategories;
  const optionsCategories = React.useMemo(
    () => _makeOptionsCategory(categoryDetails),
    [categoryDetails]
  );

  const dataShootRule = {
    highest_score: 0,
    score_x: 0,
    category: [],
    optionX: [],
  };

  const initialData = {
    event_id: eventDetail.id,
    activeSetting: 0,
    implementAll: 1,
    categories_config: [dataShootRule],
  };

  const [dataOption, setDataOption] = React.useState(optionsCategories);
  const [dataForm, setFormData] = React.useState(initialData);
  // const [numberRambahan, setnumberRambahan] = React.useState(null);

  const numberRambahan = (number) => {
    const tempnumberRambahan = [...new Array(number)].map((item, index) => {
      return { label: index + 1, value: index + 1 };
    });
    return tempnumberRambahan;
  };

  useSubmitFormRuleFaceSetting(dataForm, form.setSubmitRuleFace);

  const handleSelect = (value, index) => {
    let categories = dataForm.categories_config[index].category.length;
    if (categories < value.length || categories === 0) {
      const categories_config = dataForm.categories_config.map((field, i) => {
        if (i == index) {
          const category = [...field.category, value[value.length - 1]];
          return { ...field, category };
        }
        return field;
      });

      setFormData({
        ...dataForm,
        categories_config,
      });

      value.map((val) => {
        setDataOption(dataOption.filter((el) => el !== val));
      });
    } else {
      dataForm.categories_config[index].category.map((val) => {
        setDataOption([...dataOption, val]);
      });

      let categories_config = dataForm.categories_config;
      categories_config[index].category = value;

      setFormData((prevData) => ({
        ...prevData,
        categories_config: categories_config,
      }));
    }
  };

  const handleAdd = () => {
    setFormData((prevData) => ({
      ...prevData,
      categories_config: [...prevData.categories_config, dataShootRule],
    }));
  };

  const handleDelete = (index) => {
    let tempCategory = dataOption;
    dataForm.categories_config[index].category.map((val) => {
      tempCategory.push(val);
    });

    setDataOption(tempCategory);

    setFormData((prevData) => ({
      ...prevData,
      categories_config: [
        ...prevData.categories_config.filter((el, i) => i !== index),
      ],
    }));
  };

  const handleImplemen = (value) => {
    if (dataForm?.categories_config.length === 1) {
      setFormData((prevState) => ({
        ...prevState,
        implementAll: value ? 0 : 1,
      }));
    }
  };

  const handleSelectRule = (name, event, index) => {
    let tempcategories_config = dataForm.categories_config;
    if (name === "highest_score") {
      tempcategories_config[index][name] = event;
      tempcategories_config[index].score_x = parseInt(event);
      tempcategories_config[index].optionX = numberRambahan(parseInt(event));
    } else {
      tempcategories_config[index][name] = event.value;
      tempcategories_config[index].optionX =
        dataForm.categories_config[index].optionX;
    }

    setFormData((prevData) => ({
      ...prevData,
      categories_config: tempcategories_config,
    }));
  };

  React.useEffect(() => {
    if (targetfacegSettings) {
      const optionCategory = targetfacegSettings?.implementAll
        ? [
            {
              highest_score: targetfacegSettings?.highestScore,
              score_x: targetfacegSettings?.scoreX,
              category: [],
              optionX: numberRambahan(targetfacegSettings?.highestScore),
            },
          ]
        : _makeFaceRule(targetfacegSettings, optionsCategories);
      setFormData({
        event_id: eventDetail.id,
        activeSetting: targetfacegSettings?.activeSetting,
        implementAll: targetfacegSettings?.implementAll,
        categories_config: optionCategory,
      });

      if (!targetfacegSettings?.implementAll) {
        let tempCategory = [];
        optionCategory?.map((option) => {
          option?.category.map((val) => {
            tempCategory.push(val);
          });
        });

        setDataOption(dataOption.filter((el) => !tempCategory.includes(el)));
      }
    }
  }, [targetfacegSettings]);

  return (
    <SettingContainer>
      <SpacedVertical>
        <div>
          <h5>Aturan Target Face Perpani</h5>
          <p>
            Aturan dasar pertandingan untuk target face dari Perpani, yaitu 1
            target face terdiri dari 6 ring dengan skor tertinggi “X” yang
            memiliki nilai skor diatas 10. Anda dapat membuat aturan target face
            yang berbeda dengan mengaktifkan pengaturan dibawah ini.
          </p>
        </div>
        <EarlyBirdActivationBar>
          <div>Aktifkan Pengaturan Target Face Custom</div>
          <ToggleSwitch
            checked={dataForm?.activeSetting}
            onChange={(val) => {
              setFormData((prevState) => ({
                ...prevState,
                activeSetting: val ? 1 : 0,
              }));
            }}
          />
        </EarlyBirdActivationBar>
        {dataForm?.activeSetting ? (
          <Section>
            <SettingContentContainer>
              {dataForm.categories_config?.map((rule, index) => (
                <CategoryBlock key={index}>
                  <Section>
                    <SettingContentContainer>
                      <h5>Aturan Menembak</h5>
                      <SecondColumnsInputsGrid>
                        <FieldInputText
                          onChange={(value) =>
                            handleSelectRule("highest_score", value, index)
                          }
                          type="number"
                          placeholder="Masukkan angka"
                          value={rule.highest_score}
                        >
                          <LabelRules>Nilai Skor Tertinggi</LabelRules>
                        </FieldInputText>
                        <FieldSelect
                          value={{ label: rule.score_x, value: rule.score_x }}
                          onChange={(event) =>
                            handleSelectRule("score_x", event, index)
                          }
                          options={rule.optionX}
                        >
                          <LabelRules>Nilai Skor X</LabelRules>
                        </FieldSelect>
                      </SecondColumnsInputsGrid>
                      <EarlyBirdActivationBar>
                        <div>Terapkan ke kategori tertentu</div>
                        <ToggleSwitch
                          checked={dataForm?.implementAll ? 0 : 1}
                          onChange={(val) => handleImplemen(val, index)}
                        />
                      </EarlyBirdActivationBar>
                      <HelpDesk className="mt-2 mb-4">
                        Apabila Anda mengaktifkan fitur ini maka aturan menembak
                        hanya akan berlaku pada kategori tertentu yang Anda
                        pilih.
                      </HelpDesk>
                      {!dataForm?.implementAll ? (
                        <FieldSelectCategories
                          label="Kategori"
                          placeholder="Pilih opsi"
                          required
                          options={dataOption}
                          value={rule?.category}
                          onChange={(value) => handleSelect(value ?? [], index)}
                        />
                      ) : undefined}
                    </SettingContentContainer>
                  </Section>
                  <div style={{ marginTop: "20px" }}>
                    <Button
                      // disabled={dataForm?.implementAll ? true : false}
                      flexible
                      onClick={handleAdd}
                    >
                      <IconPlus size={12} />
                    </Button>
                    <br />
                    <Button
                      disabled={index === 0 ? true : false}
                      flexible
                      onClick={() => handleDelete(index)}
                    >
                      <IconTrash size={12} />
                    </Button>
                  </div>
                </CategoryBlock>
              ))}
            </SettingContentContainer>
          </Section>
        ) : undefined}
      </SpacedVertical>
    </SettingContainer>
  );
}

//styles
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

// const FourColumnsInputsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
//   gap: 1rem;
//   margin-top: 20px;
// `;

const SecondColumnsInputsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

// function or state
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

function _makeFaceRule(value, optionsCategories) {
  const makeShootRule = (option) => ({
    highest_score: option.highestScore,
    score_x: option.scoreX,
    category: _checkCategoriesValue(optionsCategories, option.categories) || [],
  });

  switch (value.implementAll) {
    case 0: {
      return value.categoriesConfig.map(makeShootRule);
    }

    case 1: {
      return {
        highest_score: value.highestScore,
        score_x: value.scoreX,
        category: [],
      };
    }
  }
}

function _checkCategoriesValue(optionsCategories, values) {
  const foundCategories = [];
  values.forEach((cat) => {
    const competitionCat = cat.competitionCategoryId;
    const classCat = cat.ageCategoryId;
    const distanceCat = cat.distanceId;
    const value = `${competitionCat} - ${classCat} - ${distanceCat}`;
    const found = optionsCategories.find((option) => option.value === value);
    found && foundCategories.push(found);
  });
  return foundCategories;
}
// end function or state

export { SettingTargetFace };
