import styled from "styled-components";

const StyledPageWrapper = styled.div`
  margin: 2.5rem 0;
`;

const StickyContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1.5rem;
`;

const StickyItem = styled.div`
  position: sticky;
  z-index: 100;
  @media (max-width: 782px) {
    position: static;
  }

  top: calc(70px + 2.5rem);
  flex: 1 1 15rem;
`;

const StickyItemSibling = styled.div`
  flex: 12 1 30rem;
`;

const QualificationScheduleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;

  .heading-left {
    flex-grow: 1;
  }

  .buttons-right {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const ScheduleGroupFormBox = styled.div`
  margin-bottom: 1.25rem;
  padding: 1.25rem;
  border: solid 1px var(--ma-gray-100);
  border-radius: 0.5rem;

  transition: all 0.15s ease-in-out;

  &.is-focused {
    box-shadow: 0 0 0 2px #2684ff;
  }
`;

const SchedulingFormActions = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 1rem;
`;

export {
  StyledPageWrapper,
  StickyContainer,
  StickyItem,
  StickyItemSibling,
  QualificationScheduleHeader,
  ScheduleGroupFormBox,
  SchedulingFormActions,
};
