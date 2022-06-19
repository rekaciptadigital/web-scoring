import * as React from "react";
import styled from "styled-components";

import { useSelector, useDispatch } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { AdminService } from "services";
import { Card, CardBody, Row, Col } from "reactstrap";
import iconSchedule from "../../../../assets/images/schedule.png";

const CardMenuProfileContainer = styled(Card)`
transition: all 0.4s;
overflow-y: auto:

  &::before {
    content: " ";
    --radius: 300px;

    position: absolute;
    width: var(--radius);
    height: var(--radius);
    border-radius: var(--radius);

    opacity: 0;
    background-color: none;
    border: solid 2px var(--ma-blue);

    transform: translate(-50%, -50%) scale(0);
    transition: all 0.4s;
  }

  &::after {
    content: " ";
    --radius: 70px;

    position: absolute;
    width: var(--radius);
    height: var(--radius);
    border-radius: var(--radius);

    opacity: 0;
    background-color: none;
    border: solid 1px #3d7cde;

    transform: translate(-50%, -50%) scale(0);
    transition: all 0.4s;
  }

  .card-body {
    z-index: 10;
  }

  .menu-thumbnail {
    display: flex;
    justify-content: center;
    align-items: center;

    --thumbnail-radius: 150px;
    width: var(--thumbnail-radius);
    height: var(--thumbnail-radius);
    border-radius: var(--thumbnail-radius);

    background-color: #efefef;

    .menu-icon {
      --icon-radius: 52px;
      width: var(--icon-radius);
      height: var(--icon-radius);

      .menu-icon-img {
        position: relative;
        z-index: 10;
        width: 100%;
        height: 100%;
      }
    }
  }

  .menu-link::before {
    content: " ";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .detail-link {
    font-style: italic;
    font-weight: 500;
    font-size: 14px;
    color: #0D47A1;
  }

  .text-banner {
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 140%;

  }

  .title-banner {
    font-weight: 600;
    font-size: 24px;
    line-height: 120%;
    color: #0D47A1;
  }

  .content-scroll {
    overflow-y: scroll:
    height: 400px;
  }
`;

function CardSchedule(cardData, {eventName}) {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const getUser = async () => {
      const { data, success } = await AdminService.profile();
      if (success) {
        dispatch(AuthStore.profile(data));
      }
    };
    getUser();
  }, []);

  console.log(eventName, 'ta');
  return (
    <>
    <CardMenuProfileContainer>
      <CardBody>
        <div className="d-flex ">
          <div className="flex-grow-1 ms-4">
            {!userProfile ? (
                <h2 className="mt-3">Sedang memuat data...</h2>
                ) : (
                    <React.Fragment>
                  <Row>    
                      <Col lg={9}>
                        <h4 className="mt-1 title-banner">Jadwal Pertandingan</h4>
                      </Col>
                      <Col lg={3}>
                          <img className="float-end" src={iconSchedule}/>
                      </Col>                  
                  </Row>

                  <Row>
                    <p className="d-flex flex-column text-banner">Berikut adalah kategori perlombaan yang dipertandingkan pada event ini, antara lain:</p>
                        {cardData?.cardData.map((item) => (
                          <>
                            <div className="content-scroll">
                            <p className="text-banner">{item?.dateFormatted}</p>
                            <ol className="text-banner">
                                {item?.schedule.map((detail) => (
                                    // eslint-disable-next-line react/jsx-key
                                    <li>{detail?.categoryDetailLabel}</li>
                                ))}
                            </ol>
                            </div>
                          </>
                        ))}
                  </Row>

              </React.Fragment>
            )}
          </div>
        </div>
      </CardBody>
    </CardMenuProfileContainer>
    </>
  );
}

export default CardSchedule;
