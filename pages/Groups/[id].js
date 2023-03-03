import styles from '@/styles/Group.module.css'
import Header from '../Globals/Header.js'
import Footer from '../Globals/Footer.js'
import { userService } from '../services/authorization.js';
import { groupService } from '../services/groups.js';
import { LAMBDA_RESP } from '../lib/constants'
import Head from 'next/head'
import { PAYMENT_PREFERENCE } from "@/lib/constants";

export async function getServerSideProps({req, res}) {
    //check if user is signed in
    const {email, token} = userService.getEmailFromToken({res, req});
    if (email == null) {
        return {
            props:{},
            redirect : {permanent: false,
                destination: "/"}
        }
    }
    const group_id = req.url.match("[0-9a-z\-]+$")[0];
    //const group_id = "my_uuid";
    const result = await groupService.getGroup(group_id, email);
    console.log(result);
    if (result == null || !result.token_success || !result.get_success || result.members[email] == undefined) {
        return {
            props:{},
            redirect : {permanent: false,
                destination: "/home"}
        }
    }

    console.log(result);

        return {
            props : {
                groupName : result.name,
                groupId : group_id,
                members : result.members,
                expenseHistory : result.expenses,
                userId : email,
                pendingApproval : result.pending,
                relative : result.balance.toFixed(2),
                manager : result.manager
            }
        }
}


function splitEven() {
    if (typeof window !== "undefined") {
        
        const input_total = document.querySelector('#input_item_total');
        if (input_total.value.search(/^[0-9]*[.][0-9]{2}$/g) == -1 && input_total.value.search(/^[0-9]*$/g) == -1) {
            input_total.nextElementSibling.textContent = "Invalid Number";
            input_total.style = "outline: 2px solid var(--red-background);";
            input_total.nextElementSibling.style ="display:block";
            input_total.addEventListener('keydown', function () {
                this.style = "";
                this.nextElementSibling.style = "";
          }, {once : true});
          return;
        }
        const total = parseFloat(input_total.value);
        if (total <= 0 || isNaN(total)) {
            return;
        }
        

        const elm = document.querySelector('#transaction_people');
        const num = elm.getAttribute("count");
        if (num == 0) {return;}
        const augmented_total = Math.round( total * 100);
        const remainder = augmented_total % num;
        const amount_per = Math.trunc(augmented_total / num);
        const elements = elm.querySelectorAll("." + `${styles.person}`);
        let used = [];
        for (let input of elements) {
            if (input.firstChild.classList.contains(`${styles.active}`)) {
                input.lastChild.value = (amount_per / 100).toFixed(2);
                used.push(input);
            }
        }
        used[0].lastChild.value = ((amount_per + remainder) / 100).toFixed(2);
    }
}

function selectPerson(event) {
    const native = event.nativeEvent;
    let elm = undefined;
    if (native.target.className.includes("Group_person")) {
        elm = native.target;
    } else {
        elm = native.target.parentNode;
    }
    elm.firstChild.classList.toggle(`${styles.active}`);
    if (!elm.firstChild.classList.contains(`${styles.active}`)) {
        elm.lastChild.value = "";
        elm.parentNode.setAttribute("count", parseInt(elm.parentNode.getAttribute("count")) - 1);
    } else {
        elm.parentNode.setAttribute("count", parseInt(elm.parentNode.getAttribute("count")) + 1);
    }
}

function showTransactionInput() {
    const elm = document.querySelector("#transaction_input");
    elm.style = "display:block";
}

function hide(elm, clear = false) {
    if (typeof window !== "undefined") {
        elm.style = "display:none";
        if (clear) {
            for (let input of elm.querySelectorAll('input')) {
                input.value = "";
            }
            elm.children[0].children[3].setAttribute("count", 0);
            for (let input of elm.querySelectorAll("." + `${styles.radio}`)) {
                input.classList = `${styles.radio}`;
            }
        }
    }
}

