import * as React from "react";
import styled from "styled-components";

import { Button } from "components/ma";
import { FieldInputDateTimeRange } from "../components/field-input-datetime-range";
import { FieldSettingToggleBar } from "../components/field-setting-toggle-bar";
import { FieldSelectOption } from "./field-select-option";
import { FieldSelectMulti } from "./field-select-multi";

import IconPlus from "components/ma/icons/mono/plus";
import IconTrash from "components/ma/icons/mono/trash";
// import FieldInputClasification from "./components/field-input-clasification";

function ScreenRegistrationDates({ form }) {
  const {
    data: configForm,
    toggleActiveSetting,
    initForm,
    updateFields,
  } = form;

  const rangeRegistration = {
    start: configForm.registrationDateStart,
    end: configForm.registrationDateEnd,
  };

  const rangeEvent = {
    start: configForm.eventDateStart,
    end: configForm.eventDateEnd,
  };
  console.log("rangeEvent:", rangeEvent);

  // Reset form tiap meninggalkan screen step ini
  React.useEffect(() => {
    return () => initForm();
  }, []);

  return (
    <CardSheet>
      <VerticalSpaceLoose>
        <Section>
          <VerticalSpaceBetween>
            <h5>Tanggal Pendaftaran</h5>

            <FieldInputDateTimeRange
              labelStart={{ date: "Mulai Pendaftaran", time: "Jam Buka" }}
              labelEnd={{ date: "Tutup Pendaftaran", time: "Jam Tutup" }}
              required
              value={rangeRegistration}
              onChange={(range) => {
                updateFields({
                  registrationDateStart: range.start,
                  registrationDateEnd: range.end,
                });
              }}
              minDatetime={new Date()}
            />

            <FieldInputDateTimeRange
              labelStart={{ date: "Mulai Lomba", time: "Jam Mulai" }}
              labelEnd={{ date: "Akhir Lomba", time: "Jam Akhir" }}
              required
              value={rangeEvent}
              onChange={(range) => {
                updateFields({
                  eventDateStart: range.start,
                  eventDateEnd: range.end,
                });
              }}
              minDatetime={rangeRegistration.end || new Date()}
            />
          </VerticalSpaceBetween>
        </Section>

        <Section>
          <VerticalSpaceLoose>
            <VerticalSpaceBetween>
              <h5>Tanggal Pendaftaran Khusus</h5>

              <FieldSettingToggleBar
                label="Tetapkan Tanggal Pendaftaran Khusus"
                title={
                  configForm.isActive
                    ? `Anda dapat membuat tanggal pendaftaran yang berbeda untuk individu, beregu, dan beregu campuran.`
                    : undefined
                }
                info={
                  !configForm.isActive ? (
                    <React.Fragment>
                      Anda dapat membuat tanggal pendaftaran yang berbeda untuk
                      individu, beregu, dan beregu campuran.
                    </React.Fragment>
                  ) : undefined
                }
                on={configForm.isActive}
                onChange={toggleActiveSetting}
              />
            </VerticalSpaceBetween>

            {configForm.isActive && <ConfigGroupList form={form} />}
          </VerticalSpaceLoose>
        </Section>

        {/* <Section>
          <VerticalSpaceLoose>
            <VerticalSpaceBetween>
              <h5>Klasifikasi Peserta</h5>
              <FieldInputClasification />
            </VerticalSpaceBetween>
          </VerticalSpaceLoose>
        </Section> */}
      </VerticalSpaceLoose>
    </CardSheet>
  );
}

function ConfigGroupList({ form }) {
  const {
    data,
    optionsTeamCategory,
    setTeamCategory,
    setDateRange,
    addConfig,
    removeConfig,
    toggleConfigByCategories,
    addCategoryConfig,
    removeCategoryConfig,
    getOptionsCategoryPairByGroupId,
    setSpecialCategories,
    setDateRangeCategory,
  } = form;

  const hasEmptyTeam =
    data.configs?.some((config) => !config.team?.value) || false;

  return (
    <VerticalSpaceLoose>
      {data.configs.map((configItemForm, configIndex) => (
        <Group key={configItemForm.key}>
          <ConfigEditor
            form={configItemForm}
            optionsTeamCategory={optionsTeamCategory}
            onChangeTeamCategory={(option) =>
              setTeamCategory(configIndex, option)
            }
            onChangeDateRange={(range) => setDateRange(configIndex, range)}
            onToggleConfigByCategories={() =>
              toggleConfigByCategories(configIndex)
            }
            onAddCategoryConfig={() => addCategoryConfig(configIndex)}
            onRemoveCategoryConfig={(childIndex) =>
              removeCategoryConfig(configIndex, childIndex)
            }
            optionsCategoryPair={getOptionsCategoryPairByGroupId(
              configItemForm.team?.value,
              configIndex
            )}
            onChangeSpecialCategories={(childIndex, options) => {
              setSpecialCategories(configIndex, childIndex, options);
            }}
            onChangeDateRangeCategory={(childIndex, range) => {
              setDateRangeCategory(configIndex, childIndex, range);
            }}
          />

          <GroupAction>
            <Button flexible onClick={() => removeConfig(configIndex)}>
              <IconTrash size="12" />
            </Button>

            <Button
              flexible
              disabled={!optionsTeamCategory.length || hasEmptyTeam}
              onClick={addConfig}
              title={
                !optionsTeamCategory.length
                  ? "Semua regu sudah diatur"
                  : hasEmptyTeam
                  ? "Tidak dapat menambah ketika belum pilih regu untuk bagian ini"
                  : undefined
              }
            >
              <IconPlus size="12" />
            </Button>
          </GroupAction>
        </Group>
      ))}
    </VerticalSpaceLoose>
  );
}

