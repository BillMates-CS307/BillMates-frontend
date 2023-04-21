//Global HTML Imports
import styles from '@/styles/Group.module.css'
import Header from '../../../global_components/groups_header.jsx'
import Footer from '../../../global_components/footer.jsx'
import CustomHead from '../../../global_components/head.jsx'
import LoadingCircle from '../../../global_components/loading_circle.jsx';

//Components
import ItemMenuView from '../../_components_/shoppinglist_itemview.jsx';
import CreateItems from '../../_components_/shoppinglist_createitem.jsx';
import FinalizePopup from '../../_components_/shoppinglist_finalizepopup.jsx';


import { group_methods } from '@/lambda_service/groupService.js';
import { user_methods } from '@/lambda_service/userService.js';
import { shopping_methods } from '@/lambda_service/shoppingService.js';
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
            localStorage.setItem("email", result.payload.email);
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
    const [makeItemListVisible, setMakeItemListVisible] = useState(false);
    const [showFinalizePopup, setShowFinalizePopup] = useState(false);
    const [groupData, setGroupData] = useState(null);
    const [response_data, setResponseData] = useState({
        groupId : null,
        listId : null, //added 4-19-23
        lists : {}, //might not be needed
        items : {}
    });

    const listId = (isAuthenticated) ? window.location.href.match('[a-zA-Z0-9\-]*$')[0] : null;
    const matchedGroupId = (isAuthenticated) ? window.location.href.match('(groups)\/[a-zA-z\-0-9]+')[0] : null;
    const groupId = (matchedGroupId) ? matchedGroupId.substring(7) : null;
    const groudId = (matchedGroupId) ? matchedGroupId.substring(7) : null; //just in case API call for group info no work lol
    
    console.log("listId: " + listId);
    console.log("groupId: " + groupId);
    //API call and populate list data
    const fetchData = async () => {
        console.log("fetching data");
        let response = {
            items : {}
        }
        response = await shopping_methods.fetchListData(groupId, listId);
        console.log(response);
        setLoading(false);
        if (response.errorType) {
            console.log("An error occured, check logs");
            return;
        } else if (response.success) {
            //reverse arrays to show most recent first
            let formatted_response = {
                items : {}
            }
            for (let item_id in response.data) {
                formatted_response.items[item_id] = response.data[item_id];
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

    const handleItemDelete = (itemId) => {
        const updatedItems = { ...response_data.items };
      
        updatedItems.items = updatedItems.items.filter((item, index) => `${listId}_${index}` !== itemId);
      
        setResponseData({
          ...response_data,
          items: updatedItems,
        });
    };

    //API call to fetch group data (to get group members)
    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
            fetchGroupData();
        }
    }, [isAuthenticated]);
      
    const fetchGroupData = async () => {
        const email = localStorage.getItem("email");
        const groupResponse = await group_methods.getGroupInfo(groudId, email); //"groudId" as listed in groupService
        console.log("groupResponse members: " + groupResponse);
        if (groupResponse.success) {
            setGroupData(groupResponse);
        } else {
            console.error("Failed to fetch group data");
        }
    };

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
            <Header></Header>
            <main className={styles.main}>
                <div className={styles.banner}>
                    <p>ITEMS</p>
                </div>
                { (loading)?
                    <LoadingCircle additionalStyles={{ margin: "15px auto" }}></LoadingCircle>
                    :
                    <>
                    <section>
                        {
                        response_data.items &&
                            response_data.items.items.map((item, index) => {
                            return (
                                <ItemMenuView
                                itemName={item}
                                itemId={`${listId}_${index}`}
                                listId={listId}
                                onDelete={handleItemDelete}
                                />
                            );
                            })
                        }
                        <div className={styles.createExpense} onClick={() => setShowFinalizePopup(true)}>FINALIZE</div>
                        {showFinalizePopup && groupData && (
                            <FinalizePopup
                                items={response_data.items.items}
                                listId = {listId}
                                members={groupData.members[1]} 
                                setShowFinalizePopup={setShowFinalizePopup} //for exit button
                            />
                        )}
                    </section>
                    </>
                }
                
            </main>
                {makeItemListVisible ? (
                    <CreateItems
                        hideParent={setMakeItemListVisible}
                        listId={listId}
                    ></CreateItems>
                    ) : (
                    <></>
                )}

                <Footer 
                    callback={setMakeItemListVisible} 
                    args={true} 
                    lockStatus={loading}
                ></Footer>
            </>
            
        )
    } else {
        return <></>
    }
}