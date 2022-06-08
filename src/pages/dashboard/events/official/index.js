import * as React from "react";
import styled from "styled-components";
import { MetaTags } from "react-meta-tags";
import { SearchBox } from "./components/search-box";

import { useParams } from "react-router-dom";
import { Container, Col, Row } from "reactstrap";
import { SubNavbar } from "../components/submenus-settings";
import { OfficialTable } from "./components/list-official";
import { useOfficialMembers } from "./hooks/official-members";


function PageEventOfficial() {
  const { event_id } = useParams();
  const eventId = event_id;

  const [inputSearchQuery, setInputSearchQuery] = React.useState("");

  const {
    data: officialMembers
} = useOfficialMembers(eventId);

  return (
    <React.Fragment>
        <SubNavbar eventId={event_id} />
        
        <MetaTags>
                <title>Dashboard | Official</title>
        </MetaTags>

        <Container fluid>
            <ToolbarRight>
                <HorizontalSpaced>
                    <Row>
                        <Col md={8}>
                            <OfficialLabel>
                                {officialMembers?.member?.length} Pendaftar
                            </OfficialLabel>
                        </Col>
                        <Col md={4}>
                            <PushBottom>
                                <SearchBox
                                placeholder="Cari peserta"
                                value={inputSearchQuery}
                                onChange={(ev) => setInputSearchQuery(ev.target.value)}
                                />
                            </PushBottom>
                        </Col>
                    </Row>

                </HorizontalSpaced>
            </ToolbarRight>

            <OfficialTable 
                searchName={inputSearchQuery}
            />
        </Container>
    
    </React.Fragment>
  )
}

const HorizontalSpaced = styled.div`
  display: flex;
  gap: 0.5rem;

  > * {
    flex-grow: 1;
  }
`;

const ToolbarRight = styled.div`
  > * + * {
    margin-top: 0.75rem;
  }
`;

const OfficialLabel = styled.div`
margin-top: 5px;
justify-content: flex-end;
color: #757575;
  font-weight: 600;
  font-size: 16px;
`;

const PushBottom = styled.div`
  align-self: flex-end;
`;

export default PageEventOfficial