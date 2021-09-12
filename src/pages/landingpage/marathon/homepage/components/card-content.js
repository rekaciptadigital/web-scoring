import React from "react"
import { Container, Row } from "reactstrap"

//Import Components
import CardBox from "./card-box"
import CardQualification from "./card-qualification"

const CardContent = () => {
 
  return (
    <React.Fragment>
      <section className="section bg-white p-0">
        <Container>
          <div className="currency-price">
            <Row>
              <CardBox/>
            </Row>
            <Row>
              {/* reder card boxes */}
              <CardQualification/>
            </Row>
          </div>
        </Container>
      </section>
    </React.Fragment>
  )
}

export default CardContent
