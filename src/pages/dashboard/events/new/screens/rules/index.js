import * as React from "react";
import styled from "styled-components";
import Switch from "react-switch";

import { useFormRankingSetting } from "./hooks/form-ranking-settings";

import { SpinnerDotBlock, Button } from "components/ma";
import { FieldInputText, FieldInputTextSmall, FieldSelect } from "pages/dashboard/events/components/form-fields";
import { SelectRadio } from "../../components/select-radio";
import { FieldSelectCategories } from "./components/field-select-categories";
import { FieldSelectOption } from "../field-select-option";
import IconPlus from "components/ma/icons/mono/plus";
import IconTrash from "components/ma/icons/mono/trash";
import { useSubmitFormRuleSetting } from "./hooks/form-rule-shoot-setting";
import { useSubmitFormClubRank } from "./hooks/form-club-ranking";

function ScreenRules({ eventDetail, form, shootSetting, rankingSettings, targetfacegSettings }) {
  return (
    <CardSheet>
      <Section>
        <SettingShootTheBoard eventDetail={eventDetail} form={form} shootSettings={shootSetting} />
      </Section>
      <Section>
        <SettingTargetFace eventDetail={eventDetail} form={form} targetfacegSettings={targetfacegSettings} />
      </Section>
      <Section>
        <SettingsClubsRanking eventDetail={eventDetail} form={form} rankingSettings={rankingSettings} />
      </Section>
    </CardSheet>
  );
}

