import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MetaTags from "react-meta-tags";
import { Container, Card, CardBody, Row, Col, Button } from "reactstrap";
import { DateInput, TimeInput, SelectInput } from "components";
import { Bracket, Seed, SeedItem, SeedTeam, SeedTime } from "react-brackets";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  EventsService,
  EliminationService,
  ScoringService,
} from "../../../services";

import { LoadingScreen } from "components";
import ModalScoring from "./components/ModalScoring";

import medalGoldPng from "assets/icons/medal-gold.png";
import medalSilverPng from "assets/icons/medal-silver.png";
import medalBronzePng from "assets/icons/medal-bronze.png";

// TODO: pindah somewhere proper
const APP_ARCHER_URL = process.env.REACT_APP_ARCHER_URL
  ? process.env.REACT_APP_ARCHER_URL
  : "https://staging.myarchery.id";

const CustomSeed = (seedData, setScoring, updated, maxRounds) => {
  const { roundIndex, seed, breakpoint } = seedData;

  const isFinalRound = roundIndex === maxRounds - 2;
  const isThirdPlaceRound = roundIndex === maxRounds - 1;

  const shouldScoringEnabled = () => {
    // hanya perlu render tombol scoring ketika masing-masing `team.win === 0`
    const isScoring = seed.teams.every((team) => team.win === 0);
    return !updated && isScoring;
  };

  const shouldRenderMedalIcon = () => {
    const isPaired = seed.teams.every((team) => team.id);
    return isPaired && !shouldScoringEnabled();
  };

  const handleOnClickSetScoring = () => {
    setScoring(seedData);
  };

  const computeMedalStyle = (index) => {
    const style = { position: "absolute", right: -15 };
    if (index > 0) {
      return { ...style, bottom: -8 };
    }
    return { ...style, top: -8 };
  };

  // breakpoint passed to Bracket component
  // to check if mobile view is triggered or not
  // mobileBreakpoint is required to be passed down to a seed
  return (
    <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
      <SeedItem style={{ padding: 2, backgroundColor: "var(--bs-gray-800)" }}>
        <div>
          {seed.teams.map((team, index) => {
            return team.win != undefined ? (
              team.win == 1 ? (
                <div key={index} style={{ position: "relative" }}>
                  <SeedTeamStyled
                    index={index}
                    color="white"
                    bgColor="#BC8B2C"
                    // kotak emas, teks putih, yang udah menang
                  >
                    <SeedNameLabel>
                      {team?.name || (
                        <React.Fragment>
                          &lt;belum ada partisipan&gt;
                        </React.Fragment>
                      )}
                    </SeedNameLabel>

                    <SeedScoreLabel bgColor="white" color="black">
                      {team?.result || 0}
                    </SeedScoreLabel>

                    {isFinalRound && shouldRenderMedalIcon() && (
                      <span style={computeMedalStyle(index)}>
                        <IconMedalGold />
                      </span>
                    )}
                    {isThirdPlaceRound && shouldRenderMedalIcon() && (
                      <span style={computeMedalStyle(index)}>
                        <IconMedalBronze />
                      </span>
                    )}
                  </SeedTeamStyled>
                </div>
              ) : (
                <div key={index} style={{ position: "relative" }}>
                  <SeedTeamStyled
                    index={index}
                    color="#757575"
                    bgColor="#E2E2E2"
                    // teks abu-abu, kotak abu-abu, yang belum menang/belum tanding?
                  >
                    <SeedNameLabel>
                      {team?.name || (
                        <React.Fragment>
                          &lt;belum ada partisipan&gt;
                        </React.Fragment>
                      )}
                    </SeedNameLabel>

                    <SeedScoreLabel bgColor="white" color="black">
                      {team?.result || 0}
                    </SeedScoreLabel>

                    {isFinalRound && shouldRenderMedalIcon() && (
                      <span style={computeMedalStyle(index)}>
                        <IconMedalSilver />
                      </span>
                    )}
                  </SeedTeamStyled>
                </div>
              )
            ) : (
              <div key={index}>
                <SeedTeamStyled
                  index={index}
                  color="var(--bs-gray-600)"
                  // kotak hitam, teks putih, di-bypass ("bye")
                >
                  <SeedNameLabel style={{ width: "100%", textAlign: "center" }}>
                    {team?.name || (
                      <React.Fragment>
                        &lt;belum ada partisipan&gt;
                      </React.Fragment>
                    )}
                  </SeedNameLabel>
                </SeedTeamStyled>
              </div>
            );
          })}

          {shouldScoringEnabled() && (
            <SeedItem
              style={{ marginTop: 2, backgroundColor: "var(--bs-gray-800)" }}
            >
              <ButtonScoring key={breakpoint} onClick={handleOnClickSetScoring}>
                <i className="bx bx-edit me-2" />
                Scoring
              </ButtonScoring>
            </SeedItem>
          )}
        </div>
      </SeedItem>
      <SeedTime>{seed.date}</SeedTime>
    </Seed>
  );
};

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
  }, [category, countEliminationMember, type, gender]);

  useEffect(() => {
    if (bracketData) {
      let arrData = [];
      let rowTwo = 0;
      let titleLabel = "";
      matches.rounds.map((val) => {
        switch (val.seeds.length) {
          case 8:
            titleLabel = "1/8";
            break;
          case 4:
            titleLabel = "1/4";
            break;
          case 2:
            titleLabel = "Semi-Final";
            break;
          case 1:
            if (rowTwo < 1) {
              rowTwo = 1;
              titleLabel = "Final";
            } else {
              titleLabel = "3rd Place";
            }
            break;

          default:
            titleLabel = "1/16";
            break;
        }
        let obj = {
          round: val.round,
          seeds: val.seeds,
          title: (
            <span className="badge bg-primary rounded-pill fs-6">
              {titleLabel}
            </span>
          ),
        };

        return arrData.push(obj);
      });
      matches.rounds = arrData;
    }
  }, [matches]);

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
    const { message, errors, data } =
      await EliminationService.getEventEliminationTemplate({
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
    const { message, errors, data } =
      await EliminationService.setEventEliminationSchedule({
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
    const { message, errors, data } =
      await EliminationService.setEventElimination({
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

  const setScoring = async (seedData) => {
    setLoading(true);

    const queryString = {
      type: 2, // id untuk eliminasi
      round: seedData.roundIndex + 1,
      match: seedData.seedIndex + 1,
      elimination_id: matches.eliminationId,
    };
    const result = await ScoringService.findParticipantScoreDetail(queryString);

    if (result.success && result.data) {
      setCurrentScoringDetail(result.data);
      setCurrentMatchData({
        roundIndex: seedData.roundIndex,
        seedIndex: seedData.seedIndex,
        queryStringRefetch: queryString,
      });
      openModalScoring();
    } else {
      setCurrentScoringDetail(null);
      console.error(
        "Error mengambil data detail scoring match ini:",
        result.error
      );
    }

    setLoading(false);
  };

  const getEliminasiSchedule = async () => {
    const { message, errors, data } =
      await EliminationService.getEventEliminationSchedule({
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

  const [currentScoringDetail, setCurrentScoringDetail] = React.useState(null);
  const [currentMatchData, setCurrentMatchData] = React.useState(null);
  const [isModalScoringOpen, setModalScoringOpen] = React.useState(false);

  const openModalScoring = () => setModalScoringOpen(true);

  const closeModalScoring = () => {
    setModalScoringOpen(false);
    setCurrentScoringDetail(null);
    setCurrentMatchData(null);
    getEventEliminationTemplate();
  };

  const toggleModalScoring = () => {
    setModalScoringOpen((isOpen) => !isOpen);
    if (isModalScoringOpen) {
      closeModalScoring();
    }
  };

  const handleSavePermanent = () => {
    getEventEliminationTemplate();
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
                      <Button
                        disabled={matches.updated ? false : true}
                        onClick={setEliminasi}
                      >
                        Terapkan
                      </Button>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <div className="clearfix">
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
                    </div>

                    <BaganView>
                      <Bracket
                        rounds={
                          matches.rounds != undefined ? matches.rounds : []
                        }
                        renderSeedComponent={(e) => {
                          return CustomSeed(
                            e,
                            setScoring,
                            matches.updated,
                            matches.rounds.length
                          );
                        }}
                      />

                      {isModalScoringOpen &&
                        currentScoringDetail?.length &&
                        currentMatchData && (
                          <ModalScoring
                            matchData={{
                              ...currentMatchData,
                              ...matches.rounds[currentMatchData.roundIndex]
                                .seeds[currentMatchData.seedIndex],
                              updated: matches.updated,
                            }}
                            scoringDetail={currentScoringDetail}
                            onChangeScoringDetail={(index, ev) => {
                              setCurrentScoringDetail((currentDetail) => {
                                const scoringDetailUpdated = [...currentDetail];
                                scoringDetailUpdated[index].scores = { ...ev };
                                return scoringDetailUpdated;
                              });
                            }}
                            refetchScoreDetail={async () => {
                              const result =
                                await ScoringService.findParticipantScoreDetail(
                                  currentMatchData.queryStringRefetch
                                );
                              if (result.success && result.data) {
                                setCurrentScoringDetail(result.data);
                              }
                              return result;
                            }}
                            isOpen={isModalScoringOpen}
                            onToggle={toggleModalScoring}
                            onClosed={closeModalScoring}
                            onSavePermanent={handleSavePermanent}
                            scoringTypeOptions={scoringTypeOptions}
                          />
                        )}
                    </BaganView>
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
                            <div
                              style={{ paddingTop: "1.6rem" }}
                              className="ms-1"
                            >
                              <Button onClick={addEliminasiSchedule}>+</Button>
                            </div>
                          </div>
                          <br></br>
                          {eliminasiSchedule.map((d) => {
                            return (
                              <p key={d.id}>
                                +{" "}
                                {d.date +
                                  " [" +
                                  d.startTime +
                                  " - " +
                                  d.endTime +
                                  "]"}
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
                            <SelectInput
                              options={dummyOptions}
                              placeholder="Babak 1"
                            />
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

const BaganView = styled.div`
  overflow: auto;
  margin-right: -20px;
  margin-bottom: -20px;
  margin-left: -20px;
  padding: 10px;
`;

const IconMedalGold = () => <img src={medalGoldPng} />;
const IconMedalSilver = () => <img src={medalSilverPng} />;
const IconMedalBronze = () => <img src={medalBronzePng} />;

const SeedTeamStyled = styled(SeedTeam)`
  overflow: hidden;
  align-items: stretch;
  padding: 0;
  ${({ index }) => (index === 0 ? "margin-bottom: 2px;" : "")}
  color: ${({ color }) => (color ? color : "inherit")};
  background-color: ${({ bgColor }) => (bgColor ? bgColor : "none")};
`;

const SeedNameLabel = styled.div`
  overflow: hidden;
  padding: 0.3rem 0.5rem;
  text-align: left;
`;

const SeedScoreLabel = styled.div`
  min-width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.3rem 0.5rem;
  background-color: white;
  color: var(--bs-gray);
  font-weight: bold;
`;

const ButtonScoring = styled.button`
  color: white;
  background-color: var(--bs-primary);
  width: 100%;
  border: none;
  border-radius: 0.2rem;

  &:hover {
    background-color: #485ec4;
  }
`;

export default Eliminasi;
