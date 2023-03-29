import styles from '@/styles/Group.module.css'
import React, { useState } from 'react';

export default function AllowedFulfillmentOptions({ options = [], onChange }) {
  const [billmatesChecked, setBillmatesChecked] = useState(true);
  const [venmoChecked, setVenmoChecked] = useState(true);

  const handleBillmatesChange = (e) => {
    setBillmatesChecked(e.target.checked);
    onChange(getSelectedOptions());
  };

  const handleVenmoChange = (e) => {
    setVenmoChecked(e.target.checked);
    onChange(getSelectedOptions());
  };

  const getSelectedOptions = () => {
    const selectedOptions = [];
    if (billmatesChecked) {
      selectedOptions.push("billmates");
    }
    if (venmoChecked) {
      selectedOptions.push("venmo");
    }
    return selectedOptions;
  };

  return (
    <div>
      <fieldset>
        <legend>Allowed Payment Types:</legend>
        <label htmlFor="billmates">
          <input
            id="billmates"
            type="checkbox"
            checked={billmatesChecked}
            onChange={handleBillmatesChange}
          />
          BillMates/Cash
        </label>
        <br />
        <label htmlFor="venmo">
          <input
            id="venmo"
            type="checkbox"
            checked={venmoChecked}
            onChange={handleVenmoChange}
          />
          Venmo
        </label>
      </fieldset>
    </div>
  );
}
