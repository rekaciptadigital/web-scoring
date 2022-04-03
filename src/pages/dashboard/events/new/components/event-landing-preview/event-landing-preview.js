import * as React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useWizardView } from "utils/hooks/wizard-view";
import { eventCategories } from "constants/index";
import * as AuthStore from "store/slice/authentication";

import CurrencyFormat from "react-currency-format";
import { Container, Row, Col } from "reactstrap";
import { Button, ButtonOutline, WizardView, WizardViewContent } from "components/ma";

import classnames from "classnames";
import format from "date-fns/format";
import id from "date-fns/locale/id";

const { TEAM_CATEGORIES } = eventCategories;

const categoryTabsList = [
  { step: 1, label: "Individu", teamCategory: TEAM_CATEGORIES.TEAM_INDIVIDUAL },
  { step: 2, label: "Male Team", teamCategory: TEAM_CATEGORIES.TEAM_MALE },
  { step: 3, label: "Female Team", teamCategory: TEAM_CATEGORIES.TEAM_FEMALE },
  { step: 4, label: "Mixed Team", teamCategory: TEAM_CATEGORIES.TEAM_MIXED },
];

function computeCategoriesByTeam(categoriesData) {
  const categoriesByTeam = {
    [TEAM_CATEGORIES.TEAM_INDIVIDUAL]: [],
    [TEAM_CATEGORIES.TEAM_MALE]: [],
    [TEAM_CATEGORIES.TEAM_FEMALE]: [],
    [TEAM_CATEGORIES.TEAM_MIXED]: [],
  };

  categoriesData.forEach((competition) => {
    competition.categoryDetails?.forEach((detail) => {
      detail.distance?.forEach((distanceItem, index) => {
        const newCategory = {
          ...detail,
          key: `${detail.key}-${index + 1}`,
          competitionCategory: competition.competitionCategory?.label,
          ageCategory: detail.ageCategory?.label,
          distance: distanceItem.label,
          teamCategory: detail.teamCategory?.label,
        };

        if (
          detail.teamCategory?.value === TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE ||
          detail.teamCategory?.value === TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE
        ) {
          categoriesByTeam[TEAM_CATEGORIES.TEAM_INDIVIDUAL].push(newCategory);
        } else if (detail.teamCategory?.value) {
          categoriesByTeam[detail.teamCategory.value].push(newCategory);
        }
      });
    });
  });

  return categoriesByTeam;
}

