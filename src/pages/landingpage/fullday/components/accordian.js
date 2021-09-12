import PropTypes from "prop-types"
import React, { useState } from "react"

import { Row, CardBody, Collapse } from "reactstrap"
import { Link } from "react-router-dom"
import LogoBca from  "../../../../assets/images/myachery/logo-bca.png"

const Accordian = props => {
  const [col1, setcol1] = useState(true)
  const [col2, setcol2] = useState(false)
  const [col3, setcol3] = useState(false)
  const [col4, setcol4] = useState(false)
  const [vaStep, setVaStep] = useState(1);

  function t_col1() {
    setcol1(!col1)
    setcol2(false)
    setcol3(false)
    setcol4(false)
  }

  function t_col2() {
    setcol1(false)
    setcol2(!col2)
    setcol3(false)
    setcol4(false)
  }

  function t_col3() {
    setcol1(false)
    setcol2(false)
    setcol3(!col3)
    setcol4(false)
  }

  function t_col4() {
    setcol1(false)
    setcol2(false)
    setcol3(false)
    setcol4(!col4)
  }

  const handleNext = () => {
      setVaStep(vaStep + 1);
  }
  const handleBefore = () => {
    setVaStep(vaStep - 1);
    }

  return (
    <React.Fragment>
      <div>
        <div id="gen-ques-accordion" className="accordion custom-accordion">
          <div className="mb-3">
            <Link
              to="#"
              className="accordion-list"
              onClick={() => {
                t_col1()
              }}
              style={{ cursor: "pointer" }}
            >
              <div>{props.question1}</div>
              <i
                className={
                  col1
                    ? "mdi mdi-minus accor-plus-icon"
                    : "mdi mdi-plus accor-plus-icon"
                }
              />
            </Link>

            <Collapse isOpen={col1}>
              <CardBody>
                    {vaStep == 1 && (
                        <div className="d-flex">
                            <img src={LogoBca} />
                            <p className="mb-0 mx-3">{props.answer1}</p>
                            <i onClick={handleNext} className=" mt-1 fas fa-greater-than"/>
                        </div>
                    )} 
                    { vaStep === 2 && (
                        <Row>
                            <div className="d-flex">
                                <i onClick={handleBefore} className=" mt-1 fas fa-less-than"/>
                                <h5 className="mx-3">Virtual Account BCA</h5>
                            </div>

                            <div className="d-flex mt-3">
                                <img src={LogoBca} />
                                <p className="mb-0 mx-3">{props.answer1}</p>
                            </div>

                            <div className="mt-3">
                                <p>Informasi Penting: </p>
                                <ul>
                                    <li>Hanya berlaku dengan menggunakan akun BCA</li>
                                    <li>Pembayaran dengan akun bank lain tidak akan di proses</li>
                                    <li>Pastikan nomor Virtual Account Anda sesuai dengan instruksi pembayaran</li>
                                    <li>Pastikan kembali nominal pembayaran sesuai dengan pemesanan yang anda lakukan</li>
                                    <li>dengan menekan tombol, Anda telah menyetujui Syarat & Ketentuan dan Kebijakan Privasi myarchery.com</li>
                                </ul>
                            </div>
                        </Row>
                    )}
              </CardBody>
            </Collapse>
          </div>

          <div className="mb-3">
            <Link
              to="#"
              className="accordion-list"
              onClick={() => {
                t_col2()
              }}
              style={{ cursor: "pointer" }}
            >
              <div>{props.question2}</div>
              <i
                className={
                  col2
                    ? "mdi mdi-minus accor-plus-icon"
                    : "mdi mdi-plus accor-plus-icon"
                }
              />
            </Link>
            <Collapse isOpen={col2}>
              <CardBody>
                <p className="mb-0">{props.answer2}</p>
              </CardBody>
            </Collapse>
          </div>

          <div className="mb-3">
            <Link
              to="#"
              className="accordion-list"
              onClick={() => {
                t_col3()
              }}
              style={{ cursor: "pointer" }}
            >
              <div>{props.question3}</div>
              <i
                className={
                  col3
                    ? "mdi mdi-minus accor-plus-icon"
                    : "mdi mdi-plus accor-plus-icon"
                }
              />
            </Link>
            <Collapse isOpen={col3}>
              <CardBody>
                <p className="mb-0">{props.answer3}</p>
              </CardBody>
            </Collapse>
          </div>

          <div>
            <Link
              to="#"
              className="accordion-list"
              onClick={() => {
                t_col4()
              }}
              style={{ cursor: "pointer" }}
            >
              <div>{props.question4}</div>
              <i
                className={
                  col4
                    ? "mdi mdi-minus accor-plus-icon"
                    : "mdi mdi-plus accor-plus-icon"
                }
              />
            </Link>
            <Collapse isOpen={col4}>
              <CardBody>
                <p className="mb-0">{props.answer4}</p>
              </CardBody>
            </Collapse>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

Accordian.propTypes = {
  answer1: PropTypes.any,
  answer2: PropTypes.any,
  answer3: PropTypes.any,
  answer4: PropTypes.any,
  question1: PropTypes.any,
  question2: PropTypes.any,
  question3: PropTypes.any,
  question4: PropTypes.any
}

export default Accordian
