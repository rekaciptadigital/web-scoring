import React from "react"
import MetaTags from "react-meta-tags";
import {
    Container,
    Row,
} from "reactstrap"

const FormEvent = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Dashboard | Skote - React Admin & Form Template</title>
                </MetaTags>
                <Container fluid>
                    <Row className="mb-3">
                    <label
                      htmlFor="example-text-input"
                      className="col-form-label"
                    >
                      Nama Event
                    </label>
                    <div className="col-md-12">
                      <input
                        className="form-control"
                        type="text"
                        defaultValue="Artisanal kale"
                      />
                    </div>
                  </Row>
                  <Row className="mb-3">
                    <label
                      htmlFor="example-date-input"
                      className="col-form-label"
                    >
                      Buka Pendaftaran
                    </label>
                    <div className="col-md-3">
                      <input
                        className="form-control"
                        type="date"
                        defaultValue="2019-08-19"
                        id="example-date-input"
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        className="form-control"
                        type="time"
                        defaultValue="13:45:00"
                        id="example-time-input"
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        className="form-control"
                        type="date"
                        defaultValue="2019-08-19"
                        id="example-date-input"
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        className="form-control"
                        type="time"
                        defaultValue="13:45:00"
                        id="example-time-input"
                      />
                    </div>
                  </Row>
                  <Row className="mb-3">
                    <label
                      htmlFor="example-date-input"
                      className="col-form-label"
                    >
                      Mulai Lomba
                    </label>
                    <div className="col-md-3">
                      <input
                        className="form-control"
                        type="date"
                        defaultValue="2019-08-19"
                        id="example-date-input"
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        className="form-control"
                        type="time"
                        defaultValue="13:45:00"
                        id="example-time-input"
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        className="form-control"
                        type="date"
                        defaultValue="2019-08-19"
                        id="example-date-input"
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        className="form-control"
                        type="time"
                        defaultValue="13:45:00"
                        id="example-time-input"
                      />
                    </div>
                  </Row>
                  <Row className="mb-3">
                    <label
                      htmlFor="example-text-input"
                      className="col-form-label"
                    >
                      Lokasi
                    </label>
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        type="text"
                        defaultValue="Artisanal kale"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        type="text"
                        defaultValue="Artisanal kale"
                      />
                    </div>
                  </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default FormEvent
