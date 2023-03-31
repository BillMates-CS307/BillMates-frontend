import { group_methods } from "@/lambda_service/groupService";
import { user_methods } from "@/lambda_service/userService";
import styles from "@/styles/Group.module.css";
import { use } from "react";
import { ButtonLock } from "../../global_components/button_lock";


export function TransactionView({ userId, members, expense, hideParent }) {
    const closeContainer = () => {
        if (!ButtonLock.isLocked()) {
            hideParent(-1);
        }
    }

    let hasDebt = false;

    return (
        <div className={styles.transaction_background} id="transaction_view">
            <div className={styles.transaction_large}>
                <div className={styles.x_button} onClick={closeContainer}></div>
                <div className={styles.transaction_heading} id="view_item_info">
                    <p>{expense.title}</p>
                    <p>${expense.amount.toFixed(2)}</p>
                    <p style={{color : "var(--neutral-background)"}}>{expense.comment}</p>
                    <div className={styles.name_email_combo}>
                        <p>{members[expense.owner] || "(Not In Group)"}</p>
                        <p>{expense.owner}</p>
                    </div>
                </div>
                {(expense.is_payout)?
                    <div><p className={styles.debt_remaining_text}>Paid To</p></div>
                :
                    <div><p className={styles.debt_remaining_text}>Debts Remaining</p></div>
                }
                
                <div className={styles.transaction_people} id="view_transaction_people">
                    {
                        expense.users.map(([id, amt_remaining]) => {
                            if (amt_remaining != 0) {
                                if (id == userId) {
                                    hasDebt = true;
                                }
                                return (
                                    <div className={styles.person + " " + styles.person_view}>
                                        <div className={styles.name_email_combo}>
                                            <p>{members[id] || "(Not In Group)"}</p>
                                            <p>{id}</p>
                                        </div>
                                        <p>${amt_remaining.toFixed(2)}</p>
                                    </div>
                                )
                            } else {
                                return <></>
                            }
                        })
                    }
                </div>

            </div>
        </div>
    );
}

export function PendingView({ members, expense, hideParent }) {
    const handlePendingPay = async (event, isAccept) => {
        //make API call
        if (!ButtonLock.isLocked()) {
            ButtonLock.LockButton();
            let container = event.target;
            let originalText = container.firstChild.textContent;
            //set button visually to be locked
            container.firstChild.textContent = (isAccept) ? "Accepting" : "Rejecting";
            container.style = (isAccept) ? "background-color : var(--green-muted-background)" : "background-color : var(--red-muted-background)";


            const result = await group_methods.updatePendingStatus(isAccept, expense._id);
            //const result = {success : false};
            if (result.errorType) {
                console.log(result.errorMessage);
            } else if (!result.success) {
                alert("Something went wrong");
            } else { //went through and status has changed
                window.location.reload();
                return;
            }
            ButtonLock.UnlockButton();
            container.firstChild.textContent = originalText;
            container.style = "";
            hideParent(-1);
        }
        return;
    }

    return (
        <div className={styles.transaction_background} id="pending_view">
            <div className={styles.transaction_large}>
                <div className={styles.x_button} onClick={() => hideParent(-1)}></div>
                <div className={styles.transaction_heading} id="pending_item_info">
                    <p>{expense.title}</p>
                    <p>{members[expense.paid_by]}</p>
                </div>
                <div><p className={styles.debt_remaining_text + " " + styles.pending_larger_p}>Amount Paying: $ {expense.amount_paid.toFixed(2)}</p></div>
                <div className={styles.submit_expense_container} onClick={(e) => { handlePendingPay(e, true) }}><p>Accept</p></div>
                <div className={styles.submit_expense_container + " " + styles.negative} onClick={(e) => { handlePendingPay(e, false) }}><p>Reject</p></div>
            </div>
        </div>
    );
}

export function ReportView({ userId, members, expense, hideParent, showFulFill }) {
    const handleReport = async (event, isAccept) => {
        //make API call
        if (!ButtonLock.isLocked()) {
            ButtonLock.LockButton();
            let container = event.target;
            let originalText = container.firstChild.textContent;
            //set button visually to be locked
            container.firstChild.textContent = (isAccept) ? "Accepting" : "Rejecting";
            container.style = (isAccept) ? "background-color : var(--green-muted-background)" : "background-color : var(--red-muted-background)";


            const result = await group_methods.updateReportStatus(!isAccept, expense._id);
            //const result = {success : false};
            if (result.errorType) {
                console.log(result.errorMessage);
            } else if (!result.success) {
                alert("Something went wrong");
            } else { //went through and status has changed
                window.location.reload();
                return;
            }
            ButtonLock.UnlockButton();
            container.firstChild.textContent = originalText;
            container.style = "";
            hideParent(-1);
        }
        return;
    }
    const closeContainer = () => {
        if (!ButtonLock.isLocked()) {
            hideParent(-1);
        }
    }

    return (
        <div className={styles.transaction_background} id="transaction_view">
            <div className={styles.transaction_large}>
                <div className={styles.x_button} onClick={closeContainer}></div>
                <div className={styles.transaction_heading} id="view_item_info">
                    <p>{expense.title}</p>
                    <p>${expense.amount.toFixed(2)}</p>
                    {(expense.comments) ?
                        <p>{expense.comments}</p>
                        :
                        <></>
                    }
                    <div className={styles.name_email_combo}>
                        <p>{members[expense.owner]}</p>
                        <p>{expense.owner}</p>
                    </div>
                </div>
                {(expense.is_payout)?
                    <div><p className={styles.debt_remaining_text}>Paid To</p></div>
                :
                    <div><p className={styles.debt_remaining_text}>Debts Remaining</p></div>
                }
                
                <div className={styles.transaction_people} id="view_transaction_people">
                    {
                        expense.users.map(([id, amt_remaining]) => {
                            if (amt_remaining != 0) {
                                return (
                                    <div className={styles.person + " " + styles.person_view}>
                                        <div className={styles.name_email_combo}>
                                            <p>{members[id]}</p>
                                            <p>{id}</p>
                                        </div>
                                        <p>${amt_remaining.toFixed(2)}</p>
                                    </div>
                                )
                            } else {
                                return <></>
                            }
                        })
                    }
                </div>
                <div className={styles.submit_expense_container} onClick={(e) => { handleReport(e, true) }}><p>Accept</p></div>
                <div className={styles.submit_expense_container + " " + styles.negative} onClick={(e) => { handleReport(e, false) }}><p>Void</p></div>
                {/* {(userId == expense.owner) ?
                    <>
                        <div className={styles.submit_expense_container} onClick={(event) => { confirmAction(event) }}><p>Void Expense</p></div>
                        <div className={styles.confirm_void_container}><p onClick={(event) => { voidAction(event) }}>Confirm</p><p onClick={closeContainer}>Cancel</p></div>
                    </>
                    :
                    (hasDebt) ?
                        <>
                            {(!expense.is_payout)?
                                <div className={styles.submit_expense_container} onClick={(event) => { fulfillAction(event, false) }}><p>Bill Me</p></div>
                            :
                                <></>
                            }
                            <div style={{ backgroundColor: "var(--red-background)" }} className={styles.submit_expense_container} onClick={(event) => { confirmAction(event) }}><p>Report</p></div>
                            <div className={styles.confirm_void_container}><p onClick={(event) => { reportAction(event) }}>Confirm</p><p onClick={closeContainer}>Cancel</p></div>
                        </>
                        :
                        <></>
                } */}

            </div>
        </div>
    );
}

export default function ViewsPage() {
    return <></>;
}