import Head from 'next/head'
import Image from 'next/image'
import { Cookie, Inter } from '@next/font/google'
import styles from '@/styles/Group.module.css'
import Header from './Globals/Header.js'
import Footer from './Globals/Footer.js'


export async function getServerSideProps() {
    //make API call to lambda
    //const response = await fetch();
    //const data = await response.json()

    const groupInformation = {
        groupName : "Baller Mates",
        members : {"a@gmail.com" : "Logan Cover", "b@gmail.com" : "Ben Lilley", "c@gmail.com" : "Ryan Rittner"},
        id : "0000"
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



    const data = {
        groupName : groupInformation.groupName,
        members : groupInformation.members,
        id : "0000",
        history : transactionHistory
    }

        return {
            props : data
        }
}


function splitEven() {
    if (typeof window !== "undefined") {
        const total = parseFloat(document.querySelector('#input_item_total').value);
        console.log(total);
        if (total <= 0 || isNaN(total)) {
            return;
        }
        const elm = document.querySelector('#transaction_people');
        const num = elm.getAttribute("count");
        let running_sum = total;
        const elements = elm.querySelectorAll("." + `${styles.person}`);
        for (let input of elements) {
            if (input.firstChild.classList.contains(`${styles.active}`)) {
                let val = (total / num).toFixed(2);
                input.lastChild.value =  val;
                running_sum -= val;
            }
        }
        if (running_sum != 0 && elements.length != 0) {
            let poor_soul = elements[0];
            poor_soul.lastChild.value = parseFloat(poor_soul.lastChild.value) + (running_sum);
        }
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
    console.log(expense);
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

export default function Group (data) {
    let relative_amount = 0;
    let num = 0;

    return (
    <>
    <Header></Header>
    <main className={styles.main}>
        <div className={styles.transaction_history}>
             {
                data.history.map( (trans) => {
                    num++;
                    let isOwner = ( trans.owner == "b@gmail.com" );
                    let relative = ( isOwner ) ? sumMemberExpenses(trans.expenses, "b@gmail.com")  : (parseFloat(trans.expenses["b@gmail.com"]).toFixed(2) || 0.00.toFixed(2));
                    relative_amount += parseFloat(((isOwner) ? relative : relative * -1));
                    return (
                        <div className={`${styles.transaction_container} ${(relative == 0)? styles.neutral  : ( (isOwner) ? styles.positive : styles.negative)}`} key={num}>
                        <div className={styles.transaction_info}>
                            <div className={styles.transaction_name_amount}>
                                <p>{trans.title}</p>
                                <p>${trans.total}</p>
                            </div>
                            <div className={styles.transaction_owner_date}>
                                <p>{data.members[trans.owner]}</p>
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
        <GroupHeading name={data.groupName} members={Object.keys(data.members).length} amount={relative_amount.toFixed(2)}></GroupHeading>
    </main>
    <Footer callback={showTransactionInput} args = {""}></Footer>

    <div className={styles.transaction_background} id = "transaction_input">
        <div className={styles.transaction_large}>
            <div className={styles.x_button} onClick={(e) => hide(e.nativeEvent.target.parentNode.parentNode, true)}></div>
            <div className={styles.transaction_heading}>
                <input type="text" placeholder='Item Name' id = "input_item_name"></input>
                <input type="text" placeholder='00.00' id = "input_item_total"></input>
                <p>Logan Cover</p>
            </div>
            <div className={styles.split_button_container}>
                <button onClick={() => splitEven()}>Split Even</button>
            </div>
            <div className={styles.transaction_people} count = "0" id = "transaction_people">
                {

                Object.keys(data.members).map( (id) => {
                    return (
                    <div className={styles.person}>
                        <div className={styles.radio} onClick={(e) => selectPerson(e)}></div>
                        <p className={styles.person_name} onClick={(e) => selectPerson(e)}>{data.members[id]}</p>
                        <input type="text" placeholder='00.00'></input>
                    </div>
                    )
                })
                
                }
 
            </div>
            <div className={styles.submit_expense_container}><p>Submit</p></div>
        </div>
        </div>


    </>
    );
}