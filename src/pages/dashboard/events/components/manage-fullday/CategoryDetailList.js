import * as React from "react";
import styled from "styled-components";
import { EventsService } from "services";

import { LoadingScreen } from "components";
import { ButtonOutline } from "components/ma";
import {
  FieldInputTextSmall,
  FieldSelectKelas,
  FieldSelectJarak,
  FieldSelectJenisRegu,
} from "../form-fields";

import Copy from "components/icons/Copy";
import Del from "components/icons/Del";

function CategoryDetailList({
  eventId,
  editIsAllowed,
  details,
  updateEventData,
  onSuccess,
  validationErrors,
  isFormDirty,
  setFormDirty,
}) {
  const [addingCategoryStatus, setAddingCategoryStatus] = React.useState({
    status: "idle",
    errors: null,
  });

  const isLoading = addingCategoryStatus.status === "loading";

  const handleAddDetail = async (detail) => {
    setAddingCategoryStatus((state) => ({ ...state, status: "loading", errors: null }));
    const payload = {
      event_id: eventId,
      age_category_id: detail.ageCategory.value,
      competition_category_id: detail.competitionCategory.id,
      distance_id: detail.distance.value,
      team_category_id: detail.teamCategory.value,
      quota: detail.quota,
      fee: detail.fee,
    };
    const result = await EventsService.storeCategoryDetails(payload);
    if (result.success) {
      setAddingCategoryStatus((state) => ({ ...state, status: "success" }));
      onSuccess?.();
    } else {
      setAddingCategoryStatus((state) => ({ ...state, status: "error" }));
    }
  };

  const handleRemoveDetail = async (detail) => {
    setAddingCategoryStatus((state) => ({ ...state, status: "loading", errors: null }));
    const result = await EventsService.deleteCategoryDetails({ id: detail.categoryDetailsId });
    if (result.success) {
      setAddingCategoryStatus((state) => ({ ...state, status: "success" }));
      onSuccess?.();
    } else {
      setAddingCategoryStatus((state) => ({ ...state, status: "error" }));
    }
  };

  const handleDetailFieldChange = (detail, field, value) => {
    !isFormDirty && setFormDirty(true);
    updateEventData({
      type: "UPDATE_EVENT_CATEGORY_DETAIL",
      detailKey: detail.key,
      categoryKey: detail.categoryKey,
      field: field,
      value: value,
    });
  };

  return (
    <StyledDetailList>
      {details.map((detail, index) => (
        <React.Fragment key={detail.key}>
          <StyledDetailItem>
            <div className="category-field-group">
              <div className="field-grid">
                <FieldSelectKelas
                  name={`ageCategory-${detail.categoryKey}-${detail.key}`}
                  placeholder="Pilih Kelas"
                  value={detail.ageCategory}
                  onChange={(value) => handleDetailFieldChange(detail, "ageCategory", value)}
                  errors={validationErrors?.[`${detail.categoryKey}-${detail.key}-ageCategory`]}
                  disabled={!editIsAllowed}
                >
                  Kelas
                </FieldSelectKelas>
              </div>

              <div className="field-grid">
                <FieldSelectJarak
                  name={`distance-${detail.categoryKey}-${detail.key}`}
                  placeholder="Pilih Jarak"
                  value={detail.distance}
                  onChange={(valueArray) => handleDetailFieldChange(detail, "distance", valueArray)}
                  errors={validationErrors?.[`${detail.categoryKey}-${detail.key}-distance`]}
                  disabled={!editIsAllowed}
                >
                  Jarak
                </FieldSelectJarak>
              </div>

              <div className="field-grid">
                <FieldSelectJenisRegu
                  name={`teamCategory-${detail.categoryKey}-${detail.key}`}
                  placeholder="Pilih Jenis Regu"
                  value={detail.teamCategory}
                  onChange={(value) => handleDetailFieldChange(detail, "teamCategory", value)}
                  errors={validationErrors?.[`${detail.categoryKey}-${detail.key}-teamCategory`]}
                  disabled={!editIsAllowed}
                >
                  Jenis Regu
                </FieldSelectJenisRegu>
              </div>

              <div className="field-grid">
                <FieldInputTextSmall
                  placeholder="Jumlah"
                  value={detail.quota}
                  onChange={(ev) => {
                    const value = parseInt(ev.target.value) || "";
                    handleDetailFieldChange(detail, "quota", value);
                  }}
                  errors={validationErrors?.[`${detail.categoryKey}-${detail.key}-quota`]}
                  disabled={!editIsAllowed}
                >
                  Kuota
                </FieldInputTextSmall>
              </div>
            </div>

            <div className="field-action">
              <ButtonOutline onClick={() => handleAddDetail(detail)} disabled={!editIsAllowed}>
                <Copy />
              </ButtonOutline>

              <ButtonOutline onClick={() => handleRemoveDetail(detail)} disabled={!editIsAllowed}>
                <Del />
              </ButtonOutline>
            </div>
          </StyledDetailItem>

          {index < details.length - 1 && <hr />}
        </React.Fragment>
      ))}

      <LoadingScreen loading={isLoading} />
    </StyledDetailList>
  );
}

const StyledDetailList = styled.div`
  border: dashed 2px var(--ma-gray-100);
  padding: 0.5rem;

  & > hr {
    margin: 0.85rem 0;
    background-color: var(--ma-gray-400);
  }
`;

const StyledDetailItem = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;

  .category-field-group {
    flex-shrink: 1;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 0.5rem;
  }

  .field-grid {
    display: flex;
    flex-direction: column;
    justify-content: end;
  }

  .field-action {
    flex: 0 1 auto;
    display: flex;
    gap: 0.2rem;
    font-size: 12px;
  }
`;

export default CategoryDetailList;
