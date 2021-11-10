import * as React from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter, Row, Col, Table, Button } from "reactstrap";
import Select from "react-select";

export default function ModalScoring({ modalControl }) {
  const { isModalScoringOpen, toggleModalScoring, closeModalScoring } = modalControl;

  const dataPlayer1 = {};
  const dataPlayer2 = {};

  return (
    <Modal
      size="xl"
      backdrop="static"
      autoFocus={true}
      centered={true}
      isOpen={isModalScoringOpen}
      toggle={() => toggleModalScoring()}
      onClosed={() => closeModalScoring()}
    >
      <ModalHeader toggle={() => toggleModalScoring()}>Set Scoring</ModalHeader>
      <ModalBody>
        <Row className="mt-4 mb-4">
          <Col>
            <h4 className="text-center">Individu-U-16-Compound-30m</h4>
          </Col>
        </Row>

        <Row>
          <Col className="border-end border-2">
            <h5 className="text-center mb-3">M PASHA ASSALAFI</h5>
            <ScoringGrid data={dataPlayer1} />
          </Col>

          <Col>
            <h5 className="text-center mb-3">Muhammad Ihsan Hafizh</h5>
            <ScoringGrid data={dataPlayer2} />
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="primary">Simpan</Button>
        <Button color="success">Tentukan</Button>
      </ModalFooter>
    </Modal>
  );
}

const listRambahan = [{ no: 1 }, { no: 2 }, { no: 3 }, { no: 4 }, { no: 5 }];

function ScoringGrid() {
  return (
    <div>
      <Table borderless className="text-muted text-center">
        <thead>
          <tr>
            <td className="text-center">Seri</td>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td className="text-end">Total</td>
          </tr>
        </thead>
        <tbody>
          {listRambahan.map((row) => (
            <RowRambahan key={row.no} nomor={row.no} />
          ))}

          <tr>
            <td colSpan="5" className="text-start">
              <h6 className=" ms-4">Extra Shot</h6>
            </td>
          </tr>

          <tr>
            <td></td>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td className="text-end">0</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="5" className="text-end">
              <h5>
                <span className="text-muted me-2 fw-normal">Total:</span> 123
              </h5>
            </td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}

const summingReducer = (prev, value) => {
  let interpretedValue;
  if (`${value}`.toLowerCase() === "m") {
    interpretedValue = 0;
  } else if (`${value}`.toLowerCase() === "x") {
    interpretedValue = 10;
  } else {
    interpretedValue = value;
  }
  return prev + interpretedValue;
};

function RowRambahan({ nomor }) {
  const [scoreData, setScoreData] = React.useState([]);

  const updateScoreData = (ev) => {
    setScoreData((currentData) => {
      const dataUpdated = [...currentData];
      dataUpdated[ev.nomor - 1] = ev.value.value;
      return dataUpdated;
    });
  };

  const computeTotal = () => {
    return scoreData?.length ? scoreData.reduce(summingReducer, 0) : 0;
  };

  return (
    <tr>
      <td className="text-center" style={{ color: "var(--bs-gray-400)" }}>
        #{nomor}
      </td>
      <td>
        <SelectScore nomor={1} onChange={(ev) => updateScoreData(ev)} />
      </td>
      <td>
        <SelectScore nomor={2} onChange={(ev) => updateScoreData(ev)} />
      </td>
      <td>
        <SelectScore nomor={3} onChange={(ev) => updateScoreData(ev)} />
      </td>
      <td className="text-end fw-bold">{computeTotal()}</td>
    </tr>
  );
}

const scoreOptions = [
  { value: "m", label: "M" },
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
  { value: 6, label: 6 },
  { value: 7, label: 7 },
  { value: 8, label: 8 },
  { value: 9, label: 9 },
  { value: 10, label: 10 },
  { value: "x", label: "X" },
];

function SelectScore({ nomor, onChange: notifyValueToParent }) {
  const [editMode, setEditMode] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState({ value: "m", label: "M" });

  const openSelect = () => setEditMode(true);
  const closeSelect = () => setEditMode(false);

  React.useEffect(() => {
    notifyValueToParent?.({ nomor, value: selectedValue });
  }, [selectedValue]);

  return (
    <div>
      {!editMode ? (
        <Button color="primary" outline id="Popover1" type="button" onClick={() => openSelect()}>
          {selectedValue?.label || "+"}
        </Button>
      ) : (
        <React.Fragment>
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
            onClick={() => closeSelect()}
          />
          <Select
            defaultMenuIsOpen
            options={scoreOptions}
            value={selectedValue}
            onChange={(ev) => {
              setSelectedValue(ev);
              closeSelect();
            }}
          />
        </React.Fragment>
      )}
    </div>
  );
}
