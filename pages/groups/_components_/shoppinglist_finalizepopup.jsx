import React from 'react';
import styles from '@/styles/Group.module.css';
import { ButtonLock } from "../../global_components/button_lock";
import { shopping_methods } from '@/lambda_service/shoppingService.js';
import { group_methods } from '@/lambda_service/groupService';


export default function FinalizePopup({ items, listId, isActive, members, setShowFinalizePopup, userId, groupId, listName }) {
    console.log("Finalizing shopping list...");
    
    const fulfillAction = async () => {
        if (!ButtonLock.isLocked()) {
            const container = document.querySelector("#item_list");
            let format = {
                title: listName,
                total: 0,
                comment: "",
                owner: userId,
                groupId: groupId,
                expense: {},
                tag : "No Tag",
                recurring : "none",
                request_time : "",
                request_date : ""
            }
            for (let child of container.children) {
                let row = child.children[0];
                let person = row.children[1].value;
                let price = parseFloat(row.children[2].value);

                if (format.expense[person] == undefined) {
                    format.expense[person] = 0;
                }
                format.expense[person] += price;
                format.total += price;
            }
            if (format.expense[userId] != undefined) {
                delete format.expense[userId];
            }
            console.log(format);
            const exp_resposne = await group_methods.submitExpense(format);
            if (exp_resposne.errorType) {
                console.log("an error occured");
            } else if (exp_resposne.success) {
                shopping_methods.updateActiveStatus(listId, false);
                window.location.reload(true);
                return;
            } else {
                console.log("I'm not doing this");
            }
            setShowFinalizePopup(false);
        }
    }
    
    const submitConfirmation = () => {
        // const confirmFinalize = window.confirm("Are you sure you want to finalize this list? (cannot be undone)");
        // if (confirmFinalize) {
        //     // Call function to finalize list
        //     fulfillAction();
        // }
        fulfillAction();
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

    const closeContainer = async () => {
        if (!ButtonLock.isLocked()) {
            const res = await shopping_methods.updateActiveStatus(listId, true);
            window.location.reload();
            //setShowFinalizePopup(false);
        }
    }

    return (
        <div className={styles.transaction_background} id="transaction_input">
            <div className={styles.transaction_large}>
                <div className={styles.x_button} onClick={closeContainer}></div>
                <div className={styles.transaction_heading}>
                <p className={styles.filter_expense_container}> Finalize list:</p>
                    <div className={styles.item_list} id = "item_list">
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