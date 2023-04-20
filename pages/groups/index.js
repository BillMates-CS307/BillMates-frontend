//Global HTML Imports
import styles from '@/styles/Group.module.css'
import Header from '../global_components/header.jsx'
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
    const [showTag, setShowTag] = useState("all");
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
                                Object.keys(response_data.groups).map((id) => {
                                    return <GroupItemView groupId={id} expenses={response_data.groups[id].expenses} members={response_data.groups[id].members} 
                                    name={response_data.groups[id].name} userId = {userId} manager = {response_data.groups[id].manager}
                                    setCurrentTransactionView = {setCurrentTransactionView}
                                    setCurrentReportView = {setCurrentReportView}
                                    showTag = {showTag}></GroupItemView>
                                })
                            }
                                </>
                        }
                    </div>
                    <GroupHeading name={"My Groups"} balance={response_data.balance} groupId={""} members={{"a" : 0}}
                    setShowTag={setShowTag}></GroupHeading>
                </main>
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
                {(currentFulfillView != null) ?
                    <FulFillView userId={userId} expense={currentFulfillView} hideParent={setCurrentFulfillView} warningPopup={setWarningPopup}></FulFillView>
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
                <Footer callback={setTransactionInputVisible} args={true} lockStatus={loading}></Footer>
            </>
        );
    } else {
        return <></>
    }
}