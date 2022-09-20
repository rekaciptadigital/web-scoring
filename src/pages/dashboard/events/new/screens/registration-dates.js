import * as React from "react";
import styled from "styled-components";

import { Button } from "components/ma";
import { FieldInputDateTimeRange } from "../components/field-input-datetime-range";
import { FieldSettingToggleBar } from "../components/field-setting-toggle-bar";
import { FieldSelectOption } from "./field-select-option";
import { FieldSelectMulti } from "./field-select-multi";
import { FieldInputDateRange } from "../components/field-input-date-range";

import IconPlus from "components/ma/icons/mono/plus";
import IconTrash from "components/ma/icons/mono/trash";

function ScreenRegistrationDates({ form }) {
  const { data: configForm, toggleActiveSetting } = form;

  // ubah ke action dari reducer-nya
  const [testDatetimeRange, setTestDatetimeRange] = React.useState({ start: null, end: null });
  const [testDatetimeRangeEvent, setTestDatetimeRangeEvent] = React.useState({
    start: null,
    end: null,
  });

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
              value={testDatetimeRange}
              onChange={setTestDatetimeRange}
              minDatetime={new Date()}
            />

            <FieldInputDateTimeRange
              labelStart={{ date: "Mulai Lomba", time: "Jam Mulai" }}
              labelEnd={{ date: "Akhir Lomba", time: "Jam Akhir" }}
              required
              value={testDatetimeRangeEvent}
              onChange={setTestDatetimeRangeEvent}
              minDatetime={testDatetimeRange.end || new Date()}
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
                      Anda dapat membuat tanggal pendaftaran yang berbeda untuk individu, beregu,
                      dan beregu campuran.
                    </React.Fragment>
                  ) : undefined
                }
                on={configForm.isActive}
                onChange={toggleActiveSetting}
              />
            </VerticalSpaceBetween>

            {configForm.isActive && <ScheduleGroupList form={form} />}
          </VerticalSpaceLoose>
        </Section>
      </VerticalSpaceLoose>
    </CardSheet>
  );
}

function ScheduleGroupList({ form }) {
  const {
    data,
    optionsTeamCategory,
    setTeamCategory,
    setDateRange,
    addConfig,
    removeConfig,
    toggleConfigByCategories,
    getOptionsCategoriesByTeam,
    setSpecialCategories,
  } = form;

  const hasEmptyTeam = data.configs.some((config) => !config.team?.value);

  return (
    <VerticalSpaceLoose>
      {data.configs.map((configItemForm, configIndex) => (
        <Group key={configItemForm.key}>
          <SpecialScheduleEditor
            form={configItemForm}
            optionsTeamCategory={optionsTeamCategory}
            onChangeTeamCategory={(option) => setTeamCategory(configIndex, option)}
            onChangeDateRange={(range) => setDateRange(configIndex, range)}
            onToggleConfigByCategories={() => toggleConfigByCategories(configIndex)}
            onChangeSpecialCategories={(options) => setSpecialCategories(configIndex, options)}
            getOptionsCategoriesByTeam={getOptionsCategoriesByTeam}
          />

          <GroupAction>
            <Button
              flexible
              disabled={data.configs.length <= 1}
              onClick={() => removeConfig(configIndex)}
            >
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

function SpecialScheduleEditor({
  form = {
    key: "",
    team: null,
    registrationDateStart: null,
    registrationDateEnd: null,
    isSpecialActive: false,
    categories: [],
  },
  optionsTeamCategory,
  onChangeTeamCategory,
  onChangeDateRange,
  onToggleConfigByCategories,
  onChangeSpecialCategories,
  getOptionsCategoriesByTeam,
}) {
  const optionsCategories = React.useMemo(
    () => getOptionsCategoriesByTeam(form.team?.value),
    [getOptionsCategoriesByTeam, form.team?.value]
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

          <FieldInputDateRange
            labelStart="Mulai Pendaftaran"
            labelEnd="Tutup Pendaftaran"
            required
            daterange={{
              start: form.registrationDateStart,
              end: form.registrationDateEnd,
            }}
            onChange={onChangeDateRange}
            disabled={form.isSpecialActive}
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
                Pengaturan ini dapat membuat tanggal pendaftaran yang berbeda untuk satu kategori.
                Namun, jika tidak diaktifkan maka akan otomatis diterapkan untuk semua kategori
                (individu putra dan putri). Untuk kategori yang tidak dipilih pada menu ini, maka
                akan otomatis mengikuti &quot;tanggal event&quot; yang telah Anda atur di menu
                bagian atas.
              </React.Fragment>
            ) : undefined
          }
          on={form.isSpecialActive}
          onChange={() => onToggleConfigByCategories()}
          disabled={!form.team}
        />

        {form.isSpecialActive && (
          <PairedFields>
            <FieldSelectMulti
              label="Kategori"
              name="category-details"
              placeholder="Pilih kategori"
              isClearable={false}
              options={optionsCategories}
              value={form.categories}
              onChange={onChangeSpecialCategories}
            />

            <FieldInputDateRange
              labelStart="Mulai Pendaftaran"
              labelEnd="Tutup Pendaftaran"
              required
              daterange={{
                start: form.registrationDateStart,
                end: form.registrationDateEnd,
              }}
              onChange={onChangeDateRange}
            />
          </PairedFields>
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

const PairedFields = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1.5rem 1rem;
`;

export { ScreenRegistrationDates };
