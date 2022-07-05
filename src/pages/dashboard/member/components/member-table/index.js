import * as React from "react";
import styled from "styled-components";
import { useScoringMembers } from "../../hooks/scoring-members";
import { LoadingScreen, SpinnerDotBlock, ButtonBlue, Button } from "components/ma";
import SweetAlert from "react-bootstrap-sweetalert";
import { Row, Col } from "reactstrap";
import { EventsService } from "services";
import logoUpdate from "../../../../../assets/images/myachery/update-category.png";

function MemberTable({ categoryDetail, searchName, eventId, isTeam }) {
  const {
    data: scoringMembers,
    isLoading: isLoadingScoringMembers,
    isError: isErrorScoringMembers,
  } = useScoringMembers({ categoryDetail, inputSearchQuery: searchName, eventId, isTeam });
  
  const [ isOpenAlert, setIsOpenAlert ] = React.useState(false);
  const [ dataCategories, setDataCategories ] = React.useState([]);
  const [ idParticipant, setIdParticipant ] = React.useState(0);
  const [ categoryId, setCategoryId ] = React.useState(0);
  const [ isUpdateCategory, setIsUpdateCategory ] =  React.useState(false);
  
  const isSettledScoringMembers = scoringMembers || (!scoringMembers && isErrorScoringMembers);

  const onConfirm = async (participantId) => {
    const { message, errors, data } = await EventsService.getAccessCategories({
      participant_id: participantId,
    });
    if (message === "Success") {
      setDataCategories(data);
      if (data) {
        setIsOpenAlert(true);
      }
    }
    console.info(errors);
  };

  const onCancel = () => {
    setIsOpenAlert(false);
  };

  const onUpdateCategory = async () => {
    const { message, errors } = await EventsService.updateCategory(null, {
      participant_id: idParticipant,
      category_id: categoryId,
    });
    if (message === "Success") {
      console.log("Update success");
      setIsUpdateCategory(true);
    }
    console.info(errors);
  };

  const onBackToList = () => {
    setIsUpdateCategory(false);
    window.location.reload();
  };

  if (!isSettledScoringMembers) {
    return <SpinnerDotBlock />;
  }

  if (!scoringMembers?.length) {
    return <EmptyMembers>Tidak ada peserta di kategori ini</EmptyMembers>;
  }

  return (
    <React.Fragment>
      <LoadingScreen />

      <TableContainer>
        <div style={{overflowX: 'auto'}}>
          <LoadingBlocker isLoading={isLoadingScoringMembers} />
          <MembersTable className="table table-responsive">
            <thead>
              <tr>
                {/* <th>No</th> */}
                <th className="name">Nama Peserta</th>
                <th className="name">Nama Klub</th>
                <th className="name">Kategori Lomba</th>
                <th className="name">Kelas</th>
                <th className="name">Email</th>
                <th className="name">Telepon</th>
                <th className="name">Status Pembayaran</th>
                <th className="name">...</th>
              </tr>
            </thead>

            <tbody>
              {scoringMembers?.map((row) => {
                return (
                  <tr key={row.participantId}>
                    {/* <td className="name">{row?.member?.No}</td> */}
                    <td className="name">{row?.member?.name}</td>
                    <td className="name">
                      <ClubName>{row?.member?.clubName}</ClubName>
                    </td>
                    <td className="name">
                      <ClubName>{row?.member?.competitionCategoryId}</ClubName>
                    </td>
                    <td className="name">
                      <ClubName>{row?.member?.clubName}</ClubName>
                    </td>
                    <td className="name">
                      <ClubName>{row?.member?.email}</ClubName>
                    </td>
                    <td className="name">
                      <ClubName>{row?.member?.phoneNumber}</ClubName>
                    </td>
                    <td>
                      {row?.member?.statusPayment === 'Gratis' ? (
                      <>
                        <span
                          className="py-1 px-2"
                          style={{ color: "#05944F", backgroundColor: "#DAF0E3", borderRadius: "25px" }}
                        >
                          {row.statusPayment}
                        </span>
                      </>      
                      ) : row?.member?.statusPayment === 'Belum Lunas' ? (
                        <>
                        <span
                          className="py-1 px-2"
                          style={{ color: "#FFB420", backgroundColor: "#FFE8BA", borderRadius: "25px" }}
                        >
                          {row.statusPayment}
                        </span>
                      </>
                      ) : row?.member?.statusPayment === 'Expired' ? (
                        <>
                        <span
                          className="py-1 px-2"
                          style={{ color: "#FFB420", backgroundColor: "#AFAFAF", borderRadius: "25px" }}
                        >
                          {row.statusPayment}
                        </span>
                      </>
                      ) : row?.member?.statusPayment === 'Lunas' && (
                        <>
                          <span
                            className="py-1 px-2"
                            style={{ color: "#05944F", backgroundColor: "#DAF0E3", borderRadius: "25px" }}
                          >
                            {row.statusPayment}
                          </span>
                        </>      
                        )}
                    </td>
                    
                    <td>
                      {row?.member?.statusPayment === 'Lunas' ? (
                        <>
                        <ButtonAtur
                          onClick={() => {
                            onConfirm(row?.member?.participantId);
                            setIdParticipant(row?.member?.participantId);
                          }}
                          className="py-2 px-2"
                        >
                          Detail
                        </ButtonAtur>
                        </>
                      ) : (
                        <>
                          <ButtonAturDisabled className="py-2 px-2">Atur Kategori</ButtonAturDisabled>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </MembersTable>
        </div>

        
      </TableContainer>

      <SweetAlert
          show={isOpenAlert}
          title=""
          onConfirm={() => {}}
          custom
          style={{ width: 1100, borderRadius: "1.25rem" }}
          customButtons={
            <span className="d-flex justify-content-end" style={{ gap: "0.5rem", width: "100%" }}>
              <Button onClick={onCancel} style={{ color: "var(--ma-blue)" }}>
                Batal
              </Button>
              <ButtonBlue onClick={onUpdateCategory}>Ubah</ButtonBlue>
            </span>
          }
        >
          <div style={{ textAlign: "start" }}>
            <span>Kategori Lomba</span>
            <br />
            <span>Silakan pilih salah satu kategori lomba</span>
          </div>
          <div style={{ height: "500px", overflowY: "auto", overflowX: "hidden" }}>
            <Row>
              {dataCategories.map((catagory) => {
                return (
                  <Col key={catagory.id} md={4}>
                    <div
                      onClick={() => setCategoryId(catagory.id)}
                      className="py-4 ps-2 mt-3"
                      style={{
                        border: "1px solid #E2E2E2",
                        borderRadius: "5px",
                        textAlign: "start",
                        cursor: "pointer",
                        backgroundColor: `${
                          catagory.id === categoryId ? "#E7EDF6" : "#FFF"
                        }`,
                      }}
                    >
                      <span style={{ fontSize: "18px", fontWeight: "600" }}>
                        {catagory.labelCategory}
                      </span>
                      <div className="mt-3">
                        <span
                          className="px-2 py-1"
                          style={{ backgroundColor: "#AEDDC2", borderRadius: "25px" }}
                        >
                          Sisa kuota 0 dari {catagory.quota}
                        </span>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        </SweetAlert>
        <SweetAlert
          show={isUpdateCategory}
          title=""
          onConfirm={() => {}}
          custom
          style={{ width: 740, borderRadius: "1.25rem" }}
          customButtons={
            <span
              className="d-flex justify-content-center"
              style={{ gap: "0.5rem", width: "100%" }}
            >
              <ButtonBlue onClick={onBackToList}>Lanjut ke Data Peserta</ButtonBlue>
            </span>
          }
        >
          <div>
            <div>
              <img src={logoUpdate} />
            </div>
            <div>
              <span style={{ fontWeight: "600", fontSize: "18px" }}>
                Atur Kategori Peserta Berhasil
              </span>
              <br />
              <span>Data kategori peserta telah diubah</span>
            </div>
          </div>
        </SweetAlert>

    </React.Fragment>
  );
}


function ClubName({ children, clubName }) {
  if (!children && !clubName) {
    return <GrayedOutText>&ndash;</GrayedOutText>;
  }
  return children || clubName;
}

function LoadingBlocker({ isLoading = true }) {
  if (!isLoading) {
    return null;
  }
  return (
    <LoadingContainer>
      <SpinnerDotBlock />
    </LoadingContainer>
  );
}

/* =============================== */
// styles

const GrayedOutText = styled.span`
  color: var(--ma-gray-400);
`;

const EmptyMembers = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 12rem;
  border: solid 1px var(--ma-gray-50);
  border-radius: 0.5rem;
  color: var(--ma-gray-400);
  font-weight: 600;
`;

const TableContainer = styled.div`
  position: relative;
  display: flex;

  > *:first-child {
    flex-grow: 1;
  }

  > *:last-child {
    flex-shrink: 0;
  }

  .row-active {
    position: sticky;
    top: var(--ma-header-height);
    bottom: 0;
    background-color: var(--ma-gray-50);
    transition: all 0.15s;
  }
`;

const MembersTable = styled.table`
  text-align: center;
  width: 1140px;

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

const LoadingContainer = styled.div`
  position: absolute;
  z-index: 100;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.6);
`;

const ButtonAtur = styled.span`
  cursor: pointer;
  color: #0d47a1;
  border: #0d47a1 1px solid;
  border-radius: 25px;
  font-weight: 600;
  &:hover {
    background-color: #0d47a1;
    color: #fff;
    border: #0d47a1 1px solid;
  }
`;

const ButtonAturDisabled = styled.span`
  cursor: not-allowed;
  color: #cccccc;
  border: #395d92 1px solid;
  border-radius: 25px;
  font-weight: 600;
  background-color: #395d92;
 
`;

export { MemberTable };
