import React, { useState } from 'react';

const CreateCustomerForm = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [transactions, setTransactions] = useState([
    {
      Date: '',
      BillNo: '',
      TransactionType: '',
      items: [
        {
          itemCode: '',
          itemName: '',
          purchaseRate: '',
          salesRate: '',
        },
      ],
    },
  ]);

  const handleTransactionChange = (index, field, value) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[index][field] = value;
    setTransactions(updatedTransactions);
  };

  const handleItemChange = (transactionIndex, itemIndex, field, value) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[transactionIndex].items[itemIndex][field] = value;
    setTransactions(updatedTransactions);
  };

  const handleAddTransaction = () => {
    setTransactions([
      ...transactions,
      {
        Date: '',
        BillNo: '',
        TransactionType: '',
        items: [
          {
            itemCode: '',
            itemName: '',
            purchaseRate: '',
            salesRate: '',
          },
        ],
      },
    ]);
  };

  const handleRemoveTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
  };

  const handleAddItem = (transactionIndex) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[transactionIndex].items.push({
      itemCode: '',
      itemName: '',
      purchaseRate: '',
      salesRate: '',
    });
    setTransactions(updatedTransactions);
  };

  const handleRemoveItem = (transactionIndex, itemIndex) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[transactionIndex].items = updatedTransactions[transactionIndex].items.filter((_, i) => i !== itemIndex);
    setTransactions(updatedTransactions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      CustomerName: customerName,
      CustomerMobile: customerMobile,
      transactions,
    };

    try {
      const response = await fetch('http://localhost:4000/api/createCustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Customer created successfully!');
        console.log(data);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Customer</h2>

      <label>
        Customer Name:
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
      </label>

      <label>
        Customer Mobile:
        <input
          type="text"
          value={customerMobile}
          onChange={(e) => setCustomerMobile(e.target.value)}
          required
        />
      </label>

      <h3>Transactions</h3>
      {transactions.map((transaction, index) => (
        <div key={index}>
          <label>
            Date:
            <input
              type="date"
              value={transaction.Date}
              onChange={(e) => handleTransactionChange(index, 'Date', e.target.value)}
              required
            />
          </label>

          <label>
            BillNo:
            <input
              type="text"
              value={transaction.BillNo}
              onChange={(e) => handleTransactionChange(index, 'BillNo', e.target.value)}
            />
          </label>

          <label>
            Transaction Type:
            <input
              type="text"
              value={transaction.TransactionType}
              onChange={(e) => handleTransactionChange(index, 'TransactionType', e.target.value)}
              required
            />
          </label>

          <h4>Items</h4>
          {transaction.items.map((item, itemIndex) => (
            <div key={itemIndex}>
              <label>
                Item Code:
                <input
                  type="text"
                  value={item.itemCode}
                  onChange={(e) => handleItemChange(index, itemIndex, 'itemCode', e.target.value)}
                />
              </label>

              <label>
                Item Name:
                <input
                  type="text"
                  value={item.itemName}
                  onChange={(e) => handleItemChange(index, itemIndex, 'itemName', e.target.value)}
                />
              </label>

              <label>
                Purchase Rate:
                <input
                  type="text"
                  value={item.purchaseRate}
                  onChange={(e) => handleItemChange(index, itemIndex, 'purchaseRate', e.target.value)}
                />
              </label>

              <label>
                Sales Rate:
                <input
                  type="text"
                  value={item.salesRate}
                  onChange={(e) => handleItemChange(index, itemIndex, 'salesRate', e.target.value)}
                />
              </label>

              <button type="button" onClick={() => handleRemoveItem(index, itemIndex)}>
                Remove Item
              </button>
            </div>
          ))}

          <button type="button" onClick={() => handleAddItem(index)}>
            Add Item
          </button>

          <button type="button" onClick={() => handleRemoveTransaction(index)}>
            Remove Transaction
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAddTransaction}>
        Add Transaction
      </button>

      <button type="submit">Submit</button>
    </form>
  );
};

export default CreateCustomerForm;
