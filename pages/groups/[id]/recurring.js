//Global HTML Imports
import styles from '@/styles/Group.module.css'
import Header from '../../global_components/groups_header.jsx'
import Footer from '../../global_components/footer_no_plus.jsx'
import CustomHead from '../../global_components/head.jsx'
import LoadingCircle from '../../global_components/loading_circle.jsx';

import { group_methods } from '@/lambda_service/groupService.js';
import { user_methods } from '@/lambda_service/userService.js';

//React and Redux stuff
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router.js';


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
            //fetchData(); //make the call

            //placeholder until the backend function is finished
            const data = {};
            setResponseData(data);
            setLoading(false);
        }
    }, [isAuthenticated]);

    const matchedGroupId = (isAuthenticated) ? window.location.href.match('(groups)\/[a-zA-z\-0-9]+')[0] : null;
    const groupId = (matchedGroupId) ? matchedGroupId.substring(7) : null;
    const userId = (isAuthenticated) ? localStorage.getItem("tempId") : null;


    function goToSettings() {
        if (userId == responseData.manager) {
            router.push("/groupsettings/" + groupId);
        } else {
            router.push("/groupsettings_members/" + groupId);
        }
    }
    function goToGroup() {
        router.push("../[pid]", `../${groupId}`);
    }
    function goToCalendar() {
        router.push("/calendar");
    }
    const fetchData = async () => {
        console.log("fetching data");
        let response = await group_methods.getAnalytics(userId, groupId);
        if (response.errorType) {
            console.log("An error occured, check logs");
            return;
        } else if (response.success) {
            setResponseData(response);
            setLoading(false);
        } else {
            router.push("/home/");
        }
    }


    if (isAuthenticated) {
        return (
            <>
                <CustomHead title={"Analytics"} description={"Your group analytics"}></CustomHead>
                <Header calendar={goToCalendar} group={goToGroup} settings={goToSettings}></Header>
                <main>
                    {(loading) ?
                        <LoadingCircle additionalStyles={{ margin: "15px auto" }}></LoadingCircle>
                        :
                        <>
                        <div className={styles.transaction_history}>

                        </div>
                        </>
                    }
                </main>


                <Footer></Footer>
            </>


        )
    } else {
        return <></>
    }
}