function EventLandingPreview({ eventData }) {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  const { steps, currentStep, goToStep } = useWizardView(categoryTabsList);

  const categoriesByTeam = React.useMemo(
    () => computeCategoriesByTeam(eventData.eventCategories),
    []
  );

  return (
    <PageWrapper>
      <Container fluid>
        <div className="event-banner">
          <img className="event-banner-image" src={eventData.bannerImage?.preview} />
        </div>

        <Row className="mt-3">
          <Col md="8">
            <h1 className="event-heading">{eventData.eventName}</h1>
            {userProfile?.name && <div>Oleh {userProfile.name}</div>}

            <div className="content-section mt-5">
              {/* Optional field */}
              {eventData?.description && (
                <React.Fragment>
                  <h5 className="content-info-heading">Deskripsi</h5>
                  <p>{eventData.description}</p>
                </React.Fragment>
              )}

              {/* Required fields */}
              <h5 className="content-info-heading">Waktu &amp; Tempat</h5>
              <table className="mb-3 content-info-time-place">
                <tbody>
                  <tr>
                    <td style={{ minWidth: 120 }}>Tanggal Event</td>
                    <td style={{ minWidth: "0.5rem" }}>:</td>
                    <td>
                      {eventData.eventDateStart && eventData.eventDateEnd ? (
                        <React.Fragment>
                          {format(eventData.eventDateStart, "d MMMM yyyy", { locale: id })}
                          &nbsp;-&nbsp;
                          {format(eventData.eventDateEnd, "d MMMM yyyy", { locale: id })}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>&mdash;</React.Fragment>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Lokasi</td>
                    <td>:</td>
                    <td>{eventData.location}</td>
                  </tr>
                  <tr>
                    <td>Kota</td>
                    <td>:</td>
                    <td>{eventData.city?.label}</td>
                  </tr>
                  <tr>
                    <td>Lapangan</td>
                    <td>:</td>
                    <td>{eventData.locationType}</td>
                  </tr>
                </tbody>
              </table>

              {eventData.extraInfos?.map((info) => (
                <React.Fragment key={info.key}>
                  <h5 className="content-info-heading">{info.title}</h5>
                  <p>{info.description}</p>
                </React.Fragment>
              ))}

              <h5 className="content-info-heading">Biaya Registrasi</h5>
              <p>
                {eventData.registrationDateStart && eventData.registrationDateEnd && (
                  <React.Fragment>
                    Tanggal registrasi{" "}
                    {format(eventData.registrationDateStart, "d MMMM yyyy", { locale: id })}
                    &nbsp;-&nbsp;
                    {format(eventData.registrationDateEnd, "d MMMM yyyy", { locale: id })}
                    <br />
                  </React.Fragment>
                )}
                <CopywritingRegistrationFee eventData={eventData} />
              </p>
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

              <Button style={{ width: "100%" }} disabled className="button-preview">
                Daftar
              </Button>
            </div>

            <div className="mt-4">
              <ButtonOutline disabled className="button-preview-outline button-leaderboard">
                Leaderboard &amp; Hasil
              </ButtonOutline>
            </div>
          </Col>
        </Row>

        <div className="mt-4">
          <h5 className="text-black">Kategori Lomba</h5>

          <div className="event-team-tabs mt-3 mb-4">
            {steps.map((tabItem) => (
              <div key={tabItem.step}>
                <button
                  className={classnames("event-team-item", {
                    "team-active": currentStep === tabItem.step,
                  })}
                  onClick={() => goToStep(tabItem.step)}
                >
                  {tabItem.label}
                </button>
              </div>
            ))}
          </div>

          <WizardView currentStep={currentStep}>
            <WizardViewContent>
              <EventCategoryGrid categories={categoriesByTeam[TEAM_CATEGORIES.TEAM_INDIVIDUAL]} />
            </WizardViewContent>
            <WizardViewContent>
              <EventCategoryGrid categories={categoriesByTeam[TEAM_CATEGORIES.TEAM_MALE]} />
            </WizardViewContent>
            <WizardViewContent>
              <EventCategoryGrid categories={categoriesByTeam[TEAM_CATEGORIES.TEAM_FEMALE]} />
            </WizardViewContent>
            <WizardViewContent>
              <EventCategoryGrid categories={categoriesByTeam[TEAM_CATEGORIES.TEAM_MIXED]} />
            </WizardViewContent>
          </WizardView>
        </div>
      </Container>
    </PageWrapper>
  );
}

function CopywritingRegistrationFee({ eventData }) {
  if (eventData.isFlatRegistrationFee && !eventData.registrationFee) {
    return <React.Fragment>Gratis</React.Fragment>;
  }

  if (eventData.isFlatRegistrationFee) {
    return (
      <React.Fragment>
        Mulai dari{" "}
        <CurrencyFormat
          displayType={"text"}
          value={eventData.registrationFee}
          prefix="Rp&nbsp;"
          thousandSeparator={"."}
          decimalSeparator={","}
          decimalScale={2}
          fixedDecimalScale
        />
      </React.Fragment>
    );
  }

  if (eventData.registrationFees?.length) {
    const selectedTeamCategories = [];
    for (const categoryGroup of eventData.eventCategories) {
      for (const detail of categoryGroup.categoryDetails) {
        if (!detail.teamCategory?.value) {
          continue;
        }

        if (
          detail.teamCategory.value === TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE ||
          detail.teamCategory.value === TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE
        ) {
          selectedTeamCategories.push(TEAM_CATEGORIES.TEAM_INDIVIDUAL);
        } else {
          selectedTeamCategories.push(detail.teamCategory?.value);
        }
      }
    }

    const onlySelectedCategory = (fee) => {
      const isTeamCategorySelected = selectedTeamCategories.some(
        (team) => team === fee.teamCategory
      );
      return isTeamCategorySelected && Boolean(fee.amount);
    };

    const lowToHigh = (feeA, feeB) => {
      if (feeA.amount === feeB.amount) {
        return 0;
      }
      if (feeA.amount < feeB.amount) {
        return -1;
      }
      return 1;
    };

    const sortedFees = eventData.registrationFees.filter(onlySelectedCategory).sort(lowToHigh);
    const lowestFee = sortedFees[0]?.amount;

    return (
      <React.Fragment>
        Mulai dari{" "}
        {lowestFee ? (
          <CurrencyFormat
            displayType={"text"}
            value={lowestFee}
            prefix="Rp&nbsp;"
            thousandSeparator={"."}
            decimalSeparator={","}
            decimalScale={2}
            fixedDecimalScale
          />
        ) : (
          <React.Fragment>gratis</React.Fragment>
        )}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <span>&laquo;Data harga tidak tersedia&raquo;</span>
    </React.Fragment>
  );
}

function EventCategoryGrid({ categories }) {
  return (
    <div className="event-category-grid">
      {categories.map((category, index) => (
        <div key={index} className="event-category-card">
          <h5 className="heading-category-name">
            {category.ageCategory} - {category.competitionCategory} - {category.distance}
          </h5>
          <div className="mt-4 body-category-detail">
            <div>
              <span className="category-quota-label">0&#47;{category.quota}</span>
            </div>
            <div>
              <ButtonOutline
                disabled
                corner="8"
                className="button-preview button-card-regist"
                style={{ width: 120 }}
              >
                Daftar
              </ButtonOutline>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const PageWrapper = styled.div`
  margin: 40px 0;
  font-family: "Inter";

  .event-banner {
    position: relative;
    width: 100%;
    padding-top: 42%;
    background-color: var(--ma-gray-600);

    .event-banner-image {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  .event-heading {
    margin-bottom: 0;
    color: var(--ma-blue);
  }

  .content-section {
    color: #000000;

    .content-info-heading {
      margin-top: 2rem;
      color: #000000;
    }

    .content-info-time-place td {
      cursor: initial;
    }
  }

  .event-preview-link {
    color: var(--ma-blue);
  }

  .button-preview {
    transition: all 0.2s;

    &:hover {
      box-shadow: none;
      opacity: 0.4;
    }
  }

  .button-preview-outline {
    transition: all 0.2s;

    &:disabled {
      background-color: transparent;
      border: solid 1px var(--ma-gray-200) !important;
      color: var(--ma-gray-400);
    }

    &:hover {
      box-shadow: none;
      opacity: 0.7;
    }
  }

  .button-leaderboard {
    width: 100%;
    text-align: center;
  }

  .event-notice-find {
    margin-bottom: 20px;
    padding: 8px 12px;
    border-radius: 8px;
    background-color: #f3f3f3;
    color: #000000;
  }

  .event-countdown-box {
    padding: 16px 18px;
    border-radius: 4px;
    box-shadow: 0 0.1rem 0.5rem rgb(18 38 63 / 10%);
    text-align: center;
    color: #000000;

    h5 {
      color: #000000;
    }

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
    gap: 0.75rem;

    .event-team-item {
      display: inline-block;
      padding: 0.8rem 1.5rem;
      border-radius: 2rem;
      border: solid 1px var(--ma-gray-400);
      background-color: transparent;
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
      background-color: #ffffff;
      transition: box-shadow 0.5s, transform 0.25s;

      &:hover {
        box-shadow: 0 0.3rem 0.75rem rgb(18 38 63 / 10%);
        transform: translateY(-0.75px);

        .button-card-regist {
          border-color: var(--ma-blue);
          background-color: var(--ma-blue);

          &:hover {
            border-color: var(--ma-gray-400);
            background-color: var(--ma-gray-400);
          }
        }
      }

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

export default EventLandingPreview;
