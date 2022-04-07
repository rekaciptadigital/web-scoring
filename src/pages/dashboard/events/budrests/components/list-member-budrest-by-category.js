import * as React from "react";
import styled from "styled-components";

import { BudrestNumberChooser } from "./budrest-number-chooser";

import { getNumberFromBudrest } from "../utils";

function ListMemberBudrestsByCategory({ group, budrestList }) {
  const options = React.useMemo(() => {
    return budrestList.map((item) => ({
      label: item.budRestNumber,
      value: item.budRestNumber,
    }));
  }, []);

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
                    options={options}
                    selectedNumber={memberBudrest.budRestNumber}
                  />
                </td>
                <RowTextInTheMiddle>{memberBudrest.name}</RowTextInTheMiddle>
                <RowTextInTheMiddle>{memberBudrest.clubName}</RowTextInTheMiddle>
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

export { ListMemberBudrestsByCategory };
