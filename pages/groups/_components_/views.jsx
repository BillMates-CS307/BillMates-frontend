import { group_methods } from "@/lambda_service/groupService";
import { user_methods } from "@/lambda_service/userService";
import styles from "@/styles/Group.module.css";
import { use } from "react";
import { ButtonLock } from "../../global_components/button_lock";


export function TransactionInputView({ members, userId, groupId, commentLength, callback, args }) {
    console.log("Creating Transaction Input View");
    let format = {
        title: "",
        amount: "",
        comment: "",
        members: Object.keys(members).map((id, idx) => {
            return { id: id, name: members[id], position: idx, selected: false, amount: 0 }
        }),
        owner: userId,
        groupId: groupId,
        expense: {},
        numSelected: 0
    }

    const splitEven = () => {
        const elm = document.querySelector('#transaction_people');
        //reset the error total message
        elm.nextElementSibling.style = "";
        if (format.numSelected == 0) { return; }

        //get and check the total amount inputted
        const input_total = document.querySelector('#input_item_total');
        if (input_total.value.search(/^[0-9]*[.][0-9]{2}$/g) == -1 && input_total.value.search(/^[0-9]*$/g) == -1) {
            input_total.nextElementSibling.textContent = "Invalid Number";
            input_total.style = "outline: 2px solid var(--red-background);";
            input_total.nextElementSibling.style = "display:block";
            input_total.addEventListener('keydown', function () {
                this.style = "";
                this.nextElementSibling.style = "";
            }, { once: true });
            return;
        }
        const total = parseFloat(input_total.value);
        if (total <= 0 || isNaN(total)) {
            return;
        }
        //split amoung selected inputs
        const augmented_total = Math.round(total * 100);
        const remainder = augmented_total % format.numSelected;
        const amount_per = Math.trunc(augmented_total / format.numSelected);
        const elements = elm.querySelectorAll("input");
        let lastIdx = -1;

        for (let i = 0; i < format.members.length; i++) {
            if (format.members[i].selected) {
                lastIdx = i;
                elements[i].value = (amount_per / 100).toFixed(2);
            }
        }
        elements[lastIdx].value = ((amount_per + remainder) / 100).toFixed(2);
        return;
    }
    //when person is selected, input box becomes available to type amount
    //when deselected, input box is set to zero and not changeable
    const selectPerson = (event, idx) => {
        format.members[idx].selected = !format.members[idx].selected;
        format.members[idx].amount = 0;
        format.numSelected += (format.members[idx].selected) ? 1 : -1;
        const container = event.target.parentNode;
        //toggle selected class on radio
        container.firstChild.classList.toggle(`${styles.active}`);
        //toggle input view
        container.lastChild.value = "";
        container.lastChild.readOnly = !format.members[idx].selected;
        //reset error field if deselecting
        if (!format.members[idx].selected) {
            container.parentNode.nextElementSibling.style = "";
        }
        return;
    }
    const handleExpenseSubmit = async () => {
        if (!ButtonLock.isLocked()) {
            ButtonLock.LockButton();
            //grab the form and inputs
            const form = document.querySelector('#transaction_input');
            const inputs = form.querySelectorAll('input');
            //set button visually to be locked
            form.children[0].children[5].children[0].textContent = "Submitting";
            form.children[0].children[5].style = "background-color : var(--green-muted-background)";

            let running_sum = 0;
            loooping:
            for (let i = 0; i < inputs.length; i++) {
                switch (i) {
                    case 0:
                        format.title = inputs[i].value;
                        break;
                    case 1:
                        format.total = inputs[i].value;
                        break;
                    case 2:
                        format.comment = inputs[i].value;
                        break;
                    default:
                        if (!format.members[i - 3].selected || inputs[i].value == "" || parseFloat(inputs[i].value) == 0) { break; }
                        if (inputs[i].value.search(/^[0-9]*[.][0-9]{2}$/g) == -1 && inputs[i].value.search(/^[0-9]*$/g) == -1) {
                            inputs[i].style = "outline: 2px solid var(--red-background);";
                            inputs[i].addEventListener('keydown', function () {
                                this.style = "";
                            }, { once: true });
                            format.expense = {};
                            break loooping;
                        } else {
                            format.expense[format.members[i - 3].id] = inputs[i].value;
                            running_sum += parseFloat(inputs[i].value) || 0;
                        }
                }
            }

            if (format.title == "") {
                inputs[0].nextElementSibling.textContent = "Cannot be blank";
                inputs[0].style = "outline: 2px solid var(--red-background);";
                inputs[0].nextElementSibling.style = "display:block";
                inputs[0].addEventListener('keydown', function () {
                    this.style = "";
                    this.nextElementSibling.style = "";
                }, { once: true });
            }

            if (format.total == "" || parseFloat(format.total) <= 0) {
                inputs[1].nextElementSibling.textContent = "Cannot be blank";
                inputs[1].style = "outline: 2px solid var(--red-background);";
                inputs[1].nextElementSibling.style = "display:block";
                inputs[1].addEventListener('keydown', function () {
                    this.style = "";
                    this.nextElementSibling.style = "";
                }, { once: true });
            } else if (format.total.search(/^[0-9]*[.][0-9]{2}$/g) == -1 && format.total.search(/^[0-9]*$/g) == -1) {
                inputs[1].nextElementSibling.textContent = "Invalid Number";
                inputs[1].style = "outline: 2px solid var(--red-background);";
                inputs[1].nextElementSibling.style = "display:block";
                inputs[1].addEventListener('keydown', function () {
                    this.style = "";
                    this.nextElementSibling.style = "";
                }, { once: true });
                format.total = "";
            } else if (parseFloat(format.total) != running_sum) {
                const elm = document.querySelector("#transaction_people").nextElementSibling;
                elm.style = "display:block";
                const amt = (Math.round((parseFloat(format.total) - running_sum) * 100) / 100);
                elm.textContent = `Amount ${(amt < 0) ? "Over" : "Left"} $` + Math.abs(amt).toFixed(2);
                format.total = "";
            }

            if (format.title != "" && format.total != "" && format.expense != {}) {
                //why are we subtracting what the owner paid from the grand total???
                //format.total = (Math.round((parseFloat(format.total) * 100)) / 100) - (Math.round(((parseFloat(format.expense[userId]) || 0) * 100)) / 100);
                delete format.expense[userId];
                format.total = parseFloat(format.total);
                format.request_time = "now";
                format.due_date = "later";
                for (let user in format.expense) {
                    format.expense[user] = parseFloat(format.expense[user]);
                }
                const result = await group_methods.submitExpense(format);
                if (result.errorType) {
                    console.log(result.errorMessage);
                    return;
                } else if (result.success) {
                    window.location.reload();
                    return;
                } else {
                    alert("invalid but not error");
                }
            }


            ButtonLock.UnlockButton();
            //set button visually to be unlocked
            form.children[0].children[5].children[0].textContent = "Submit";
            form.children[0].children[5].style = "";
        } else {
            console.log("Button is Locked");
        }
    }

    const updateCharacterCount = (event) => {
        const target = event.target;
        target.nextElementSibling.textContent = target.value.length + "/" + commentLength;
        return;
    }

    const hideView = (elm) => {
        format = {
            title: "",
            amount: "",
            comment: "",
            members: Object.keys(members).map((id, idx) => {
                return { id: id, name: members[id], position: idx, selected: false, amount: 0 }
            }),
            owner: userId,
            groupId: groupId,
            expense: {},
            numSelected: 0
        }
        //reset input fields
        const inputs = elm.querySelectorAll("input");
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
            if (i == 2) {
                inputs[i].nextElementSibling.textContent = "0/" + commentLength;
            } else if (i > 2) {
                inputs[i].parentNode.firstChild.className = styles.radio;
            }
        }
        elm.children[0].children[4].style = "";
        elm.style = "";

    }

    return (
        <div className={styles.transaction_background} id="transaction_input">
            <div className={styles.transaction_large}>
                <div className={styles.x_button} onClick={() => { callback(args) }}></div>
                <div className={styles.transaction_heading}>
                    <input type="text" placeholder='Item Name' id="input_item_name"></input>
                    <span></span>
                    <input type="text" placeholder='00.00' id="input_item_total"></input>
                    <span></span>
                    {(commentLength > 0) ?
                        <>
                            <input type="text" placeholder='Comments' id="input_item_comments" maxLength={commentLength} onInput={updateCharacterCount}></input>
                            <span className={styles.comments_char_count}>0/{commentLength}</span>
                        </>
                        :
                        <>
                            <input type="hidden" id="input_item_comments"></input>
                        </>
                    }
                    <p>{members[userId]}</p>
                </div>
                <div className={styles.split_button_container}>
                    <button onClick={() => splitEven()}>Split Even</button>
                </div>
                <div className={styles.transaction_people} count="0" id="transaction_people">
                    {

                        Object.keys(members).map((id, idx) => {
                            return (
                                <div className={styles.person}>
                                    <div className={styles.radio} onClick={(e) => selectPerson(e, idx)}></div>
                                    <div className={styles.name_email_combo} onClick={(e) => selectPerson(e, idx)}>
                                        <p className={styles.person_name}>{members[id]}</p>
                                        <p>{id}</p>
                                    </div>
                                    <input type="text" placeholder='00.00' email={id} onChange={(e) => { e.target.parentNode.parentNode.nextElementSibling.style = ""; }} readOnly={true}></input>
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

export function TransactionView({ userId, members, expense, hideParent, showFulFill }) {
    const fulfillAction = () => {
        if (!ButtonLock.isLocked()) {
            hideParent(-1);
            showFulFill(expense);
        }
    }
    const reportAction = async (event) => {
        if (!ButtonLock.isLocked()) {
            ButtonLock.LockButton();
            let container = event.target;
            let originalText = container.firstChild.textContent;
            //set button visually to be locked
            container.firstChild.textContent = "Reporting";
            container.style = "background-color : var(--green-muted-background)";

            //TODO: check api call
            const result = await group_methods.reportExpense(expense._id);
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
    const voidAction = async (event) => {
        if (!ButtonLock.isLocked()) {
            ButtonLock.LockButton();
            let container = event.target;
            let originalText = container.firstChild.textContent;
            //set button visually to be locked
            container.firstChild.textContent = "Voiding";
            container.style = "background-color : var(--green-muted-background)";

            //TODO: check api call
            const result = await group_methods.voidExpense(expense._id);
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
                                if (id == userId) {
                                    hasDebt = true;
                                }
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
                {(userId == expense.owner) ?
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
                }

            </div>
        </div>
    );
}

export function FulFillView({ userId, expense, defaultVenmo, hideParent }) {
    let usingVenmo = defaultVenmo;
    let amt = 0;
    for (let pair of expense.users) {
        if (pair[0] == userId) {
            amt = pair[1];
            break;
        }
    }
    const toggle = (event, isVenmo) => {
        const elm = event.target;
        elm.style = "background:var(--green-background); color : #FFF";
        usingVenmo = isVenmo;
        if (isVenmo) {
            elm.previousElementSibling.style = "";
        } else {
            elm.nextElementSibling.style = "";
        }
    }

    const handleExpensePay = async (event) => {
        if (!ButtonLock.isLocked()) {
            ButtonLock.LockButton();
            let container = event.target;
            let originalText = container.firstChild.textContent;
            //set button visually to be locked
            container.firstChild.textContent = "Billing";
            container.style = "background-color : var(--green-muted-background)";
            /*
            
            check if login was successful
                        - not : whatever form stuff
            check if 2 factor needed
                        call otp
                        check if secret expired (boolean returned)
                            - is : whatever form stuff
                            - not : show opt form
            
            loginwithcredentials {
                error : int,
                errorMessage : string
                success : bool,
                otpSecret : string or null,
                deviceId : string or null
            }
            sendSms {
                error : int,
                errorMessage : string,
                success : bool
            }
            
            */

            if (usingVenmo) {
                let my_token = "Bearer e7bdd17043835f22d704edf1a896ca6d43924110251baa85bca5e14062739900";
                let result = await user_methods.getUserIdsFromVenmo(my_token, my_token);
                console.log(result);
                if (result[0].success && result[1].success) { //both users had valid tokens and linked to Venmo
                    let payment = await user_methods.payUserWithVenmo(my_token, "1", result[0].userId, result[1].userId);
                    console.log(payment);
                }
            

                //check if login credentials work
                // let result = await user_methods.loginVenmoWithCredentials("coverlog555@gmail.com", "Logcov210117?");
                // if (result.error) {
                //     alert("We got an error");
                //     console.log(result.errorMessage);
                // } else if (!result.success) {
                //     console.log("invalid credentials");
                // } else if (result.otpSecret) {
                //     console.log(result);
                //     let smsResult = await user_methods.sendVenmoSms(result.deviceId, result.otpSecret);
                //     if (smsResult.success) {
                //         console.log("sent the text");
                //     } else {
                //         console.log("secret expired somehow");
                //     }
                // }
                // let finalResult = await user_methods.loginVenmoWithOtp("357113572186890509257930635223921221", "MeyN16znRPaIl7AdULCSfTpoFK2smvQTOSdRbcgnANxXUJBoaRXPLq2iaotQQ7AV", "990700");
                // console.log(finalResult);
            } else {
                console.log("using billmates");
                let result = await group_methods.fulfillExpense(userId, expense._id, amt);
                if (result.errorType) {
                    console.log(result.errorMessage);
                    alert("Something went wrong, please try again later");
                } else if (!result.success) {
                    console.log("Unsuccessful (this should be impossible)");
                } else {
                    window.location.reload();
                    return;
                }
            }

            ButtonLock.UnlockButton();
            container.firstChild.textContent = originalText;
            container.style = "";
        } else {
            console.log("locked");
        }
    }

    return (
        <div className={styles.transaction_background} id="submit_expense">
            <div className={styles.transaction_large}>
                <div className={styles.x_button} onClick={() => { hideParent(null) }}></div>
                {(defaultVenmo) ?
                    <div className={styles.payment_method} ><button onClick={(e) => toggle(e, false)}>BillMates</button><button style={{ background: "var(--green-background)", color: "#FFF" }} onClick={(e) => toggle(e, true)}>Venmo</button></div>
                    :
                    <div className={styles.payment_method} ><button style={{ background: "var(--green-background)", color: "#FFF" }} onClick={(e) => toggle(e, false)}>BillMates</button><button onClick={(e) => toggle(e, true)}>Venmo</button></div>
                }
                <div className={styles.expense_payment_form}>
                    <p>Amount Paying: ${amt.toFixed(2)}</p>
                </div>
                <div className={styles.submit_expense_container} onClick={(e) => { handleExpensePay(e) }}><p>Bill Me</p></div>
            </div>
        </div>
    )
}

export function PendingView({ members, expense, hideParent }) {
    console.log(expense);
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

export function PayAllView({ members, userId, groupId, commentLength, callback, args, balance, userBalances }) {
    console.log("Creating Payout All View");
    //remove user from the list of members

    let idx = 0;
    let format = {
        title: "",
        amount: balance,
        comment: "",
        members: Object.keys(members).reduce((result, id) => {
            if (id != userId) {
                result.push({ id: id, name: members[id], position: idx, selected: false, amount: 0 })
                idx++;
            }
            return result;
        }, []),
        owner: userId,
        groupId: groupId,
        expense: {},
        numSelected: 0
    }
    const splitEven = () => {
        const elm = document.querySelector('#transaction_people');
        //reset the error total message
        elm.nextElementSibling.style = "";
        if (format.numSelected == 0) { return; }

        //get and check the total amount inputted
        const input_total = document.querySelector('#input_item_total');
        if (input_total.value.search(/^[0-9]*[.][0-9]{2}$/g) == -1 && input_total.value.search(/^[0-9]*$/g) == -1) {
            input_total.nextElementSibling.textContent = "Invalid Number";
            input_total.style = "outline: 2px solid var(--red-background);";
            input_total.nextElementSibling.style = "display:block";
            input_total.addEventListener('keydown', function () {
                this.style = "";
                this.nextElementSibling.style = "";
            }, { once: true });
            return;
        }
        const total = parseFloat(input_total.value);
        if (total <= 0 || isNaN(total)) {
            return;
        }
        //split amoung selected inputs
        const augmented_total = Math.round(total * 100);
        const remainder = augmented_total % format.numSelected;
        const amount_per = Math.trunc(augmented_total / format.numSelected);
        const elements = elm.querySelectorAll("input");
        let lastIdx = -1;

        for (let i = 0; i < format.members.length; i++) {
            if (format.members[i].selected) {
                lastIdx = i;
                elements[i].value = (amount_per / 100).toFixed(2);
            }
        }
        elements[lastIdx].value = ((amount_per + remainder) / 100).toFixed(2);
        return;
    }
    //when person is selected, input box becomes available to type amount
    //when deselected, input box is set to zero and not changeable
    const selectPerson = (event, idx) => {
        format.members[idx].selected = !format.members[idx].selected;
        format.members[idx].amount = 0;
        format.numSelected += (format.members[idx].selected) ? 1 : -1;
        const container = event.target.parentNode;
        //toggle selected class on radio
        container.firstChild.classList.toggle(`${styles.active}`);
        //toggle input view
        container.lastChild.value = "";
        container.lastChild.readOnly = !format.members[idx].selected;
        //reset error field if deselecting
        if (!format.members[idx].selected) {
            container.parentNode.nextElementSibling.style = "";
        }
        return;
    }
    const handleExpenseSubmit = async () => {
        if (!ButtonLock.isLocked()) {
            ButtonLock.LockButton();
            //grab the form and inputs
            const form = document.querySelector('#transaction_input');
            const inputs = form.querySelectorAll('input');
            //set button visually to be locked
            form.children[0].children[5].children[0].textContent = "Submitting";
            form.children[0].children[5].style = "background-color : var(--green-muted-background)";

            let running_sum = 0;
            loooping:
            for (let i = 0; i < inputs.length; i++) {
                switch (i) {
                    case 0:
                        format.title = inputs[i].value;
                        break;
                    case 1:
                        format.total = inputs[i].value;
                        break;
                    case 2:
                        format.comment = inputs[i].value;
                        break;
                    default:
                        if (!format.members[i - 3].selected || inputs[i].value == "" || parseFloat(inputs[i].value) == 0) { break; }
                        if (inputs[i].value.search(/^[0-9]*[.][0-9]{2}$/g) == -1 && inputs[i].value.search(/^[0-9]*$/g) == -1) {
                            inputs[i].style = "outline: 2px solid var(--red-background);";
                            inputs[i].addEventListener('keydown', function () {
                                this.style = "";
                            }, { once: true });
                            format.expense = {};
                            break loooping;
                        } else {
                            format.expense[format.members[i - 3].id] = inputs[i].value;
                            running_sum += parseFloat(inputs[i].value) || 0;
                        }
                }
            }

            if (format.title == "") {
                inputs[0].nextElementSibling.textContent = "Cannot be blank";
                inputs[0].style = "outline: 2px solid var(--red-background);";
                inputs[0].nextElementSibling.style = "display:block";
                inputs[0].addEventListener('keydown', function () {
                    this.style = "";
                    this.nextElementSibling.style = "";
                }, { once: true });
            }

            if (format.total == "" || parseFloat(format.total) <= 0) {
                inputs[1].nextElementSibling.textContent = "Cannot be blank";
                inputs[1].style = "outline: 2px solid var(--red-background);";
                inputs[1].nextElementSibling.style = "display:block";
                inputs[1].addEventListener('keydown', function () {
                    this.style = "";
                    this.nextElementSibling.style = "";
                }, { once: true });
            } else if (format.total.search(/^[0-9]*[.][0-9]{2}$/g) == -1 && format.total.search(/^[0-9]*$/g) == -1) {
                inputs[1].nextElementSibling.textContent = "Invalid Number";
                inputs[1].style = "outline: 2px solid var(--red-background);";
                inputs[1].nextElementSibling.style = "display:block";
                inputs[1].addEventListener('keydown', function () {
                    this.style = "";
                    this.nextElementSibling.style = "";
                }, { once: true });
                format.total = "";
            } else if (parseFloat(format.total) != running_sum) {
                const elm = document.querySelector("#transaction_people").nextElementSibling;
                elm.style = "display:block";
                const amt = (Math.round((parseFloat(format.total) - running_sum) * 100) / 100);
                elm.textContent = `Amount ${(amt < 0) ? "Over" : "Left"} $` + Math.abs(amt).toFixed(2);
                format.total = "";
            }

            if (format.title != "" && format.total != "" && format.expense != {}) {
                //why are we subtracting what the owner paid from the grand total???
                //format.total = (Math.round((parseFloat(format.total) * 100)) / 100) - (Math.round(((parseFloat(format.expense[userId]) || 0) * 100)) / 100);
                //delete format.expense[userId];
                format.total = parseFloat(format.total);
                format.request_time = "now";
                format.due_date = "later";
                for (let user in format.expense) {
                    format.expense[user] = parseFloat(format.expense[user]);
                }
                console.log(format);
                const result = await group_methods.submitPayout(format);
                if (result.errorType) {
                    console.log(result.errorMessage);
                    alert("Something went wrong, please try again later");
                } else if (result.success) {
                    window.location.reload();
                    return;
                } else {
                    alert("invalid but not error");
                }
            }


            ButtonLock.UnlockButton();
            //set button visually to be unlocked
            form.children[0].children[5].children[0].textContent = "Submit";
            form.children[0].children[5].style = "";
        } else {
            console.log("Button is Locked");
        }
    }

    const updateCharacterCount = (event) => {
        const target = event.target;
        target.nextElementSibling.textContent = target.value.length + "/" + commentLength;
        return;
    }

    return (
        <div className={styles.transaction_background} id="transaction_input">
            <div className={styles.transaction_large}>
                <div className={styles.x_button} onClick={() => { callback(args) }}></div>
                <div className={styles.transaction_heading}>
                    <input type="text" placeholder='Item Name' id="input_item_name" readOnly value={members[userId] + " has paid back their balance in full"}></input>
                    <span></span>
                    <input type="text" placeholder='00.00' id="input_item_total" readOnly value={(format.amount * -1).toFixed(2)}></input>
                    <span></span>
                    {(commentLength > 0) ?
                        <>
                            <input type="text" placeholder='Comments' id="input_item_comments" maxLength={commentLength} onInput={updateCharacterCount}></input>
                            <span className={styles.comments_char_count}>0/{commentLength}</span>
                        </>
                        :
                        <>
                            <input type="hidden" id="input_item_comments"></input>
                        </>
                    }
                    <p>{members[userId]}</p>
                </div>
                <div className={styles.split_button_container}>
                    <button onClick={() => splitEven()}>Split Even</button>
                </div>
                <div className={styles.transaction_people} count="0" id="transaction_people">
                    {

                        format.members.map((member) => {
                            return (
                                <div className={styles.person}>
                                    <div className={styles.radio} onClick={(e) => selectPerson(e, member.position)}></div>
                                    <div className={styles.name_email_combo} onClick={(e) => selectPerson(e, member.position)}>
                                        <p className={styles.person_name}>{members[member.id]}</p>
                                        <p>{member.id}</p>
                                    </div>
                                    <input type="text" placeholder={userBalances[member.id].toFixed(2)} email={member.id} onChange={(e) => { e.target.parentNode.parentNode.nextElementSibling.style = ""; }} readOnly={true}></input>
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


export default function ViewsPage() {
    return <></>;
}