function SettingShootTheBoard({ eventDetail, form, shootSettings }) {

  const numberKategori = [...new Array(6)].map((item, index) => {
    return { label: index + 1, value: index + 1 }
  })

  const numberRambahan = [...new Array(12)].map((item, index) => {
    return { label: index + 1, value: index + 1 }
  })

  const categoryDetails = eventDetail?.eventCategories;
  const optionsCategories = React.useMemo(
    () => _makeOptionsCategory(categoryDetails),
    [categoryDetails]
  );

  const dataShootRule = {
    session: null,
    rambahan: null,
    child_bow: null,
    category: []
  };

  const initialData = {
    event_id: eventDetail.id,
    activeSetting: null,
    implementAll: 1,
    shootRule: [dataShootRule]
  }

  const [dataOption, setDataOption] = React.useState(optionsCategories);
  const [dataForm, setFormData] = React.useState(initialData);

  useSubmitFormRuleSetting(dataForm, form.setSubmitRule);

  const handleSelect = (value, index) => {

    let categories = dataForm.shootRule[index].category.length;
    if (categories < value.length || categories === 0) {
      if (dataForm.shootRule[index].session >= value.length) {
        const shootRule = dataForm.shootRule.map((field, i) => {
          if (i == index) {
            const category = [...field.category, value[value.length - 1]];
            return { ...field, category }
          }
          return field
        });

        setFormData({
          ...dataForm,
          shootRule
        });

        value.map((val) => {
          setDataOption(dataOption.filter((el) => el !== val));
        })
      }

    } else {

      dataForm.shootRule[index].category.map((val) => {
        setDataOption([...dataOption, val]);
      });

      let shootRule = dataForm.shootRule;
      shootRule[index].category = value;

      setFormData((prevData) => ({
        ...prevData,
        shootRule: shootRule
      }));
    }
  }

  const handleAdd = () => {
    setFormData((prevData) => ({
      ...prevData,
      shootRule: [...prevData.shootRule, dataShootRule]
    }));
  }

  const handleDelete = (index) => {

    let tempCategory = dataOption;
    dataForm.shootRule[index].category.map((val) => {
      tempCategory.push(val);
    });

    setDataOption(tempCategory);

    setFormData((prevData) => ({
      ...prevData,
      shootRule: [...prevData.shootRule.filter((el, i) => i !== index)]
    }));

  }

  const handleImplemen = (value) => {
    if (dataForm?.shootRule.length === 1) {
      setFormData((prevState) => ({
        ...prevState,
        implementAll: value ? 0 : 1
      }));
    }
  }

  const handleSelectRule = (name, event, index) => {
    let shootRule = dataForm.shootRule;
    shootRule[index][name] = event.value;

    setFormData((prevData) => ({
      ...prevData,
      shootRule: shootRule
    }));

  }

  React.useEffect(() => {
    if (shootSettings) {
      const optionCategory = shootSettings?.implementAll ? [{
        session: shootSettings?.session,
        rambahan: shootSettings?.rambahan,
        child_bow: shootSettings?.childBow,
        category: []
      }] : _makeShootRule(shootSettings, optionsCategories);
      setFormData({
        event_id: eventDetail.id,
        activeSetting: shootSettings?.activeSetting,
        implementAll: shootSettings?.implementAll,
        shootRule: optionCategory
      });

      if (!shootSettings?.implementAll) {
        let tempCategory = []
        optionCategory?.map((option) => {
          option?.category.map((val) => {
            tempCategory.push(val)
          });
        });

        setDataOption(dataOption.filter((el) => !tempCategory.includes(el)));
      }

    }
  }, [shootSettings]);

  return (
    <SettingContainer>
      <SpacedVertical>
        <div>
          <h5>Aturan Menembak Perpani</h5>
          <p>
            Aturan dasar pertandingan panahan dari Perpani, yaitu setiap 1 sesi terdiri dari 6 rambahan dan tiap rambahan terdiri dari 6 anak panah. Anda dapat membuat aturan pertandingan yang berbeda dengan mengaktifkan pengaturan dibawah ini.
          </p>
        </div>
        <EarlyBirdActivationBar>
          <div>Aktifkan Pengaturan Menembak Custom</div>
          <ToggleSwitch
            checked={dataForm?.activeSetting}
            onChange={(val) => {
              setFormData((prevState) => ({
                ...prevState,
                activeSetting: val ? 1 : 0
              }));
            }}
          />
        </EarlyBirdActivationBar>
        {dataForm?.activeSetting ? (
          <Section>
            <SettingContentContainer>
              {dataForm?.shootRule?.map((rule, index) => (
                <CategoryBlock key={index}>
                  <Section>
                    <SettingContentContainer>
                      <h5>Aturan Menembak</h5>
                      <FourColumnsInputsGrid>
                        <FieldSelect value={{ label: rule.session, value: rule.session }} onChange={(event) => handleSelectRule('session', event, index)} options={numberKategori}><LabelRules>Jumlah Sesi per Kategori</LabelRules></FieldSelect>
                        <FieldSelect value={{ label: rule.rambahan, value: rule.rambahan }} onChange={(event) => handleSelectRule('rambahan', event, index)} options={numberRambahan}><LabelRules>Jumlah Rambahan</LabelRules></FieldSelect>
                        <FieldSelect value={{ label: rule.child_bow, value: rule.child_bow }} onChange={(event) => handleSelectRule('child_bow', event, index)} options={numberRambahan}><LabelRules>Jumlah Anak Panah per-Rambahan</LabelRules></FieldSelect>
                      </FourColumnsInputsGrid>
                      <EarlyBirdActivationBar>
                        <div>Terapkan ke kategori tertentu</div>
                        <ToggleSwitch
                          checked={dataForm?.implementAll ? 0 : 1}
                          onChange={(val) => handleImplemen(val)}
                        />
                      </EarlyBirdActivationBar>
                      <HelpDesk className="mt-2 mb-4">
                        Apabila Anda mengaktifkan fitur ini maka aturan menembak hanya akan berlaku pada kategori tertentu yang Anda pilih.
                      </HelpDesk>
                      {!dataForm?.implementAll ?
                        <FieldSelectCategories
                          label="Kategori"
                          placeholder="Pilih opsi"
                          required
                          options={dataOption}
                          value={rule?.category}
                          onChange={(value) => handleSelect(value ?? [], index)}
                        />
                        : undefined}
                    </SettingContentContainer>
                  </Section>
                  <div style={{ marginTop: '20px' }}>
                    <Button disabled={dataForm?.implementAll ? true : false} flexible onClick={handleAdd}><IconPlus size={12} /></Button><br />
                    <Button disabled={index === 0 ? true : false} flexible onClick={() => handleDelete(index)}><IconTrash size={12} /></Button>
                  </div>
                </CategoryBlock>
              ))}
            </SettingContentContainer>
          </Section>) : undefined
        }

      </SpacedVertical>
      {/* <AlertSubmitError isError={isErrorFetch} errors={errorsFetch} /> */}
      {/* <AlertSubmitError isError={isErrorSubmit} errors={errorsSubmit} /> */}
    </SettingContainer >
  )
}

