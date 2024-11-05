import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const CustomerBankAccountTable = () => {
  const [rowData, setRowData] = useState([
    { accountNumber: '123456', customerName: 'John Doe', balance: 1000, approvedLoan: 5000 },
    { accountNumber: '654321', customerName: 'Jane Smith', balance: 2000, approvedLoan: 10000 },
    { accountNumber: '789012', customerName: 'Alice Johnson', balance: 3000, approvedLoan: 15000 },
    { accountNumber: '7890112', customerName: 'Shailesh Singh', balance: 3000 },
  ]);

  const [columnDefs] = useState([
    { headerName: 'Account Number', field: 'accountNumber' },
    { headerName: 'Customer Name', field: 'customerName' },
    { headerName: 'Balance', field: 'balance', valueFormatter: (params) => params.value.toLocaleString() },
    { 
      headerName: 'Approved Loan', 
      field: 'approvedLoan', 
      editable: true, 
      valueFormatter: (params) => params.value != null ? params.value.toLocaleString() : '', 
      valueGetter: (params) => params.data.approvedLoan,
      valueParser: (params) => parseAbbreviatedValue(params.newValue)
    },
  ]);

  const [newRow, setNewRow] = useState({
    accountNumber: '',
    customerName: '',
    balance: '',
    approvedLoan: ''
  });

  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow({ ...newRow, [name]: value });
  };

  const parseAbbreviatedValue = (value) => {
    if (value === '' || value === null) return null;
    if (value === '0' || value === 0) return 0;
    const units = {
      K: 1e3,
      M: 1e6,
      B: 1e9,
      T: 1e12
    };
    const match = String(value).match(/^(\d+(\.\d+)?)([KMBT])$/i);
    if (match) {
      const number = parseFloat(match[1]);
      const unit = match[3].toUpperCase();
      return number * (units[unit] || 1);
    }
    return parseFloat(String(value).replace(/,/g, ''));
  };

  const validateLoanInput = (loan) => {
    if (loan === '') return true;
    const numericValue = parseAbbreviatedValue(loan);
    if (isNaN(numericValue) || numericValue < 0) {
      return false;
    }
    return true;
  };

  const handleAddRow = () => {
    if (!validateLoanInput(newRow.approvedLoan)) {
      setError('Approved Loan must be a valid number and greater than or equal to zero.');
      return;
    }
    setError('');
    setRowData([...rowData, {
      ...newRow,
      balance: parseAbbreviatedValue(newRow.balance),
      approvedLoan: newRow.approvedLoan === '' ? null : parseAbbreviatedValue(newRow.approvedLoan)
    }]);
    setNewRow({ accountNumber: '', customerName: '', balance: '', approvedLoan: '' });
  };

  const handleCellValueChanged = (params) => {
    if (params.colDef.field === 'approvedLoan') {
      const newValue = params.newValue;
      if (newValue === '') {
        params.data.approvedLoan = null;
      } else if (!validateLoanInput(newValue)) {
        setError('Approved Loan must be a valid number and greater than or equal to zero.');
        params.node.setDataValue('approvedLoan', params.oldValue); // Revert to old value
        return;
      } else {
        setError('');
        params.data.approvedLoan = parseAbbreviatedValue(newValue);
      }
    }
    const updatedData = rowData.map(row => 
      row.accountNumber === params.data.accountNumber ? params.data : row
    );
    setRowData(updatedData);
  };

  return (
    <div>
      <div className="ag-theme-alpine" style={{ height: 400, width: 800 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          onCellValueChanged={handleCellValueChanged}
        />
      </div>
      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          value={newRow.accountNumber}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={newRow.customerName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="balance"
          placeholder="Balance"
          value={newRow.balance}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="approvedLoan"
          placeholder="Approved Loan"
          value={newRow.approvedLoan}
          onChange={handleInputChange}
        />
        <button onClick={handleAddRow}>Add Row</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default CustomerBankAccountTable;