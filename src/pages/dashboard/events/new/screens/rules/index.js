import * as React from "react";
import styled from "styled-components";
import { SettingShootTheBoard } from "./components/field-setting-shoot-the-board";
import { SettingsClubsRanking } from "./components/field-setting-club-ranking";

function ScreenRules({ eventDetail, form, shootSetting, rankingSettings }) {
  return (
    <CardSheet>
      <Section>
        <SettingShootTheBoard
          eventDetail={eventDetail}
          form={form}
          shootSettings={shootSetting}
        />
      </Section>
      <Section>
        <SettingsClubsRanking
          eventDetail={eventDetail}
          form={form}
          rankingSettings={rankingSettings}
        />
      </Section>
    </CardSheet>
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
  margin-bottom: 10px;
`;

export { ScreenRules };
