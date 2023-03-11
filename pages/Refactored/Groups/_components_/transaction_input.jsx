import styles from "@/styles/Group.module.css"
import { ButtonLock } from "../../Global_components/button_lock";


export default function TransactionInputView({ members, userId, groupId, commentLength, callback, args }) {
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
    const handleExpenseSubmit = () => {
        if (!ButtonLock.isLocked()) {
            ButtonLock.LockButton();
            //grab the form and inputs
            const form = document.querySelector('#transaction_input');
            const inputs = form.querySelectorAll('input');
            //set button visually to be locked
            form.children[0].children[5].children[0].textContent = "Submitting";
            form.children[0].children[5].style = "background-color : var(--green-muted-background)";

            let running_sum = 0;
            //console.log(format);
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
                format.total = (Math.round((parseFloat(format.total) * 100)) / 100) - (Math.round(((parseFloat(format.expense[userId]) || 0) * 100)) / 100);
                delete format.expense[userId];
                format.total = parseFloat(format.total);
                format.request_time = "now";
                format.due_date = "later";
                //console.log(format);
                for (let user in format.expense) {
                    format.expense[user] = parseFloat(format.expense[user]);
                }
                // const result = await groupService.submitExpense(format);
                // //console.log(result);
                // if (result == LAMBDA_RESP.SUCCESS) {
                //     location.reload();
                // } else if (result == LAMBDA_RESP.INVALID) {
                //     alert("Check to make sure all inputs sum to the total, there are no '$', and that there is at least one person paying");
                //     return;
                // } else if (result == LAMBDA_RESP.ERROR || result == LAMBDA_RESP.INVALID_TOKEN) {
                //     alert("Something went wrong please try again later");
                //     return;
                // }
            }


            ButtonLock.UnlockButton();
            //set button visually to be unlocked
            form.children[0].children[5].children[0].textContent = "Submit";
            form.children[0].children[5].style = "";
        } else {
            //console.log(ButtonLock.isLocked());
        }
    }

    const updateCharacterCount = (event) => {
        //console.log(event);
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
                <div className={styles.x_button} onClick={() => {callback(args)}}></div>
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
                                    <p className={styles.person_name} onClick={(e) => selectPerson(e, idx)}>{members[id]}</p>
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