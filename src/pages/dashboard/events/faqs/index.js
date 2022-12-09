import * as React from "react";
import { useParams } from "react-router-dom";
import { Container } from "reactstrap";
import { MetaTags } from "react-meta-tags";
import styled from "styled-components";
import logoEmpty from "assets/images/myachery/empty.png";
import { Modal, ModalBody } from "reactstrap";
import { FieldInputText, FieldTextArea } from "../components/form-fields";
import { Button, ButtonBlue, ButtonGhostBlue } from "components/ma";
import { eye, eyeOff } from "../home/utils/icon-svgs";
import SweetAlert from "react-bootstrap-sweetalert";
import logoBuatAkun from "assets/images/myachery/Illustration.png";
import { FAQService } from "services";

import { SubNavbar } from "../components/submenus-settings";

import IconPlus from "components/ma/icons/mono/plus";
import IconEdit from "components/ma/icons/mono/edit";
import IconTrash from "components/ma/icons/mono/trash";

function PageEventFaqs() {
  const { event_id } = useParams();
  const [showFaqModal, setShowFaqModal] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [idFaq, setIdFaq] = React.useState(-1);
  const [detail, setDetail] = React.useState({});

  const handlerShowFaqModal = () => setShowFaqModal(true);
  const handlerCloseFaqModal = () => setShowFaqModal(false);
  const onCancel = () => setIsAlertOpen(false);

  const getListFaq = async () => {
    const { message, data, errors } = await FAQService.getListFaq({
      event_id,
      limit: 30,
    });
    if (message === "Success") {
      setData(data);
    }
    console.error(errors);
  };

  React.useEffect(() => {
    getListFaq();
  }, []);

  const onSave = async (data) => {
    const { message } = await FAQService.creteFaq({
      event_id: event_id,
      question: data.question,
      answer: data.answer,
      is_hide: data.is_hide,
    });
    if (message === "Success") {
      getListFaq();
      handlerCloseFaqModal();
    }
  };

  const onUpdate = async (data) => {
    const { message } = await FAQService.updateFaq({
      event_id: event_id,
      question: data.question,
      answer: data.answer,
      is_hide: data.is_hide,
      id: data.id,
    });
    if (message === "Success") {
      getListFaq();
      handlerCloseFaqModal();
    }
  };

  const getDetailFaq = async (id) => {
    const { message, data, errors } = await FAQService.getDetailFaq({
      qna_id: id,
    });
    if (message === "Success") {
      setDetail(data[0]);
      if (detail) {
        getListFaq();
        handlerShowFaqModal();
      }
    }
    console.error(errors);
  };

  const onConfirm = async () => {
    const { message } = await FAQService.deleteFaq({
      event_id: event_id,
      q_and_a_id: idFaq,
    });
    if (message) {
      getListFaq();
      setIsAlertOpen(false);
    }
  };

  const verfiedAlert = () => {
    return (
      <SweetAlert
        show={isAlertOpen}
        title=""
        custom
        btnSize="md"
        onConfirm={onConfirm}
        style={{ padding: "1.25rem", width: "800px", borderRadius: "20px" }}
        customButtons={
          <span
            className="d-flex w-100 justify-content-center"
            style={{ gap: "0.5rem" }}
          >
            <Button onClick={onCancel} style={{ color: "var(--ma-blue)" }}>
              Batalkan
            </Button>
            <ButtonBlue onClick={onConfirm}>Iya, Hapus pertanyaan</ButtonBlue>
          </span>
        }
      >
        <div className="d-flex justify-content-center flex-column">
          <div style={{ width: "30%", margin: "0 auto" }}>
            <div style={{ width: "214px", height: "145px" }}>
              <img
                src={logoBuatAkun}
                width="100%"
                height="100%"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <span
            style={{ fontWeight: "600", fontSize: "18px", lineHeight: "24px" }}
            className="mt-3"
          >
            Apakah Anda yakin akan menghapus pertanyaan?
          </span>
          <p>
            Pertanyaan yang dihapus akan terhapus dari Landing Page. Anda juga
            dapat menonaktifkan pertanyaan pada bagian edit.
          </p>
        </div>
      </SweetAlert>
    );
  };

  return (
    <React.Fragment>
      <SubNavbar eventId={event_id} />
      <div>
        <MetaTags>
          <title>Dashboard | List - FAQ</title>
        </MetaTags>
        <WarpperFAQ>
          <Container fluid>
            <div className="box-header">
              <div className="box-text">
                <span className="text-header">Frequently Ask Questions</span>
                <span className="text-sub-header">
                  Pengaturan List Pertanyaan yang sering ditanyakan
                </span>
              </div>
              <div>
                <button
                  className="btn-faq"
                  onClick={() => {
                    handlerShowFaqModal();
                    setDetail({});
                  }}
                >
                  <IconPlus size="16" /> Tambah FAQ
                </button>
              </div>
            </div>
            {!data ? (
              <div className="content-empty mt-3">
                <span className="text-header">
                  Pengaturan Frequently Ask Question
                </span>
                <div className="text-content">
                  <span>
                    Atur list pertanyaan dan jawaban yang sering ditanyakan
                    peserta untuk ditampilkan pada Landing Page Event. Anda
                    dapat mengatur:
                  </span>
                  <ol>
                    <li>Jumlah pertanyaan</li>
                    <li>Visibilitas pertanyaan pada landing page</li>
                  </ol>
                  <span>
                    Klik tombol{" "}
                    <span style={{ fontWeight: "600" }}>“Tambah FAQ”</span> di
                    kanan atas untuk mulai membuat pertanyaan.
                  </span>
                </div>
                <div className="pt-4">
                  <img src={logoEmpty} />
                </div>
              </div>
            ) : (
              data?.map((d) => {
                return (
                  <div
                    key={d.id}
                    className="content-faq d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div className="box-content content-question">
                        <h5 className="text-title">{d.question}</h5>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="box-content content-answer">
                          <div className="text-content">{d.answer}</div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <ButtonGhostBlue
                        flexible
                        onClick={() => getDetailFaq(d.id)}
                      >
                        <IconEdit size="18" />
                      </ButtonGhostBlue>

                      <ButtonGhostBlue
                        flexible
                        onClick={() => {
                          setIdFaq(d.id);
                          setIsAlertOpen(true);
                        }}
                      >
                        <IconTrash size="18" />
                      </ButtonGhostBlue>
                    </div>
                  </div>
                );
              })
            )}
          </Container>
        </WarpperFAQ>
      </div>
      {detail ? (
        <ModalExtraInfoEditor
          infoData={detail}
          onSave={onSave}
          showEditor={showFaqModal}
          onClose={handlerCloseFaqModal}
          onUpdate={onUpdate}
        />
      ) : (
        <ModalExtraInfoEditor
          onSave={onSave}
          showEditor={showFaqModal}
          onClose={handlerCloseFaqModal}
          onUpdate={onUpdate}
        />
      )}
      {verfiedAlert()}
    </React.Fragment>
  );
}

