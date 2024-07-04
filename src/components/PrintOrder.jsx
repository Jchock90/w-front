// src/components/PrintOrder.jsx

import React, { forwardRef } from 'react';

const PrintOrder = forwardRef(({ order }, ref) => (
  <div ref={ref} className="hidden print:block">
    <h2>N° de pedido: {order._id}</h2>
    <p>Origen: {order.source}</p>
    <p>Total: ${order.total}</p>
    <ul>
      {order.items.map((item, index) => (
        <li key={index}>
          {item.name} (x{item.quantity}) - ${(item.price * item.quantity).toFixed(2)}
        </li>
      ))}
    </ul>
  </div>
));

export default PrintOrder;

