import styles from "@/styles/Group.module.css"

export default function TransactionView({members, expense, hideParent, showFulFill, hideFulFill}) {
    console.log(expense);
    return (
        <div className={styles.transaction_background} id = "transaction_view">
        <div className={styles.transaction_large}>
            <div className={styles.x_button} onClick={() => {hideParent(-1)}}></div>
            <div className={styles.transaction_heading} id = "view_item_info">
                <p>{expense.title}</p>
                <p>${expense.amount.toFixed(2)}</p>
                <p>{expense.comments}</p>
                <p>{expense.owner}</p>
            </div>
            <div><p className={styles.debt_remaining_text}>Debts Remaining</p></div>
            <div className={styles.transaction_people} id = "view_transaction_people">
                {
                    Object.keys(expense.users).map( (id) => {
                        let amt_remaining = expense.users[id];
                        if (amt_remaining != 0) {
                        return (
                            <div className={styles.person + " " + styles.person_view}><p>{members[id]}</p><p>${amt_remaining.toFixed(2)}</p></div>
                        )
                        } else {
                            return <></>
                        }
                    })
                }
            </div>
            <div className={styles.submit_expense_container} onClick={() => {hideParent(-1)}}><p>Bill Me</p></div>
        </div>
    </div>
    );
}