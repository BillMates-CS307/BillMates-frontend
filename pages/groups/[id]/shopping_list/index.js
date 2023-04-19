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

    //Defining state management
    const [makeShoppingListVisible, setMakeShoppingListVisible] = useState(false);
    const [response_data, setResponseData] = useState({
        groupId : null,
        lists : {}
    });

    const matchedGroupId = (isAuthenticated) ? window.location.href.match('(groups)\/[a-zA-z\-0-9]+')[0] : null;
    const groupId = (matchedGroupId) ? matchedGroupId.substring(7) : null;
    //const userId = (isAuthenticated) ? localStorage.getItem("tempId") : null;

    //API call and populate group information to trigger redraw
    const fetchData = async () => {
        console.log("fetching data");
        let response = {
            lists : {}
        }
        response = await shopping_methods.fetchAllListData(groupId);
        console.log(response);
        setLoading(false);
        if (response.errorType) {
            console.log("An error occured, check logs");
            return;
        } else if (response.success) {
            let formatted_response = {
                lists : {}
            }
            //formatted_response.lists[groupId] = lists;
            for (let list of response.data) {
                formatted_response.lists[list._id] = list;
            }
            console.log(formatted_response);
            setResponseData(formatted_response);
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

    //FOR DEBUGGING
    /*
    <section>
    <ListView listName="data 1" listId={1} goToList="/test"></ListView>
    <ListView listName="data 2" listId={2} goToList="/test"></ListView>
    </section>
    */

    if (isAuthenticated) {
        return (
            <>
                <CustomHead title={"Shopping Lists"} description={"Your shopping lists"}></CustomHead>
                <Header></Header>
                <main className={styles.main}>
                <div className={styles.banner}>
                    <p>LISTS</p>
                </div>
                { (loading)?
                    <LoadingCircle additionalStyles={{ margin: "15px auto" }}></LoadingCircle>
                    :
                    <>
                    <section>
                    {
                        response_data.lists &&
                            Object.keys(response_data.lists).map((id) => {
                                const list = response_data.lists[id];
                                return (
                                    <ListView
                                    listName={list.name}
                                    listId={id}
                                    goToList={() => router.push(`/groups/${groupId}/shopping_list/${list._id}`)}
                                    />
                                );
                            })
                    }
                    </section>
                    </>
                }
                </main>
                {makeShoppingListVisible ? (
                    <CreateList
                        hideParent={setMakeShoppingListVisible}
                        groupId={groupId}
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