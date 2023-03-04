import IconEdit from "components/ma/icons/mono/edit";
import IconTrash from "components/ma/icons/mono/trash";
import React from "react";
import styled from "styled-components";

const CardClassificationList = ({
  indexNumber,
  title,
  subtitle,
  onEditClassification,
  onDeleteClassification,
}) => {
  return (
    <CardWrapper>
      <CardDetailBox>
        <CardDetailBox className="card-box-parent">
          <CardNumber>{indexNumber}</CardNumber>
          <CardDetailBox className="card-box">
            <CardTitle>{title}</CardTitle>
            <CardSubtitle>{subtitle}</CardSubtitle>
          </CardDetailBox>
        </CardDetailBox>
      </CardDetailBox>
      <CardActionBox>
        <div onClick={onEditClassification}>
          <IconEdit size={"1rem"} />
        </div>
        <div onClick={onDeleteClassification}>
          <IconTrash size={"1rem"} />
        </div>
      </CardActionBox>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  display: flex;
  background: white;
  padding: 16px;
  margin-top: 30px;
  border-radius: 8px;
  justify-content: space-between;
  align-items: center;
`;
const CardDetailBox = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 12px;
  color: #545454;
  &.card-box-parent {
    flex-direction: row;
    gap: 16px;
    align-items: start;
  }
  &.card-box {
    gap: 4px;
  }
`;
const CardActionBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  font-weight: 600;
  font-size: 14px;
  color: #0d47a1;

  > :nth-child(1):hover {
    color: black;
    cursor: pointer;
  }

  > :nth-child(2):hover {
    color: black;
    cursor: pointer;
  }
`;

const CardTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  text-transform: capitalize;
`;

const CardSubtitle = styled.div`
  display: inline-block;
  font-weight: 400;
  font-size: 14px;
  text-transform: capitalize;
  color: #545454;
  width: 35%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const CardNumber = styled.div`
  font-size: 14px;
  color: #0d47a1;
`;

export default CardClassificationList;
