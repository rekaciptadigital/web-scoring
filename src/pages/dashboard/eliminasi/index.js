import React, { useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import { Container, Card, CardBody, Row, Col, Button } from "reactstrap";
import { DateInput, TimeInput, SelectInput } from "components";
import { Bracket, Seed, SeedItem, SeedTeam, SeedTime } from "react-brackets";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { EventsService, EliminationService, ScoringService } from "../../../services";

import { LoadingScreen } from "components";
import ModalScoring from "./components/ModalScoring";

// TODO: pindah somewhere proper
const APP_ARCHER_URL = process.env.REACT_APP_ARCHER_URL
  ? process.env.REACT_APP_ARCHER_URL
  : "https://staging.myarchery.id";

const CustomSeed = (e, setScoring, updated) => {
  const { roundIndex, seedIndex, seed, breakpoint } = e;

  const shouldRenderScoring = () => {
    // hanya perlu render tombol scoring ketika masing-masing `team.win === 0`
    const isScoring = seed.teams.every((team) => team.win === 0);
    return !updated && isScoring;
  };

  const handleOnClickSetScoring = () => {
    setScoring({
      round: roundIndex + 1,
      match: seedIndex + 1,
    });
  };

  // breakpoint passed to Bracket component
  // to check if mobile view is triggered or not
  // mobileBreakpoint is required to be passed down to a seed
  return (
    <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
      <SeedItem>
        <div>
          {seed.teams.map((team) => {
            return team.win != undefined ? (
              team.win == 1 ? (
                <div>
                  <SeedTeam
                    style={{
                      borderBottom: "2px solid black", // kotak emas, teks putih, yang udah menang
                      color: "white",
                      background: "#BC8B2C",
                    }}
                  >
                    {team?.name || "<not have participant>"}
                  </SeedTeam>
                </div>
              ) : (
                <SeedTeam
                  style={{
                    borderBottom: "2px solid black",
                    color: "#757575", // teks abu-abu, kotak abu-abu, yang belum menang/belum tanding?
                    background: "#E2E2E2",
                  }}
                >
                  {team?.name || "<not have participant>"}
                </SeedTeam>
              )
            ) : (
              <div>
                <SeedTeam
                  style={{
                    borderBottom: "2px solid white", // kotak hitam, teks putih, kalah/di-bypass ("bye")
                  }}
                >
                  {team?.name || "<not have participant>"}
                </SeedTeam>
              </div>
            );
          })}

          {shouldRenderScoring() && (
            <div>
              <SeedItem
                style={{ borderBottom: "2px solid black", color: "black", background: "#fffdfd" }}
              >
                <button
                  style={{ color: "white", background: "red", width: "100%" }}
                  key={breakpoint}
                  onClick={handleOnClickSetScoring}
                >
                  scoring
                </button>
              </SeedItem>
            </div>
          )}
        </div>
      </SeedItem>
      <SeedTime>{seed.date}</SeedTime>
    </Seed>
  );
};

const initialScoringDetail = { scoringData: null };

function Eliminasi() {
  const [loading, setLoading] = React.useState(false);

  const [eliminasiSchedule, setEliminasiSchedule] = useState([]);
  const [matches, setMatches] = useState([]);
  const [eventDetail, setEventDetail] = useState({});
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [category, setCategory] = useState(0);
  const { event_id } = useParams();

  const [currentScoringDetail, setCurrentScoringDetail] = React.useState(
    () => initialScoringDetail
  );

  const eliminationType = [
    { id: "1", label: "A vs Z" },
    { id: "2", label: "A vs B" },
    { id: "3", label: "Random" },
  ];
  const genderOptions = [
    { id: "male", label: "Laki-laki" },
    { id: "female", label: "Perempuan" },
  ];

  const scoringTypeOptions = [
    { id: "1", label: "Sistem Point" },
    { id: "2", label: "Sistem Akumulasi Score" },
  ];
  const [scoringType, setScoringType] = useState(scoringTypeOptions[0]);

  const countEliminationMemberOptions = [
    { id: "16", label: "16" },
    { id: "8", label: "8" },
  ];
  const [countEliminationMember, setCountEliminationMember] = useState(
    countEliminationMemberOptions[0]
  );

  const [type, setType] = useState(eliminationType[0]);
  const [gender, setGender] = useState(genderOptions[0]);

  useEffect(() => {
    if (eventDetail.id == undefined) {
      getEventDetail();
    }
    getEventEliminationTemplate();
  }, [category, countEliminationMember, type, gender, countEliminationMember]);

  const getEventDetail = async () => {
    const { message, errors, data } = await EventsService.getEventById({
      id: event_id,
    });
    if (data) {
      console.log("data.categories", data.cetegories);
      setEventDetail(data);
      setCategory(data.categories[0]);
      getEliminasiSchedule();
      console.log(message);
    } else console.log(message);
    console.log(errors);
  };

  const getEventEliminationTemplate = async () => {
    const { message, errors, data } = await EliminationService.getEventEliminationTemplate({
      event_id: event_id,
      match_type: type.id,
      gender: gender.id,
      event_category_id: category.id,
      elimination_member_count: countEliminationMember.id,
    });
    if (data) {
      setMatches(data);
    } else console.log(message);
    console.log(errors);
  };

  const addEliminasiSchedule = async () => {
    const { message, errors, data } = await EliminationService.setEventEliminationSchedule({
      event_id: event_id,
      date: date,
      start_time: start,
      end_time: end,
    });
    if (data) {
      setDate("");
      setEnd("");
      setStart("");
      getEliminasiSchedule();
    } else console.log(message);
    console.log(errors);
  };

  const setEliminasi = async () => {
    const { message, errors, data } = await EliminationService.setEventElimination({
      match_type: type.id,
      gender: gender.id,
      event_category_id: category.id,
      scoring_type: scoringType.id,
      elimination_member_count: countEliminationMember.id,
    });
    if (data) {
      getEventEliminationTemplate();
    } else console.log(message);
    console.log(errors);
  };

  const setScoring = async (ev) => {
    setLoading(true);

    const contextDetails = {
      type: 2, // id untuk eliminasi
      round: ev.round,
      match: ev.match,
      elimination_id: matches.eliminationId,
    };
    const result = await ScoringService.findParticipantScoreDetail(contextDetails);

    if (result.success && result.data?.length) {
      setCurrentScoringDetail({
        ...contextDetails,
        scoringTypeOptions: scoringTypeOptions,
        scoringData: result.data,
      });
      openModalScoring();
    } else {
      setCurrentScoringDetail({ ...initialScoringDetail });
    }

    setLoading(false);
  };

  const getEliminasiSchedule = async () => {
    const { message, errors, data } = await EliminationService.getEventEliminationSchedule({
      event_id: event_id,
    });
    if (data) {
      setEliminasiSchedule(data);
    } else console.log(message);
    console.log(errors);
  };

  const dummyOptions = [
    { id: "1", label: "Babak 1" },
    { id: "1", label: "Babak 2" },
    { id: "1", label: "Babak 3" },
    { id: "1", label: "Babak 4" },
  ];

  const [isModalScoringOpen, setModalScoringOpen] = React.useState(false);

  const openModalScoring = () => setModalScoringOpen(true);
  const closeModalScoring = () => {
    setModalScoringOpen(false);
    setCurrentScoringDetail({ ...initialScoringDetail }); // reset data current detail kalau modal gak aktif
  };
  const toggleModalScoring = () => setModalScoringOpen((isOpen) => !isOpen);

  const modalControl = {
    isModalScoringOpen,
    toggleModalScoring,
    closeModalScoring,
    openModalScoring,
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Dashboard | Setting - Eliminasi</title>
        </MetaTags>
        <Container fluid>
          <div>
            <Link to="/dashboard/events">
              <div className="my-4" style={{ cursor: "pointer" }}>
                <i className="bx bx-arrow-back"></i>
                <span className="ms-2">Dashboard</span>
              </div>
            </Link>
            <h3>Setting Match Eliminasi {"'" + eventDetail.eventName + "'"}</h3>
            <Row>
              <Col md={7}>
                <Card>
                  <CardBody>
                    <div>
                      <SelectInput
                        label={"kategori"}
                        options={eventDetail.categories}
                        value={category}
                        placeholder="select"
                        onChange={(e) => {
                          setCategory(e.value);
                        }}
                      />
                    </div>
                    <div>
                      <SelectInput
                        style={{ width: "200px" }}
                        label={"scoring type"}
                        options={scoringTypeOptions}
                        value={scoringType}
                        placeholder="select type"
                        onChange={(e) => {
                          setScoringType(e.value);
                        }}
                      />
                    </div>
                    <div>
                      <SelectInput
                        style={{ width: "200px" }}
                        label={"jumlah peserta eliminasi"}
                        options={countEliminationMemberOptions}
                        value={countEliminationMember}
                        placeholder="select type"
                        onChange={(e) => {
                          setCountEliminationMember(e.value);
                        }}
                      />
                    </div>
                    <div>
                      <SelectInput
                        readOnly={true}
                        style={{ width: "100px" }}
                        label={"type"}
                        options={eliminationType}
                        value={type}
                        placeholder="select type"
                        onChange={(e) => {
                          setType(e.value);
                        }}
                      />
                    </div>
                    <div>
                      <SelectInput
                        style={{ width: "200px" }}
                        label={"jenis kelamin"}
                        options={genderOptions}
                        value={gender}
                        placeholder="select type"
                        onChange={(e) => {
                          setGender(e.value);
                        }}
                      />
                    </div>
                    <div className="float-end mt-2">
                      <Button disabled={matches.updated ? false : true} onClick={setEliminasi}>
                        Terapkan
                      </Button>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody style={{ overflow: "auto" }}>
                    <div className="mb-4 float-end">
                      <Button
                        tag="a"
                        size="sm"
                        color="primary"
                        target="_blank"
                        href={`${APP_ARCHER_URL}/display/stages/${eventDetail.eventSlug}`}
                        rel="noopener noreferrer"
                      >
                        Lihat di web
                      </Button>
                    </div>

                    <div className="mt-5">
                      <Bracket
                        rounds={matches.rounds != undefined ? matches.rounds : []}
                        renderSeedComponent={(e) => {
                          return CustomSeed(e, setScoring, matches.updated);
                        }}
                      />
                    </div>
                    {currentScoringDetail.scoringData?.length && (
                      <ModalScoring
                        data={currentScoringDetail}
                        modalControl={modalControl}
                        onSavePermanent={() => getEventEliminationTemplate()}
                      />
                    )}
                  </CardBody>
                </Card>
              </Col>
              <Col md={5}>
                <Card>
                  <CardBody>
                    <div>
                      <div>
                        <h5>Setting Jadwal Eliminasi</h5>
                        <div style={{ height: "220px", overflowY: "auto" }}>
                          <div className="d-flex justify-content-between">
                            <div>
                              <DateInput
                                value={date}
                                onChange={(e) => {
                                  setDate(e.value);
                                }}
                                label="Tanggal"
                              />
                            </div>
                            <div>
                              <TimeInput
                                value={start}
                                onChange={(e) => {
                                  setStart(e.value);
                                }}
                                label="Jam Mulai"
                              />
                            </div>
                            <div>
                              <TimeInput
                                value={end}
                                onChange={(e) => {
                                  setEnd(e.value);
                                }}
                                label="Jam Selesai"
                              />
                            </div>
                            <div style={{ paddingTop: "1.6rem" }} className="ms-1">
                              <Button onClick={addEliminasiSchedule}>+</Button>
                            </div>
                          </div>
                          <br></br>
                          {eliminasiSchedule.map((d) => {
                            return (
                              <p key={d.id}>
                                + {d.date + " [" + d.startTime + " - " + d.endTime + "]"}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <div>
                      <div>
                        <Row>
                          <Col>
                            <h5>Setting Match And Schedule</h5>
                          </Col>
                        </Row>
                      </div>
                      <div style={{ height: "220px", overflowY: "scroll" }}>
                        <div className="w-75">
                          <div>
                            <SelectInput options={dummyOptions} placeholder="Babak 1" />
                          </div>
                        </div>
                      </div>
                      <div className="float-end mt-2">
                        <Button>Terapkan</Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      <LoadingScreen loading={loading} />
    </React.Fragment>
  );
}

export default Eliminasi;
