import * as React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import queryString from "query-string";
import { EventsService } from "services";

import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import { ButtonBlue } from "components/ma";

import ShareInstagram from "components/icons/social-share/Instagram";
import ShareFacebook from "components/icons/social-share/Facebook";
import ShareTwitter from "components/icons/social-share/Twitter";
import CopyChain from "components/icons/CopyChain";

const CongratulationCardContainer = styled.div`
  width: 100%;

  .card-congratulations {
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: space-around;

    margin: auto;
    margin-top: 4rem;
    padding: 4.5rem;
    max-width: 480px;
    height: 440px;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 5px 20px rgba(18, 38, 63, 0.07);

    text-align: center;

    .heading {
      margin-bottom: 1rem;
      font-size: 2rem;
      font-weight: 400;
    }

    &.invalid {
      justify-content: center;

      .heading {
        font-size: 1.5rem;
        color: var(--ma-gray-400)
      }

      > *:first-child {
        margin-bottom: 1.5rem;
      }
    }

    .link-textbox {
      position: relative;
      margin-bottom: 1rem;

      .link-textbox-input {
        display: inline-block;
        width: 100%;
        padding: 11px 12px;
        border: none;
        border-radius: 4px;
        background-color: #f8f8f8;
        font-size: 12px;
        font-weight: 400;
        color: #495057;
      }

      .link-textbox-icon {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        padding: 0 12px;
        display: flex;
        justify-content: center;
        align-items: center;

        &::before {
          content: " ";
          position: absolute;
          z-index: 0;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-color: #f8f8f8;
          opacity: 0.8;
        }

        .link-textbox-icon-button {
          position: relative;
          z-index: 10;
        }
      }
    }

    .social-share-box {
      margin-bottom: 1rem;
      padding: 0.5rem 0;

      .heading-share-to {
        margin-bottom: 0.9rem;
        font-size: 14px;
        font-weight: 500;
        color: #000000;
      }

      .list-social-media {
        list-style: none;
        padding: 0;
        margin: 0;

        display: flex;
        justify-content: center;
        gap: 2.2rem;

        .item-social {
          font-size: 10px;
        }
      }
    }
  }
`;

function CongratulationsContent({ withSocialSharing }) {
  const { search } = useLocation();
  const eventId = queryString.parse(search)?.event;

  const [event, setEvent] = React.useState(null);
  const [eventError, setEventError] = React.useState(false);

  React.useEffect(() => {
    const fetchEvent = async () => {
      const { success, data, errors } = await EventsService.getEventById({ id: eventId });
      if (success) {
        setEvent(data);
      } else if (errors) {
        setEventError(true);
      }
    };
    fetchEvent();
  }, []);

  const handleClickCopyLink = () => {
    navigator.clipboard.writeText(event.eventUrl);
  };

  if (!eventId || eventError) {
    return (
      <div className="card-congratulations invalid">
        <h3 className="mt-4 heading">Event tidak valid</h3>
        <div>
          <ButtonBlue as={Link} to="/dashboard">
            Kembali ke Dashboard
          </ButtonBlue>
        </div>
      </div>
    );
  }

  if (!event) {
    return <div className="card-congratulations">Sedang memuat data event...</div>;
  }

  if (event) {
    return (
      <div className="card-congratulations">
        <div>
          <h1 className="heading">Selamat Eventmu Sudah Live</h1>

          <div className="link-textbox">
            <input className="link-textbox-input" value={event.eventUrl} readOnly />
            <span className="link-textbox-icon">
              <a className="link-textbox-icon-button" onClick={handleClickCopyLink}>
                <CopyChain />
              </a>
            </span>
          </div>
        </div>

        {withSocialSharing && (
          <div className="social-share-box">
            <h6 className="heading-share-to">Share to</h6>
            <ul className="list-social-media">
              <li className="item-social">
                <Link to="#">
                  <ShareFacebook />
                </Link>
              </li>

              <li className="item-social">
                <Link to="#">
                  <ShareTwitter />
                </Link>
              </li>

              <li className="item-social">
                <Link to="#">
                  <ShareInstagram />
                </Link>
              </li>
            </ul>
          </div>
        )}

        <div>
          <ButtonBlue as={Link} to="/dashboard">
            Kembali ke Dashboard
          </ButtonBlue>
        </div>
      </div>
    );
  }
}

export default function PageCongratulations() {
  return (
    <div className="page-content">
      <MetaTags>
        <title>Event baru berhasil dibuat! | MyArchery.id</title>
      </MetaTags>

      <Container fluid className="mt-4 mb-5">
        <CongratulationCardContainer>
          <CongratulationsContent />
        </CongratulationCardContainer>
      </Container>
    </div>
  );
}