function SettingTargetFace({ eventDetail, form, targetfacegSettings }) {

  const numberKategori = [...new Array(6)].map((item, index) => {
    return { label: index + 1, value: index + 1 }
  })

  const numberRambahan = [...new Array(12)].map((item, index) => {
    return { label: index + 1, value: index + 1 }
  })

  const categoryDetails = eventDetail?.eventCategories;
  const optionsCategories = React.useMemo(
    () => _makeOptionsCategory(categoryDetails),
    [categoryDetails]
  );

  const dataShootRule = {
    session: null,
    rambahan: null,
    child_bow: null,
    category: []
  };

  const initialData = {
    event_id: eventDetail.id,
    activeSetting: null,
    implementAll: 1,
    shootRule: [dataShootRule]
  }

  const [dataOption, setDataOption] = React.useState(optionsCategories);
  const [dataForm, setFormData] = React.useState(initialData);

  useSubmitFormRuleSetting(dataForm, form.setSubmitRule);

  // const handleSelect = (value, index) => {

  //   let categories = dataForm.shootRule[index].category.length;
  //   if (categories < value.length || categories === 0) {
  //     if (dataForm.shootRule[index].session >= value.length) {
  //       const shootRule = dataForm.shootRule.map((field, i) => {
  //         if (i == index) {
  //           const category = [...field.category, value[value.length - 1]];
  //           return { ...field, category }
  //         }
  //         return field
  //       });

  //       setFormData({
  //         ...dataForm,
  //         shootRule
  //       });

  //       value.map((val) => {
  //         setDataOption(dataOption.filter((el) => el !== val));
  //       })
  //     }

  //   } else {

  //     dataForm.shootRule[index].category.map((val) => {
  //       setDataOption([...dataOption, val]);
  //     });

  //     let shootRule = dataForm.shootRule;
  //     shootRule[index].category = value;

  //     setFormData((prevData) => ({
  //       ...prevData,
  //       shootRule: shootRule
  //     }));
  //   }
  // }

  const handleAdd = () => {
    setFormData((prevData) => ({
      ...prevData,
      shootRule: [...prevData.shootRule, dataShootRule]
    }));
  }

  const handleDelete = (index) => {

    let tempCategory = dataOption;
    dataForm.shootRule[index].category.map((val) => {
      tempCategory.push(val);
    });

    setDataOption(tempCategory);

    setFormData((prevData) => ({
      ...prevData,
      shootRule: [...prevData.shootRule.filter((el, i) => i !== index)]
    }));

  }

  // const handleImplemen = (value) => {
  //   if (dataForm?.shootRule.length === 1) {
  //     setFormData((prevState) => ({
  //       ...prevState,
  //       implementAll: value ? 0 : 1
  //     }));
  //   }
  // }

  // const handleSelectRule = (name, event, index) => {
  //   let shootRule = dataForm.shootRule;
  //   shootRule[index][name] = event.value;

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     shootRule: shootRule
  //   }));

  // }

  React.useEffect(() => {
    if (targetfacegSettings) {
      const optionCategory = shootSettings?.implementAll ? [{
        session: shootSettings?.session,
        rambahan: shootSettings?.rambahan,
        child_bow: shootSettings?.childBow,
        category: []
      }] : _makeShootRule(shootSettings, optionsCategories);
      setFormData({
        event_id: eventDetail.id,
        activeSetting: shootSettings?.activeSetting,
        implementAll: shootSettings?.implementAll,
        shootRule: optionCategory
      });

      if (!shootSettings?.implementAll) {
        let tempCategory = []
        optionCategory?.map((option) => {
          option?.category.map((val) => {
            tempCategory.push(val)
          });
        });

        setDataOption(dataOption.filter((el) => !tempCategory.includes(el)));
      }

    }
  }, [shootSettings]);

  return (
    <SettingContainer>
      <SpacedVertical>
        <div>
          <h5>Aturan Target Face Perpani</h5>
          <p>
            Aturan dasar pertandingan untuk target face dari Perpani, yaitu 1 target face terdiri dari 6 ring dengan skor tertinggi “X” yang memiliki nilai skor diatas 10. Anda dapat membuat aturan target face yang berbeda dengan mengaktifkan pengaturan dibawah ini.
          </p>
        </div>
        <EarlyBirdActivationBar>
          <div>Aktifkan Pengaturan Target Face Custom</div>
          <ToggleSwitch
          // checked={data.isPrivate ? 1 : 0}
          // onChange={(val) => updateField("isPrivate", val ? 1 : 0)}
          />
        </EarlyBirdActivationBar>
        <Section>
          <SettingContentContainer>
            <EarlyBirdActivationBar>
              <div>Terapkan ke semua kategori</div>
              <ToggleSwitch
              // checked={data.isPrivate ? 1 : 0}
              // onChange={(val) => updateField("isPrivate", val ? 1 : 0)}
              />
            </EarlyBirdActivationBar>
            {data.map((rule, index) => (
              <CategoryBlock key={index}>
                <Section>
                  <SettingContentContainer>
                    <h5>Aturan Target Face</h5>
                    <FourColumnsInputsGrid>
                      <FieldSelect value={{ label: rule.session, value: rule.session }} options={numberKategori}><LabelRules>Jumlah Ring pada Target Face</LabelRules></FieldSelect>
                      <FieldInputText type="number" placeholder="Masukkan angka"><LabelRules>Nilai Skor Tertinggi</LabelRules></FieldInputText>
                      <FieldSelect options={numberRambahan}><LabelRules>Nilai Skor “X”</LabelRules></FieldSelect>
                    </FourColumnsInputsGrid>
                    <FieldSelectCategories
                      label="Kategori"
                      placeholder="Pilih opsi"
                      required
                      options={optionsCategories}
                    // value={categories}
                    // onChange={(value) => updateField("categories", value || [])}
                    // errors={errors.categories}
                    />
                  </SettingContentContainer>
                </Section>
                <div style={{ marginTop: '20px' }}>
                  <Button disabled={dataForm?.implementAll ? true : false} flexible onClick={handleAdd}><IconPlus size={12} /></Button><br />
                  <Button disabled={index === 0 ? true : false} flexible onClick={() => handleDelete(index)}><IconTrash size={12} /></Button>
                </div>
              </CategoryBlock>
            ))}


          </SettingContentContainer>
        </Section>
      </SpacedVertical>
    </SettingContainer >
  )
}

