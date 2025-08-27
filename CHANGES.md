
```js
GET /api/Invoices
[
    {
        invoiceId: 1,
        clientId: 3,
        clientName:"string",
        status: "Unpaid",
        orderDate: "2025-08-23T09:59:12.819Z",
        dueDate: "2025-08-23T09:59:12.819Z",
        receiptUrl: "string" || null, 
        receiptId: 0 or null, 
    }
]
```

```js
GET /api/Invoices/invoiceId
{
  invoiceId: 2,
  clientId: 3,
  status: "Unpaid",
  orderDate: "2025-08-23T00:00:00Z",
  dueDate: "2025-08-23T00:00:00Z",
  totalAmount: 120,
  
  items: [
    {
      invoiceItemId: 2,
      itemName: "mior item",
      quantity: 1,
      unitPrice: 120,
      lineTotal: 120
    }
  ]
}
```

```js
POST /api/Expenses 
{
  itemName: "Burger Chicken Crispy",
  category: "",
  quantity: 4,
  unitPrice: 4,
  receiptFile: File ,
}

GET /api/Expenses
[
  {
    id: 1,
    itemName: "Burger Chicken Crispy",
    category: "string",
    quantity: 4,
    unitPrice: 4,
    receiptUrl: "string"
    receiptId: 0,
  }
]
```