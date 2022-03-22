import React, { useState, useEffect } from "react";
import { MetaTags } from "react-meta-tags";
import { Container, Button, Col, Row, Input } from "reactstrap";
// import { SelectInput } from "components";
import TableMember from "./components/TableMember";
import { EventsService } from "services";
import { useParams } from "react-router-dom";
import Download from "components/icons/Download";
import fileSaver from "file-saver";
import { errorsUtil } from "utils";
import { AlertSubmitError } from "components/ma";
import { BreadcrumbDashboard } from "../events/components/breadcrumb";

function ListMember() {
  const { event_id } = useParams();
  const [, setEventDetail] = useState({});
  const [members, setMembers] = useState([]);
  const [dataMembers, setDataMembers] = useState([]);
  const [category, setCategory] = useState({});
  const [statusFilter, setStatusFilter] = useState(0);
  const [dataExcel, setDataExcel] = useState();
  const [errorsIdCard, setErrorsIdCard] = useState(null);
  const [waitIdCard, setWaitIdCard] = useState(false);

  useEffect(async () => {
    try {
      const { data, errors, success, message } = await EventsService.getEventById({ id: event_id });
      if (success) {
        if (data) {
          setEventDetail(data);
          // getMember(data.flatCategories[0]);
          let payload = {
            ...data.eventCategories[0],
            id: data.eventCategories[0].categoryDetailsId,
            label: `${data.eventCategories[0].teamCategoryId.label}-${data.eventCategories[0].ageCategoryId.label}-${data.eventCategories[0].competitionCategoryId.label}-${data.eventCategories[0].distanceId.label} (${data.eventCategories[0].totalParticipant}/${data.eventCategories[0].quota})`,
          };

          getMember(payload);
        }
      } else {
        console.log(message, errors);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getEventLaporan = async () => {
    try {
      const { data, message } = await EventsService.getEventLaporan({
        event_id: event_id,
        status_id: 1,
      });
      if (message === "Success") {
        setDataExcel(data);
      }
      console.error(message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEventLaporan();
  }, []);

  const setMemberMap = (data, payload, status) => {
    setCategory(payload);
    setStatusFilter(status);
    let m = [];
    if (!dataMembers[payload.id + "-" + status]) {
      dataMembers[payload.id + "-" + status] = data;
      setDataMembers(dataMembers);
    }
    let no = 0;
    data.list.map((d) => {
      no = no + 1;
      m.push({
        id: d.member.id,
        no: no,
        name: d.member.name,
        email: d.email,
        telepon: d.phoneNumber,
        club: d.club,
        age: d.member.club,
        gender: d.member.gender,
        status: d.status,
        statusLabel: d.statusLabel,
      });
    });
    setMembers(m);
  };
  const getMember = async (payload, status = 0) => {
    try {
      if (dataMembers[payload.id + "-" + status]) {
        return await setMemberMap(dataMembers[payload.id + "-" + status], payload, status);
      }
      const { data, errors, success, message } = await EventsService.getEventMember({
        id: event_id,
        competition_category_id: payload.competitionCategoryId.id,
        team_category_id: payload.teamCategoryId.id,
        age_category_id: payload.ageCategoryId.id,
        category_id: payload.categoryDetailsId,
        status: status,
      });
      if (success) {
        if (data) {
          setMemberMap(data, payload, status);
        }
      } else {
        console.log(message, errors);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadIdCard = async () => {
    setErrorsIdCard(null);
    setWaitIdCard(true);
    const queryString = { event_category_id: category.id, event_id: event_id };
    const result = await EventsService.getEventMemberIdCardByCategory(queryString);
    if (result.success) {
      const { fileName, fileBase64 } = result.data;
      fileSaver.saveAs(fileBase64, fileName || "id-cards-peserta.pdf");
    } else {
      setErrorsIdCard(errorsUtil.interpretServerErrors(result));
    }
    setWaitIdCard(false);
  };

  return (
    <React.Fragment>
      <div>
        <MetaTags>
          <title>Dashboard | List - Member</title>
        </MetaTags>
        <Container fluid>
          <BreadcrumbDashboard to={`/dashboard/event/${event_id}/home`}>
            Peserta Individu
          </BreadcrumbDashboard>

          <div>
            <div className="mb-4">
              <Row>
                <Col
                  md={2}
                  sm={12}
                  style={{ textAlign: "center", borderBottom: "2px solid #FFB420" }}
                >
                  <span
                    onClick={() => getMember(category, 0)}
                    color={statusFilter == 0 ? "dark" : "outline-dark"}
                  >
                    Semua
                  </span>
                </Col>
                <Col md={2} sm={12} style={{ textAlign: "center" }}>
                  <span
                    onClick={() => getMember(category, 1)}
                    color={statusFilter == 1 ? "dark" : "outline-dark"}
                  >
                    Recurve
                  </span>
                </Col>
                <Col md={2} sm={12} style={{ textAlign: "center" }}>
                  <span
                    onClick={() => getMember(category, 4)}
                    color={statusFilter == 4 ? "dark" : "outline-dark"}
                  >
                    Compound
                  </span>
                </Col>
                <Col md={2} sm={12} style={{ textAlign: "center" }}>
                  <span
                    onClick={() => getMember(category, 2)}
                    color={statusFilter == 2 ? "dark" : "outline-dark"}
                  >
                    Nasional
                  </span>
                </Col>
                <Col md={2} sm={12} style={{ textAlign: "center" }}>
                  <span
                    onClick={() => getMember(category, 2)}
                    color={statusFilter == 2 ? "dark" : "outline-dark"}
                  >
                    Barebow
                  </span>
                </Col>
                <Col md={2} sm={12} style={{ textAlign: "center" }}>
                  <span
                    onClick={() => getMember(category, 2)}
                    color={statusFilter == 2 ? "dark" : "outline-dark"}
                  >
                    Traditional Bow
                  </span>
                </Col>
              </Row>
            </div>
            <div className="mb-4">
              <Row>
                <Col md={8}>
                  <div style={{ width: "330px" }}>
                    <Input />
                  </div>
                </Col>
                <Col md={4} sm={12}>
                  <div className="d-block d-md-flex mt-md-0 mt-3 justify-content-end">
                    <a
                      href={dataExcel}
                      className="btn me-2"
                      style={{ backgroundColor: "#fff", border: "1px solid #0D47A1" }}
                    >
                      <Download /> <span style={{ color: "#0D47A1" }}>Unduh Laporan</span>
                    </a>

                    <Button
                      disabled={waitIdCard}
                      className="btn"
                      onClick={handleDownloadIdCard}
                      style={{ backgroundColor: "#fff", border: "1px solid #0D47A1" }}
                    >
                      <Download />{" "}
                      <span style={{ color: "#0D47A1" }}>
                        {waitIdCard ? "menyiapkan data..." : "Unduh ID Card"}
                      </span>
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center" style={{flexWrap: 'wrap', gap: '3.2rem'}}>
                <div>
                  <span>Kelas:</span>
                </div>
                <div>
                  <span
                    style={{
                      border: "1px solid ##0D47A1",
                      padding: "8px 12px",
                      borderRadius: "5px",
                      fontWeight: '600',
                      color: '#0D47A1',
                      backgroundColor: '#E7EDF6'
                    }}
                    >
                    Semua
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center mt-3" style={{flexWrap: 'wrap', gap: '1rem'}}>
                <div>
                  <span>Jenis Regu:</span>
                </div>
                <div>
                  <span
                    style={{
                      border: "1px solid ##0D47A1",
                      padding: "8px 12px",
                      borderRadius: "5px",
                      fontWeight: '600',
                      color: '#0D47A1',
                      backgroundColor: '#E7EDF6'
                    }}
                    >
                    Semua
                  </span>
                </div>
              </div>
            </div>
          </div>

          <TableMember members={members} />
        </Container>
        <AlertSubmitError isError={Boolean(errorsIdCard)} errors={errorsIdCard} />
      </div>
    </React.Fragment>
  );
}

export default ListMember;