function SettingsClubsRanking({ eventDetail, form, rankingSettings }) {
  // const {
  //   data: rankingSettings,
  //   isLoading,
  //   fetchRankingSetting,
  // } = useClubRankingSetting(eventDetail?.id);

  const categoryDetails = eventDetail?.eventCategories;
  const optionsCategories = React.useMemo(
    () => _makeOptionsCategory(categoryDetails),
    [categoryDetails]
  );

  const optionsCountingTypes = React.useMemo(
    () => [
      { value: 1, label: "Digabung" },
      { value: 2, label: "Dipisah" },
    ],
    []
  );

  const initialValues = React.useMemo(
    () => _makeFormInitialValues(rankingSettings, { optionsCategories, optionsCountingTypes }),
    [rankingSettings, optionsCategories, optionsCountingTypes]
  );

  const { data, errors, updateField, setType } = useFormRankingSetting(initialValues);

  const { type, rankingName, categories, medalCountingType } = data;

  useSubmitFormClubRank(data, form.setFormPemeringkatan);

  return (
    <SettingContainer>
      <SpacedVertical>
        <div>
          <h5>Aturan Pemeringkatan Klub</h5>
          <p>
            Pemeringkatan klub merupakan skor yang diperingkatkan berdasarkan perolehan skor dari
            masing-masing klub dan akan ditampilkan pada menu &#34;Pemeringkatan Klub&#34; pada tiap
            event. Anda dapat menampilkan semua kategori saja atau dapat mengatur kategori tertentu
            untuk ditampilkan.
          </p>
        </div>

        {!rankingSettings && isLoading ? (
          <SpinnerDotBlock />
        ) : (
          <React.Fragment>
            <div>
              <SelectRadio
                options={[
                  { value: 1, label: "Semua Kategori" },
                  { value: 2, label: "Kategori Tertentu" },
                  { value: 3, label: "Gabungan dari Kategori Tertentu (Khusus)" },
                ]}
                value={type}
                onChange={(value) => setType(parseInt(value))}
              />
            </div>

            {type > 1 && (
              <React.Fragment>
                {type === 3 && (
                  <div>
                    <FieldInputTextSmall
                      label="Penamaan Pemeringkatan"
                      placeholder="Masukkan nama"
                      required
                      value={rankingName}
                      onChange={(ev) => updateField("rankingName", ev.target.value)}
                      errors={errors.rankingName}
                      isTouched // prop legacy dari form input bantalan
                    />
                  </div>
                )}

                <div>
                  <FieldSelectCategories
                    label="Kategori"
                    placeholder="Pilih opsi"
                    required
                    options={optionsCategories}
                    value={categories}
                    onChange={(value) => updateField("categories", value || [])}
                    errors={errors.categories}
                  />
                  <SubtleFieldNote>
                    Kategori pemeringkatan klub akan ditampilkan satu-satu sesuai kategori yang
                    dipilih. Anda dapat memilih lebih dari satu kategori untuk ditampilkan pada menu
                    &#34;Pemeringkatan Klub&#34;
                  </SubtleFieldNote>
                </div>

                <div>
                  <FieldSelectOption
                    label="Perhitungan Medali"
                    placeholder="Pilih opsi"
                    required
                    options={optionsCountingTypes}
                    value={medalCountingType}
                    onChange={(value) => updateField("medalCountingType", value)}
                    errors={errors.medalCountingType}
                  />
                  <SubtleFieldNote>
                    Perhitungan medali pada kategori tertentu dapat &#34;digabung&#34; atau
                    &#34;dipisah&#34;. Dimana &#34;digabung&#34; merupakan jumlah medali dari
                    kategori yang telah dipilih dan ditotalkan pada &#34;Semua Kategori&#34;.
                    Sedangkan &#34;dipisah&#34; merupakan medali yang diperoleh dari masing-masing
                    kategori dan tidak dihitung / digabung pada &#34;Semua Kategori&#34;.
                  </SubtleFieldNote>
                </div>
              </React.Fragment>
            )}

          </React.Fragment>
        )}
      </SpacedVertical>
    </SettingContainer>
  );
}

