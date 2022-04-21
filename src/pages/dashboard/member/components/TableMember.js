import React, { Component } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
// import { EventsService } from "services";
import ModalParticipantMemberProfile from "../../../../components/Common/ModalParticipanMemberProfile";
// datatable related plugins
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationProvider } from "react-bootstrap-table2-paginator";
import SweetAlert from "react-bootstrap-sweetalert";
import { Button, ButtonBlue } from "components/ma";
import { EventsService } from "services";
import logoUpdate from "../../../../assets/images/myachery/update-category.png";

import ToolkitProvider from "react-bootstrap-table2-toolkit";

//Import Breadcrumb
import "./sass/datatables.scss";

class TableMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: this.props.page,
      sizePerPage: 10,
      productData: this.props.members,
      modal: false,
      member_id_for_pop_up: 0,
      users: [],
      user: [],
      isOpenAlert: false,
      isUpdateCategory: false,
      dataCategories: [],
      catagoryID: 0,
      IdParticipant: 0,
      handlePageChange: this.props.handlePageChange,
      totalData: this.props.totalData,
    };
  }

  render() {
    // const getMemberProfile = async (id) => {
    //   let u = [];
    //   u = await this.state.users;
    //   if (u[id]) {
    //     this.setState({ modal: true, user: this.state.users[id] });
    //     return;
    //   }

    //   const { data, errors, success, message } = await EventsService.getEventMemberProfile({
    //     member_id: id,
    //   });
    //   if (success) {
    //     if (data) {
    //       u[id] = data;
    //       this.setState({ modal: true, user: data, users: u });
    //     }
    //   } else {
    //     console.log(message, errors);
    //   }
    // };

    let temp = [];
    for (let index = 0; index < this.props.members.length; index++) {
      temp.push(this.props.members[index]);
      temp[index] = { ...temp[index], no: index + 1 };
    }

    const onConfirm = async (participantId) => {
      const { message, errors, data } = await EventsService.getAccessCategories({
        participant_id: participantId,
      });
      if (message === "Success") {
        this.setState({ dataCategories: data });
        if (data) {
          this.setState({ isOpenAlert: true });
        }
      }
      console.info(errors);
    };

    const onUpdateCategory = async () => {
      console.log(this.state.IdParticipant);
      console.log(this.state.catagoryID);
      const { message, errors } = await EventsService.updateCategory(null, {
        participant_id: this.state.IdParticipant,
        category_id: this.state.catagoryID,
      });
      if (message === "Success") {
        console.log("Update success");
        this.setState({ isUpdateCategory: true });
      }
      console.info(errors);
    };

    const onBackToList = () => {
      this.setState({ isUpdateCategory: false });
      window.location.reload();
    };

    const onCancel = () => {
      this.setState({ isOpenAlert: false });
    };

    const toggle = () => {
      this.setState({ modal: !this.state.modal });
    };

    const columns = [
      {
        dataField: "No",
        text: "No",
      },
      {
        dataField: "name",
        text: `${this.props.team ? "Nama Tim" : "Nama Peserta"}`,
        sort: true,
        // style: { width: "40px", overflow: "hidden" },
        // headerStyle: { width: "40px", overflow: "hidden" },
        formatter: (cell, row) => {
         return (
            <>
            <div style={{ minWidth: 200, paddingTop: 15 }}>
              <p>{row.name}</p>
            </div>
            </>
          );
        },
      },
      {
        dataField: "clubName",
        text: "Nama Klub",
        sort: true,
        formatter: (cell, row) => {
          if (!row.clubName) {
            return (
              <>
                <span>Tidak ada club</span>
              </>
            );
          }
          return (
            <>
              <span>{row.clubName}</span>
            </>
          );
        },
      },
      {
        dataField: "competitionCategory",
        text: "Kategori Lomba",
        sort: true,
        formatter: (cell, row) => {
          if (!row.competitionCategory) {
            return (
              <>
                <span>-</span>
              </>
            );
          }
          return (
            <>
              <span>{row.competitionCategory}</span>
            </>
          );
        },
      },
      {
        dataField: "ageCategory",
        text: "Kelas",
        sort: true,
        formatter: (cell, row) => {
          if (!row.ageCategory) {
            return (
              <>
                <span>-</span>
              </>
            );
          }
          return (
            <>
              <span >{row.ageCategory}</span>
            </>
          );
        },
      },
      {
        dataField: "email",
        text: "Email",
        sort: true,
      },
      {
        dataField: "phoneNumber",
        text: "Telepon",
      },
      {
        dataField: "statusPayment",
        text: "Status Pembayaran",
        formatter: (cell, row) => {
          if (row.statusPayment === "Belum Lunas")
            return (
              <>
                <span
                  className="py-1 px-2"
                  style={{ color: "#FFB420", backgroundColor: "#FFE8BA", borderRadius: "25px" }}
                >
                  {row.statusPayment}
                </span>
              </>
            );
          if (row.statusPayment === "Lunas")
            return (
              <>
                <span
                  className="py-1 px-2"
                  style={{ color: "#05944F", backgroundColor: "#DAF0E3", borderRadius: "25px" }}
                >
                  {row.statusPayment}
                </span>
              </>
            );
          if (row.statusPayment === "Expired")
            return (
              <>
                <span
                  className="py-1 px-2"
                  style={{ color: "#FFFFFF", backgroundColor: "#AFAFAF", borderRadius: "25px" }}
                >
                  {row.statusPayment}
                </span>
              </>
            );
        },
      },
      {
        dataField: "",
        text: "...",
        formatter: (cell, row) => {
          if (row.statusPayment === "Lunas") {
            return (
              <>
                <span
                  onClick={() => {
                    onConfirm(row.participantId);
                    this.setState({ IdParticipant: row.participantId });
                  }}
                  className="py-2 px-2 btn-atur"
                >
                  Atur Kategori
                </span>
              </>
            );
          } else {
            return (
              <>
                <span className="py-2 px-2 btn-atur-disable">Atur Kategori</span>
              </>
            );
          }
        },
      },
    ];
    const defaultSorted = [
      {
        dataField: "id",
        order: "asc",
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: this.state.totalData, // replace later with size(customers),
      custom: true,
      page: this.state.page,
    };

    // Custom Pagination Toggle
    // const sizePerPageList = [
    //   { text: '5', value: 5 },
    //   { text: '10', value: 10 },
    //   { text: '15', value: 15 },
    //   { text: '20', value: 20 },
    //   { text: '25', value: 25 },
    //   { text: 'All', value: (this.state.productData).length }];

    // Select All Button operation
    // const selectRow = {
    //   mode: 'checkbox'
    // }

    // const { SearchBar } = Search;

    return (
      <React.Fragment>
        <div>
          <ModalParticipantMemberProfile
            isOpen={this.state.modal}
            toggle={toggle}
            participant={this.state.user}
          />
          <div>
            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={columns}
                      data={temp}
                    >
                      {({ paginationTableProps }) => (
                        <ToolkitProvider keyField="id" columns={columns} data={temp} search>
                          {(toolkitProps) => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col md="4">
                                  <div className="search-box me-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      {/* <SearchBar
                                        {...toolkitProps.searchProps}
                                      /> */}
                                      {/* <i className="bx bx-search-alt search-icon" /> */}
                                    </div>
                                  </div>
                                </Col>
                              </Row>

                              <Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      keyField={"id"}
                                      responsive
                                      bordered={false}
                                      striped={false}
                                      defaultSorted={defaultSorted}
                                      noDataIndication="Table is Empty"
                                      pagination={paginationFactory(pageOptions)}
                                      // selectRow={selectRow}
                                      classes={"table align-middle table-nowrap"}
                                      headerWrapperClasses={"thead-light"}
                                      {...toolkitProps.baseProps}
                                      {...paginationTableProps}
                                    />
                                  </div>
                                </Col>
                              </Row>

                              {/* <Row>
                                <Col xl="12">
                                  <PaginationListStandalone 
                                    {...paginationProps}
                                    onPageChange={(e) => {
                                      handlePageChange(e);
                                    }} />
                                </Col>
                              </Row> */}
                            </React.Fragment>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
        <SweetAlert
          show={this.state.isOpenAlert}
          title=""
          custom
          style={{ width: 1100, borderRadius: "1.25rem" }}
          customButtons={
            <span className="d-flex justify-content-end" style={{ gap: "0.5rem", width: "100%" }}>
              <Button onClick={onCancel} style={{ color: "var(--ma-blue)" }}>
                Batal
              </Button>
              <ButtonBlue onClick={onUpdateCategory}>Ubah</ButtonBlue>
            </span>
          }
        >
          <div style={{ textAlign: "start" }}>
            <span>Kategori Lomba</span>
            <br />
            <span>Silakan pilih salah satu kategori lomba</span>
          </div>
          <div style={{ height: "500px", overflowY: "auto", overflowX: "hidden" }}>
            <Row>
              {this.state.dataCategories.map((catagory) => {
                return (
                  <Col key={catagory.id} md={4}>
                    <div
                      onClick={() => this.setState({ catagoryID: catagory.id })}
                      className="py-4 ps-2 mt-3"
                      style={{
                        border: "1px solid #E2E2E2",
                        borderRadius: "5px",
                        textAlign: "start",
                        cursor: "pointer",
                        backgroundColor: `${
                          catagory.id === this.state.catagoryID ? "#E7EDF6" : "#FFF"
                        }`,
                      }}
                    >
                      <span style={{ fontSize: "18px", fontWeight: "600" }}>
                        {catagory.labelCategory}
                      </span>
                      <div className="mt-3">
                        <span
                          className="px-2 py-1"
                          style={{ backgroundColor: "#AEDDC2", borderRadius: "25px" }}
                        >
                          Sisa kuota 0 dari {catagory.quota}
                        </span>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        </SweetAlert>
        <SweetAlert
          show={this.state.isUpdateCategory}
          title=""
          custom
          style={{ width: 740, borderRadius: "1.25rem" }}
          customButtons={
            <span
              className="d-flex justify-content-center"
              style={{ gap: "0.5rem", width: "100%" }}
            >
              <ButtonBlue onClick={onBackToList}>Lanjut ke Data Peserta</ButtonBlue>
            </span>
          }
        >
          <div>
            <div>
              <img src={logoUpdate} />
            </div>
            <div>
              <span style={{ fontWeight: "600", fontSize: "18px" }}>
                Atur Kategori Peserta Berhasil
              </span>
              <br />
              <span>Data kategori peserta telah diubah</span>
            </div>
          </div>
        </SweetAlert>
      </React.Fragment>
    );
  }
}

export default TableMember;
