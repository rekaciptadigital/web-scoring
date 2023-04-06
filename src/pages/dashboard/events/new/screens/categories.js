import * as React from "react";
import styled from "styled-components";
import {
  useCompetitionCategories,
  useAgeCategories,
  useDistanceCategories,
} from "../hooks/archery-categories";
import { useSubmitCategories } from "../hooks/submit-categories";

import SweetAlert from "react-bootstrap-sweetalert";
import {
  Button,
  ButtonBlue,
  ButtonOutlineBlue,
  AlertSubmitError,
} from "components/ma";
import { FieldSelectSmall } from "../../components/form-fields";
import { LoadingScreen } from "../components/loading-screen-portal";
import { toast } from "../components/processing-toast";
import { FieldInputQuota } from "./field-input-quota";
import { FieldSelectClass } from "./field-select-class";

import IconPlus from "components/ma/icons/mono/plus";
import IconTrash from "components/ma/icons/mono/trash";
import illustrationAlertPublication from "assets/images/events/alert-publication.svg";

function ScreenCategories({ eventDetail, fetchEventDetail, form, formFees }) {
  const { data, setMaxLengthFromOptions } = form;
  const { options: optionsCompetitionCategories } = useCompetitionCategories();
  const { options: optionsAgeCategories } = useAgeCategories();
  const { options: optionsDistanceCategories } = useDistanceCategories();

  React.useEffect(() => {
    if (!optionsCompetitionCategories?.length) {
      return;
    }
    setMaxLengthFromOptions(optionsCompetitionCategories?.length);
  }, [optionsCompetitionCategories?.length]);

  const unselectedCompetitionCategories = getUnselectedCompetitionCategories(
    data,
    optionsCompetitionCategories
  );

  return (
    <div>
      {Boolean(data?.length) &&
        data.map((category) => {
          return (
            <CategoriesByCompetition
              key={category.key}
              eventDetail={eventDetail}
              fetchEventDetail={fetchEventDetail}
              form={form}
              formFees={formFees}
              category={category}
              defaultCompetitionCategory={unselectedCompetitionCategories[0]}
              optionsCompetitionCategories={unselectedCompetitionCategories}
              optionsAgeCategories={optionsAgeCategories}
              optionsDistanceCategories={optionsDistanceCategories}
            />
          );
        })}
    </div>
  );
}

const CardSheet = styled.div`
  /* position: relative; */
  /* z-index: 0; */
  margin-bottom: 24px;

  padding: 35px;
  border: 0 solid #f6f6f6;
  border-radius: 8px;
  background-color: #ffffff;
  background-clip: border-box;
  box-shadow: 0 0.75rem 1.5rem rgb(18 38 63 / 3%);
`;

const VerticalSpacedBox = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const CompetitionCategorySelector = styled.div`
  margin-bottom: 1rem;
  max-width: 16rem;
`;

const CategoryBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem 1rem;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;

    > * + * {
      margin-left: 0.5rem;
    }
  }
`;

const PairedFields = styled.div`
  display: flex;
  gap: 1.5rem 1rem;

  > * {
    flex: 1;
  }
`;

const ClassGroup = styled.div`
  padding: 1rem;
  border: 1px solid var(--ma-gray-200);
  border-radius: 0.5rem;
`;

const DetailQuotaGrid = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  > * {
    width: 0;
    flex: 1;
  }
`;

/* ============================================= */

