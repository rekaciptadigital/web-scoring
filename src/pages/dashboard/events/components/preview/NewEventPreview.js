import * as React from "react";
import styled from "styled-components";

import { Container, Row, Col } from "reactstrap";
import { Button, ButtonOutline } from "components/ma";

const PageWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter";

  .event-banner {
    width: 100%;
    height: 420px;
    background-color: var(--ma-gray-600);
  }

  .event-heading {
    margin-bottom: 0;
    color: var(--ma-blue);
  }

  .event-preview-link {
    color: var(--ma-blue);
  }

  .event-notice-find {
    margin-bottom: 20px;
    padding: 8px 12px;
    border-radius: 8px;
    background-color: #f3f3f3;
  }

  .event-countdown-box {
    padding: 16px 18px;
    border-radius: 4px;
    box-shadow: 0 0.1rem 0.5rem rgb(18 38 63 / 10%);
    text-align: center;

    > *:not(:first-child) {
      margin-top: 1rem;
    }

    .countdown-timer {
      display: flex;
      justify-content: space-evenly;
      gap: 0.5rem;

      .countdown-item {
        display: flex;
        flex-direction: column;
        padding: 0.5rem;
        border-radius: 4px;
        border: solid 1px #eff2f7;
        font-size: 18px;
        font-weight: 600;

        .timer-unit {
          padding: 2px 8px;
          background-color: #eff2f7;
          font-size: 11px;
          font-weight: 400;
        }
      }
    }
  }

  .event-team-tabs {
    display: flex;
    list-style: none;
    padding: 0;
    gap: 1rem;

    .event-team-item {
      display: inline-block;
      padding: 0.8rem 1.5rem;
      border-radius: 2rem;
      border: solid 1px var(--ma-gray-400);
      background-color: transparent;
      font-size: 1rem;
      color: var(--ma-gray-500);

      &.team-active {
        background-color: var(--ma-gray-400);
        color: #ffffff;
      }
    }
  }

  .event-category-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    .event-category-card {
      padding: 12px 1rem;
      border-radius: 4px;
      box-shadow: 0 0.25rem 1rem rgb(18 38 63 / 5%);
      background-color: #ffffff;

      .heading-category-name {
        color: var(--ma-blue);
      }

      .body-category-detail {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .category-quota-label {
          padding: 4px 8px;
          border-radius: 1em;
          background-color: #aeddc2;
        }
      }
    }
  }
`;

function NewEventPreview({ eventData }) {
  return (
    <PageWrapper>
      <Container fluid>
        <div className="event-banner">Gambar</div>

        <Row className="mt-3">
          <Col md="8">
            <h1 className="event-heading">{eventData.eventName}</h1>
            <div>Oleh Pro Archery Club</div>

            <div className="mt-5">
              {/* Optional field */}
              {eventData?.description && (
                <React.Fragment>
                  <h5>Deskripsi</h5>
                  <p>{eventData.description}</p>
                </React.Fragment>
              )}

              {/* Required fields */}
              <h5>Waktu &amp; Tempat</h5>
              <table className="mb-3">
                <tbody>
                  <tr>
                    <td>Tanggal Event</td>
                    <td>:</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Lokasi</td>
                    <td>:</td>
                    <td>{eventData.location}</td>
                  </tr>
                  <tr>
                    <td>Kota</td>
                    <td>:</td>
                    <td>{eventData.city}</td>
                  </tr>
                  <tr>
                    <td>Lapangan</td>
                    <td>:</td>
                    <td>{eventData.locationType}</td>
                  </tr>
                </tbody>
              </table>

              {eventData.eventInformations?.map((info) => (
                <React.Fragment key={info.key}>
                  <h5>{info.title}</h5>
                  <p>{info.description}</p>
                </React.Fragment>
              ))}

              <h5>Biaya Registrasi</h5>
            </div>
          </Col>

          <Col md="4">
            <div className="event-notice-find">
              Temukan lebih banyak event panahan di{" "}
              <a className="event-preview-link">myarchery.id</a>
            </div>

            <div className="event-countdown-box">
              <h5>Waktu tersisa</h5>

              <div className="countdown-timer">
                <div className="countdown-item">
                  266
                  <span className="timer-unit">Hari</span>
                </div>
                <div className="countdown-item">
                  266
                  <span className="timer-unit">Jam</span>
                </div>
                <div className="countdown-item">
                  266
                  <span className="timer-unit">Menit</span>
                </div>
                <div className="countdown-item">
                  266
                  <span className="timer-unit">Detik</span>
                </div>
              </div>

              <Button style={{ width: "100%" }}>Daftar</Button>
            </div>

            <div className="mt-4">
              <ButtonOutline style={{ width: "100%" }}>Leaderboard &amp; Hasil</ButtonOutline>
            </div>
          </Col>
        </Row>

        <div>
          <h5>Kategori Lomba</h5>

          <div className="event-team-tabs mt-3 mb-4">
            <div>
              <button className="event-team-item team-active">Individu</button>
            </div>
            <div>
              <button className="event-team-item">Male Team</button>
            </div>
            <div>
              <button className="event-team-item">Female Team</button>
            </div>
            <div>
              <button className="event-team-item">Mixed Team</button>
            </div>
          </div>

          <div className="event-category-grid">
            {[1, 1, 1, 1, 1, 1].map((category, index) => (
              <div key={index} className="event-category-card">
                <h4 className="heading-category-name">Umum - Barebow - 50m</h4>
                <div className="mt-4 body-category-detail">
                  <div>
                    <span className="category-quota-label">0/100</span>
                  </div>
                  <div>
                    <ButtonOutline disabled corner="8" style={{ width: 100 }}>
                      Daftar
                    </ButtonOutline>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}

export default NewEventPreview;
