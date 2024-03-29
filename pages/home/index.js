//Global HTML Imports
import styles from "@/styles/Group.module.css";
import Header from "../global_components/header.jsx";
import Footer from "../global_components/footer.jsx";
import CustomHead from "../global_components/head.jsx";
import LoadingCircle from "../global_components/loading_circle.jsx";

//React and Redux stuff
import React, { useEffect, useState } from "react";
import { useStore } from "react-redux";
import { useDispatch } from "react-redux";
import { groupDataAction } from "@/lib/store/groupData.slice";

import { useRouter } from "next/router.js";
import { user_methods } from "@/lambda_service/userService.js";
import GroupTemplate from "./_components_/group.jsx";
import { MakeGroupView } from "./_components_/views.jsx";
import { userDataAction } from "@/lib/store/userData/userData.slice.js";

let userData = {
  groups: [],
};

export default function Homeheading() {
  //check user login status
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAuthenticated, setAuthentication] = useState(false);
  const check = async () => {
    let result = await user_methods.validateLoginJWT(router);
    if (result.success) {
      localStorage.setItem("tempId", result.payload.email);
      dispatch(userDataAction.setEmail({ email: result.payload.email }));
      setAuthentication(true);
    } else {
      router.replace("/");
      return;
    }
  };
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("authenticating");
      check();
    }
  }, [isAuthenticated]);

  //get redux state
  const store = useStore();
  const userId = isAuthenticated ? localStorage.getItem("tempId") : null;
  //let response_data = store.getState().userData;
  //define loading circle and refresh when loading is done
  const [loading, setLoading] = useState(true);
  const [makeGroupVisible, setMakeGroupVisible] = useState(false);
  const fetchData = async (userId) => {
    console.log("fetching data");
    let lambda_resp = await user_methods.getUserData(userId);
    if (lambda_resp.success) {
      userData = lambda_resp.user;
      dispatch(userDataAction.setName({ name: userData.name }));
      dispatch(
        userDataAction.setSettingsNotification({ settings: userData.settings })
      );
      console.log(userData);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (isAuthenticated) {
      fetchData(userId); //make the call
    }
  }, [isAuthenticated]);

  function sumDebts(userGroups) {
    let total = 0;
    for (let group of userGroups) {
      total += Math.trunc(group.balance * 100);
    }
    return (total / 100).toFixed(2);
  }

  function goToGroup(groupId) {
    dispatch(
      groupDataAction.setGroupId({ groupId: groupId })
    );
    let isArchived = false;
    for (let g of userData.groups) {
      if (g.uuid == groupId) {
        isArchived = g.archived;
        break;
      }
    }
    if (isArchived) { //set to wrong thing
      router.push("/archived_groups/" + groupId);
    } else {
      router.push("/groups/" + groupId);
    }
  }
  if (isAuthenticated) {
    const hex =
      sumDebts(userData.groups) == 0
        ? "black"
        : sumDebts(userData.groups) < 0
        ? "var(--red-background)"
        : "var(--green-background)";
    return (
      <>
        <CustomHead
          title={"Home"}
          description={"BillMates home page"}
        ></CustomHead>

        <Header></Header>
        <main className={styles.main}>
          <div className={styles.group_heading}>
            <div className={styles.yourNameTotalContainer} onClick={() => {goToGroup("")}} style={{cursor : "pointer"}}>
              {/* <p className={styles.individualDebt}>Total debt: ${sumDebts(userData.groups)}</p> */}
              {loading ? (
                <p className={styles.individualDebt}>Loading...</p>
              ) : (
                <>
                  <p className={styles.yourName}>{userData.name}</p>
                  <p className={styles.individualDebt} style={{ color: hex }}>
                    Total debt: $
                    {(sumDebts(userData.groups) < 0
                      ? sumDebts(userData.groups) * -1
                      : sumDebts(userData.groups) * 1
                    ).toFixed(2)}
                  </p>
                </>
              )}
            </div>
            <div className={styles.banner}>
              <p>MY GROUPS</p>
            </div>
          </div>
          <div className={styles.myGroupsListContainer}>
            {loading ? (
              <LoadingCircle
                additionalStyles={{ margin: "15px auto" }}
              ></LoadingCircle>
            ) : (
              userData.groups.map((group) => {
                //const group = userData.groups[id];
                return <GroupTemplate groupName={(group.archived)? "(Archived) " + group.name : group.name} debtOwed={group.balance.toFixed(2)} groupId={group.uuid} goToGroup={goToGroup}></GroupTemplate>;
              })
            )}
            <div className={styles.buffer_block}></div>
          </div>
        </main>
        {makeGroupVisible ? (
          <MakeGroupView
            hideParent={setMakeGroupVisible}
            userId={userId}
          ></MakeGroupView>
        ) : (
          <></>
        )}

        <Footer
          callback={setMakeGroupVisible}
          args={true}
          lockStatus={loading}
        ></Footer>
      </>
    );
  } else {
    return <></>;
  }
}

// export default function Grouplist ({groupName, groupId}) {
//     //import header, home banner, add dynamic list, then footer
// }
