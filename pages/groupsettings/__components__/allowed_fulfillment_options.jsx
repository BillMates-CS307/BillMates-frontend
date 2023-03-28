import styles from '@/styles/Group.module.css'
import React from 'react';

export default function AllowedFulfillmentOptions({ options, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label htmlFor="fulfillment-options">Allowed Fulfillment Options:</label>
      <select
        id="fulfillment-options"
        value={options}
        onChange={handleChange}
      >
        <option value="billmates">BillMates</option>
        <option value="venmo">Venmo</option>
        <option value="both">Both</option>
      </select>
    </div>
  );
}