/* ============================ */
// styles

const CardSheet = styled.div`
  margin-bottom: 24px;

  padding: 35px;
  border: 0 solid #f6f6f6;
  border-radius: 8px;
  background-color: #ffffff;
  background-clip: border-box;
  box-shadow: 0 0.75rem 1.5rem rgb(18 38 63 / 3%);
`;

const Section = styled.section`
  border: 1px solid var(--ma-gray-200);
  border-radius: 0.5rem;
  background-clip: border-box;
  margin-bottom : 10px;
`;

const SettingContainer = styled.div`
  padding: 1.25rem;
`;

const SettingContentContainer = styled.div`
  padding: 0.5rem;
  > * + *{
    margin-top : 1.5rem;
  }
`;

const SpacedVertical = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const SubtleFieldNote = styled.div`
  margin-top: 0.5rem;
  color: var(--ma-gray-600);
  font-size: 0.9em;
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
  font-family: 'Inter';
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

/* ============================ */
// utils

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

function _makeFormInitialValues(rankingSettings, { optionsCategories, optionsCountingTypes }) {
  if (!rankingSettings) {
    return {
      type: 1,
      rankingName: "",
      categories: [],
      medalCountingType: null,
    };
  }

  return {
    type: rankingSettings.type || 1,
    rankingName: rankingSettings.groupCategoryName || "",
    categories: _checkCategoriesValue(optionsCategories, rankingSettings.listCategory) || [],
    medalCountingType:
      optionsCountingTypes.find((option) => option.value === rankingSettings.rulesRatingClub) ||
      null,
  };
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

function _makeShootRule(value, optionsCategories) {

  const makeShootRule = (option) => ({
    session: option.session,
    rambahan: option.rambahan,
    child_bow: option.arrow,
    category: _checkCategoriesValue(optionsCategories, option.categories) || [],
  });

  switch (value.implementAll) {
    case 0: {
      return value.shootRule.map(makeShootRule);
    }

    case 1: {
      return {
        session: value.session,
        rambahan: value.rambahan,
        child_bow: value.childBow,
        category: [],
      };
    }
  }
}

export { ScreenRules };
