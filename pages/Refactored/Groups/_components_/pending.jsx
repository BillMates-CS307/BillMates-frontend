import styles from "@/styles/Group.module.css";

export default function PendingItem({id,index, title, date, owner, amount}) {
    const makePendingView = (index) => {
        console.log(index);
        return;
    }

    return (
        <div index={index} className={`${styles.transaction_container} ${styles.pending}`} key={index} onClick={() => makePendingView(index)}>
        <div className={styles.pending_transaction_info}>
            <div className={styles.transaction_name_amount}>
                <p>Pending:</p>
                <p>{title}</p>
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