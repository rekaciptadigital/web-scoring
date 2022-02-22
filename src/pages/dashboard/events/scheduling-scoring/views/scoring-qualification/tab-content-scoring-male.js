import * as React from "react";
import styled from "styled-components";

import { LoadingScreen } from "components";
import { ButtonOutlineBlue } from "components/ma";
import { FolderPanel } from "../../components";
import { ScoringEditor } from "./scoring-editor";
import { FieldSelectCategory } from "./field-select-category";

import IconDownload from "components/ma/icons/mono/download";

function createMockListData(counts) {
  return [...new Array(counts)].map((item, index) => ({
    id: index + 1,
    schedule_id: index + 3,
    member_number: "X-XX", // ? not sure
    member: { id: index + 7, name: "Nama pesertanya" },
    club: { id: index + 11, name: "Kelelep" },
    budRestNo: "1A", // terisi setelah diinput skornya
    total: 10, // terisi setelah diinput skornya
    xCounts: 10, // terisi setelah diinput skornya
    x10Counts: 11, // terisi setelah diinput skornya
  }));
}

const FakeService = {};
FakeService.getEventMemberSchedules = function (params) {
  // "/api/xxx/scoring-event-category-schedules?teamCategoryId=individu male"
  // expected:
  // - schedule ID
  // - bantalan, kalau udah diisi/diset skornya

  // - No. Peserta
  // - Bantalan
  // - Nama
  // - Klub
  // - Total
  // - X
  // - X+10
  const data = createMockListData(3);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data, params });
    }, 800);
  });
};

function memberSchedulesReducer(state, action) {
  if (action.type === "REFETCH") {
    return { ...state, attempts: state.attempts + 1 };
  }
  return { ...state, ...action };
}

function useMemberSchedules() {
  const [state, dispatch] = React.useReducer(memberSchedulesReducer, {
    status: "idle",
    data: null,
    errors: null,
    attempts: 1,
  });
  const { attempts } = state;

  const refetch = () => dispatch({ type: "REFETCH" });

  const params = {
    teamCategoryId: "individu male", // "individu male" || "individu female"
  };

  React.useEffect(() => {
    const fetchData = async () => {
      dispatch({ status: "loading", errors: null });
      // TODO: ganti ke service beneran
      const result = await FakeService.getEventMemberSchedules(params);
      if (result.success) {
        dispatch({ status: "success", data: result.data });
      } else {
        dispatch({ status: "error", errors: result.errors || result.message });
      }
    };
    fetchData();
  }, [attempts]);

  return { ...state, rawState: state, refetch, params: params };
}

function TabContentScoringMale() {
  const {
    data: memberSchedules,
    rawState: memberSchedulesState,
    refetch: refetchMemberSchedules,
  } = useMemberSchedules();
  const isLoadingMemberSchedules = memberSchedulesState.status === "loading";
  const isInitMemberSchedules = !memberSchedules && isLoadingMemberSchedules;
  const isErrorMemberSchedules = memberSchedulesState.status === "error";
  const isRefetchingMemberSchedules = memberSchedules && isLoadingMemberSchedules;

  return (
    <FolderPanel>
      <TopToolbar>
        <div>
          <FieldSelectCategory
            placeholder="Kategori"
            value={{ value: 1, label: "Default ke - Kategori - Urutan Pertama" }}
          >
            Kategori
          </FieldSelectCategory>
        </div>

        <SpacedButtonsGroup>
          <ButtonDownload onClick={() => refetchMemberSchedules()}>
            <span>
              <IconDownload size="16" />
            </span>
            <span>Scoresheet</span>
          </ButtonDownload>
        </SpacedButtonsGroup>
      </TopToolbar>

      {isInitMemberSchedules ? (
        <div>Sedang memuat data skoring...</div>
      ) : memberSchedules?.length > 0 ? (
        <table className="table table-responsive">
          <thead>
            <tr>
              <THMember>No. Peserta</THMember>
              <THMember>Bantalan</THMember>
              <THMember>Nama</THMember>
              <THMember>Klub</THMember>
              <THMember>Total</THMember>
              <THMember>X</THMember>
              <THMember>X+10</THMember>
              <THMember>&nbsp;</THMember>
            </tr>
          </thead>

          <tbody>
            {memberSchedules.map((member, index) => (
              <tr key={index}>
                <td>{member.member_number}</td>
                <td>{member.budRestNo}</td>
                <td>{member.member.name}</td>
                <td>{member.club.name}</td>
                <td>{member.total}</td>
                <td>{member.xCounts}</td>
                <td>{member.x10Counts}</td>

                <TDTableButtons>
                  <ScoringEditor id={member.schedule_id} data={member} />
                </TDTableButtons>
              </tr>
            ))}
          </tbody>
        </table>
      ) : memberSchedules?.length === 0 ? (
        <div>Belum ada data skoring.</div>
      ) : isErrorMemberSchedules ? (
        <div>Error mengambil data skoring kualifikasi</div>
      ) : (
        <div>
          Ada error yang tidak diketahui. Silakan coba lagi beberapa saat lagi, atau hubungi
          teknikal support.
        </div>
      )}

      <LoadingScreen loading={isRefetchingMemberSchedules} />
    </FolderPanel>
  );
}

const TopToolbar = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;

  > *:first-child {
    flex: 1 1 0%;

    > * {
      max-width: 18.75rem;
    }
  }
`;

const ButtonDownload = styled(ButtonOutlineBlue)`
  > span:first-of-type {
    margin-right: 0.5rem;
  }
`;

const SpacedButtonsGroup = styled.div`
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: flex-start;
`;

const THMember = styled.th`
  text-transform: uppercase;
`;

const TDTableButtons = styled.td`
  width: 1.875rem;
`;

export { TabContentScoringMale };