function ConfigEditor({
  form = {
    key: "",
    team: null,
    start: null,
    end: null,
    isSpecialActive: false,
    categories: [],
  },
  optionsTeamCategory,
  onChangeTeamCategory,
  onChangeDateRange,
  onToggleConfigByCategories,
  onChangeSpecialCategories,
  optionsCategoryPair,
  onAddCategoryConfig,
  onRemoveCategoryConfig,
  onChangeDateRangeCategory,
}) {
  const hasEmptyCategories = form.categories.some(
    (config) => !config.categories?.length
  );
  return (
    <InnerGroup>
      <VerticalSpaceLoose>
        <VerticalSpaceBetween>
          <EditorHeader>
            {!form.team ? (
              <FieldSelectOption
                label="Jenis Regu"
                required
                name="team-category"
                placeholder="Pilih jenis regu"
                options={optionsTeamCategory}
                value={form.team}
                onChange={onChangeTeamCategory}
              />
            ) : (
              <div>
                <p>Jenis Regu</p>
                <h5>{form.team.label}</h5>
              </div>
            )}
          </EditorHeader>

          <FieldInputDateTimeRange
            labelStart={{ date: "Mulai Pendaftaran", time: "Jam Buka" }}
            labelEnd={{ date: "Tutup Pendaftaran", time: "Jam Tutup" }}
            required={!form.isSpecialActive}
            disabled={form.isSpecialActive}
            value={
              !form.isSpecialActive
                ? { start: form.start, end: form.end }
                : undefined
            }
            onChange={onChangeDateRange}
          />
        </VerticalSpaceBetween>

        <FieldSettingToggleBar
          label={
            form.team ? (
              "Tetapkan Kategori Tertentu"
            ) : (
              <React.Fragment>
                Isi <strong>Jenis Regu</strong> untuk mengatur kategori tertentu
              </React.Fragment>
            )
          }
          title={
            form.isSpecialActive
              ? `Pengaturan ini dapat membuat tanggal pendaftaran yang berbeda untuk satu kategori. Namun, jika tidak diaktifkan maka akan otomatis diterapkan untuk semua kategori (individu putra dan putri). Untuk kategori yang tidak dipilih pada menu ini, maka akan otomatis mengikuti "tanggal event" yang telah Anda atur di menu bagian atas.`
              : undefined
          }
          info={
            !form.isSpecialActive ? (
              <React.Fragment>
                Pengaturan ini dapat membuat tanggal pendaftaran yang berbeda
                untuk satu kategori. Namun, jika tidak diaktifkan maka akan
                otomatis diterapkan untuk semua kategori (individu putra dan
                putri). Untuk kategori yang tidak dipilih pada menu ini, maka
                akan otomatis mengikuti &quot;tanggal event&quot; yang telah
                Anda atur di menu bagian atas.
              </React.Fragment>
            ) : undefined
          }
          on={form.isSpecialActive}
          onChange={() => onToggleConfigByCategories?.()}
          disabled={!form.team}
        />

        {form.isSpecialActive && (
          <VerticalSpaceLoose>
            {form.categories.map((item, itemIndex) => (
              <GroupCategoryEditor key={item.key}>
                <VerticalSpaceBetween>
                  <FieldSelectMulti
                    label="Kategori"
                    name="category-details"
                    required
                    placeholder="Pilih kategori"
                    isClearable={false}
                    options={optionsCategoryPair}
                    value={item.categories}
                    onChange={(option) =>
                      onChangeSpecialCategories?.(itemIndex, option)
                    }
                  />

                  <FieldInputDateTimeRange
                    labelStart={{ date: "Mulai Pendaftaran", time: "Jam Buka" }}
                    labelEnd={{ date: "Tutup Pendaftaran", time: "Jam Tutup" }}
                    required
                    value={{ start: item.start, end: item.end }}
                    onChange={(range) =>
                      onChangeDateRangeCategory?.(itemIndex, range)
                    }
                  />
                </VerticalSpaceBetween>

                <GroupAction>
                  <Button
                    flexible
                    onClick={() => onRemoveCategoryConfig?.(itemIndex)}
                  >
                    <IconTrash size="12" />
                  </Button>

                  <Button
                    flexible
                    onClick={() => onAddCategoryConfig?.(itemIndex)}
                    disabled={
                      !optionsCategoryPair?.length || hasEmptyCategories
                    }
                    title={
                      !optionsCategoryPair?.length
                        ? "Semua kategori telah diatur"
                        : undefined
                    }
                  >
                    <IconPlus size="12" />
                  </Button>
                </GroupAction>
              </GroupCategoryEditor>
            ))}
          </VerticalSpaceLoose>
        )}
      </VerticalSpaceLoose>
    </InnerGroup>
  );
}

/* ======================== */
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

const VerticalSpaceLoose = styled.div`
  > * + * {
    margin-top: 2.5rem;
  }
`;

const VerticalSpaceBetween = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`;

const Section = styled.div`
  padding: 1.25rem;
  border: 1px solid var(--ma-gray-200);
  border-radius: 0.5rem;
`;

const Group = styled.div`
  display: flex;
  gap: 1rem;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
  }
`;

const InnerGroup = styled.div`
  padding: 0.75rem;
  padding-bottom: 1.5rem;
  border: 1px solid var(--ma-gray-100);
  border-radius: 0.5rem;

  min-height: 100px;
`;

const GroupAction = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const EditorHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 1.5rem 1rem;
`;

const GroupCategoryEditor = styled.div`
  display: flex;
  gap: 0.5rem;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 1;
  }
`;

export { ScreenRegistrationDates };
