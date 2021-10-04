import React, {useState, useEffect} from "react"
import Select from "react-select";
import { EventsService } from "services";

import { Row,
  Col, 
  Card,Button, 
  CardBody} from "reactstrap";


const BoxSetScoring = props => {
  const [error, setError] = useState([]);

  useEffect(() => {
  }, []);

  const save = async() => {
    setError("");
    let form = {
      "schedule_id":props.memberScore.participant.scheduleId,
      "target_no":props.memberScore.no_target,
      "type":1,
    };
    console.log("message", form);
    let scors=[];
    props.memberScore.scors.map((s,i) => {
      let ms = []
      s.map((sc) =>{
        ms.push(sc.value);
      })
      scors[i] = ms;
    })
    form.shoot_scores = scors;

    const { data, errors, success, message } = await EventsService.saveScore(form);
    if (success) {
        if (data) {
            props.setMemberScore({});
            if(props.callback)
              props.callback(props.memberScore.participant.scheduleId);
          }
    } else {
        setError(message);
        
        console.log(message, errors);
    }
  }
return (
      <React.Fragment>
        <Row>
                <Col sm={12}>
                    <Card>    
                        <CardBody>
                          <Row>
                            <Col md={3} sm={12}>
                                <div className="w-75 mx-auto">
                                  <span>
                                      <table>
                                        <tr>
                                          <td>Nama</td>
                                          <td> : </td>
                                          <td> {props.memberScore.participant?.member.name} </td>
                                        </tr>
                                        <tr>
                                          <td>Kategori</td>
                                          <td> : </td>
                                          <td> {props.memberScore.participant?.categoryLabel} </td>
                                        </tr>
                                        <tr>
                                          <td>No Target</td>
                                          <td> : </td>
                                          <td><input onChange={(e)=>{
                                            console.log("e.value",e.target.value);
                                                  props.setMemberScore({...props.memberScore,no_target:e.target.value});
                                                }} value={props.memberScore?.no_target}/>  </td>
                                        </tr>
                                      </table>
                                  </span>
                                </div>
                            </Col>
                            <Col md={7} sm={12}>
                                <div className="w-75 mx-auto">
                                  <span>
                                    <table style={{textAlign:"center"}}>
                                      <tr>
                                        <td>seri</td>
                                        <td align="center" colSpan={6}>score</td>
                                      </tr>
                                      <tr>
                                        <td></td>
                                        {props.shot_per_seri.map((sps) => {
                                          return <td key={sps}>{sps}</td>
                                        })}
                                      </tr>
                                      {props.memberScore != undefined && props.memberScore.scors ? props.memberScore.scors.map((s,i) => {
                                      return <tr key={i} style={{background:props.scoreSeries[i-1].background}}>
                                              <td style={{color:props.scoreSeries[i-1].color}}>{i}</td>
                                              {s.map((sps,x) => {
                                                return <td key={x}><Select
                                                maxMenuHeight={100}
                                                value={sps}
                                                options={props.score}
                                                onChange={(e)=>{
                                                  let ms = props.memberScore.scors;
                                                  ms[i][x] = e
                                                  props.setMemberScore({...props.memberScore,scors:ms});
                                                }}
                                                classNamePrefix="select2-selection"
                                              /></td>
                                              })}
                                            </tr>
                                      }) : null}
                                    </table>
                                    <p style={{color:"red"}}>{error}</p>
                                  </span>
                                </div>
                            </Col>
                            <Col md={2} sm={12}>
                              <Button onClick={()=>{props.setMemberScore({});}} type="buttong" color="warning">
                                Batal
                              </Button>
                              <Button onClick={()=>{save();}} type="buttong" color="success">
                                Save
                              </Button>
                            </Col>
                          </Row>
                        </CardBody>
                    </Card>
                </Col>
               
            </Row>
      </React.Fragment>
     );
    };
    
    export default BoxSetScoring;
