import styled from "styled-components";

export const GroupCategoryList = styled.div`
  margin: -1rem -1rem 0 -1rem;

  > *:not(:first-child) {
    margin-top: 2rem;
  }

  > *:last-child {
    margin-top: 1.2rem;
  }
`;

export const GroupCategory = styled.div`
  border: solid 1px var(--ma-gray-100);
  border-radius: 4px;
  padding: 1rem;
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

  .field-grid {
    flex: 0 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: end;

    &.select-category {
      min-width: 135px;
    }

    &.select-distance {
      min-width: 128px;
    }
  }

  .field-action {
    flex: 1 0 auto;
    display: flex;
    gap: 0.2rem;
    font-size: 12px;
  }
`;
