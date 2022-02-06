import React, { useState, useEffect } from 'react'
import { MetaTags } from 'react-meta-tags'
import {
    Container,
    Button,
    Col,
    Row,
} from 'reactstrap'
import { SelectInput } from 'components'
import { Link } from 'react-router-dom'
import TableMember from './components/TableMember'
import { EventsService } from "services";
import { useParams } from "react-router-dom";

function ListMember() {
    const { event_id } = useParams();
    const [eventDetail, setEventDetail] = useState({});
    const [members, setMembers] = useState([]);
    const [dataMembers, setDataMembers] = useState([]);
    const [category, setCategory] = useState({});
    const [statusFilter, setStatusFilter] = useState(0);

    useEffect(async () => {
    try {
        const { data, errors, success, message } = await EventsService.getEventById(
            {"id":event_id}
        );
        if (success) {
            if (data) {
                setEventDetail(data);
                // getMember(data.flatCategories[0]);
                let payload = {...data.eventCategories[0],
                    id: data.eventCategories[0].categoryDetailsId,
                    "label":`${data.eventCategories[0].teamCategoryId.label}-${data.eventCategories[0].ageCategoryId.label}-${data.eventCategories[0].competitionCategoryId.label}-${data.eventCategories[0].distanceId.label}`}
                
                getMember(payload)
            }
        } else {
            console.log(message, errors);
        }
        } catch (error) {
        console.log(error);
        }
    }, []);

    const setMemberMap = (data, payload, status) => {
        setCategory(payload)
        setStatusFilter(status)
        let m =[];
        if(!dataMembers[payload.label+"-"+status]){
            dataMembers[payload.label+"-"+status] = data;
            setDataMembers(dataMembers);
        }
        data.map((d)=>{
            m.push({"id": d.member.id,
            "name": d.member.name,
            "email": d.email,
            "telepon": d.phoneNumber,
            "club": d.club,
            "age": d.member.club,
            "gender": d.member.gender,
            "status": d.status, 
            "statusLabel": d.statusLabel}); 
        })
            setMembers(m);
    }
    const getMember = async (payload,status = 0) => {
        try {
            if(dataMembers[payload.label+"-"+status]){
                return await setMemberMap(dataMembers[payload.label+"-"+status], payload,status)
            }
            const { data, errors, success, message } = await EventsService.getEventMember(
                {
                    id:event_id,
                    competition_category_id:payload.competitionCategoryId.id,
                    "team_category_id":payload.teamCategoryId.id,
                    "age_category_id":payload.ageCategoryId.id,
                    "category_id":payload.categoryDetailsId,
                    "status":status,
                }
            );
            if (success) {
                if (data) {
                    setMemberMap(data, payload,status)
                }
            } else {
                console.log(message, errors);
            }
            } catch (error) {
            console.log(error);
            }
        };

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Dashboard | List - Member</title>
                </MetaTags>
                <Container fluid>
                <Link to="/dashboard/events">
                    <Button color="outline-dark">{'<-'}</Button>
                </Link>
                <span style={{marginLeft: '0.5rem'}}>Kembali ke List Event</span>
                <div className="mb-4">
                    <h6>Category</h6>
                    <div>
                        <Row>
                            <Col md={3} sm={12}>
                                {/* <div className="d-block d-md-flex justify-content-between"> */}
                                    <SelectInput
                                        name='jenis'
                                        onChange={(v) => {getMember(v.value, statusFilter)}}
                                        options={
                                            eventDetail?.eventCategories?.map((option) => {
                                              return {
                                                ...option,
                                                id: option.categoryDetailsId,
                                                label: `${option.teamCategoryId.label}-${option.ageCategoryId.label}-${option.competitionCategoryId.label}-${option.distanceId.label}`,
                                              };
                                            }) || []
                                          }
                                          value={category.label != undefined ? category:null}
                                        />
                            </Col>
                            <Col md={4} sm={12}>
                                <div className="d-block d-md-flex mt-md-0 mt-3">
                                    <Button onClick={()=>getMember(category,0)} color={statusFilter == 0 ? "dark" : "outline-dark"}>Semua</Button>
                                    <Button onClick={()=>getMember(category,1)} color={statusFilter == 1 ? "dark" : "outline-dark"}>Telah Dibayar</Button>
                                    <Button onClick={()=>getMember(category,4)} color={statusFilter == 4 ? "dark" : "outline-dark"}>Menunggu Pembayaran</Button>
                                    <Button onClick={()=>getMember(category,2)} color={statusFilter == 2 ? "dark" : "outline-dark"}>Pembayaran Kadarluarsa</Button>
                                </div>
                            </Col>
                             <Col md={3} sm={12}>
                                {/* <div className="d-block d-md-flex mt-md-0 mt-3 justify-content-end">
                                    <Button color="outline-dark">Unduh Data</Button>
                                </div> */}
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="mb-4">
                    <hr />
                </div>
                <TableMember members={members}/>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default ListMember
