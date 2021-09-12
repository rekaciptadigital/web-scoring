import React from "react"
import { Card, CardBody, CardTitle, Media } from "reactstrap"

const CardActivity = () =>  {

    return (
      <React.Fragment>
        <Card>
          <CardBody>
            <CardTitle className="mb-5">Activity</CardTitle>
            <ul className="verti-timeline list-unstyled">
              <li className="event-list">
                <div className="event-timeline-dot">
                  <i className="bx bx-right-arrow-circle font-size-18"/>
                </div>
                <Media>
                  <div className="me-3">
                    <h5 className="font-size-14">
                      22 Nov{" "}
                      <i className="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2"/>
                    </h5>
                  </div>
                  <Media body>
                    <div>Babak Eliminasi</div>
                  </Media>
                </Media>
              </li>

              <li className="event-list">
                <div className="event-timeline-dot">
                  <i className="bx bx-right-arrow-circle font-size-18"/>
                </div>
                <Media>
                  <div className="me-3">
                    <h5 className="font-size-14">
                      17 Nov{" "}
                      <i className="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2"/>
                    </h5>
                  </div>
                  <Media body>
                      Pengumuman Hasil Babak Kualifikasi Jakarta Archery 2021 
                    <div id="activitytext">
                    </div>
                  </Media>
                </Media>
              </li>
              <li className="event-list active">
                <div className="event-timeline-dot">
                  <i className="bx bxs-right-arrow-circle font-size-18 bx-fade-right"/>
                </div>
                <Media>
                  <div className="me-3">
                    <h5 className="font-size-14">
                      15 Nov{" "}
                      <i className="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2"/>
                    </h5>
                  </div>
                  <Media body>
                    <div>Babak Kualifikasi Jakarta Archery 2021</div>
                  </Media>
                </Media>
              </li>
              <li className="event-list">
                <div className="event-timeline-dot">
                  <i className="bx bx-right-arrow-circle font-size-18"/>
                </div>
                <Media>
                  <div className="me-3">
                    <h5 className="font-size-14">
                      12 Nov{" "}
                      <i className="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2"/>
                    </h5>
                  </div>
                  <Media body>
                    <div>Pembayaran terkonfirmasi</div>
                  </Media>
                </Media>
              </li>
            </ul>
          </CardBody>
        </Card>
      </React.Fragment>
    )
  }

export default CardActivity
