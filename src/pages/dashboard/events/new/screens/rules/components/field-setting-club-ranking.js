import * as React from "react";
import styled from "styled-components";
import { useFormRankingSetting } from "../hooks/form-ranking-settings";
import { FieldInputTextSmall } from "pages/dashboard/events/components/form-fields";
import { SpinnerDotBlock } from "components/ma";
import { FieldSelectCategories } from "./field-select-categories";
import { SelectRadio } from "../../../components/select-radio";
import { FieldSelectOption } from "../../field-select-option";
import { useSubmitFormClubRank } from "../hooks/form-club-ranking";

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
    () =>
      _makeFormInitialValues(rankingSettings, {
        optionsCategories,
        optionsCountingTypes,
      }),
    [rankingSettings, optionsCategories, optionsCountingTypes]
  );

  const { data, errors, updateField, setType } =
    useFormRankingSetting(initialValues);

  const { type, rankingName, categories, medalCountingType } = data;

  useSubmitFormClubRank(data, form.setFormPemeringkatan);

  return (
    <SettingContainer>
      <SpacedVertical>
        <div>
          <h5>Aturan Pemeringkatan Klub</h5>
          <p>
            Pemeringkatan klub merupakan skor yang diperingkatkan berdasarkan
            perolehan skor dari masing-masing klub dan akan ditampilkan pada
            menu &#34;Pemeringkatan Klub&#34; pada tiap event. Anda dapat
            menampilkan semua kategori saja atau dapat mengatur kategori
            tertentu untuk ditampilkan.
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
                  {
                    value: 3,
                    label: "Gabungan dari Kategori Tertentu (Khusus)",
                  },
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
                      onChange={(ev) =>
                        updateField("rankingName", ev.target.value)
                      }
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
                    Kategori pemeringkatan klub akan ditampilkan satu-satu
                    sesuai kategori yang dipilih. Anda dapat memilih lebih dari
                    satu kategori untuk ditampilkan pada menu &#34;Pemeringkatan
                    Klub&#34;
                  </SubtleFieldNote>
                </div>

                <div>
                  <FieldSelectOption
                    label="Perhitungan Medali"
                    placeholder="Pilih opsi"
                    required
                    options={optionsCountingTypes}
                    value={medalCountingType}
                    onChange={(value) =>
                      updateField("medalCountingType", value)
                    }
                    errors={errors.medalCountingType}
                  />
                  <SubtleFieldNote>
                    Perhitungan medali pada kategori tertentu dapat
                    &#34;digabung&#34; atau &#34;dipisah&#34;. Dimana
                    &#34;digabung&#34; merupakan jumlah medali dari kategori
                    yang telah dipilih dan ditotalkan pada &#34;Semua
                    Kategori&#34;. Sedangkan &#34;dipisah&#34; merupakan medali
                    yang diperoleh dari masing-masing kategori dan tidak
                    dihitung / digabung pada &#34;Semua Kategori&#34;.
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

//styles

const SettingContainer = styled.div`
  padding: 1.25rem;
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
//end styles

// function or state
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

function _makeFormInitialValues(
  rankingSettings,
  { optionsCategories, optionsCountingTypes }
) {
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
    categories:
      _checkCategoriesValue(optionsCategories, rankingSettings.listCategory) ||
      [],
    medalCountingType:
      optionsCountingTypes.find(
        (option) => option.value === rankingSettings.rulesRatingClub
      ) || null,
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
// end function or state

export { SettingsClubsRanking };
