import * as React from "react";
import styled from "styled-components";

import { BudrestNumberChooser } from "./budrest-number-chooser";

import IconAlertCircle from "components/ma/icons/mono/alert-circle";

import { getNumberFromBudrest } from "../utils";

function ListMemberBudrestsByCategory({ group, budrestList, budrestOptions }) {
  return (
    <div key={group.id}>
      <CategoryLabelHead>{group.label}</CategoryLabelHead>

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
    </div>
  );
}

const CategoryLabelHead = styled.div`
  padding: 1rem;
  background-color: var(--ma-primary-blue-50);
  font-weight: 600;
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
