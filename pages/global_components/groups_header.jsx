import Link from "next/link";
import styles from "@/styles/Group.module.css";
import { useRouter } from 'next/router.js';

export const HEADER_PATHS = {
  GROUP: 1,
  ANALYTICS : 2, 
  CALENDAR : 4,
  SHOPPINGLIST : 8,
  SETTINGS : 16,
  RECURRING : 32
}

export default function Header({ groupPath, selected, getManagerStatus, loading }) {
  function showHammy() {
    if (loading) { return; }
    const target = document.querySelector("#hamburger_panel");
    target.style = "animation: slideIn 0.25s ease-out forwards;display: block;";
    target.parentNode.style = "";
  }
  return (
    <>
      <header>
        <Link href="/notifications">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              fill="currentColor"
              d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
            />
          </svg>
        </Link>
        <div>
          <p><strong>Bill</strong></p>
          <p><strong>Mates</strong></p>
        </div>
        <a>
          <svg onClick={showHammy} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 22" fill="none">
            <line y1="1" x2="30" y2="1" stroke="currentColor" strokeWidth="2" />
            <line y1="11" x2="30" y2="11" stroke="currentColor" strokeWidth="2" />
            <line y1="21" x2="30" y2="21" stroke="currentColor" strokeWidth="2" />
          </svg>
        </a>
        <HamburgerPanel groupPath={groupPath} selected={selected} isManager={getManagerStatus}></HamburgerPanel>
      </header>

    </>
  );
}

function HamburgerPanel({ groupPath, selected, isManager }) {
  //I'm just going to make it custom to this page
  const router = useRouter();
  function closeContainer(e) {
    const target = e.target.parentNode;
    target.style = "";
    target.parentNode.style = "display:none";
  }

  function goToCalendar() {
    router.push(groupPath + "/calendar");
  }
  function goToAnalytics() {
    router.push(groupPath + "/analytics");
  }
  function goToSettings() {
    const groupId = groupPath.match("[a-zA-Z0-9\-]*$");
    if (isManager()) {
      router.push("/groupsettings/" + groupId);
    } else {
      router.push("/groupsettings_members/" + groupId);
    }
  }
  function goToGroup() {
    router.push(groupPath);
  }
  function goToShoppingList() {
    router.push(groupPath + "/shopping_list");
  }
  function goToRecurring() {
    router.push(groupPath + "/recurring");
  }

  return (
    <>
      <div className={styles.transaction_background} style={{ display: "none" }}>
        <div id="hamburger_panel">
          <div className={styles.x_button} onClick={(e) => { closeContainer(e) }} style={{ width: "1rem", height: "1rem" }}></div>
          <ul>
            {(!(selected & HEADER_PATHS.GROUP)) ?
              <></>
              :
              <li onClick={goToGroup}>
                My Group
              </li>
            }
            {(!(selected & HEADER_PATHS.ANALYTICS)) ?
              <></>
              :
              <li onClick={goToAnalytics}>
                Analytics
              </li>
            }
            {(!(selected & HEADER_PATHS.SETTINGS)) ?
              <></>
              :
              <li onClick={goToSettings}>
                Settings
              </li>
            }
            {(!(selected & HEADER_PATHS.CALENDAR)) ?
              <></>
              :
              <li onClick={goToCalendar}>
                Calendar
              </li>
            }
            {(!(selected & HEADER_PATHS.SHOPPINGLIST)) ?
              <></>
              :
              <li onClick={goToShoppingList}>
                Lists
              </li>
            }
            {(!(selected & HEADER_PATHS.RECURRING)) ?
              <></>
              :
              <li onClick={goToRecurring}>
                Recurring
              </li>
            }
          </ul>
        </div>
      </div>
    </>
  )
}
