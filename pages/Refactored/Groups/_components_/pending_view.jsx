import styles from "@/styles/Group.module.css"

export default function PendingView({members, expense, hideParent}) {
    const handlePendingPay = (e, a) => {
        //make API call
        //reload on success
        //show error box else
        
        hideParent(-1);
        return;
    }
    
    return   (
        <div className={styles.transaction_background} id = "pending_view">
        <div className={styles.transaction_large}>
            <div className={styles.x_button} onClick={() =>hideParent(-1)}></div>
            <div className={styles.transaction_heading} id = "pending_item_info">
                <p>{expense.title}</p>
                <p>{members[expense.paid_by]}</p>
            </div>
            <div><p className={styles.debt_remaining_text + " " + styles.pending_larger_p}>Amount Paying: $ {expense.amount_paid.toFixed(2)}</p></div>
            <div className={styles.submit_expense_container} onClick={(e) => {handlePendingPay(e, true)}}><p>Accept</p></div>
            <div className={styles.submit_expense_container + " " + styles.negative} onClick={(e) => {handlePendingPay(e, false)}}><p>Reject</p></div>
        </div>
    </div>
    );
}