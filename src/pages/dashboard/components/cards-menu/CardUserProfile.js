import * as React from "react";
import styled from "styled-components";
import { useUserProfile } from "hooks/user-profile";

import { Link } from "react-router-dom";
import { Card, CardBody } from "reactstrap";
import { ButtonBlueOutline } from "components/ma";
import { user as userIcon } from "pages/dashboard/events/home/utils/icon-svgs";

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
    overflow: hidden;
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

    .menu-user-avatar {
      &-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
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

function CardUserProfile() {
  const { userProfile } = useUserProfile();
  return (
    <CardMenuProfileContainer>
      <CardBody>
        <div className="d-flex ">
          {!userProfile?.avatar ? (
            <div className="menu-thumbnail flex-shrink-0">
              <div className="menu-icon">
                <img className="menu-icon-img" src={userIcon} />
              </div>
            </div>
          ) : (
            <div className="menu-thumbnail flex-shrink-0">
              <div className="menu-user-avatar">
                <img className="menu-user-avatar-img" src={userProfile?.avatar} />
              </div>
            </div>
          )}

          <div className="flex-grow-1 ms-4">
            {!userProfile ? (
              <h2 className="mt-3">Sedang memuat data...</h2>
            ) : (
              <React.Fragment>
                <h2 className="mt-3">{userProfile.name}</h2>
                <p className="mt-4 d-flex flex-column">
                  <span>Email</span>
                  <span className="fw-bold">{userProfile.email}</span>
                </p>

                <div className="float-end">
                  <ButtonBlueOutline tag={Link} className="menu-link" to="/dashboard/profile">
                    Edit Profil
                  </ButtonBlueOutline>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </CardBody>
    </CardMenuProfileContainer>
  );
}

export default CardUserProfile;
