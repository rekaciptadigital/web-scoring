import * as React from "react";
import styled from "styled-components";

import { useParams } from "react-router-dom";
import { useOfficialMembers } from "../../hooks/official-members";

function OfficialTable( {searchName} ) {
    const { event_id } = useParams();
    const eventId = event_id;

    const {
        data: officialMembers
    } = useOfficialMembers(eventId, searchName);

  return (
    <React.Fragment>
         <MembersTable className="table table-responsive">
            <thead>
              <tr>
                <th className="name">No.</th>
                <th className="name">Nama Official</th>
                <th className="name">Nama Klub</th>
                <th className="name">Email</th>
                <th className="name">Telepon</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {officialMembers?.member?.map((row) => {
                  return (
                      <tr key={row.userName}>
                        <td className="name">{row.sortNumber}</td>  
                        <td className="name">{row.userName}</td>
                        <td className="name">
                            <ClubName>{row.clubName}</ClubName>
                        </td>
                        <td className="name">
                            <ClubName>{row.email}</ClubName>
                        </td>
                        <td className="name">
                            <ClubName>{row.phoneNumber}</ClubName>
                        </td>
                      </tr>
                  );
                  })}
            </tbody>

          </MembersTable>

    </React.Fragment>
  )
}

function ClubName({ children, clubName }) {
    if (!children && !clubName) {
      return <GrayedOutText>&ndash;</GrayedOutText>;
    }
    return children || clubName;
  }

/* =============================== */
// styles


const GrayedOutText = styled.span`
  color: var(--ma-gray-400);
`;


const MembersTable = styled.table`
  text-align: center;

  thead {
    background-color: var(--ma-primary-blue-50);

    th {
      color: var(--ma-txt-black);
      font-weight: 600;

      &.name {
        text-align: left;
      }

      &.stats {
        text-align: right;
      }
    }
  }

  tbody td {
    vertical-align: middle;

    &.name {
      text-align: left;
    }

    &.stats {
      text-align: right;
    }
  }

  th,
  td {
    cursor: auto;
  }
`;

export { OfficialTable }