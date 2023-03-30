import styles from "@/styles/Group.module.css";

export function ReportedItem({ id, index, title, date, owner, amount, showView, groupId }) {
    return (
        <div index={index} key={id} className={styles.transaction_container + " " + styles.pending}
            onClick={() => showView([index, groupId])}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount + " " + styles.pending_upper_row}>
                    <p>Review Expense: {title}</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>{owner}</p>
                    <p>{date}</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>${amount}</p>
            </div>
        </div>
    )
}
export function PendingItem({ id, index, title, date, owner, amount, showView }) {
    return (
        <div index={index} key={id} className={styles.transaction_container + " " + styles.pending}
            onClick={() => showView(index)}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount + " " + styles.pending_upper_row}>
                    <p>Pending Approval: {title}</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>{owner}</p>
                    <p>{date}</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>${amount}</p>
            </div>
        </div>
    )
}
export function ExpenseItem({ id, index, title, date, owner, amount, isOwner, userId, users, showExpense, groupId }) {
    const sumMemberExpenses = (expenses) => {
        let total = 0.00;
        for (let i = 0; i < expenses.length; i++) {
            total += expenses[i][1];
        }
        //total -= expense[owner];
        return total.toFixed(2);
    }
    //idk why it was changed to an array over a dictionary but ok
    const getRelativeAmt = (expenses) => {
        console.log(expenses);
        for (let i = 0; i < expenses.length; i++) {
            console.log(expenses[i] + " " + userId);
            if (expenses[i][0] == userId) {
                return expenses[i][1].toFixed(2);
            }
        }
        return 0.00;
    }
    let relative = (isOwner) ? sumMemberExpenses(users) : getRelativeAmt(users);
    return (
        <>
        {(relative)?
        <div index={index} key={id} className={`${styles.transaction_container} 
        ${(relative == 0) ? styles.neutral : ((isOwner) ? styles.positive : styles.negative)}`}
            onClick={() => showExpense([index, groupId])}>
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
        :
        <></>
        }
        </>
    )
}

export function GroupItemView({groupId, expenses, members, name, userId, manager, setCurrentTransactionView, setCurrentReportView}) {
    console.log(expenses);
    return <>
    <div className={styles.groupNameHeading}><p>{name}</p></div>
    {
        expenses.map((item, index) => {
            if (item.contested) {
                if (userId == manager) {
                    return (<ReportedItem index={index}
                        title={item.title}
                        date={item.date}
                        amount={item.amount.toFixed(2)}
                        owner={members[item.owner]}
                        showView={setCurrentReportView}
                        groupId = {groupId}
                    ></ReportedItem>);
                } else {
                    return <></>
                }
            }
            return (<ExpenseItem index={index} id={index}
                title={item.title}
                date={item.date}
                owner={members[item.owner]}
                amount={item.amount.toFixed(2)}
                isOwner={(userId == item.owner)}
                userId={userId}
                users={item.users}
                showExpense={setCurrentTransactionView}
                groupId = {groupId}
            ></ExpenseItem>);
        })
    }
    </>
}

export function NoExpenses() {
    return <>
    <div className={styles.NoExpenseContainer}>
        <p>No expenses to show</p>
    </div>
    </>
}

export default function ItemPage() {
    return <></>;
}