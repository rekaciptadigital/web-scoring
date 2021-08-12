import React, { useState } from "react";
import { Col, Form, Row } from "reactstrap";

const FormRepeater = () => {
  const [rows1, setrows1] = useState([]);

  function handleAddRow() {
    const item1 = { name1: "" };
    setrows1([...rows1, item1]);
  }

  function handleRemoveRow(e, idx) {
    if (typeof idx != "undefined") {
      const newItems = rows1.splice(idx, 1);
      setrows1(newItems);
    }
  }

  return (
    <Row>
      <Col xs={12}>
        <Form className="repeater" encType="multipart/form-data">
          <div data-repeater-list="group-a">
            <div data-repeater-item className="row">
              <div className="mb-3 col-lg-2">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="untyped-input"
                  className="form-control"
                />
              </div>

              <div className="mb-3 col-lg-2">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" className="form-control" />
              </div>

              <div className="mb-3 col-lg-2">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" className="form-control" />
              </div>

              <div className="mb-3 col-lg-2">
                <label htmlFor="resume">Resume</label>
                <input type="file" className="form-control" id="resume" />
              </div>

              <div className="mb-3 col-lg-2">
                <label htmlFor="message">Message</label>
                <textarea id="message" className="form-control"></textarea>
              </div>

              <Col lg={2} className="align-self-center"></Col>
            </div>
          </div>
          {rows1.map((item1, idx) => (
            <div data-repeater-list="group-a" key={item1.name} id={"row" + idx}>
              <div data-repeater-item className="row">
                <div className="mb-3 col-lg-2">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="untyped-input"
                    className="form-control"
                  />
                </div>

                <div className="mb-3 col-lg-2">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" className="form-control" />
                </div>

                <div className="mb-3 col-lg-2">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" className="form-control" />
                </div>

                <div className="mb-3 col-lg-2">
                  <label htmlFor="resume">Resume</label>
                  <input type="file" className="form-control" id="resume" />
                </div>

                <div className="mb-3 col-lg-2">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" className="form-control"></textarea>
                </div>

                <Col lg={2} className="align-self-center">
                  <div className="d-grid">
                    <input
                      data-repeater-delete
                      type="button"
                      className="btn btn-primary"
                      value="Delete"
                      onClick={e => {
                        handleRemoveRow(e, idx);
                      }}
                    />
                  </div>
                </Col>
              </div>
            </div>
          ))}
          <input
            data-repeater-create
            type="button"
            className="btn btn-success mt-3 mt-lg-0"
            value="Add"
            onClick={() => handleAddRow()}
          />
        </Form>
      </Col>
    </Row>
  );
};

export default FormRepeater;
