// src/components/TableView.jsx

import React, { useState, useEffect } from 'react';

const TableView = () => {
  const initialTables = Array(16).fill(false); // Inicializar con 16 mesas, false indica que están libres
  const [tables, setTables] = useState(() => {
    const savedTables = localStorage.getItem('tables');
    return savedTables ? JSON.parse(savedTables) : initialTables;
  });

  useEffect(() => {
    localStorage.setItem('tables', JSON.stringify(tables));
  }, [tables]);

  const toggleTableStatus = (index) => {
    const newTables = [...tables];
    newTables[index] = !newTables[index]; // Alternar el estado de la mesa
    setTables(newTables);
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {tables.map((isOccupied, index) => (
        <div
          key={index}
          className={`w-24 h-24 flex items-center justify-center rounded ${
            isOccupied ? 'bg-red-500' : 'bg-green-500'
          } cursor-pointer`}
          onClick={() => toggleTableStatus(index)}
        >
          <span className="text-white font-bold">Mesa {index + 1}</span>
        </div>
      ))}
    </div>
  );
};

export default TableView;
