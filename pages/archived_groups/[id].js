//Global HTML Imports
import styles from '@/styles/Group.module.css'
import Header from '../global_components/groups_header.jsx'
import Footer from '../global_components/footer_no_plus'
import CustomHead from '../global_components/head.jsx'
import LoadingCircle from '../global_components/loading_circle.jsx';

//React and Redux stuff
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router.js';
//Components
import GroupHeading from './_components_/group_heading.jsx';
import {TransactionView, PendingView, ReportView } from './_components_/views.jsx'
import { ExpenseItem, PendingItem, ReportedItem } from './_components_/items.jsx';
import { group_methods } from '@/lambda_service/groupService.js';
import { user_methods } from '@/lambda_service/userService.js';

export default function Group() {
    const router = useRouter();
    const [isAuthenticated, setAuthentication] = useState(false);
    async function check() {
        let result = await user_methods.validateLoginJWT(router);
        if (result.success) {
            localStorage.setItem("tempId", result.payload.email);
            setAuthentication(true);
        }
    }
    useEffect(() => {
        if (!isAuthenticated) {
            console.log("authenticating");
            check();
        }
    }, [isAuthenticated])

    //Defining state management
    const [currentTransactionView, setCurrentTransactionView] = useState(-1);
    const [currentPendingView, setCurrentPendingView] = useState(-1);
    const [currentReportView, setCurrentReportView] = useState(-1);
    const [warningPopup, setWarningPopup] = useState(null);
    const [response_data, setResponseData] = useState({name : null,
        groupId : null,
        members : {},
        balance : 0.00,});
    const groupId = (isAuthenticated) ? window.location.href.match('[a-zA-Z0-9\-]*$')[0] : null;
    const userId = (isAuthenticated) ? localStorage.getItem("tempId") : null;
    //API call and populate group information to trigger redraw
    const fetchData = async () => {
        console.log("fetching data");
        let response = await group_methods.getGroupInfo(groupId, userId);
        if (response.errorType) {
            console.log("An error occured, check logs");
            return;
        } else if (response.success) {
            //reverse arrays to show most recent first
            response.expenses = response.expenses.reverse();
            for (let i = 0; i < response.expenses.length; i++) { //have to push reported items to the front
                if (response.expenses[i].contested) {
                    response.expenses.unshift(response.expenses.splice(i,1)[0]);
                }
            }
            response.pending = response.pending.reverse();
            response["groupId"] = groupId;
            response.maxComment = 10;
            setResponseData(response);
            setLoading(false);
        } else {
            router.push("/home/");
        }
    }

    //define loading circle and refresh when loading is done
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (isAuthenticated) {
            fetchData(); //make the call
        }
    }, [isAuthenticated]);

    if (isAuthenticated) {
        return (
            <>
                <CustomHead title={"Group"} description={"A BillMates group"}></CustomHead>
                <Header></Header>

                <main className={styles.main}>
                    <div className={styles.transaction_history}>
                        { (loading)?
                            <LoadingCircle additionalStyles={{ margin: "15px auto" }}></LoadingCircle>
                            :
                            <>
                            {
                                response_data.pending.map((item, index) => {
                                    if (userId == item.paid_to) {
                                        return (<PendingItem index={index}
                                            title={item.title}
                                            date={item.date}
                                            amount={item.amount_paid.toFixed(2)}
                                            owner={response_data.members[item.paid_by]}
                                            showView={setCurrentPendingView}
                                        ></PendingItem>);
                                    } else {
                                        return <></>
                                    }
                                })
                            }
                            {
                                response_data.expenses.map((item, index) => {
                                    if (item.contested) {
                                        if (userId == response_data.manager) {
                                            return (<ReportedItem index={index}
                                                title={item.title}
                                                date={item.date}
                                                amount={item.amount.toFixed(2)}
                                                owner={response_data.members[item.owner]}
                                                showView={setCurrentReportView}
                                            ></ReportedItem>);
                                        } else {
                                            return <></>
                                        }
                                    }
                                    return (<ExpenseItem index={index} id={index}
                                        title={item.title}
                                        date={item.date}
                                        owner={response_data.members[item.owner]}
                                        amount={item.amount.toFixed(2)}
                                        isOwner={(userId == item.owner)}
                                        userId={userId}
                                        users={item.users}
                                        showExpense={setCurrentTransactionView}
                                    ></ExpenseItem>);
                                })
                            }
                                </>
                        }
                    </div>
                    <GroupHeading name={response_data.name} balance={response_data.balance} groupId={response_data.groupId} members={response_data.members}></GroupHeading>
                </main>
                {(currentPendingView != -1) ?
                    <PendingView members={response_data.members} expense={response_data.pending[currentPendingView]} hideParent={setCurrentPendingView}></PendingView>
                    :
                    <></>
                }
                {(currentTransactionView != -1) ?
                    <TransactionView userId={userId} members={response_data.members} expense={response_data.expenses[currentTransactionView]} hideParent={setCurrentTransactionView}></TransactionView>
                    :
                    <></>
                }
                {(currentReportView != -1) ?
                    <ReportView userId={userId} members={response_data.members} expense={response_data.expenses[currentReportView]} hideParent={setCurrentReportView}></ReportView>
                    :
                    <></>
                }
                { (warningPopup != null)?
                <>
                <div className={styles.transaction_background} style={{background : "transparent"}}>
                    <div className={styles.warningPopup} style={{animation : "popup "  + warningPopup[1] + "s ease-in forwards"}}>
                        <p>{warningPopup[0]}</p>
                    </div>
                    <div style={{display : "none"}}>
                    {
                        setTimeout(() => {
                            setWarningPopup(null);
                        }, warningPopup[1] * 1000)
                    }
                    </div>
                </div>
                </>
                :
                <></>
                }
                <Footer></Footer>
            </>
        );
    } else {
        return <></>
    }
}