import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const CustomerBankAccountTable = () => {
  const [rowData] = useState([
    { accountNumber: '123456', customerName: 'John Doe', balance: 1000 },
    { accountNumber: '654321', customerName: 'Jane Smith', balance: 2000 },
    { accountNumber: '789012', customerName: 'Alice Johnson', balance: 3000 },
  ]);

  const [columnDefs] = useState([
    { headerName: 'Account Number', field: 'accountNumber' },
    { headerName: 'Customer Name', field: 'customerName' },
    { headerName: 'Balance', field: 'balance' },
  ]);

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
      />
    </div>
  );
};

export default CustomerBankAccountTable;