//Global HTML Imports
import styles from '@/styles/Group.module.css'
import Header from '../Global_components/header.jsx'
import Footer from '../Global_components/footer.jsx'
import CustomHead from '../Global_components/head.jsx'
import LoadingCircle from '../Global_components/loading_circle.jsx';
//import { ButtonLock } from '../Global_components/button_lock.js';
//BillMates services and constants
import { PAYMENT_PREFERENCE } from "@/lib/constants";
import { groupService } from '@/pages/services/groups.js'
//React and Redux stuff
import React, { useEffect, useState } from "react";
import { useStore } from 'react-redux';
import { useDispatch } from 'react-redux';
import { groupDataAction } from '@/lib/store/groupData.slice';
//Components
import GroupHeading from './_components_/group_heading.jsx';
import { TransactionInputView, TransactionView, PendingView } from './_components_/views.jsx'
import { ExpenseItem, PendingItem } from './_components_/items.jsx';
import { group_methods } from '@/lambda_service/groupService.js';
import { user_methods } from '@/lambda_service/userService.js';

export default function Group() {
    const [isAuthenticated, setAuthentication] = useState(false);
    async function check() {
      let result = await user_methods.validateLoginJWT();
      if (result.success) {
        localStorage.setItem("tempId", result.payload.email);
        setAuthentication(true);
      }
    }
    useEffect(()=> {
        if (!isAuthenticated) {
            console.log("authenticating");
            check();
        }
    },[isAuthenticated])

    // if (typeof window !== "undefined" && !isAuthenticated) {
    //     console.log("performing auth check");
    //     check();
    // }


    //Defining state management
    const [transactionInputVisible, setTransactionInputVisible] = useState(false);
    const [currentTransactionView, setCurrentTransactionView] = useState(-1);
    const [currentPendingView, setCurrentPendingView] = useState(-1);

    //get global store state from Redux
    const store = useStore();
    const dispatch = useDispatch();
    const groupId = (isAuthenticated) ? window.location.href.match('[a-zA-Z0-9\-]*$')[0] : null;
    const userId = (isAuthenticated) ? localStorage.getItem("tempId") : null;
    //API call and populate group information to trigger redraw
    let response_data = store.getState().groupData;
    const fetchData = async () => {
        console.log("fetching data");
        let response = await group_methods.getGroupInfo(groupId, userId);
        if (response.errorType) {
            console.log("An error occured, check logs");
            return;
        } else if (response.success) {
            response_data = response;
            response_data["groupId"] = groupId;
            setLoading(false);
            dispatch(
                groupDataAction.setGroupData(response_data)
            );
        } else {
            console.log(response);
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
                        {(loading) ?
                            <LoadingCircle additionalStyles={{ margin: "15px auto" }}></LoadingCircle>
                            :
                            response_data.pending.map((item, index) => {
                                if (userId == item.paid_to) {
                                    return (<PendingItem index={index}
                                        title={item.title}
                                        date={item.date}
                                        owner={response_data.members[item.owner]}
                                        amount={item.amount.toFixed(2)}
                                        showView={setCurrentPendingView}
                                    ></PendingItem>);
                                } else {
                                    return <></>
                                }
                            })
                        }
                        {(!loading) ?
                            response_data.expenses.map((item, index) => {
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
                            }) :
                            <></>
                        }
                    </div>
                    <GroupHeading></GroupHeading>
                    <div className={styles.buffer_block}></div>
                </main>
                {(currentPendingView != -1) ?
                    <PendingView members={response_data.members} expense={response_data.pendingApproval[currentPendingView]} hideParent={setCurrentPendingView}></PendingView>
                    :
                    <></>
                }
                {(currentTransactionView != -1) ?
                    <TransactionView members={response_data.members} expense={response_data.expenseHistory[currentTransactionView]} hideParent={setCurrentTransactionView}></TransactionView>
                    :
                    <></>
                }
                {(transactionInputVisible) ?
                    <TransactionInputView members={response_data.members} userId={userId} groupId={groupId} commentLength={response_data.maxComment} callback={setTransactionInputVisible} args={false}></TransactionInputView>
                    :
                    <></>
                }
                <Footer callback={setTransactionInputVisible} args={true} lockStatus={loading}></Footer>
            </>
        );
    } else {
        return <></>
    }
}