import styles from '@/styles/Group.module.css'
import Header from '../Globals/Header.js'
import Footer from '../Globals/Footer.js'
import { userService } from '../services/authorization.js';


export async function getServerSideProps({req, res}) {
    //check if user is signed in
    const {email, token} = userService.getUserFromToken({res, req});
    if (email == null) {
        return {
            props:{},
            redirect : {permanent: false,
                destination: "/"}
        }
    }
    const group_id = req.url.match("[0-9]+$")[0];
    //make API call to lambda
    //const response = await fetch();
    //const data = await response.json()

    const groupInformation = {
        groupName : "Baller Mates",
        members : {"a@gmail.com" : "Logan Cover", "b@gmail.com" : "Ben Lilley", "c@gmail.com" : "Ryan Rittner"},
        id : group_id
    }

    const transactionHistory = [
        {
            owner : "a@gmail.com",
            total : "50.00",
            title : "Testing",
            date : "02/24/2023",
            expenses : {
                "a@gmail.com" : "20.00",
                "b@gmail.com" : "20.00",
                "c@gmail.com" : "10.00"
            }
        },
        {
            owner : "b@gmail.com",
            total : "10.00",
            title : "Testing",
            date : "02/23/2023",
            expenses : {
                "a@gmail.com" : "2.00",
                "b@gmail.com" : "8.00",
                "c@gmail.com" : "0.00"
            }
        }
    ]

        return {
            props : {
                groupName : groupInformation.groupName,
                groupId : group_id,
                members : groupInformation.members,
                history : transactionHistory,
                userId : email
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
        for (let input of elements) {
            if (input.firstChild.classList.contains(`${styles.active}`)) {
                input.lastChild.value = (amount_per / 100);
            }
        }
        elements[0].lastChild.value = (amount_per + remainder) / 100;
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
    total -= expense[owner];
    return total.toFixed(2);
}

function GroupHeading({name, members, amount}) {
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
            <div className={styles.banner}>
                    <p>EXPENSES</p>
            </div>
        </div>
        </>
    );
}

export default function Group ({groupName, groupId, members, history, userId}) {
    let relative_amount = 0;
    let num = -1;
    const user = userService.signout();
    
    return (
    <>
    <Header></Header>
    <main className={styles.main}>
        <div className={styles.transaction_history}>
             {
                history.map( (trans) => {
                    num++;
                    let isOwner = ( trans.owner == userId );
                    let relative = ( isOwner ) ? sumMemberExpenses(trans.expenses, userId)  : (parseFloat(trans.expenses[userId]).toFixed(2) || 0.00.toFixed(2));
                    relative_amount += parseFloat(((isOwner) ? relative : relative * -1));
                    return (
                        <div index={num} className={`${styles.transaction_container} ${(relative == 0)? styles.neutral  : ( (isOwner) ? styles.positive : styles.negative)}`} key={num} onClick={(e) => makeTransactionView(e)}>
                        <div className={styles.transaction_info}>
                            <div className={styles.transaction_name_amount}>
                                <p>{trans.title}</p>
                                <p>${trans.total}</p>
                            </div>
                            <div className={styles.transaction_owner_date}>
                                <p>{members[trans.owner]}</p>
                                <p>{trans.date}</p>
                            </div>
                        </div>
                        <div className={styles.relative_amount}>
                            <p>${relative}</p>
                        </div>
                    </div>
                    )
                })
            }
            <div className={styles.buffer_block}></div>
        </div>
        <GroupHeading name={groupName} members={Object.keys(members).length} amount={relative_amount.toFixed(2)}></GroupHeading>
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
                <p>Logan Cover</p>
            </div>
            <div><p className={styles.debt_remaining_text}>Debts Remaining</p></div>
            <div className={styles.transaction_people} id = "view_transaction_people">
            </div>
            <div className={styles.submit_expense_container}><p>Bill Me</p></div>
        </div>
        </div>

    </>
    );


    function makeTransactionView(event) {
        const expense = history[event.target.getAttribute("index")];
        const heading = document.querySelector('#view_item_info');
        heading.children[0].textContent = expense.title;
        heading.children[1].textContent = "$" + expense.total;
        heading.children[2].textContent = members[expense.owner];
        const people_view = document.querySelector('#view_transaction_people');
        let children_string = "";
        for (let person in expense.expenses) {
            let amt_remaining = parseFloat(expense.expenses[person]);
            if (amt_remaining == 0 || person == expense.owner) {
                continue;
            }
            children_string += `<div class="${styles.person} ${styles.person_view}"><p>${members[person]}</p><p>$${amt_remaining.toFixed(2)}</p></div>`;
        }
        people_view.innerHTML = children_string;
        document.querySelector('#transaction_view').style = "display:block";
    }

    function handleExpenseSubmit() {
        const form = document.querySelector('#transaction_input');
        const inputs = form.querySelectorAll('input');
        let format = {
            title : "",
            total : "",
            owner : "a@gmail.com",
            breakdown : {}
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
                    format.breakdown = "";
                    break loooping;
                    } else {
                        format.breakdown[inputs[i].getAttribute("email")] = inputs[i].value;
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

        if (format.title == "" || format.total == "" || format.breakdown == "") {
            return;
        } else {
            console.log(format);
        }
    }
}