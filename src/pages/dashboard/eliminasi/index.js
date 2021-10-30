import React, {useState} from 'react'
import MetaTags from "react-meta-tags";
import {Container, Card, CardBody, Row, Col, Button} from "reactstrap"
import { DateInput, TimeInput, SelectInput } from "components"
import { Bracket, Seed, SeedItem, SeedTeam } from 'react-brackets'
import { Link } from "react-router-dom"

const rounds = [
    {
      title: 'Round one',
      seeds: [
        {
          id: 1,
          date: new Date().toDateString(),
          teams: [{ name: 'Team A', lose: 2 }, { name: 'Team B', lose: 1 }],
        },
        {
          id: 2,
          date: new Date().toDateString(),
          teams: [{ name: 'Team C', lose: 1 }, { name: 'Team D', lose : 2 }],
        },
        {
          id: 3,
          date: new Date().toDateString(),
          teams: [{ name: 'Team E', lose: 0 }, { name: 'Team F', lose: 0 }],
        },
        {
          id: 4,
          date: new Date().toDateString(),
          teams: [{ name: 'Team G', lose: 0 }, { name: 'Team H', lose: 0 }],
        },
      ],
    },
    {
      title: 'Round two',
      seeds: [
        {
          id: 5,
          date: new Date().toDateString(),
          teams: [{ name: 'Team A' }, { name: 'Team D' }],
        },
        {
          id: 6,
          date: new Date().toDateString(),
          teams: [{ name: 'Team E' }, { name: 'Team H' }],
        },
      ],
    },
  ];

  const CustomSeed = ({seed, breakpoint}) => {
    // breakpoint passed to Bracket component
    // to check if mobile view is triggered or not
  
    // mobileBreakpoint is required to be passed down to a seed
    return (
      <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
        <SeedItem>
          <div>
            { seed.teams[0].lose && seed.teams[1].lose ?
            (
              <div>
                <SeedTeam style={{ color: `${seed.teams[0].lose == 1 ? "#757575" : "white"}`, background: `${seed.teams[0].lose == 1 ? "#E2E2E2" : "#BC8B2C"}` }}>{seed.teams[0]?.name || 'NO TEAM '}</SeedTeam>
                <SeedTeam style={{ color: `${seed.teams[1].lose == 2 ? "white" : "#757575"}`, background: `${seed.teams[1].lose == 2 ? "#BC8B2C" : "#E2E2E2"}`}}>{seed.teams[1]?.name || 'NO TEAM '}</SeedTeam>
              </div>
            ):(
              <div>
              <SeedTeam>{seed.teams[0]?.name || 'NO TEAM '}</SeedTeam>
              <SeedTeam>{seed.teams[1]?.name || 'NO TEAM '}</SeedTeam>
              </div>
            )
            }
          </div>
        </SeedItem>
      </Seed>
    );
  };

function Eliminasi() {
    const [eliminasiData, setEliminasiData] = useState([])

    const eliminasiSchedule = () => {
        return (
            <div>
                <div className="d-flex justify-content-between">
                    <div>
                        <DateInput label="Tanggal Eliminasi" />
                    </div>
                    <div className="ms-1">
                        <TimeInput label="Jam Mulai" />
                    </div>
                    <div className="ms-1">
                        <TimeInput label="Jam Selesai" />
                    </div>
                </div>
            </div>
        )
    }

    const addEliminasiSchedule = () => {
        setEliminasiData([...eliminasiData, eliminasiSchedule()])
    }

    const dummyOptions = [
        { id: "1", label: "Babak 1" }, 
        { id: "1", label: "Babak 2" }, 
        { id: "1", label: "Babak 3" }, 
        { id: "1", label: "Babak 4" }, 
    ]

    console.log(eliminasiData)
    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Dashboard | Setting - Eliminasi</title>
                </MetaTags>
                <Container fluid>
                    <div>
                        <Link to="/dashboard/events">
                            <div className="my-4" style={{cursor:"pointer"}}>
                                <i className="bx bx-arrow-back"></i>
                                <span className="ms-2">Dashboard</span>
                            </div>
                        </Link>
                        <h3>Setting Match Eliminasi</h3>
                        <Row>
                            <Col md={7}>
                                <Card>
                                    <CardBody>
                                        <div>
                                            <Bracket rounds={rounds} renderSeedComponent={CustomSeed} />
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md={5}>
                            <Card>
                                    <CardBody>
                                        <div>
                                            <div className="d-flex justify-content-between">
                                                <h5>Elimination member count</h5>
                                                <div className="border-1">00</div>
                                            </div>
                                            <div>
                                                <p>Jadwal Eliminasi</p>
                                                 <div style={{height: '220px', overflowY: 'auto'}}>
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <DateInput label="Tanggal" />
                                                        </div>
                                                        <div>
                                                            <TimeInput label="Jam Mulai" />
                                                        </div>
                                                        <div>
                                                            <TimeInput label="Jam Selesai" />
                                                        </div>
                                                        <div style={{paddingTop: '1.6rem'}} className="ms-1">
                                                            <Button onClick={addEliminasiSchedule}>+</Button>
                                                        </div>
                                                    </div>
                                                    {eliminasiData}
                                                </div>
                                            </div>
                                            <div className="float-end mt-2">
                                                <Button>Terapkan</Button>
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
                                                        <h5>Babak</h5>
                                                    </Col>
                                                    <Col>
                                                    <div>
                                                        <SelectInput options={dummyOptions} placeholder="Babak 1" />
                                                    </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div style={{height: '220px', overflowY: 'scroll'}}>
                                                <div className="w-75">
                                                    <div className="mt-2">
                                                        <SelectInput label="Sesi 1" />
                                                    </div>
                                                    <div className="mt-2">
                                                        <SelectInput label="Sesi 2" />
                                                    </div>
                                                    <div className="mt-2">
                                                        <SelectInput label="Sesi 3" />
                                                    </div>
                                                    <div className="mt-2">
                                                        <SelectInput label="Sesi 4" />
                                                    </div>
                                                    <div className="mt-2">
                                                        <SelectInput label="Sesi 5" />
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
        </React.Fragment>
    )
}

export default Eliminasi
