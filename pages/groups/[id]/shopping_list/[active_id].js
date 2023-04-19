//Global HTML Imports
import styles from '@/styles/Group.module.css'
import Header from '../../../global_components/groups_header.jsx'
import Footer from '../../../global_components/footer.jsx'
import CustomHead from '../../../global_components/head.jsx'
import LoadingCircle from '../../../global_components/loading_circle.jsx';

//Components
import ListView from '../../_components_/shoppinglist_listview.jsx';
import CreateItems from '../../_components_/shoppinglist_createlist.jsx';

import { group_methods } from '@/lambda_service/groupService.js';
import { user_methods } from '@/lambda_service/userService.js';
import { shopping_methods } from '@/lambda_service/shoppingService';
//React and Redux stuff
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router.js';
import { result, set } from 'lodash';

//THIS WILL BE FOR ACTIVE SHOPPING LISTS

export default function ShoppingListActive() {
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
    useEffect(() => {
        if (isAuthenticated) {
            fetchData(); //make the call
        }
    }, [isAuthenticated]);

    //Defining state management
    const [makeListItemsVisible, setMakeListItemsVisible] = useState(false);
    const [response_data, setResponseData] = useState({
        groupId : null,
        lists : {}, //might not be needed
        items : {}
    });

    const listId = (isAuthenticated) ? window.location.href.match('[a-zA-Z0-9\-]*$')[0] : null;
    let matchedGroupId = (isAuthenticated) ? window.location.href.match('(groups)\/[a-zA-z\-0-9]+')[0] : null;
    const userId = (isAuthenticated) ? localStorage.getItem("tempId") : null;

    //API call and populate group information to trigger redraw
    const fetchData = async () => {
        console.log("fetching data");
        let response = {
            items : {}
        }
        response = await shopping_methods.fetchListData(userId);
        setLoading(false);
        if (response.errorType) {
            console.log("An error occured, check logs");
            return;
        } else if (response.success) {
            //reverse arrays to show most recent first
            let formatted_response = {
                items : {}
            }
            for (let items of response.data) {
                items.reverse();
                formatted_response.items[group_id] = items;
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

    function placeHolder() {
        console.log("TODO");
        if (loading) {
            setTimeout(() => {
                setLoading(false);
            }, 5000);
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
                            {
                                response_data.items &&
                                    Object.keys(response_data.items).map((id) => {
                                        const list = response_data.items[id];
                                        return (
                                            <ListView
                                            listName={list.name}
                                            listId={id}
                                            goToList={`/shoppinglist/${id}`}
                                            />
                                        );
                                    })
                            }
                            </>
                }
                </main>
                {makeShoppingListVisible ? (
                    <CreateItems
                        hideParent={setMakeShoppingListVisible}
                        userId={userId}
                    ></CreateItems>
                    ) : (
                    <></>
                )}

                <Footer 
                    callback={placeHolder} 
                    args={true} 
                    lockStatus={loading}
                ></Footer>
            </>

            
        )
    } else {
        return <></>
    }
}