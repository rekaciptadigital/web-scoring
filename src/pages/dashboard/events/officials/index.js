import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import { SubNavbar } from "../components/submenus-settings";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import TableOfficial from "./components/TableOfficial";
import { OfficialService } from "services";

function PageEventOfficial() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const [members, setMembers] = useState([]);

  const getMember = async () => {
      try {
          const { message, errors, data } = await OfficialService.get({
            event_id: event_id,
          });
        if (message === "Success") {
            setMembers(data?.data);
        }
        console.info(errors);
      } catch (errors) {
        console.log(errors);
      }
  };

  useEffect(() => {
      getMember();
  }, [event_id]);

  console.log(members, 'data');

  return (
    <ContentLayoutWrapper pageTitle="Pengaturan Official" navbar={<SubNavbar eventId={eventId} />}>
      <CardSheet>
        <div>
            <TableOfficial members={members} />
        </div>

      </CardSheet>
    </ContentLayoutWrapper>
  );
}

const CardSheet = styled.div`
  position: relative;
  margin-bottom: 24px;

  padding: 35px;
  border: 0 solid #f6f6f6;
  border-radius: 8px;
  background-color: #ffffff;
  background-clip: border-box;
  box-shadow: 0 0.75rem 1.5rem rgb(18 38 63 / 3%);
`;

export default PageEventOfficial;