function sumMemberExpenses(expense, owner) {
    let total = 0.00;
    for (let user in expense) {
        total += parseFloat(expense[user]);
    }
    //total -= expense[owner];
    return total.toFixed(2);
}

function GroupHeading({name, members, amount, groupId}) {
    let hex = (amount == 0) ? "var(--neutral-background)" : (amount < 0) ? "var(--red-background)" : "var(--green-background)";

    return (
        <>
        <div className={styles.group_heading}>
            <div className={styles.group_info}>
                <div className={styles.names_members}>
                    <p>{name}</p>
                    <p>Members: {members}</p>
                </div>
                <div className={styles.group_amount}>
                    <p style={{color:hex}} >${((amount < 0) ? amount * -1 : amount * 1).toFixed(2)}</p>
                </div>
            </div>
            <div className={styles.group_info}>
                <div className={styles.names_members}>
                    <p>Join Link</p>
                    <p className={styles.word_break_all}>localhost:8000/JoinGroup/{groupId}</p>
                </div>
            </div>
            <div className={styles.banner}>
                    <p>EXPENSES</p>
            </div>
        </div>
        </>
    );
}

export default function Group ({groupName, groupId, members, expenseHistory, userId, pendingApproval, relative, manager}) {
    let history_num = -1;
    let pending_num = -1;

    return (

    <>
        <Head>
        <title>Groups</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <Header></Header>
    <main className={styles.main}>
        <div className={styles.transaction_history}>
             {
                pendingApproval.map( (trans) => {
                    pending_num++;
                    if (trans.paid_to == userId) {
                    return (
                        <div index={pending_num} className={`${styles.transaction_container} ${styles.pending}`} key={pending_num} onClick={(e) => makePendingView(e)}>
                        <div className={styles.pending_transaction_info}>
                            <div className={styles.transaction_name_amount}>
                                <p>Pending:</p>
                                <p>{trans.title}</p>
                            </div>
                            <div className={styles.transaction_owner_date}>
                                <p>{members[trans.paid_by]}</p>
                                <p>{trans.date}</p>
                            </div>
                        </div>
                        <div className={styles.relative_amount}>
                            <p>${trans.amount_paid.toFixed(2)}</p>
                        </div>
                    </div>
                    )
                    } else {
                        return <></>
                    }
                })
            }
            {  
                expenseHistory.map( (trans) => {
                    history_num++;
                    let isOwner = ( trans.owner == userId );
                    let relative = ( isOwner ) ?  sumMemberExpenses(trans.users) : ((parseFloat(trans.users[userId]) || 0.00).toFixed(2));
                    //relative_amount += parseFloat(((isOwner) ? relative : relative * -1));
                    return (
                        <div index={history_num} className={`${styles.transaction_container} ${(relative == 0)? styles.neutral  : ( (isOwner) ? styles.positive : styles.negative)}`} key={history_num} onClick={(e) => makeTransactionView(e)}>
                        <div className={styles.transaction_info}>
                            <div className={styles.transaction_name_amount}>
                                <p>{trans.title}</p>
                                <p>${trans.amount.toFixed(2)}</p>
                            </div>
                            <div className={styles.transaction_owner_date}>
                                <p>{members[trans.owner]}</p>
                                <p>{trans.request_time}</p>
                            </div>
                        </div>
                        <div className={styles.relative_amount}>
                            <p>${relative}</p>
                        </div>
                    </div>
                    )
                })
            }
            <button className={styles.delete_group_button} onClick={deleteGroup}>DELETE GROUP</button>
            <div className={styles.buffer_block}></div>
        </div>
        <GroupHeading name={groupName} members={Object.keys(members).length} amount={relative} groupId={groupId}></GroupHeading>
    </main>
    <Footer callback={showTransactionInput} args = {""}></Footer>

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

        <div className={styles.transaction_background} id = "transaction_view">
            <div className={styles.transaction_large}>
                <div className={styles.x_button} onClick={(e) => hide(e.nativeEvent.target.parentNode.parentNode)}></div>
                <div className={styles.transaction_heading} id = "view_item_info">
                    <p>PLACEHOLDER</p>
                    <p>PLACEHOLDER</p>
                    <p>PLACEHOLDER</p>
                </div>
                <div><p className={styles.debt_remaining_text}>Debts Remaining</p></div>
                <div className={styles.transaction_people} id = "view_transaction_people">
                </div>
                <div className={styles.submit_expense_container} onClick={(e) => {hide(e.nativeEvent.target.parentNode.parentNode); showFulfillExpense(e)}}><p>Bill Me</p></div>
            </div>
        </div>
        <div className={styles.transaction_background} id = "pending_view">
            <div className={styles.transaction_large}>
                <div className={styles.x_button} onClick={(e) => hide(e.nativeEvent.target.parentNode.parentNode)}></div>
                <div className={styles.transaction_heading} id = "pending_item_info">
                    <p>PLACEHOLDER</p>
                    <p>PLACEHOLDER</p>
                </div>
                <div><p className={`${styles.debt_remaining_text} ${styles.pending_larger_p}`}>Amount Paying</p></div>
                <div className={styles.submit_expense_container} onClick={(e) => {hide(e.nativeEvent.target.parentNode.parentNode); handlePendingPay(e, true)}}><p>Accept</p></div>
                <div className={`${styles.submit_expense_container} ${styles.negative}`} onClick={(e) => {hide(e.nativeEvent.target.parentNode.parentNode); handlePendingPay(e, false)}}><p>Reject</p></div>
            </div>
        </div>
    <div className={styles.transaction_background} id = "submit_expense">
        <div className={styles.transaction_large}>
            <div className={styles.x_button} onClick={(e) => hide(e.nativeEvent.target.parentNode.parentNode)}></div>
            <div className={styles.payment_method} ><button onClick={(e) => toggleBillVenmo(e,false)}>BillMates</button><button onClick={(e) => toggleBillVenmo(e,true)}>Venmo</button></div> 
            <div className={styles.expense_payment_form}>
                <p>Original Amount : </p>
                <input type="text" id = "expense_paying" placeholder='00.00'></input>
            </div>
            <div className={styles.submit_expense_container} onClick={(e) => {handleExpensePay(e)}}><p>Bill Me</p></div>
        </div>
    </div>
    </>
    );

    function makeTransactionView(event) {
        const expense = expenseHistory[event.target.getAttribute("index")];
        console.log(expenseHistory);
        console.log(event.target.getAttribute("index"));
        const heading = document.querySelector('#view_item_info');
        heading.children[0].textContent = expense.title;
        heading.children[1].textContent = "$" + expense.amount.toFixed(2);
        heading.children[2].textContent = members[expense.owner];
        const people_view = document.querySelector('#view_transaction_people');
        let children_string = "";
        for (let person in expense.users) {
            let amt_remaining = parseFloat(expense.users[person]);
            if (amt_remaining.toFixed(2) == 0) {
                continue;
            }
            children_string += `<div class="${styles.person} ${styles.person_view}"><p>${members[person]}</p><p>$${amt_remaining.toFixed(2)}</p></div>`;
        }
        people_view.innerHTML = children_string;
        people_view.nextElementSibling.setAttribute("index", event.target.getAttribute("index"));
        document.querySelector('#transaction_view').style = "display:block";
    }
    function makePendingView(event) {
        const expense = pendingApproval[event.target.getAttribute("index")];
        const heading = document.querySelector('#pending_item_info');
        heading.children[0].textContent = expense.title;
        heading.children[1].textContent = members[expense.paid_by];
        heading.nextElementSibling.children[0].textContent = "Amount Paying: $" + expense.amount_paid.toFixed(2);
        // const people_view = document.querySelector('#pending_transaction_people');
        // let children_string = "";
        // people_view.innerHTML = children_string;
        // people_view.nextElementSibling.setAttribute("index", event.target.getAttribute("index"));
        const view = document.querySelector('#pending_view');
        view.children[0].setAttribute("index", event.target.getAttribute("index"));
        view.style = "display:block";
    }
    async function handleExpenseSubmit() {
        const form = document.querySelector('#transaction_input');
        const inputs = form.querySelectorAll('input');
        let format = {
            title : "",
            total : 0.00,
            owner : userId,
            expense : {},
            group_id : groupId
        }
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
                default:
                    if (inputs[i].value.search(/^[0-9]*[.][0-9]{2}$/g) == -1 && inputs[i].value.search(/^[0-9]*$/g) == -1) {
                    inputs[i].style = "outline: 2px solid var(--red-background);";
                    inputs[i].addEventListener('keydown', function () {
                        this.style = "";
                    }, {once : true});
                    format.expense = "";
                    break loooping;
                    } else {
                        format.expense[inputs[i].getAttribute("email")] = inputs[i].value;
                        running_sum += parseFloat(inputs[i].value) || 0;
                    }
            }
        }
    
        if (format.title == "") {
            inputs[0].nextElementSibling.textContent = "Cannot be blank";
            inputs[0].style = "outline: 2px solid var(--red-background);";
            inputs[0].nextElementSibling.style ="display:block";
            inputs[0].addEventListener('keydown', function () {
                this.style = "";
                this.nextElementSibling.style = "";
          }, {once : true});
        }
    
        if (format.total == "" || parseFloat(format.total) <= 0) {
            inputs[1].nextElementSibling.textContent = "Cannot be blank";
            inputs[1].style = "outline: 2px solid var(--red-background);";
            inputs[1].nextElementSibling.style ="display:block";
            inputs[1].addEventListener('keydown', function () {
                this.style = "";
                this.nextElementSibling.style = "";
          }, {once : true});
        } else if (format.total.search(/^[0-9]*[.][0-9]{2}$/g) == -1 && format.total.search(/^[0-9]*$/g) == -1) {
            inputs[1].nextElementSibling.textContent = "Invalid Number";
            inputs[1].style = "outline: 2px solid var(--red-background);";
            inputs[1].nextElementSibling.style ="display:block";
            inputs[1].addEventListener('keydown', function () {
                this.style = "";
                this.nextElementSibling.style = "";
          }, {once : true});
          format.total = "";
        } else if (parseFloat(format.total) != running_sum) {
            const elm = document.querySelector("#transaction_people").nextElementSibling;
            elm.style = "display:block";
            elm.textContent = "Amount Difference: $" + (Math.round((parseFloat(format.total) - running_sum) * 100) / 100);
            format.total = "";
        }
    
        if (format.title == "" || format.total == "" || format.expense == "") {
            return;
        } else {
            console.log(format);
            format.total = (Math.trunc((parseFloat(format.total) * 100)) / 100) - (Math.trunc(((parseFloat(format.expense[userId]) || 0) * 100)) / 100);
            delete format.expense[userId];
            format.total = parseFloat(format.total);
            format.request_time = "now";
            format.due_date = "later";
            for (let user in format.expense) {
                format.expense[user] = parseFloat(format.expense[user]);
            }
            const result = await groupService.submitExpense(format);
            console.log(result);
            if (result == LAMBDA_RESP.SUCCESS) {
                location.reload();
            } else if (result == LAMBDA_RESP.INVALID) {
                alert("Check to make sure all inputs sum to the total, there are no '$', and that there is at least one person paying");
                return;
            } else if (result == LAMBDA_RESP.ERROR || result == LAMBDA_RESP.INVALID_TOKEN) {
                alert("Something went wrong please try again later");
                return;
            }
        }
    }
    
    function showFulfillExpense(event) {
        const index = event.target.getAttribute("index");
        if (expenseHistory[index].users[userId] == undefined) {
            alert("You do not have any debts here")
            return;
        }
        const elm = document.querySelector("#submit_expense");
        console.log(elm);
        if (expenseHistory[index].owner == userId) {
            elm.children[0].children[2].children[0].textContent = "Would you like to clear this debt?";
            elm.children[0].children[2].children[1].value = sumMemberExpenses(expenseHistory[index].users, userId);
        } else {
            elm.children[0].children[1].children[ (JSON.parse(localStorage.getItem('payment_preference')) == PAYMENT_PREFERENCE.VENMO) ? 1 : 0].className = `${styles.selected_method}`
            elm.children[0].children[1].children[ (JSON.parse(localStorage.getItem('payment_preference')) == PAYMENT_PREFERENCE.VENMO) ? 0 : 1].className = ""
            elm.children[0].children[2].children[0].textContent = "Original Amount: " + expenseHistory[index].users[userId].toFixed(2);
            elm.children[0].children[2].children[1].value = expenseHistory[index].users[userId].toFixed(2);
        }
        elm.children[0].children[3].setAttribute("index", index);
        elm.style = "display:block";
    }
    
    //when BillMe button is pushed to pay out an existing debt
    async function handleExpensePay(event) {
        const index = event.target.getAttribute("index");
        const input = document.querySelector("#expense_paying");
        if (input.value == "" || (input.value.search(/^[0-9]*[.][0-9]{2}$/g) == -1 && input.value.search(/^[0-9]*$/g) == -1)) {
            input.style = "outline: 2px solid var(--red-background);";
            input.addEventListener('keydown', function () {
                this.style = "";
            }, {once : true});
        } else {
            const value = parseFloat(input.value);
            console.log(expenseHistory[index].users);
    
            const result = await groupService.payDebt(userId, expenseHistory[index]._id, value);
            console.log(result);
            if (result == LAMBDA_RESP.SUCCESS) {
                location.reload();
            } else if (result == LAMBDA_RESP.INVALID) {
                alert("Sorry, we could not process this request");
                location.reload();
            } else if (result == LAMBDA_RESP.ERROR || result == LAMBDA_RESP.INVALID_TOKEN) {
                alert("Something went wrong please try again later");
            }
    
        }
    }
    //when accept or reject is pushed to accept/reject a pending request
    async function handlePendingPay(event, isAccepted) {
        const expense = pendingApproval[event.target.parentNode.getAttribute("index")];
        let accepted = true;
        if (isAccepted) {
            
            console.log(expense);
            console.log("Will be accepted");
        } else {
            accepted = false;
            console.log(expense);
            console.log("Will be Denied");
        }
    
        const result = await groupService.updatePendingState(isAccepted, expense.expense_id);
        if (result == LAMBDA_RESP.SUCCESS) {
            location.reload();
        } else if (result == LAMBDA_RESP.INVALID) {
            alert("Sorry, we could not process this request");
            location.reload();
        } else if (result == LAMBDA_RESP.ERROR || result == LAMBDA_RESP.INVALID_TOKEN) {
            alert("Something went wrong please try again later");
        }
    }
    async function deleteGroup() {
        let name = prompt("Retype the name of the group to delete");
        if (userId != manager) {alert("You are not the group manager"); return;}
        if (name == null) {alert("Sorry, we could not process that right now");return;}
        if (name == groupName) {
            let result = await groupService.deleteGroup(groupId);
            if (result == LAMBDA_RESP.ERROR || result == LAMBDA_RESP.INVALID || result == LAMBDA_RESP.INVALID_TOKEN) {
                alert("Sorry, we could not process that right now");
                return;
            }
            location.reload();
        } else {
            return;
        }
        return;
    }
}

function toggleBillVenmo(event, isVenmo) {
    if (isVenmo) {
        event.target.previousElementSibling.className="";
    } else {
        event.target.nextElementSibling.className="";
    }
    event.target.className = `${styles.selected_method}`;
}


