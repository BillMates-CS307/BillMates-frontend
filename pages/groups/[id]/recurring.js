//Global HTML Imports
import styles from '@/styles/Group.module.css'
import Header,{HEADER_PATHS} from '../../global_components/groups_header.jsx'
import Footer from '../../global_components/footer_no_plus.jsx'
import CustomHead from '../../global_components/head.jsx'
import LoadingCircle from '../../global_components/loading_circle.jsx';

import { group_methods } from '@/lambda_service/groupService.js';
import { user_methods } from '@/lambda_service/userService.js';
import getGroupCalendar from "@/lib/api/getGroupCalendar.js";

//React and Redux stuff
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router.js';
import { RecurringItem } from '../_components_/items.jsx';
import { RecurringView } from '../_components_/views.jsx';

export default function Recurring() {
    //UNCOMMENT WHEN NEEDED
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
    }, [isAuthenticated]);
    //define loading circle and refresh when loading is done
    const [loading, setLoading] = useState(true);
    const [responseData, setResponseData] = useState(undefined);
    useEffect(() => {
        if (isAuthenticated) {
            fetchData(); //make the call
        }
    }, [isAuthenticated]);

    const [currentRecurringView, setCurrentRecurringView] = useState(-1);

    const matchedGroupId = (isAuthenticated) ? window.location.href.match('(groups)\/[a-zA-z\-0-9]+')[0] : null;
    const groupId = (matchedGroupId) ? matchedGroupId.substring(7) : null;
    const userId = (isAuthenticated) ? localStorage.getItem("tempId") : null;

    const fetchData = async () => {
        console.log("fetching data");
        let response = await getGroupCalendar({ group_id : groupId});
        console.log(response);
        if (response.errorType) {
            console.log("An error occured, check logs");
            return;
        } else if (response.get_success) {
            let expenses = [];
            for (let item of response.events) {
                if (item.expense != null) {
                    expenses.push(item);
                }
            }
            setResponseData(expenses);
            setLoading(false);
        } else {
            router.push("/home/");
        }
    }
    function isGroupManager() {
        return false; //TODO : fix this
    }


    if (isAuthenticated) {
        return (
            <>
                <CustomHead title={"Recurring Expenses"} description={"Your group recurring expenses"}></CustomHead>
                <Header loading={loading} selected={HEADER_PATHS.ANALYTICS|HEADER_PATHS.CALENDAR|HEADER_PATHS.SETTINGS|HEADER_PATHS.SHOPPINGLIST|HEADER_PATHS.GROUP}
                getManagerStatus={isGroupManager} groupPath={window.location.href.match(".+?(?=\/recurring)")[0]}></Header>
                <main className={styles.main}>
                <div className={styles.transaction_history} style={{marginTop : "15px"}}>
                        { (loading)?
                            <LoadingCircle additionalStyles={{ margin: "15px auto" }}></LoadingCircle>
                            :
                            <>
                            {
                                responseData.map((item, index) => {
                                            return (<RecurringItem index={index} id={item.id}
                                                name={item.name}
                                                date={item.date}
                                                owner={item.creator}
                                                isOwner={(userId == item.creator)}
                                                userId={userId}
                                                expense={item.expense}
                                                frequency={item.frequency}
                                                showView={setCurrentRecurringView}
                                            ></RecurringItem>);
                                })
                            }
                                </>
                        }
                    </div>
                </main>
                {(currentRecurringView != -1) ?
                    <RecurringView groupId = {groupId} id = {responseData[currentRecurringView].id} hideParent={setCurrentRecurringView}></RecurringView>
                    :
                    <></>
                }

                <Footer></Footer>
            </>


        )
    } else {
        return <></>
    }
}