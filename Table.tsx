import React, { useMemo } from 'react';

const Table = ({ fundraisers }) => {
  // Filtering fundraisers to only include ones with date greater than today
  const filteredFundraisers = useMemo(() => {
    const today = new Date('2026-03-02'); 
    return fundraisers.filter(fundraiser => new Date(fundraiser.date) > today);
  }, [fundraisers]);

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {filteredFundraisers.map(fundraiser => (
          <tr key={fundraiser.id}>
            <td>{fundraiser.title}</td>
            <td>{new Date(fundraiser.date).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;