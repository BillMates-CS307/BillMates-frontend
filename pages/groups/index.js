//Global HTML Imports
import styles from '@/styles/Group.module.css'
import Header from '../global_components/groups_header.jsx'
import Footer from '../global_components/footer.jsx'
import CustomHead from '../global_components/head.jsx'
import LoadingCircle from '../global_components/loading_circle.jsx';

//React and Redux stuff
import React, { useEffect, useState } from "react";
import { useStore } from 'react-redux';
import { useDispatch } from 'react-redux';
import { groupDataAction } from '@/lib/store/groupData.slice';
import { useRouter } from 'next/router.js';
//Components
import GroupHeading from './_components_/group_heading.jsx';
import { TransactionInputView, TransactionView, PendingView, FulFillView } from './_components_/views.jsx'
import { ExpenseItem, PendingItem } from './_components_/items.jsx';
import { group_methods } from '@/lambda_service/groupService.js';
import { user_methods } from '@/lambda_service/userService.js';

export default function SelfGroup() {
    const router = useRouter();
    const [isAuthenticated, setAuthentication] = useState(false);
    async function check() {
      let result = await user_methods.validateLoginJWT(router);
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

    //Defining state management
    const [transactionInputVisible, setTransactionInputVisible] = useState(false);
    const [currentTransactionView, setCurrentTransactionView] = useState(-1);
    const [currentPendingView, setCurrentPendingView] = useState(-1);
    const [currentFulfillView, setCurrentFulfillView] = useState(null);

    //get global store state from Redux
    const store = useStore();
    const dispatch = useDispatch();
    const userId = (isAuthenticated) ? localStorage.getItem("tempId") : null;
    //API call and populate group information to trigger redraw
    let response_data = store.getState().groupData;
    const fetchData = async () => {
        console.log("fetching data");
        let response = await group_methods.getAllGroupsInfo(userId);
        if (response.errorType) {
            console.log("An error occured, check logs");
            return;
        } else if (response.success) {
            response_data = response;

            //sort each group
            for (let groupId in response_data.group_expenses) {
              groupExpenses = response_data.group_expenses[groupId];
              groupExpenses.sort((a,b) => {
                if (a.time <= b.time) {
                  return -1;
                } else {
                  return 1;
                }
              })
              response_data.group_expenses[groupId] = groupExpenses;
            }

            //merge groups into one array
            
            final_expenses = [];

            setLoading(false);
        } else {
            router.push("/home/");
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
                <CustomHead title={"All Groups"} description={"All groups a user is a part of"}></CustomHead>
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
                                        amount={item.amount_paid.toFixed(2)}
                                        owner={item.paid_by}
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
                    <PendingView members={response_data.members} expense={response_data.pending[currentPendingView]} hideParent={setCurrentPendingView}></PendingView>
                    :
                    <></>
                }
                {(currentTransactionView != -1) ?
                    <TransactionView userId={userId} members={response_data.members} expense={response_data.expenses[currentTransactionView]} hideParent={setCurrentTransactionView} showFulFill={setCurrentFulfillView}></TransactionView>
                    :
                    <></>
                }
                {(transactionInputVisible) ?
                    <TransactionInputView members={response_data.members} userId={userId} groupId={groupId} commentLength={response_data.maxComment} callback={setTransactionInputVisible} args={false}></TransactionInputView>
                    :
                    <></>
                }
                {(currentFulfillView != null) ?
                    <FulFillView userId={userId} expense={currentFulfillView} hideParent={setCurrentFulfillView}></FulFillView>
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