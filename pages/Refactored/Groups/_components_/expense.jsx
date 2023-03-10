import styles from "@/styles/Group.module.css";

export default function ExpenseItem({id,index, title, date, owner, amount, isOwner, userId, users}) {
    const makeTransactionView = (index) => {
        console.log(index);
        return;
    }
    const sumMemberExpenses = (expense, owner) => {
        let total = 0.00;
        for (let user in expense) {
            total += parseFloat(expense[user]);
        }
        //total -= expense[owner];
        return total.toFixed(2);
    }
    let relative = ( isOwner ) ?  sumMemberExpenses(users) : ((parseFloat(users[userId]) || 0.00).toFixed(2));
    //relative_amount += parseFloat(((isOwner) ? relative : relative * -1));
    return (
        <div index={index} key={id} className={`${styles.transaction_container} ${(relative == 0)? styles.neutral  : ( (isOwner) ? styles.positive : styles.negative)}`} onClick={() => makeTransactionView(index)}>
        <div className={styles.transaction_info}>
            <div className={styles.transaction_name_amount}>
                <p>{title}</p>
                <p>${amount}</p>
            </div>
            <div className={styles.transaction_owner_date}>
                <p>{owner}</p>
                <p>{date}</p>
            </div>
        </div>
        <div className={styles.relative_amount}>
            <p>${relative}</p>
        </div>
    </div>
    )
}