function ModalExtraInfoEditor({ showEditor, ...props }) {
  if (!showEditor) {
    return null;
  }
  return <ExtraInfoEditor {...props} />;
}

function ExtraInfoEditor({ infoData, onSave, onClose, onUpdate }) {
  const [title, setTitle] = React.useState(infoData?.question || "");
  const [description, setDescription] = React.useState(infoData?.answer || "");
  const [visible, setVisible] = React.useState(infoData?.isHide || 0);

  const initialTitle = React.useRef(title);
  const initialDescription = React.useRef(description);

  const shouldSubmitAllowed = () => {
    const isRequiredAll = title && description;
    const isEdited =
      title !== initialTitle.current ||
      description !== initialDescription.current;
    return isRequiredAll && isEdited;
  };

  const handleCloseModal = () => {
    setTitle("");
    setDescription("");
    setVisible(-1);
    onClose?.();
  };

  const handleClickSave = () => {
    if (!shouldSubmitAllowed()) {
      return;
    }
    onSave?.({
      question: title,
      answer: description,
      is_hide: visible,
    });
    handleCloseModal();
  };

  const handleClickUpdate = () => {
    if (!shouldSubmitAllowed()) {
      return;
    }
    onUpdate?.({
      question: title,
      answer: description,
      is_hide: visible,
      id: infoData.id,
    });
    handleCloseModal();
  };

  return (
    <Modal centered isOpen size="lg">
      <ModalBody>
        <h4>Pertanyaan dan Jawaban</h4>
        <div className="mt-3 d-flex align-items-center flex-wrap gap-2">
          <div className="w-75">
            <FieldInputText
              name="Pertanyaan"
              placeholder="Contoh: Apakah ini pertandingan berbayar?"
              value={title}
              onChange={(value) => {
                setTitle(value);
              }}
            >
              Pertanyaan
            </FieldInputText>
          </div>
          <div className="mt-2">
            <span className="me-2" style={{ color: "#0D47A1" }}>
              Visibilitas
            </span>
            {!visible ? (
              <img
                style={{ cursor: "pointer" }}
                src={eye}
                onClick={() => setVisible(1)}
              />
            ) : (
              <img
                style={{ cursor: "pointer" }}
                src={eyeOff}
                onClick={() => setVisible(0)}
              />
            )}
          </div>
        </div>

        <div className="mt-4">
          <FieldTextArea
            name="Jawaban"
            placeholder="Masukkan jawaban"
            value={description}
            onChange={(value) => {
              setDescription(value);
            }}
          >
            Jawaban
          </FieldTextArea>
        </div>

        <div
          className="mt-4 d-flex justify-content-end"
          style={{ gap: "0.5rem" }}
        >
          <Button
            style={{ color: "var(--ma-blue)" }}
            onClick={handleCloseModal}
          >
            Batal
          </Button>
          {!infoData?.id ? (
            <ButtonBlue
              onClick={handleClickSave}
              disabled={!shouldSubmitAllowed()}
            >
              Simpan
            </ButtonBlue>
          ) : (
            <ButtonBlue
              onClick={handleClickUpdate}
              disabled={!shouldSubmitAllowed()}
            >
              Simpan
            </ButtonBlue>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}

const WarpperFAQ = styled.div`
  @media (min-width: 768px) {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  margin-top: 2.5rem;
  margin-bottom: 2.5rem;

  .box-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-block: 2rem;
    .box-text {
      display: flex;
      flex-direction: column;
      .text-header {
        font-size: 28px;
        line-height: 36px;
        font-weight: 500;
      }
      .text-sub-header {
        font-size: 16px;
        line-height: 22.4px;
        font-weight: 400;
        color: #545454;
      }
    }
    .btn-faq {
      padding: 0;
      border: 1px solid #0d47a1;
      background: white;
      color: #0d47a1;
      padding: 0.5rem;
      font-size: small;
      border-radius: 8px;
      font-weight: 400;
      line-height: 19.6px;
      &:hover {
        background-color: #0d47a1;
        color: #fff;
        border: 1px solid #0d47a1;
      }
    }
  }
  .content-faq {
    background-color: #fff;
    border-radius: 8px;
    padding: 24px;
    margin-block: 0.75rem;

    .box-content {
      &.content-question {
        display: flex;
        gap: 1.25rem;

        &::before {
          content: "P";
          color: var(--ma-blue);
          line-height: 1.2;
          font-size: 14px;
          font-weight: 600;
        }
      }

      &.content-answer {
        margin-top: 0.75rem;
        display: flex;
        gap: 1.25rem;

        &::before {
          content: "J";
          color: var(--ma-blue);
          line-height: 1.5;
          font-size: 14px;
          font-weight: 600;
        }
      }

      .text-title-p {
        font-size: 14px;
        font-weight: 600;
        color: #0d47a1;
      }
      .text-title {
        color: #545454;
        font-size: 16px;
        font-weight: 600;
      }
      .text-content {
        white-space: pre-wrap;
      }
    }
  }

  .content-empty {
    text-align: center;
    display: flex;
    flex-direction: column;
    padding: 24px 174px;
    background-color: #fff;
    border-radius: 8px;
    @media screen and (max-width: 600px) {
      padding: 0;
    }
    .text-header {
      font-style: normal;
      font-weight: 600;
      font-size: 32px;
      line-height: 38px;
      color: #000000;
    }
    .text-content {
      text-align: start;
      font-size: 20px;
      line-height: 28px;
      font-weight: 400;
    }
  }
`;

export default PageEventFaqs;
