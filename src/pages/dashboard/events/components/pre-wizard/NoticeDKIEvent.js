import * as React from "react";
import styled from "styled-components";
import AlertCircle from "components/icons/AlertCircle";

const NoticeMessageWrapper = styled.div`
  display: flex;
  padding: 12px 16px;
  border-radius: 4px;
  background-color: #e7edf6;

  .notice-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;

    .svg-icon-path {
      stroke: var(--ma-blue);
    }
  }

  .notice-message {
    flex-shrink: 1;
    margin-left: 10px;
  }
`;

export default function NoticeDKIEvent({ children, ...props }) {
  return (
    <NoticeMessageWrapper {...props}>
      <div className="notice-icon">
        <AlertCircle />
      </div>

      <p className="notice-message mb-0">{children}</p>
    </NoticeMessageWrapper>
  );
}
