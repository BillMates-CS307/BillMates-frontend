import styles from '@/styles/Group.module.css'
import React, { useState } from 'react';

export default function AllowedFulfillmentOptions({ setBillmatesChecked, setVenmoChecked, options = [] }) {
  //const [billmatesChecked, setBillmatesChecked] = useState(true);
  //const [venmoChecked, setVenmoChecked] = useState(true);

  const handleBillmatesChange = (e) => {
    setBillmatesChecked(e.target.checked);
    //onChange(getSelectedOptions());
  };

  const handleVenmoChange = (e) => {
    setVenmoChecked(e.target.checked);
    //onChange(getSelectedOptions());
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
  console.log("options: " + options);
  return (
    <div>
      <fieldset>
        <legend>Allowed Payment Types:</legend>
        <label htmlFor="billmates">
          <input
            id="billmates"
            type="checkbox"
            defaultChecked={(options == 'billmates' || options == 'both')}
            onChange={handleBillmatesChange}
          />
          BillMates/Cash
        </label>
        <br />
        <label htmlFor="venmo">
          <input
            id="venmo"
            type="checkbox"
            defaultChecked={(options == 'venmo' || options == 'both')}
            onChange={handleVenmoChange}
          />
          Venmo
        </label>
      </fieldset>
    </div>
  );
}
