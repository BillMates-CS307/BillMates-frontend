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
                inputs[1].nextElementSibling.textContent = "Has to be more than 0.00";
                inputs[1].style = "outline: 2px solid var(--red-background);";
                inputs[1].nextElementSibling.style = "display:block";
                inputs[1].addEventListener('keydown', function () {
                    this.style = "";
                    this.nextElementSibling.style = "";
                }, { once: true });
                format.total = "";
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
                if (format.comment.trim() == "") {
                    format.comment = "No Additional Comments";
                }
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
            const result = await group_methods.reportExpense(expense._id, userId);
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

export function FulFillView({ userId, expense, hideParent, warningPopup, owner, paymentAllowed }) {
    let usingVenmo = (localStorage.getItem("payment_preference") == 'venmo');
    let amt = 0;
    for (let pair of expense.users) {
        if (pair[0] == userId) {
            amt = pair[1];
            break;
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

            if (!document.querySelector("#BillMates").checked) {
                if (paymentAllowed != 'both' && paymentAllowed != 'venmo') {
                    warningPopup(["The group does not allow you to pay with Venmo", 5]);
                    ButtonLock.UnlockButton();
                    container.firstChild.textContent = originalText;
                    container.style = "";
                    return;
                }
                /*
                * Grab tokens of owner and user (from cookie)
                * Grab userId from Venmo using tokens
                * validate the userId response
                *       false -> set popup warning the action
                * Make BillMates fulfill requset to check if expense still exists
                *       false -> relay expense no longer exists
                * Make Venmo request using the API to pay
                */

                //grab token of owner of the expense
                const owner_auth_token = await user_methods.getVenmoAuthToken(expense.owner);
                if (owner_auth_token.errorType) {
                    warningPopup([owner_auth_token.errorMessage + "\n please try again later", 3]);
                    ButtonLock.UnlockButton();
                    container.firstChild.textContent = originalText;
                    container.style = "";
                    return;
                }
                if (!owner_auth_token.success) {
                    warningPopup(["The owner of this expense has not linked their Venmo account yet", 3]);
                    ButtonLock.UnlockButton();
                    container.firstChild.textContent = originalText;
                    container.style = "";
                    return;
                }
                owner_auth_token.token = "Bearer " + owner_auth_token.token;
                //grab token of token of the user
                const user_auth_token = user_methods.getSelfVenmoToken();
                if (user_auth_token.errorType) {
                    warningPopup([owner_auth_token.errorMessage + "\n please try again later", 3]);
                    ButtonLock.UnlockButton();
                    container.firstChild.textContent = originalText;
                    container.style = "";
                    return;
                }
                if (!user_auth_token.success) {
                    warningPopup(["You not have linked your Venmo account yet", 3]);
                    ButtonLock.UnlockButton();
                    container.firstChild.textContent = originalText;
                    container.style = "";
                    return;
                }
                user_auth_token.token = "Bearer " + user_auth_token.token;
                //grab userId from Venmo (required for the actual Venmo transaction)
                const venmo_user_ids = await user_methods.getUserIdsFromVenmo(user_auth_token.token, owner_auth_token.token);
                if (venmo_user_ids[0].errorType || venmo_user_ids[1].errorType) {
                    if (venmo_user_ids[0].errorType) {
                        warningPopup([venmo_user_ids[0].errorMessage + "\n Please try again later", 3]);
                    } else {
                        warningPopup([venmo_user_ids[1].errorMessage + "\n Please try again later", 3]);
                    }
                    ButtonLock.UnlockButton();
                    container.firstChild.textContent = originalText;
                    container.style = "";
                    return;
                }
                if (venmo_user_ids[0].success && venmo_user_ids[1].success) {
                    //Pay through BillMates first to validate it can be done
                    const fulfill_request = await group_methods.fulfillExpense(userId, expense._id, amt, 'Venmo');
                    if (fulfill_request.errorType) {
                        warningPopup([fulfill_request.errorMessage + "\n Please try again later", 3]);
                        ButtonLock.UnlockButton();
                        container.firstChild.textContent = originalText;
                        container.style = "";
                    } else if (!fulfill_request.success) { //expense does not exist
                        window.location.reload();
                        return;
                    } else { //valid to make through Venmo
                        console.log(user_auth_token);
                        console.log(amt);
                        console.log(venmo_user_ids);
                        const venmo_payment = await user_methods.payUserWithVenmo(user_auth_token.token, '1', 
                            venmo_user_ids[0].method, venmo_user_ids[1].userId );
                        console.log(venmo_payment);
                        if (venmo_payment.errorType) {
                            warningPopup([venmo_payment.errorMessage + "\n Resubmit expense through BillMates", 3]);
                            ButtonLock.UnlockButton();
                            container.firstChild.textContent = originalText;
                            container.style = "";
                        }
                    }
                } else {
                    if (venmo_user_ids[0].success) { //other person invalid token
                        warningPopup(["The owner of this expense has not linked their Venmo account yet", 3]);
                    } else {
                        warningPopup(["You have not linked your Venmo account yet", 2]);
                    }
                }
            } else {
                if (paymentAllowed != 'both' && paymentAllowed != 'billmates') {
                    warningPopup(["The group does not allow you to pay with BillMates", 5]);
                    ButtonLock.UnlockButton();
                    container.firstChild.textContent = originalText;
                    container.style = "";
                    return;
                }
                let result = await group_methods.fulfillExpense(userId, expense._id, amt, 'BillMates');
                if (result.errorType) {
                    console.log(result.errorMessage);
                    alert("Something went wrong, please try again later");
                } else if (!result.success) { //expense does not exist
                    window.location.reload();
                    return;
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

    const closeParent = () => {
        sessionStorage.removeItem("isVenmo");
        hideParent(null);
    }

    return (
        <div className={styles.transaction_background} id="submit_expense">
            <div className={styles.transaction_large} action="">
                <div className={styles.x_button} onClick={closeParent}></div>
                <div className={styles.payment_option_container} id="radio_container">
                    <p>Payment Method:</p>
                    <form className={styles.radio_div}>
                        <label>
                            <input id="BillMates" type='radio' name="radio" defaultChecked={!usingVenmo}></input>
                                BillMates
                        </label>
                        <label>
                            <input type='radio' name="radio" defaultChecked={usingVenmo}></input>
                                Venmo
                        </label>
                    </form>
                </div>
                <div className={styles.expense_payment_form}>
                    <p>Amount Paying: ${amt.toFixed(2)}</p>
                    <p>To: {owner}</p>
                    <p>Item: {expense.title}</p>
                </div>
                <div className={styles.submit_expense_container} onClick={(e) => { handleExpensePay(e) }}><p>Bill Me</p></div>
            </div>
        </div>
    )
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