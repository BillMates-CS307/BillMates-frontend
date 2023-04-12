//Global HTML Imports
import styles from '@/styles/Group.module.css'
import Header from '../../../global_components/groups_header.jsx'
import Footer from '../../../global_components/footer.jsx'
import CustomHead from '../../../global_components/head.jsx'
import LoadingCircle from '../../../global_components/loading_circle.jsx';

import { group_methods } from '@/lambda_service/groupService.js';
import { user_methods } from '@/lambda_service/userService.js';
import { shopping_methods } from '@/lambda_service/shoppingService';

//React and Redux stuff
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router.js';

//SHOW ALL LISTS HERE

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
    const [makeShoppingListVisible, setMakeShoppingListVisible] = useState(false); //new --------
    useEffect(() => {
        if (isAuthenticated) {
            placeHolder(); //make the call
        }
    }, [isAuthenticated]);

    const matchedGroupId = (isAuthenticated) ? window.location.href.match('(groups)\/[a-zA-z\-0-9]+')[0] : null;
    const groupId = (matchedGroupId) ? matchedGroupId.substring(7) : null;
    const userId = (isAuthenticated) ? localStorage.getItem("tempId") : null;
    function groupSettingsRoute() {
        if (userId == response_data.manager) {
            router.push("/groupsettings/" + groupId);
        } else {
            router.push("/groupsettings_members/" + groupId);
        }
    }
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
                <CustomHead title={"Shopping Lists"} description={"Your shopping lists"}></CustomHead>
                <Header groupId = {groupSettingsRoute}></Header>
                <main className={styles.main}>
                { (loading)?
                    <LoadingCircle additionalStyles={{ margin: "15px auto" }}></LoadingCircle>
                    :
                    <>

                    </>
                }
                </main>
                {makeGroupVisible ? (
                    <MakeGroupView
                        hideParent={setMakeShoppingListVisible}
                        userId={userId}
                    ></MakeGroupView>
                    ) : (
                    <></>
                )}

                <Footer
                    callback={setMakeShoppingListVisible}
                    args={true}
                    lockStatus={loading}
                ></Footer>
            </>   
        )
    } else {
        return <></>
    }
}