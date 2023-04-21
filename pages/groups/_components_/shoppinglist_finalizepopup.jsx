import React from 'react';
import styles from '@/styles/Group.module.css';
import { ButtonLock } from "../../global_components/button_lock";
import { shopping_methods } from '@/lambda_service/shoppingService.js';

export default function FinalizePopup({ items, listId, isActive, members, setShowFinalizePopup }) {
    console.log("Finalizing shopping list...");
    
    const fulfillAction = () => {
        if (!ButtonLock.isLocked()) {
            setShowFinalizePopup(false);
        }
    }
    
    const submitConfirmation = () => {
        const confirmFinalize = window.confirm("Are you sure you want to finalize this list? (cannot be undone)");
        if (confirmFinalize) {
            // Call function to finalize list
            fulfillAction();
        }
    };

    const activeStatus = async (event) => {
        if (!ButtonLock.isLocked()) {
            ButtonLock.LockButton();
            let container = event.target;
            let originalText = container.firstChild.textContent;
            //set button visually to be locked
            container.firstChild.textContent = "Voiding";
            container.style = "background-color : var(--green-muted-background)";

            //TODO: check api call
            const result = await shopping_methods.updateActiveStatus(listId, isActive);
            //const result = {success : false};
            if (result.errorType) {
                console.log(result.errorMessage);
                alert("Something went wrong, please try again later");
            } else if (!result.success) {
                alert("Something went wrong");
            } else { //went through and status has changed
                window.location.reload();
                return;
            }
            ButtonLock.UnlockButton();
            container.firstChild.textContent = originalText;
            container.style = "";
        } else {
            console.log("locked");
        }
    }

    const confirmAction = (event) => {
        event.target.style = "display:none";
        event.target.nextElementSibling.style = "display:grid";
    }

    const closeContainer = () => {
        if (!ButtonLock.isLocked()) {
            setShowFinalizePopup(false);
        }
    }

    return (
        <div className={styles.transaction_background} id="transaction_input">
            <div className={styles.transaction_large}>
                <div className={styles.x_button} onClick={closeContainer}></div>
                <div className={styles.transaction_heading}>
                <p className={styles.filter_expense_container}> Finalize list:</p>
                    <div className={styles.item_list}>
                    {items.map((item, index) => (
                        <div key={index} className={styles.item_row}>
                            <div className={styles.item_container}>
                            <div className={styles.item_text}>{item}</div>
                            <select
                                className={styles.gallery_type_select}
                                id={`member_select_${index}`}
                            >
                                {Object.keys(members).map((member, idx) => (
                                <option key={idx} value={member}>
                                    {members[member]}
                                </option>
                                ))}
                            </select>
                            <input type="text" placeholder='$00.00' id="input_item_total" />
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                <div className={styles.submit_expense_container} onClick={submitConfirmation}><p>Submit</p></div>
            </div>
        </div>
    );
}