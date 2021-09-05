import React from 'react'
import { Card, CardBody, Media, Button } from "reactstrap"
import styled from "styled-components"

const Label = styled.label`
  font-size: 12px;
  line-height: 15px;
  color: #495057;
  display: ruby;
  font-weight: 400;
`;

const Td = styled.td`
  padding-top: 20px;
`;

const CardTicket = () => {
    return (
        <Card style={{backgroundColor: "#FAFAFA"}}>
            <CardBody>
                <Media>
                    <Media body>
                        <h5 className="mb-3">Tiket Lomba</h5>
                        <h5 className="mb-3">Order ID 12345</h5>
                        <tr>
                            <Td>
                                <Label>Jenis Regu: </Label>
                            </Td>
                            <Td>
                                Tim
                            </Td>
                        </tr>
                        <tr>
                            <Td>
                                <Label>Kategori Lomba: </Label>
                            </Td>
                            <Td>
                                Traditional Bow - U16 - 50m
                            </Td>
                        </tr>
                        <tr>
                            <Td>
                                <Label><b>Total: </b> </Label>
                            </Td>
                            <Td><b>Rp 100.000</b></Td>
                        </tr>

                        <div className="d-grid gap-2 mt-5">
                        <Button
                            type="button"
                            color="success">
                        Pilih Pembayaran
                        </Button>
                        </div>

                    </Media>
                </Media>
            </CardBody>
        </Card>
    )
}

export default CardTicket
