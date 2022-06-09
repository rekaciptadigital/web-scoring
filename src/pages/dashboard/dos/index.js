import * as React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { DosService } from "services";
import MetaTags from "react-meta-tags";
import { Container, Row, Col } from "reactstrap";
import { CardEventDos, CardRingkasanDos, CardSchedule } from "./components";

const DashboardDos = () => {
    const { event_id } = useParams();
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
  
      const getDosData = async () => {
        const queryString = { event_id: event_id };
        const result = await DosService.get(
          queryString,
        );
        
        if (result.success) {
          setData(
            {
              ...data,
              dataDos: result?.data,
            });
        }
      }

      getDosData();
    }, [event_id]);

    return (
    <StyledPageWrapper>
      <MetaTags>
        <title>Dashboard DOS | MyArchery.id</title>
      </MetaTags>

      <Container fluid className="mt-4 mb-5">
        <h1>Dashboard DOS</h1>

        <Row className="mt-5">
          <Col md={6}>
            {data?.dataDos && data?.dataDos.length > 0 ? (
              <CardEventDos cardData={data?.dataDos}/>
            ) : <p>Loading ...</p>}
          </Col>

          <Col md={6}>
            <CardRingkasanDos/>  
            {data?.dataDos && data?.dataDos.length > 0 ? (
              <CardSchedule cardData={data?.dataDos}/>
            ) : <p>Loading ...</p>}
          </Col>
        </Row>

      </Container>
    </StyledPageWrapper>
  );
};

const StyledPageWrapper = styled.div`
  margin: 4rem 0;
`;

export default DashboardDos;
