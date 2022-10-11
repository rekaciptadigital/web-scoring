import * as React from "react";
import styled from "styled-components";
import Switch from "react-switch";

import { useClubRankingSetting } from "./hooks/club-ranking-settings";
import { useFormRankingSetting } from "./hooks/form-ranking-settings";
import { useSubmitClubsRanking } from "./hooks/submit-clubs-ranking";

import { ButtonBlue, LoadingScreen, SpinnerDotBlock, AlertSubmitError, Button } from "components/ma";
import { toast } from "components/ma/processing-toast";
import { FieldInputText, FieldInputTextSmall, FieldSelect } from "pages/dashboard/events/components/form-fields";
import { SelectRadio } from "../../components/select-radio";
import { FieldSelectCategories } from "./components/field-select-categories";
import { FieldSelectOption } from "../field-select-option";
import IconPlus from "components/ma/icons/mono/plus";
import IconTrash from "components/ma/icons/mono/trash";

function ScreenRules({ eventDetail }) {
  return (
    <CardSheet>
      <Section>
        <SettingShootTheBoard eventDetail={eventDetail} />
      </Section>
      <Section>
        <SettingTargetFace eventDetail={eventDetail} />
      </Section>
      <Section>
        <SettingsClubsRanking eventDetail={eventDetail} />
      </Section>
    </CardSheet>
  );
}

function SettingShootTheBoard({ eventDetail }) {

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

  const [data, setData] = React.useState([{ data: 'rules' }])

  return (
    <SettingContainer>
      <SpacedVertical>
        <div>
          <h5>Aturan Menembak Perpani</h5>
          <p>
            Aturan dasar pertandingan panahan dari Perpani, yaitu setiap 1 sesi terdiri dari 6 rambahan dan tiap rambahan terdiri dari 7 anak panah. Anda dapat membuat aturan pertandingan yang berbeda dengan mengaktifkan pengaturan dibawah ini.
          </p>
        </div>
        <EarlyBirdActivationBar>
          <div>Aktifkan Event Private</div>
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
                    <h5>Aturan Menembak</h5>
                    <FourColumnsInputsGrid>
                      <FieldSelect options={numberKategori}><LabelRules>Jumlah Segi per Kategori</LabelRules></FieldSelect>
                      <FieldSelect options={numberRambahan}><LabelRules>Jumlah Rambahan</LabelRules></FieldSelect>
                      <FieldSelect options={numberRambahan}><LabelRules>Jumlah Anak Panah per-Rambahan</LabelRules></FieldSelect>
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
                  <Button flexible onClick={() => setData([...data, { data: 'rules' }])}><IconPlus size={12} /></Button><br />
                  <Button flexible onClick={() => setData(data.filter((el, i) => i !== index))}><IconTrash size={12} /></Button>
                </div>
              </CategoryBlock>
            ))}


          </SettingContentContainer>
        </Section>
      </SpacedVertical>
    </SettingContainer >
  )
}

function SettingTargetFace({ eventDetail }) {

  const numberKategori = [...new Array(12)].map((item, index) => {
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

  const [data, setData] = React.useState([{ data: 'rules' }])

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
                      <FieldSelect options={numberKategori}><LabelRules>Jumlah Ring pada Target Face</LabelRules></FieldSelect>
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
                  <Button flexible onClick={() => setData([...data, { data: 'rules' }])}><IconPlus size={12} /></Button><br />
                  <Button flexible onClick={() => setData(data.filter((el, i) => i !== index))}><IconTrash size={12} /></Button>
                </div>
              </CategoryBlock>
            ))}


          </SettingContentContainer>
        </Section>
      </SpacedVertical>
    </SettingContainer >
  )
}

function SettingsClubsRanking({ eventDetail }) {
  const {
    data: rankingSettings,
    isLoading,
    fetchRankingSetting,
  } = useClubRankingSetting(eventDetail?.id);

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

  const { data, errors, updateField, setType, handleValidation } =
    useFormRankingSetting(initialValues);
  const { type, rankingName, categories, medalCountingType } = data;

  const {
    submit,
    isLoading: isLoadingSubmit,
    isError: isErrorSubmit,
    errors: errorsSubmit,
  } = useSubmitClubsRanking(eventDetail?.id, data);

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

            <div>
              <BottomActions>
                <ButtonBlue
                  onClick={() =>
                    handleValidation({
                      onInvalid: (errors) => {
                        // TODO: ke depan bisa kasih toast untuk display pesan error
                        Object.values(errors).forEach((error) =>
                          error.forEach((message) => console.error(message))
                        );
                      },
                      onValid: () => {
                        submit({
                          onSuccess: () => {
                            toast.success("Pengaturan untuk Pemeringkatan Klub berhasil disimpan");
                            fetchRankingSetting();
                          },
                        });
                      },
                    })
                  }
                >
                  Simpan
                </ButtonBlue>
              </BottomActions>
            </div>
          </React.Fragment>
        )}
      </SpacedVertical>

      <LoadingScreen loading={isLoadingSubmit} />
      <AlertSubmitError isError={isErrorSubmit} errors={errorsSubmit} />
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

const BottomActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
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

export { ScreenRules };
