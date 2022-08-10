import * as React from "react";
import styled from "styled-components";

function OfficialTable( {officialMembers} ) {

  return (
    <React.Fragment>
         <MembersTable className="table table-responsive">
            <thead>
              <tr>
                <th className="name">Nama Official</th>
                <th className="name">Nama Klub</th>
                <th className="name">Email</th>
                <th className="name">Telepon</th>
                <th className="name">Status Pembayaran</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {officialMembers?.member?.map((row) => {
                  return (
                      <tr key={row?.expiredTime}>
                        <td className="name">{row?.userName}</td>
                        <td className="name">
                            <ClubName>{row?.clubName}</ClubName>
                        </td>
                        <td className="name">
                            <ClubName>{row?.email}</ClubName>
                        </td>
                        <td className="name">
                            <ClubName>{row?.phoneNumber}</ClubName>
                        </td>
                        <td>
                            {row?.statusLabel == 'Pending' ? (
                              <LabelPaymentYellow>{row?.statusLabel}</LabelPaymentYellow>
                            ) : row?.statusLabel == 'Lunas' ? (
                              <LabelPaymentGreen>{row?.statusLabel}</LabelPaymentGreen>
                            ) : <LabelPaymentYellow>{row?.statusLabel}</LabelPaymentYellow> }
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

const LabelPaymentYellow = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  color: #FFB420;
  background: #FFE8BA;
  border-radius: 30px;
  padding: 5px 10px 5px 10px;
`;

const LabelPaymentGreen = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  color: #05944F;
  background: #DAF0E3;
  border-radius: 30px;
  padding: 5px 10px 5px 10px;
`;


export { OfficialTable }