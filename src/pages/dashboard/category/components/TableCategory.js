import React, { useState } from "react";
import { Card, CardBody } from "reactstrap";
import { dummyConstants } from '../../../../constants';
import { CategoryTable } from "./CategoryTable.component";

const TableCategory = React.memo(() => {
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [productData] = useState(dummyConstants.category);

  return (
    <Card>
      <CardBody>
        <CategoryTable
          data={productData}
          page={page}
          sizePerPage={sizePerPage}
          onPageChange={setPage}
          onSizePerPageChange={setSizePerPage}
        />
      </CardBody>
    </Card>
  );
});

export default TableCategory;
