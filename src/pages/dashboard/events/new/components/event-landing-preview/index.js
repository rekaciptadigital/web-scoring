import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";

import { List, ListInlineItem } from "reactstrap";
import { LoadingScreen } from "components";
import { Button, ButtonBlue } from "components/ma";
// eslint-disable-next-line no-unused-vars
import EventLandingPreview from "./event-landing-preview";

function PreviewEventLanding({ buttonLabel = "Pratinjau", eventDetail, onPublish }) {
  const [isActive, setActive] = React.useState(false);

  const closePreviewPortal = () => setActive(false);

  const handleClickPublish = () => {
    const context = { close: closePreviewPortal };
    onPublish?.(context);
  };

  return (
    <React.Fragment>
      <Button onClick={() => setActive(true)}>{buttonLabel}</Button>
      <PreviewPortal
        isActive={isActive}
        eventData={eventDetail}
        onClose={closePreviewPortal}
        onPublish={handleClickPublish}
      />
    </React.Fragment>
  );
}

function PreviewPortal({ isActive, isLoading, eventData, onClose, onPublish }) {
  const portalRef = React.useRef(null);

  React.useEffect(() => {
    const portalTargetDOM = document.createElement("div");
    portalRef.current = portalTargetDOM;

    portalTargetDOM.setAttribute("id", "preview-event-landing");
    document.body.appendChild(portalTargetDOM);

    return function () {
      portalTargetDOM.remove();
    };
  }, []);

  if (portalRef.current && isActive) {
    return ReactDOM.createPortal(
      <FullscreenShellContainer isLoading={isLoading} onClose={onClose} onPublish={onPublish}>
        {/* <EventLandingPreview eventData={eventData} /> */}
        <div>Hai{JSON.stringify(eventData)}</div>
      </FullscreenShellContainer>,
      portalRef.current
    );
  }

  return null;
}

function FullscreenShellContainer({ children, isLoading, onClose, onPublish }) {
  const handlePublishEvent = () => onPublish?.();

  React.useEffect(() => {
    // Mencegah scrolling dari konten asli halaman form
    // ketika preview terbuka
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    // cleanup, kembalikan
    return function () {
      document.body.style.overflow = "unset";
      document.body.style.height = "unset";
    };
  }, []);

  return (
    <PreviewShellLayout>
      <div className="inner-container">
        <div className="preview-toolbar-top">
          <div className="navbar-header" style={{ paddingLeft: 12 }}>
            <div className="d-flex">
              <h3 className="m-0">Pratinjau</h3>
            </div>

            <List className="d-none d-lg-flex my-auto">
              <ListInlineItem className="d-flex justify-content-center align-items-center">
                <Button onClick={() => onClose?.()}>Ubah</Button>
              </ListInlineItem>

              <ListInlineItem className="d-flex justify-content-center align-items-center">
                <ButtonBlue onClick={handlePublishEvent}>Publikasi</ButtonBlue>
              </ListInlineItem>
            </List>
          </div>
        </div>
        <div className="preview-content">{children}</div>
      </div>
      <LoadingScreen loading={isLoading} />
    </PreviewShellLayout>
  );
}

/* ================================================ */

const PreviewShellLayout = styled.div`
  --preview-toolbar-height: 70px;

  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;

  .inner-container {
    height: 100vh;
    position: relative;

    .preview-toolbar-top,
    .preview-content {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    .preview-toolbar-top {
      z-index: 20;
      height: var(--preview-toolbar-height);
      background-color: #ffffff;
      box-shadow: 0 0.25rem 0.8rem rgb(18 38 63 / 7.5%);
    }

    .preview-content {
      top: var(--preview-toolbar-height);
      z-index: 10;
      overflow-y: auto;
      background-color: var(--bs-body-bg);
    }
  }
`;

export { PreviewEventLanding };
