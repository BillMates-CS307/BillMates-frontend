import styles from '@/styles/Group.module.css'
import React, { useState } from 'react';

export default function AllowedFulfillmentOptions({ setBillmatesChecked, setVenmoChecked, options }) {
  //const [billmatesChecked, setBillmatesChecked] = useState(true);
  //const [venmoChecked, setVenmoChecked] = useState(true);
  console.log(options);
  console.log(options == 'both');
  return (
    <div>
      <fieldset>
        <legend>Allowed Payment Types:</legend>
        <select name="payments" id="payments">
          <option value="billmates" selected={options == 'billmates'}>BillMates</option>
          <option value="venmo" selected={options == 'venmo'}>Venmo</option>
          <option value="both" selected={options == 'both'}>Both</option>
        </select>
        {/* <label htmlFor="billmates">
          <input
            id="billmates"
            type="checkbox"
            defaultChecked={default_bill}
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
        </label> */}
      </fieldset>
    </div>
  );
}
