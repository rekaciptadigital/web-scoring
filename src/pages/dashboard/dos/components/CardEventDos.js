import * as React from "react";
import styled from "styled-components";

import { useDispatch } from "react-redux";

import * as AuthStore from "store/slice/authentication";
import { AdminService } from "services";

import { Link, useParams } from "react-router-dom";
import { Card, CardBody } from "reactstrap";

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

  .detail-link {
        font-style: italic;
        font-weight: 500;
        font-size: 14px;
        color: #0D47A1;
  }

  .date-banner {
      &,
      &:focus,
      &:active {
          background-color: #ffffff;
          border: solid 1px var(--ma-blue);
          border-radius: 0.5rem;
      color: var(--ma-blue) !important;
      box-shadow: none;
      padding: 5px;
    }
  
    &:hover {
      background-color: var(--ma-blue);
      color: #ffffff !important;
      padding: 5px;
    }
  }
`;

function CardEventDos(cardData) {
  const dispatch = useDispatch();
  const { event_id } = useParams();

  React.useEffect(() => {
    const getUser = async () => {
      const { data, success } = await AdminService.profile();
      if (success) {
        dispatch(AuthStore.profile(data));
      }
    };
    getUser();
  }, []);

  return (
      <>
      {cardData?.cardData.map((item) => (
        // eslint-disable-next-line react/jsx-key
        <CardMenuProfileContainer>
        <CardBody>
        <div className="d-flex ">
        <div className="flex-grow-1 ms-4">
        <React.Fragment>
        <h4 className="mt-1">{item?.dateFormatted}</h4>
        <p className="mt-2 d-flex flex-column">
        <span>Update event pertandingan untuk DOS</span>
        </p>
        
        <div style={{ background: '#E7EDF6', padding: '20px', borderRadius: '8px' }}>
        
        <span className="date-banner">
        {item?.status}
        </span>
        
        <div className="float-end">
        <Link to={`/dashboard/event/${event_id}/${item?.date}/dos-qualification`}>
        <span className="detail-link">
        Lihat Detail 
        </span>
        <span style={{ marginLeft: '20px', fontSize: '16px', color: '#0D47A1'}} >
        &#62;
        </span>
        </Link>
        </div>
        </div>
        </React.Fragment>
        </div>
        </div>
        </CardBody>
        </CardMenuProfileContainer>
    ))}
    </>
        );
    }
    
    export default CardEventDos;
    