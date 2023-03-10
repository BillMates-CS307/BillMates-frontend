import styles from "@/styles/Group.module.css"

export default function TransactionInputView({members, userId}) {
    const splitEven = () => {
        return;
    }
    const selectPerson = (event) => {
        return;
    }
    const handleExpenseSubmit = () => {
        return;
    }


    return (
    <div className={styles.transaction_background} id = "transaction_input">
    <div className={styles.transaction_large}>
        <div className={styles.x_button} onClick={(e) => hide(e.nativeEvent.target.parentNode.parentNode, true)}></div>
        <div className={styles.transaction_heading}>
            <input type="text" placeholder='Item Name' id = "input_item_name"></input>
            <span></span>
            <input type="text" placeholder='00.00' id = "input_item_total"></input>
            <span></span>
            <p>{members[userId]}</p>
        </div>
        <div className={styles.split_button_container}>
            <button onClick={() => splitEven()}>Split Even</button>
        </div>
        <div className={styles.transaction_people} count = "0" id = "transaction_people">
            {

            Object.keys(members).map( (id) => {
                return (
                <div className={styles.person}>
                    <div className={styles.radio} onClick={(e) => selectPerson(e)}></div>
                    <p className={styles.person_name} onClick={(e) => selectPerson(e)}>{members[id]}</p>
                    <input type="text" placeholder='00.00' email={id} onChange={ (e) => {e.target.parentNode.parentNode.nextElementSibling.style = "";} }></input>
                </div>
                )
            })
            
            }

        </div>
        <span></span>
        <div className={styles.submit_expense_container} onClick={handleExpenseSubmit}><p>Submit</p></div>
    </div>
</div>

    );
}