import * as React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useSubmitBudrestNumber } from "../hooks/submit-budrest-number";

import { AlertSubmitError } from "components/ma";
import { LoadingScreen } from "pages/dashboard/events/new/components/loading-screen-portal";
import { toast } from "pages/dashboard/events/new/components/processing-toast";
import { BudrestNumberChooser } from "./budrest-number-chooser";

import IconAlertCircle from "components/ma/icons/mono/alert-circle";

import { getNumberFromBudrest } from "../utils";

function ListMemberBudrestsByCategory({
  group,
  budrestList,
  budrestOptions,
  onChangeItem,
  isUpdatingData,
}) {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const {
    submit,
    isLoading: isLoadingSubmit,
    isError: isErrorSubmit,
    errors: errorsSubmit,
  } = useSubmitBudrestNumber(eventId);

  return (
    <div key={group.id}>
      <LoadingScreen loading={isLoadingSubmit} />
      <AlertSubmitError isError={isErrorSubmit} errors={errorsSubmit} />
      <CategoryLabelHead>{group.label}</CategoryLabelHead>

      <ListMemberNumbers>
        {isUpdatingData && <UpdateLoadingBlocker>Memperbarui data...</UpdateLoadingBlocker>}
        <table className="table table-responsive">
          <thead>
            <tr>
              <th colSpan="2">Bantalan</th>
              <th>Nama</th>
              <th>Klub</th>
            </tr>
          </thead>

          <tbody>
            {budrestList.map((memberBudrest) => (
              <React.Fragment key={memberBudrest.budRestNumber}>
                <tr>
                  {Boolean(memberBudrest.rowSpan) && (
                    <CenterCenterRow rowSpan={memberBudrest.rowSpan}>
                      <span>{getNumberFromBudrest(memberBudrest.budRestNumber)}</span>
                    </CenterCenterRow>
                  )}

                  <td>
                    <BudrestNumberChooser
                      options={budrestOptions}
                      selectedNumber={memberBudrest.budRestNumber}
                      onSubmit={(opt) => {
                        const params = {
                          scheduleId: memberBudrest.scheduleFullDayId,
                          budrestNumber: opt.value,
                        };

                        submit(params, {
                          onSuccess() {
                            onChangeItem?.();
                            toast.success("Berhasil menyimpan nomor bantalan");
                          },
                        });
                      }}
                    />
                  </td>
                  <RowTextInTheMiddle>{memberBudrest.name}</RowTextInTheMiddle>
                  <RowTextInTheMiddle>
                    {memberBudrest.hasSameClub ? (
                      <SpaceBetween>
                        <HighlightedText>{memberBudrest.clubName}</HighlightedText>

                        <WarningIconWrapper>
                          <IconAlertCircle />
                        </WarningIconWrapper>
                      </SpaceBetween>
                    ) : (
                      <span>{memberBudrest.clubName}</span>
                    )}
                  </RowTextInTheMiddle>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </ListMemberNumbers>
    </div>
  );
}

const CategoryLabelHead = styled.div`
  padding: 1rem;
  background-color: var(--ma-primary-blue-50);
  font-weight: 600;
`;

const ListMemberNumbers = styled.div`
  position: relative;
`;

const UpdateLoadingBlocker = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.625);
`;

const CenterCenterRow = styled.td`
  text-align: center;
  vertical-align: middle;
`;

const RowTextInTheMiddle = styled.td`
  vertical-align: middle;
`;

const SpaceBetween = styled.span`
  display: flex;
  justify-content: space-between;
`;

const HighlightedText = styled.span`
  /* TODO: kasih warna "stabilo" (kuning) kalau nanti perlu */
  background-color: none;
`;

const WarningIconWrapper = styled.span`
  color: var(--ma-yellow);
`;

export { ListMemberBudrestsByCategory };
