import * as React from "react";
import styled from "styled-components";

import { ButtonOutline } from "components/ma";
import {
  FieldInputTextSmall,
  FieldSelectKelas,
  FieldSelectMultiJarak,
  FieldSelectJenisRegu,
} from "../form-fields";

import Copy from "components/icons/Copy";
import Del from "components/icons/Del";

function CategoryDetailList({ details, updateEventData, validationErrors, shouldDisableDelete }) {
  const handleAddDetail = (detail) => {
    updateEventData({
      type: "COPY_EVENT_CATEGORY_DETAIL",
      categoryKey: detail.categoryKey,
      detailKey: detail.key,
    });
  };

  const handleRemoveDetail = (detail) => {
    updateEventData({
      type: "REMOVE_EVENT_CATEGORY_DETAIL",
      categoryKey: detail.categoryKey,
      detailKey: detail.key,
    });
  };

  const handleDetailFieldChange = (detail, field, value) => {
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
                >
                  Kelas
                </FieldSelectKelas>
              </div>

              <div className="field-grid">
                <FieldSelectMultiJarak
                  name={`distance-${detail.categoryKey}-${detail.key}`}
                  placeholder="Pilih Jarak"
                  value={detail.distance}
                  onChange={(valueArray) => handleDetailFieldChange(detail, "distance", valueArray)}
                  errors={validationErrors?.[`${detail.categoryKey}-${detail.key}-distance`]}
                >
                  Jarak
                </FieldSelectMultiJarak>
              </div>

              <div className="field-grid">
                <FieldSelectJenisRegu
                  name={`teamCategory-${detail.categoryKey}-${detail.key}`}
                  placeholder="Pilih Jenis Regu"
                  value={detail.teamCategory}
                  onChange={(value) => handleDetailFieldChange(detail, "teamCategory", value)}
                  errors={validationErrors?.[`${detail.categoryKey}-${detail.key}-teamCategory`]}
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
                >
                  Kuota
                </FieldInputTextSmall>
              </div>
            </div>

            <div className="field-action">
              <ButtonOutline onClick={() => handleAddDetail(detail)}>
                <Copy />
              </ButtonOutline>
              <ButtonOutline
                onClick={() => handleRemoveDetail(detail)}
                disabled={shouldDisableDelete}
              >
                <Del />
              </ButtonOutline>
            </div>
          </StyledDetailItem>

          {index < details.length - 1 && <hr />}
        </React.Fragment>
      ))}
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
