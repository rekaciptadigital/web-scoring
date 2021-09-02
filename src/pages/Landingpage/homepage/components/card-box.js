// import PropTypes from 'prop-types'
import React from "react"
import { Card, CardBody, Col, Media } from "reactstrap"
import TableCategory from "./TableCategory"

const landingTimeLocation = [
    {
        id: "1",
        label: "Pendaftaran Hingga",
        icon: "far fa-calendar",
        content: "9 Agustus 2021 (24.00 WIB)"
    },
    {
        id: "2",
        label: "Tanggal Lomba",
        icon: "far fa-calendar",
        content: "13 Agustus - 16 Agustus 2021"
    },
    {
        id: "3",
        label: "Lokasi",
        icon: "fas fa-map-marker-alt",
        content: "Gelora Bung Karno, DKI Jakarta Indoor | Outdoor"
    },
    {
        id: "4",
        label: "No. Telepon",
        icon: "fas fa-phone-alt",
        content: "+62 3456 7890"
    },

]

const CardBox = () => {
  return (
    <React.Fragment>
        <Col md="5" >
          <Card>
            <CardBody>
              <Media>
                <Media body>
                  <h5>Waktu dan Tempat</h5>
                 {landingTimeLocation.map((i, key) => (

                     <tr key={key}>
                      <td>
                        <p className="text-muted text-truncate mb-0 me-3">
                        {i.label}
                        </p>
                      </td>
                      <td>
                        <i className={"me-2 " + i.icon}/>
                      </td>
                      <td>
                        <p className="mb-0 font-weight-bold">
                            {i.content}
                        </p>
                      </td>
                  </tr>
                ))}

                  
                </Media>
              </Media>
            </CardBody>
          </Card>
        </Col>
        <Col md="7" >
          <Card>
            <CardBody>
              <Media>
                <Media body>
                    <h5>Kategori Lomba</h5>
                    <TableCategory/>
                </Media>
              </Media>
            </CardBody>
          </Card>
        </Col>
    </React.Fragment>
  )
}


export default CardBox
