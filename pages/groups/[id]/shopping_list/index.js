//Global HTML Imports
import styles from '@/styles/Group.module.css'
import Header from '../../../global_components/groups_header.jsx'
import Footer from '../../../global_components/footer.jsx'
import CustomHead from '../../../global_components/head.jsx'
import LoadingCircle from '../../../global_components/loading_circle.jsx';

//Components
import ListView from '../../_components_/shoppinglist_listview.jsx';
import CreateList from '../../_components_/shoppinglist_createlist.jsx';

import { group_methods } from '@/lambda_service/groupService.js';
import { user_methods } from '@/lambda_service/userService.js';
import { shopping_methods } from '@/lambda_service/shoppingService.js';

//React and Redux stuff
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router.js';

//SHOW ALL LISTS HERE

export default function ShoppingLists() {
    //UNCOMMENT WHEN NEEDED
    const router = useRouter();
    const [isAuthenticated, setAuthentication] = useState(false);
    async function check() {
        let result = await user_methods.validateLoginJWT(router);
        //let result = { success : true, payload : {"email" : "test@test.com"}};
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

    //Defining state management
    const [makeShoppingListVisible, setMakeShoppingListVisible] = useState(false);
    const [response_data, setResponseData] = useState({name : null,
        groupId : null,
        members : {},
        balance : 0.00,});

    //API call and populate group information to trigger redraw
    const fetchData = async () => {
        console.log("fetching data");
        let response = {
            lists : {}
        }
        response = await shopping_methods.fetchAllListData(userId);
        setLoading(false);
        if (response.errorType) {
            console.log("An error occured, check logs");
            return;
        } else if (response.success) {
            //reverse arrays to show most recent first
            let formatted_response = {
                lists : {}
            }
            for (let lists of response.lists) {
                lists.reverse();
                formatted_response.lists[group_id] = lists;
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
    
    useEffect(() => {
        if (isAuthenticated) {
            fetchData(); //make the call
        }
    }, [isAuthenticated]);

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
                <CustomHead title={"Shopping Lists"} description={"Your shopping lists"}></CustomHead>
                <Header></Header>
                <main className={styles.main}>
                { (loading)?
                    <LoadingCircle additionalStyles={{ margin: "15px auto" }}></LoadingCircle>
                    :
                    <>
                    {
                        <section>
                            <div className={styles.banner}>
                                <p>Lists</p>
                            </div>
                            <ListView listName="data 1" listId={1} goToList="/test"></ListView>
                            <ListView listName="data 2" listId={2} goToList="/test"></ListView>
                            <ListView listName="data 3" listId={3} goToList="/test"></ListView>
                            <ListView listName="data 4" listId={4} goToList="/test"></ListView>
                            <ListView listName="data 5" listId={5} goToList="/test"></ListView>
                        </section>
                    }
                    </>
                }
                </main>
                {makeShoppingListVisible ? (
                    <CreateList
                        hideParent={setMakeShoppingListVisible}
                        userId={userId}
                    ></CreateList>
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