import styled from "styled-components";

export const GroupCategoryList = styled.div`
  margin: -1rem -1rem 0 -1rem;

  > * {
    margin-top: 2rem;
  }

  .bottom-section-add-category {
    display: flex;
    justify-content: flex-end;
  }
`;

export const GroupCategory = styled.div`
  border: solid 1px var(--ma-gray-100);
  border-radius: 4px;
  padding: 1rem;

  .top-section {
    display: flex;
    justify-content: space-between;
    align-items: start;

    .top-grid-select-category {
      flex-basis: 240px;
    }

    .top-grid-actions {
      display: flex;
      gap: 0.2rem;
    }
  }
`;

export const GroupDetail = styled.div`
  border: dashed 2px var(--ma-gray-100);
  padding: 0.5rem;

  & > hr {
    margin: 0.85rem 0;
    background-color: var(--ma-gray-400);
  }
`;

export const DetailItem = styled.div`
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

export { default as GroupCategoryDetails } from "./GroupCategoryDetails";
