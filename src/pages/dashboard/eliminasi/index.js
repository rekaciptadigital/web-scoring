import React, {useState, useEffect} from 'react'
import MetaTags from "react-meta-tags";
import {Container, Card, CardBody, Row, Col, Button, Input} from "reactstrap"
import { DateInput, TimeInput, SelectInput } from "components"
import { Bracket, Seed, SeedItem, SeedTeam, SeedTime } from 'react-brackets'
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { EventsService, EliminationService } from "../../../services"

  const CustomSeed = ({seed, breakpoint}) => {
    // breakpoint passed to Bracket component
    // to check if mobile view is triggered or not
  
    // mobileBreakpoint is required to be passed down to a seed
    return (
      <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
        <SeedItem>
          <div>
              {
                  seed.teams.map((team) => {
                    return(
                        team.win != undefined ? 
                        team.win == 1 ? 
                        <SeedTeam style={{ borderBottom: "2px solid black", color: "white", background: "#BC8B2C" }}>{team?.name || "<not have participant>"}</SeedTeam> 
                        :
                        <SeedTeam style={{ borderBottom: "2px solid black", color: "#757575", background: "#E2E2E2"}}>{team?.name || "<not have participant>"}</SeedTeam>
                        :   
                        <SeedTeam style={{ borderBottom: "2px solid white"}}>{team?.name || '<not have participant>'}</SeedTeam>
                    )
                  })
              }
          </div>
        </SeedItem>
        <SeedTime>{seed.date}</SeedTime>
      </Seed>
    );
  };

function Eliminasi() {
    const [eliminasiSchedule, setEliminasiSchedule] = useState([])
    const [matches, setMatches] = useState([])
    const [eventDetail, setEventDetail] = useState({})
    const [date, setDate] = useState("")
    const [start, setStart] = useState("")
    const [end, setEnd] = useState("")
    const [category, setCategory] = useState(0)
    const [updated, setUpdated] = useState(true)
    const [countEliminationMember, setCountEliminationMember] = useState(16)
    const { event_id } = useParams();
    const eliminationType = [
        { id: "1", label: "A vs Z" }, 
        { id: "2", label: "A vs B" }, 
        { id: "3", label: "Random" },  
    ]
    const genderOptions = [
        { id: "male", label: "Laki-laki" }, 
        { id: "female", label: "Perempuan" }, 
    ]
    const [type, setType] = useState(eliminationType[0])
    const [gender, setGender] = useState(genderOptions[0])


    useEffect(() => {
        if(eventDetail.id == undefined)
            getEventDetail()

        setUpdated(true)
        getEventEliminationTemplate()
    }, [category, countEliminationMember, type, gender]);

    const getEventDetail = async () => {
        const {message, errors, data } = await EventsService.getEventById({
            "id" : event_id
        })
        if (data) {
            console.log("data.categories", data.cetegories)
            setEventDetail(data)
            setCategory(data.categories[0])
            getEliminasiSchedule();
            console.log(message)
        } else 
        console.log(message)
        console.log(errors)
    }

    const getEventEliminationTemplate = async () => {
        const {message, errors, data } = await EliminationService.getEventEliminationTemplate({
            "event_id" : event_id,
            "match_type" : type.id,
            "gender" : gender.id,
            "event_category_id" : category.id,
            "elimination_member_count" : countEliminationMember
        })
        if (data) {
            setMatches(data);
        } else 
        console.log(message)
        console.log(errors)
    }

    const addEliminasiSchedule = async() => {
        const {message, errors, data } = await EliminationService.setEventEliminationSchedule({
            "event_id" : event_id,
            "date" : date,
            "start_time" : start,
            "end_time" : end,
        })
        if (data) {
            setDate("");
            setEnd("");
            setStart("");
            getEliminasiSchedule();
        } else 
        console.log(message)
        console.log(errors)
    }

    const setEliminasi = async() => {
        const {message, errors, data } = await EliminationService.setEventElimination({
            "match_type" : type.id,
            "gender" : gender.id,
            "event_category_id" : category.id,
            "elimination_member_count" : countEliminationMember
        })
        if (data) {
            getEventEliminationTemplate();
        } else 
        console.log(message)
        console.log(errors)
    }

    const getEliminasiSchedule = async() => {
        const {message, errors, data } = await EliminationService.getEventEliminationSchedule({
            "event_id" : event_id,
        })
        if (data) {
            setEliminasiSchedule(data)
        } else 
        console.log(message)
        console.log(errors)
    }

    const dummyOptions = [
        { id: "1", label: "Babak 1" }, 
        { id: "1", label: "Babak 2" }, 
        { id: "1", label: "Babak 3" }, 
        { id: "1", label: "Babak 4" }, 
    ]

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
                        <h3>Setting Match Eliminasi {"'"+eventDetail.eventName+"'"}</h3>
                        <Row>
                            <Col md={7}>
                                <Card>
                                    <CardBody>
                                        <div>
                                            <SelectInput label ={"kategori"} options={eventDetail.categories} value={category} placeholder="select" onChange={(e)=>{setCategory(e.value)}} />
                                        </div>
                                        <div>
                                            <label>jumlah peserta eliminasi</label>
                                            <br></br>
                                            <Input readOnly={updated == true ? true : true} style={{width:"70px"}} type="number" value={countEliminationMember} onChange={(e)=>{setCountEliminationMember(e.target.value)}} />
                                        </div>
                                        <div>
                                            <SelectInput readOnly={true} style={{width:"100px"}} label ={"type"} options={eliminationType} value={type} placeholder="select type" onChange={(e)=>{setType(e.value)}} />
                                        </div>
                                        <div>
                                            <SelectInput style={{width:"200px"}} label ={"jenis kelamin"} options={genderOptions} value={gender} placeholder="select type" onChange={(e)=>{setGender(e.value)}} />
                                        </div>
                                        <div className="float-end mt-2">
                                            <Button disabled={matches.updated ? false : true} onClick={setEliminasi}>Terapkan</Button>
                                        </div>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody style={{overflow: "auto"}}>
                                        <div>
                                            <Bracket rounds={matches.rounds != undefined ? matches.rounds : []} renderSeedComponent={CustomSeed} />
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md={5}>
                            <Card>
                                    <CardBody>
                                        <div>
                                            <div>
                                                <h5>Setting Jadwal Eliminasi</h5>
                                                 <div style={{height: '220px', overflowY: 'auto'}}>
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <DateInput value={date} onChange={(e)=>{setDate(e.value)}} label="Tanggal" />
                                                        </div>
                                                        <div>
                                                            <TimeInput value={start} onChange={(e)=>{setStart(e.value)}} label="Jam Mulai" />
                                                        </div>
                                                        <div>
                                                            <TimeInput value={end} onChange={(e)=>{setEnd(e.value)}} label="Jam Selesai" />
                                                        </div>
                                                        <div style={{paddingTop: '1.6rem'}} className="ms-1">
                                                            <Button onClick={addEliminasiSchedule}>+</Button>
                                                        </div>
                                                    </div>
                                                    <br></br>
                                                    {
                                                        eliminasiSchedule.map((d)=>{
                                                            return (<p key={d.id}>+ {d.date+" ["+d.startTime+" - "+d.endTime+"]"}</p>);
                                                        })
                                                    }
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
                                            <div style={{height: '220px', overflowY: 'scroll'}}>
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
        </React.Fragment>
    )
}

export default Eliminasi