function CategoriesByCompetition({
  eventDetail,
  fetchEventDetail,
  form,
  formFees,
  category,
  defaultCompetitionCategory,
  optionsCompetitionCategories,
  optionsAgeCategories,
  optionsDistanceCategories,
}) {
  const {
    data,
    selectCompetitionCategory,
    selectCategoryDetailItem,
    setQuotaAmount,
    removeCategoryByKey,
    createEmptyCategoryDetail,
    removeCategoryDetailByKey,
  } = form;
  const { checkIsTeamActive } = formFees;

  React.useEffect(() => {
    if (!defaultCompetitionCategory || category.competitionCategoryId) {
      return;
    }
    selectCompetitionCategory(category.key, defaultCompetitionCategory);
  }, [category.competitionCategoryId, defaultCompetitionCategory]);

  const {
    deleteByCompetitionCategory,
    deleteByCategoryClass,
    isLoading: isSubmitingCategories,
    isError: isErrorCategories,
    errors: categoriesErrors,
  } = useSubmitCategories();

  return (
    <CardSheet>
      <LoadingScreen loading={isSubmitingCategories} />
      <AlertSubmitError isError={isErrorCategories} errors={categoriesErrors} />

      <CompetitionCategorySelector>
        <FieldSelectSmall
          name={`competitionCategoryId-${category.key}`}
          options={optionsCompetitionCategories}
          value={category.competitionCategoryId}
          onChange={(value) => {
            selectCompetitionCategory(category.key, value);
          }}
        >
          Kategori
        </FieldSelectSmall>
      </CompetitionCategorySelector>

      <VerticalSpacedBoxLoose>
        {category.categoryDetails.map((detail) => {
          return (
            <CategoryBlock key={detail.key}>
              <ClassGroup>
                <VerticalSpacedBox>
                  <PairedFields>
                    <FieldSelectClass
                      name={`ageCategoryId-${detail.key}`}
                      options={optionsAgeCategories}
                      value={detail.ageCategoryId}
                      onChange={(value) => {
                        selectCategoryDetailItem(
                          "ageCategoryId",
                          category.key,
                          detail.key,
                          value
                        );
                      }}
                    >
                      Kelas
                    </FieldSelectClass>

                    <FieldSelectSmall
                      name={`distanceId-${detail.key}`}
                      options={optionsDistanceCategories}
                      value={detail.distanceId}
                      onChange={(value) => {
                        selectCategoryDetailItem(
                          "distanceId",
                          category.key,
                          detail.key,
                          value
                        );
                      }}
                    >
                      Jarak
                    </FieldSelectSmall>
                  </PairedFields>

                  <div>
                    <h6 className="fw-bold">Detail Kategori</h6>
                    <DetailQuotaGrid>
                      {detail.quotas.map((quota) => {
                        const teamName = getTeamName(quota.teamCategoryId);
                        const isDisabled = !checkIsTeamActive(teamName);
                        return (
                          <div key={quota.teamCategoryId}>
                            <FieldInputQuota
                              name={`quota-${quota.teamCategoryId}-${detail.key}`}
                              placeholder="kuota"
                              disabled={isDisabled}
                              value={quota.quota || ""}
                              onChange={(ev) => {
                                setQuotaAmount(
                                  quota.teamCategoryId,
                                  category.key,
                                  detail.key,
                                  ev.target.value
                                );
                              }}
                            >
                              {quota.teamCategoryLabel}
                            </FieldInputQuota>
                          </div>
                        );
                      })}
                    </DetailQuotaGrid>
                  </div>
                </VerticalSpacedBox>
              </ClassGroup>

              <div>
                <Button
                  flexible
                  onClick={() => createEmptyCategoryDetail(category.key)}
                >
                  <IconPlus size="13" />
                </Button>

                <ButtonWithConfirmPrompt
                  flexible
                  disabled={category.categoryDetails.length <= 1}
                  messagePrompt="Ingin hapus kategori?"
                  buttonConfirmLabel="Hapus"
                  onConfirm={() => {
                    if (!detail.isAlive) {
                      removeCategoryDetailByKey(category.key, detail.key);
                    } else {
                      deleteByCategoryClass(detail, {
                        eventId: eventDetail?.id,
                        onSuccess() {
                          toast.success("Berhasil menghapus kategori");
                          fetchEventDetail();
                        },
                      });
                    }
                  }}
                >
                  <IconTrash size="13" />
                </ButtonWithConfirmPrompt>
              </div>
            </CategoryBlock>
          );
        })}

        <div>
          <ButtonWithConfirmPrompt
            customButton={ButtonOutlineBlue}
            disabled={data?.length <= 1}
            onConfirm={() => {
              if (!eventDetail?.eventCategories?.length || !category.isAlive) {
                removeCategoryByKey(category.key);
              } else {
                deleteByCompetitionCategory(category, {
                  eventId: eventDetail?.id,
                  onSuccess() {
                    toast.success("Informasi umum event berhasil disimpan");
                    fetchEventDetail();
                  },
                });
              }
            }}
            messagePrompt="Ingin hapus kategori?"
          >
            <IconTrash size="13" /> <span>Hapus kategori</span>
          </ButtonWithConfirmPrompt>
        </div>
      </VerticalSpacedBoxLoose>
    </CardSheet>
  );
}

const VerticalSpacedBoxLoose = styled.div`
  > * + * {
    margin-top: 1.75rem;
  }
`;

/* ==================================== */

function ButtonWithConfirmPrompt({
  children,
  disabled,
  buttonConfirmLabel,
  onConfirm,
  buttonCancelLabel,
  onCancel,
  customButton,
  flexible,
  messagePrompt,
  messageDescription,
}) {
  const [showAlert, setShowAlert] = React.useState(false);

  const closeAlert = () => {
    setShowAlert(false);
  };

  const handleCancel = () => {
    setShowAlert(false);
    onCancel?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
    closeAlert();
  };

  const CustomButtomComp = customButton || Button;

  const buttonTriggerProps = {
    onClick: () => setShowAlert(true),
    disabled: disabled,
    flexible: flexible,
  };

  return (
    <React.Fragment>
      <CustomButtomComp {...buttonTriggerProps}>{children}</CustomButtomComp>
      <SweetAlert
        show={showAlert}
        title=""
        custom
        btnSize="md"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        style={{ width: 800, padding: "35px 88px", borderRadius: "1.25rem" }}
        customButtons={
          <span
            className="d-flex justify-content-center"
            style={{ gap: "0.5rem", width: "100%" }}
          >
            <Button onClick={handleCancel}>
              {buttonCancelLabel || "Batal"}
            </Button>
            <ButtonBlue onClick={handleConfirm}>
              {buttonConfirmLabel || "Konfirmasi"}
            </ButtonBlue>
          </span>
        }
      >
        <IllustationAlertPrompt />
        {messagePrompt && <h4>{messagePrompt}</h4>}
        {messageDescription && (
          <p className="text-muted">{messageDescription}</p>
        )}
      </SweetAlert>
    </React.Fragment>
  );
}

const IllustationAlertPrompt = styled.div`
  margin-bottom: 2rem;
  width: 100%;
  min-height: 188px;
  background-image: url(${illustrationAlertPublication});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

/* ============================================= */
// util
function getTeamName(teamCategoryId) {
  const teamNames = {
    "individu male": "individu",
    "individu female": "individu",
    individu_mix: "individu_mix",
    male_team: "team",
    female_team: "team",
    mix_team: "mix",
  };
  return teamNames[teamCategoryId];
}

const getUnselectedCompetitionCategories = (data, options) => {
  if (!options?.length || !data) {
    return [];
  }

  const selectedIds = data.map(
    (category) => category.competitionCategoryId?.value
  );

  let unselected = [];
  for (const option of options) {
    let isSelected = false;
    for (const id of selectedIds) {
      if (option.value === id) {
        isSelected = true;
        break;
      }
    }
    if (isSelected) continue;
    unselected.push(option);
  }

  return unselected;
};

export { ScreenCategories };
