import * as React from "react";
import styled from "styled-components";

import MetaTags from "react-meta-tags";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { ButtonBlue, ButtonBlueOutline } from "components/ma";

import { users, user } from "./events/home/utils/icon-svgs";
import IconAdd from "components/icons/EventAdd";

const Dashboard = () => {
  return (
    <div className="page-content">
      <MetaTags>
        <title>Dashboard | MyArchery.id</title>
      </MetaTags>

      <Container fluid className="mt-4 mb-5">
        <h1>Dashboard</h1>
        <p>Atur akun &amp; eventmu di sini</p>

        <Row className="mt-5">
          <Col md={6}>
            <CardMenuProfileContainer>
              <CardBody>
                <div className="d-flex ">
                  <div className="menu-thumbnail flex-shrink-0">
                    <div className="menu-icon">
                      <img className="menu-icon-img" src={user} />
                    </div>
                  </div>

                  <div className="flex-grow-1 ms-4">
                    <h2 className="mt-3">Fast Archery</h2>
                    <p className="mt-4 d-flex flex-column">
                      <span>Email</span>
                      <span className="fw-bold">Fastarchery@gmail.com</span>
                    </p>

                    <div className="float-end">
                      <ButtonBlueOutline tag="a" className="menu-link" href="">
                        Edit Profil
                      </ButtonBlueOutline>
                    </div>
                  </div>
                </div>
              </CardBody>
            </CardMenuProfileContainer>
          </Col>

          <Col md={6}>
            <CardMenuContainer>
              <CardBody>
                <div className="menu-icon mb-3">
                  <img className="menu-icon-img" src={users} />
                </div>

                <h3>Users</h3>
                <p>Mengatur pengguna seperti manager event</p>

                <div className="float-end">
                  <a className="menu-link" href="">
                    <i className="bx bx-right-arrow-alt fs-3" style={{ color: "var(--ma-blue)" }} />
                  </a>
                </div>
              </CardBody>
            </CardMenuContainer>
          </Col>
        </Row>

        <div className="d-flex justify-content-between align-items-end my-3">
          <h3 className="mb-0">Events</h3>
          <div>
            <ButtonBlue>+ Tambah Event</ButtonBlue>
          </div>
        </div>

        <Row>
          <Col md={4}>
            <ThumbnailEvent />
          </Col>
          <Col md={4}>
            <ThumbnailEvent />
          </Col>
          <Col md={4}>
            <ThumbnailEvent />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;

function ThumbnailEvent() {
  return (
    <ThumbnailEventWrapper>
      <a className="action-button">
        <span className="action-icon">
          <IconAdd />
        </span>
        <span className="action-label">Tambah Event</span>
      </a>
    </ThumbnailEventWrapper>
  );
}

const ThumbnailEventWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 240px;
  border-radius: 8px;
  border: dashed 2px var(--ma-gray);

  background-color: #ffffff;
  transition: all 0.4s;

  .svg-icon-path {
    stroke: var(--ma-gray);
  }

  .action-button {
    &::before {
      content: " ";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .action-icon {
      transform: translateY(1em);
      transition: transform 0.4s;

      .svg-icon-path {
        transition: stroke 0.4s;
      }
    }

    .action-label {
      color: var(--ma-blue);
      opacity: 0;
      transition: opacity 0.4s;
    }
  }

  &:hover {
    border: dashed 2px var(--ma-blue);

    .action-icon {
      transform: translateY(0);

      .svg-icon-path {
        stroke: var(--ma-blue);
      }
    }

    .action-label {
      opacity: 1;
    }
  }
`;

const CardMenuProfileContainer = styled(Card)`
  overflow: hidden;
  transition: all 0.4s;

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

  &:hover {
    box-shadow: 0 0.75rem 2.5rem rgb(18 38 63 / 12.5%);
    transform: translateY(-0.05rem);
    transition: all 0.4s;

    .effect-pulse {
      transition: all 0.4s;
    }

    &::before {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }

    &::after {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }

    .menu-icon::before {
      transform: scale(1.4);
    }
  }
`;

const CardMenuContainer = styled(Card)`
  overflow: hidden;
  transition: all 0.4s;

  &::before {
    content: " ";
    --radius: 300px;

    position: absolute;
    width: var(--radius);
    height: var(--radius);
    border-radius: var(--radius);

    opacity: 0;
    background-color: #0d47a1;

    transform: translate(-40%, -50%) scale(0);
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
  }

  .menu-icon {
    --icon-radius: 50px;
    width: var(--icon-radius);
    height: var(--icon-radius);

    &::before {
      content: " ";
      position: absolute;
      transition: all 0.4s;

      width: var(--icon-radius);
      height: var(--icon-radius);
      border-radius: var(--icon-radius);

      background-color: #fff971;

      transform: scale(0);
    }

    .menu-icon-img {
      position: relative;
      z-index: 10;
      width: 100%;
      height: 100%;
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

  &:hover {
    box-shadow: 0 0.75rem 2.5rem rgb(18 38 63 / 12.5%);
    transform: translateY(-0.05rem);
    transition: all 0.4s;

    .effect-pulse {
      transition: all 0.4s;
    }

    &::before {
      opacity: 0.08;
      transform: translate(-40%, -50%) scale(1);
    }

    .menu-icon::before {
      transform: scale(1.4);
    }
  }
`;
