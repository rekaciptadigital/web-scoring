import React from "react"
import { Container, Row } from "reactstrap"

//Import Components
import CardBox from "./card-box"

const CardContent = () => {
 
  return (
    <React.Fragment>
      <section className="section bg-white p-0">
        <Container>
          <div className="currency-price">
            <Row>
              {/* reder card boxes */}
              <CardBox/>
            </Row>
          </div>
        </Container>
      </section>
    </React.Fragment>
  )
}

export default CardContent
