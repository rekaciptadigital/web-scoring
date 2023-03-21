import * as React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useBudrestNumbers } from "../hooks/budrest-numbers";
import { useSubmitBudrestNumber } from "../hooks/submit-budrest-number";

import { AlertSubmitError } from "components/ma";
import { LoadingScreen } from "pages/dashboard/events/new/components/loading-screen-portal";
import { toast } from "pages/dashboard/events/new/components/processing-toast";
import { BudrestNumberChooser } from "./budrest-number-chooser";

import IconAlertCircle from "components/ma/icons/mono/alert-circle";

import { getNumberFromBudrest } from "../utils";

const TOOLTIP_WARNING_TEXT = `Terdapat peserta dari klub yang
sama dalam satu bantalan. Silakan
ubah bantalan salah satu peserta.`;

function ListMemberBudrestsByCategory({
  group,
  budrestList,
  onChangeItem,
  isUpdatingData,
}) {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const categoryId = group.id;

  const {
    data: budrestNumbers,
    isLoading: isLoadingNumberList,
    fetchBudrestNumbers,
  } = useBudrestNumbers(eventId, categoryId);

  const isUpdating = isUpdatingData && budrestNumbers && isLoadingNumberList;

  // Di-memo dulu sebelum dioper ke komponen Select yang di-memo juga
  const optionsBudrestNumber = React.useMemo(() => {
    if (!budrestNumbers) {
      return [];
    }
    return budrestNumbers.map((numberItem) => ({
      label: numberItem.label,
      value: numberItem.label,
      isEmpty: numberItem.isEmpty,
    }));
  }, [budrestNumbers]);

  const {
    submit,
    isLoading: isLoadingSubmit,
    isError: isErrorSubmit,
    errors: errorsSubmit,
  } = useSubmitBudrestNumber(eventId);

  return (
    <div key={categoryId}>
      <LoadingScreen loading={isLoadingSubmit} />
      <AlertSubmitError isError={isErrorSubmit} errors={errorsSubmit} />
      <CategoryLabelHead>{group.label}</CategoryLabelHead>

      <ListMemberNumbers>
        {isUpdating && isLoadingNumberList && (
          <UpdateLoadingBlocker>Memperbarui data...</UpdateLoadingBlocker>
        )}
        <table className="table table-responsive">
          <thead>
            <tr>
              <th colSpan="2">Bantalan</th>
              <th>Nama</th>
              <th>Kontingen</th>
            </tr>
          </thead>

          <tbody>
            {budrestList.map((memberBudrest) => {
              // console.log("memberBudrest:", memberBudrest);
              return (
                <tr key={memberBudrest.key}>
                  {Boolean(memberBudrest.rowSpan) && (
                    <CenterCenterRow rowSpan={memberBudrest.rowSpan}>
                      <span>
                        {getNumberFromBudrest(memberBudrest.budRestNumber) ||
                          "-"}
                      </span>
                    </CenterCenterRow>
                  )}

                  <td>
                    <BudrestNumberChooser
                      options={optionsBudrestNumber}
                      selectedNumber={memberBudrest.budRestNumber}
                      onSubmit={(opt) => {
                        const params = {
                          categoryId: categoryId,
                          scheduleId: memberBudrest.scheduleFullDayId,
                          budrestNumber: opt.value,
                        };
                        submit(params, {
                          onSuccess() {
                            fetchBudrestNumbers();
                            onChangeItem?.();
                            toast.success("Berhasil menyimpan nomor bantalan");
                          },
                          onError() {
                            toast.error("Gagal menyimpan nomor bantalan");
                          },
                        });
                      }}
                    />
                  </td>
                  <RowTextInTheMiddle>{memberBudrest.name}</RowTextInTheMiddle>
                  <RowTextInTheMiddle>
                    {memberBudrest.hasSameClub ? (
                      <SpaceBetween>
                        <HighlightedText>
                          {/* {memberBudrest.withContingent
                            ? memberBudrest.cityName
                            : memberBudrest.clubName} */}
                          {memberBudrest.parentClassificationType == 1
                            ? memberBudrest.clubName
                            : memberBudrest.parentClassificationType == 2
                            ? memberBudrest.countryName
                            : memberBudrest.parentClassificationType == 3
                            ? memberBudrest.provinceName
                            : memberBudrest.parentClassificationType == 4
                            ? memberBudrest.cityName
                            : memberBudrest.childrenClassificationMembersName}
                        </HighlightedText>

                        <WarningIconWrapper title={TOOLTIP_WARNING_TEXT}>
                          <IconAlertCircle />
                        </WarningIconWrapper>
                      </SpaceBetween>
                    ) : (
                      <span>
                        {/* {memberBudrest.withContingent
                          ? memberBudrest.cityName
                          : memberBudrest.clubName} */}
                        {memberBudrest.parentClassificationType == 1
                          ? memberBudrest.clubName
                          : memberBudrest.parentClassificationType == 2
                          ? memberBudrest.countryName
                          : memberBudrest.parentClassificationType == 3
                          ? memberBudrest.provinceName
                          : memberBudrest.parentClassificationType == 4
                          ? memberBudrest.cityName
                          : memberBudrest.childrenClassificationMembersName}
                      </span>
                    )}
                  </RowTextInTheMiddle>
                </tr>
              );
            })}
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
