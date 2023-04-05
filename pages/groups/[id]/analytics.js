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

//SHOW ANALYTICS HERE

export default function ShoppingLists() {
    //UNCOMMENT WHEN NEEDED
    const router = useRouter();
    const [isAuthenticated, setAuthentication] = useState(false);
    async function check() {
        //let result = await user_methods.validateLoginJWT(router);
        let result = { success : true, payload : {"email" : "test@test.com"}};
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
    useEffect(() => {
        if (isAuthenticated) {
            placeHolder(); //make the call
        }
    }, [isAuthenticated]);
    function goToSettings() {
        if (userId == response_data.manager) {
            router.push("/groupsettings/" + groupId);
        } else {
            router.push("/groupsettings_members/" + groupId);
        }
    }
    function goToGroup() {
        router.push("../[pid]", "../" + groupId); //idk of a way to do relative paths with this
    }
    function goToCalendar() {
        router.push("/calendar");
    }

    const matchedGroupId = (isAuthenticated) ? window.location.href.match('(groups)\/[a-zA-z\-0-9]+')[0] : null;
    const groupId = (matchedGroupId) ? matchedGroupId.substring(7) : null;
    const userId = (isAuthenticated) ? localStorage.getItem("tempId") : null;
    async function placeHolder(isCallback) {
        console.log("TODO");
        if (loading) {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
        if (isCallback) {
            console.log("Over Here!");
        }
        return;
    }

    if (isAuthenticated) {
        return (
            <>
                <CustomHead title={"Analytics"} description={"Your group analytics"}></CustomHead>
                <Header group={goToGroup} settings={goToSettings} calendar={goToCalendar} loading={loading}></Header>
                <main className={styles.main}>
                { (loading)?
                            <LoadingCircle additionalStyles={{ margin: "15px auto" }}></LoadingCircle>
                            :
                            <></>
                }
                </main>


                <Footer></Footer>
            </>

            
        )
    } else {
        return <></>
    }
}