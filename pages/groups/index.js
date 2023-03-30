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
import { TransactionInputView, TransactionView, PendingView, FulFillView, PayAllView, ReportView } from './_components_/views.jsx'
import { GroupItemView } from './_components_/items_self';
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
    useEffect(() => {
        if (!isAuthenticated) {
            console.log("authenticating");
            check();
        }
    }, [isAuthenticated])

    //Defining state management
    const [transactionInputVisible, setTransactionInputVisible] = useState(false);
    const [payAllVisible, setPayAllVisible] = useState(false);
    const [currentTransactionView, setCurrentTransactionView] = useState(-1);
    const [currentPendingView, setCurrentPendingView] = useState(-1);
    const [currentReportView, setCurrentReportView] = useState(-1);
    const [currentFulfillView, setCurrentFulfillView] = useState(null);
    const [warningPopup, setWarningPopup] = useState(null);
    const [response_data, setResponseData] = useState({name : null,
        groupId : null,
        members : {},
        balance : 0.00,});
    const groupId = (isAuthenticated) ? "bd3a252d-77b3-4dd3-ac09-f1165c6eb79b" : null;
    const userId = (isAuthenticated) ? localStorage.getItem("tempId") : null;
    //API call and populate group information to trigger redraw
    const fetchData = async () => {
        console.log("fetching data");
        let response = {
            groups : {}
        }
        //response.groups["5f8ba41e-265e-4035-9525-1c18c6a812e7"] = await group_methods.getGroupInfo("5f8ba41e-265e-4035-9525-1c18c6a812e7", userId);
        //response.groups["bd3a252d-77b3-4dd3-ac09-f1165c6eb79b"] = await group_methods.getGroupInfo("bd3a252d-77b3-4dd3-ac09-f1165c6eb79b", userId);
        // response.success = 1;
        response = await group_methods.getAllGroupsInfo(userId);
        console.log(response);
        if (response.errorType) {
            console.log("An error occured, check logs");
            return;
        } else if (response.success) {
            //reverse arrays to show most recent first
            let formatted_response = {
                groups : {},
                balance : 0.00
            }
            for (let group of response.groups) {
                group.expenses.reverse();
                formatted_response.groups[group.group_id] = group;
                formatted_response.balance += group.balance;
                //idk if I should include contested
                //response.groups[group].pending = [];
            }
            console.log(formatted_response);
            setResponseData(formatted_response);
            setLoading(false);
            // dispatch(
            //     groupDataAction.setGroupData(response_data)
            // );
        } else {
            router.push("/home/");
            console.log(response);
        }
        console.log(response_data);
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
                                Object.keys(response_data.groups).map((id) => {
                                    return <GroupItemView groupId={id} expenses={response_data.groups[id].expenses} members={response_data.groups[id].members} 
                                    name={response_data.groups[id].name} userId = {userId} manager = {response_data.groups[id].manager}
                                    setCurrentTransactionView = {setCurrentTransactionView}
                                    setCurrentReportView = {setCurrentReportView}></GroupItemView>
                                })
                            }
                                </>
                        }
                    </div>
                    <GroupHeading name={"My Groups"} balance={response_data.balance} groupId={""} members={{"a" : 0}}></GroupHeading>
                    {/* {(response_data.balance < 0)?
                        <div className={styles.repay_all_container} onClick={() => { setPayAllVisible(true) }}>
                            <p>Repay All</p>
                        </div>
                        :
                        <div className={styles.repay_all_container} onClick={() => { setWarningPopup("You have no debts to pay")}}>
                            <p>Repay All</p>
                        </div>
                    } */}
                </main>
                {/* {(currentPendingView != -1) ?
                    <PendingView members={response_data.groups[currentPendingView[1]].members} expense={response_data.pending[currentPendingView]} hideParent={setCurrentPendingView}></PendingView>
                    :
                    <></>
                } */}
                {(currentTransactionView != -1) ?
                    <TransactionView userId={userId} members={response_data.groups[currentTransactionView[1]].members} expense={response_data.groups[currentTransactionView[1]].expenses[currentTransactionView[0]]}
                     hideParent={setCurrentTransactionView} showFulFill={setCurrentFulfillView}></TransactionView>
                    :
                    <></>
                }
                {(currentReportView != -1) ?
                    <ReportView userId={userId} members={response_data.groups[currentReportView[1]].members} expense={response_data.groups[currentReportView[1]].expenses[currentReportView[0]]} 
                    hideParent={setCurrentReportView} showFulFill={setCurrentFulfillView}></ReportView>
                    :
                    <></>
                }
                {/* {(transactionInputVisible) ?
                    <TransactionInputView members={response_data.groups[currentPendingView[1]].members} userId={userId} groupId={groupId} 
                    commentLength={response_data.maxComment} callback={setTransactionInputVisible} args={false}></TransactionInputView>
                    :
                    <></>
                } */}
                {(currentFulfillView != null) ?
                    <FulFillView userId={userId} expense={currentFulfillView} hideParent={setCurrentFulfillView}></FulFillView>
                    :
                    <></>
                }
                {/* {(payAllVisible) ?
                    <PayAllView balance={response_data.balance} userBalances={response_data.balances} members={response_data.members} userId={userId} groupId={groupId} commentLength={response_data.maxComment} callback={setPayAllVisible} args={false}></PayAllView>
                    :
                    <></>
                } */}
                { (warningPopup != null)?
                <>
                <div className={styles.transaction_background} style={{background : "transparent"}}>
                    <div className={styles.warningPopup}>
                        <p>{warningPopup}</p>
                    </div>
                    <div style={{display : "none"}}>
                    {
                        setTimeout(() => {
                            setWarningPopup(null);
                        }, 1500)
                    }
                    </div>
                </div>
                </>
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