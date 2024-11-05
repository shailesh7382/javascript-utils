# CustomerBankAccountTable Component

The `CustomerBankAccountTable` component is a React component that displays a table of customer bank accounts using AG Grid. It allows users to add new rows and edit the "Approved Loan" field directly in the table. The component handles `0`, `null`, and empty values appropriately.

## Features

- Display customer bank account information in a table.
- Add new rows with customer account details.
- Edit the "Approved Loan" field directly in the table.
- Handle `0`, `null`, and empty values for the "Approved Loan" field.

## Handling of `0`, `null`, and Empty Values

### `0` Value

- The `parseAbbreviatedValue` function correctly handles the value `0` by returning `0` when the input value is `'0'` or `0`.
- This ensures that `0` is treated as a valid input and not converted to `null`.

### `null` Value

- If the "Approved Loan" field is left empty, it is set to `null`.
- This is handled in both the `handleAddRow` and `handleCellValueChanged` functions.

### Empty Value

- If the "Approved Loan" field is left empty, it is treated as `null`.
- The `parseAbbreviatedValue` function returns `null` for empty strings.

## Code Example

Here is the relevant code for handling `0`, `null`, and empty values:
```javascript
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