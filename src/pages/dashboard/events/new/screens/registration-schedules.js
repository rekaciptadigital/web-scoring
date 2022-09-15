import * as React from "react";
import styled from "styled-components";

import { Button } from "components/ma";
import { FieldInputDateTimeRange } from "../components/field-input-datetime-range";
import { FieldSettingToggleBar } from "../components/field-setting-toggle-bar";
import { FieldSelectOption } from "./field-select-option";
import { FieldInputDateRange } from "../components/field-input-date-range";

import IconPlus from "components/ma/icons/mono/plus";
import IconTrash from "components/ma/icons/mono/trash";

function ScreenRegistrationSchedules({
  eventDetail,
  // categories,
  // formSchedules,
  // schedulesProvider,
}) {
  eventDetail;
  // ubah ke action dari reducer-nya
  const [testDatetimeRange, setTestDatetimeRange] = React.useState({ start: null, end: null });
  const [testDatetimeRangeEvent, setTestDatetimeRangeEvent] = React.useState({
    start: null,
    end: null,
  });

  const [isSpecialSettingActive, setSpecialSettingActive] = React.useState(false);

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
                  isSpecialSettingActive &&
                  `Anda dapat membuat tanggal pendaftaran yang berbeda untuk individu, beregu, dan beregu campuran.`
                }
                info={
                  !isSpecialSettingActive && (
                    <React.Fragment>
                      Anda dapat membuat tanggal pendaftaran yang berbeda untuk individu, beregu,
                      dan beregu campuran.
                    </React.Fragment>
                  )
                }
                on={isSpecialSettingActive}
                onChange={() => setSpecialSettingActive((on) => !on)}
              />
            </VerticalSpaceBetween>

            {isSpecialSettingActive && <ScheduleGroupList />}
          </VerticalSpaceLoose>
        </Section>
      </VerticalSpaceLoose>
    </CardSheet>
  );
}

function ScheduleGroupList() {
  const [count, setCount] = React.useState(1);
  const items = [...new Array(count)].map((item, index) => index + 1);
  return (
    <VerticalSpaceLoose>
      {items.map((id) => (
        <Group key={id}>
          <SpecialScheduleEditor />

          <GroupAction>
            <Button
              flexible
              onClick={() => setCount((count) => (count > 1 ? count - 1 : count))}
              disabled={count <= 1}
            >
              <IconTrash size="12" />
            </Button>

            <Button flexible onClick={() => setCount((count) => count + 1)} disabled={count >= 3}>
              <IconPlus size="12" />
            </Button>
          </GroupAction>
        </Group>
      ))}
    </VerticalSpaceLoose>
  );
}

function SpecialScheduleEditor() {
  const [isSpecialCategoriesActive, setSpecialCategoriesActive] = React.useState(false);
  return (
    <InnerGroup>
      <VerticalSpaceLoose>
        <VerticalSpaceBetween>
          <EditorHeader>
            <FieldSelectOption
              label="Jenis Regu"
              name="team-category"
              placeholder="Pilih jenis regu"
            />
          </EditorHeader>

          <FieldInputDateRange
            labelStart="Mulai Pendaftaran"
            labelEnd="Tutup Pendaftaran"
            required
            daterange={{
              start: new Date("2022-09-10"),
              end: new Date(),
            }}
          />
        </VerticalSpaceBetween>

        <FieldSettingToggleBar
          label="Tetapkan Kategori Tertentu"
          title={
            isSpecialCategoriesActive &&
            `Pengaturan ini dapat membuat tanggal pendaftaran yang berbeda untuk satu kategori. Namun, jika tidak diaktifkan maka akan otomatis diterapkan untuk semua kategori (individu putra dan putri). Untuk kategori yang tidak dipilih pada menu ini, maka akan otomatis mengikuti "tanggal event" yang telah Anda atur di menu bagian atas.`
          }
          info={
            !isSpecialCategoriesActive && (
              <React.Fragment>
                Pengaturan ini dapat membuat tanggal pendaftaran yang berbeda untuk satu kategori.
                Namun, jika tidak diaktifkan maka akan otomatis diterapkan untuk semua kategori
                (individu putra dan putri). Untuk kategori yang tidak dipilih pada menu ini, maka
                akan otomatis mengikuti &quot;tanggal event&quot; yang telah Anda atur di menu
                bagian atas.
              </React.Fragment>
            )
          }
          on={isSpecialCategoriesActive}
          onChange={() => setSpecialCategoriesActive((on) => !on)}
        />

        {isSpecialCategoriesActive && (
          <PairedFields>
            <FieldSelectOption
              label="Kategori"
              name="category-details"
              placeholder="Pilih kategori"
            />

            <FieldInputDateRange
              labelStart="Mulai Pendaftaran"
              labelEnd="Tutup Pendaftaran"
              required
              daterange={{
                start: new Date("2022-09-10"),
                end: new Date(),
              }}
            />
          </PairedFields>
        )}
      </VerticalSpaceLoose>
    </InnerGroup>
  );
}

/* ======================================== */

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

export { ScreenRegistrationSchedules };
