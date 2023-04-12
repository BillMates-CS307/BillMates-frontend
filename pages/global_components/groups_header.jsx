import Link from "next/link";
import styles from "@/styles/Group.module.css";

export default function Header({ settings, analytics, calendar, group, shopping, loading }) {
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
        <HamburgerPanel goToSettings={settings} goToAnalytics={analytics} goToCalendar={calendar} goToGroup={group} goToShopping={shopping}></HamburgerPanel>
      </header>

    </>
  );
}

export function HamburgerPanel({ goToSettings, goToAnalytics, goToCalendar, goToShopping ,goToGroup }) {
  //I'm just going to make it custom to this page
  function closeContainer(e) {
    const target = e.target.parentNode;
    target.style = "";
    target.parentNode.style = "display:none";
  }
  return (
    <>
      <div className={styles.transaction_background} style={{ display: "none" }}>
        <div id="hamburger_panel">
          <div className={styles.x_button} onClick={(e) => { closeContainer(e) }} style={{ width: "1rem", height: "1rem" }}></div>
          <ul>
            {(goToGroup == undefined) ?
              <></>
              :
              <li onClick={goToGroup}>
                My Group
              </li>
            }
            {(goToAnalytics == undefined) ?
              <></>
              :
              <li onClick={goToAnalytics}>
                Analytics
              </li>
            }
            {(goToSettings == undefined) ?
              <></>
              :
              <li onClick={goToSettings}>
                Settings
              </li>
            }
            {(goToCalendar == undefined) ?
              <></>
              :
              <li onClick={goToCalendar}>
                Calendar
              </li>
            }
            {(goToShopping == undefined) ?
              <></>
              :
              <li onClick={goToShopping}>
                Shopping Lists
              </li>
            }
          </ul>
        </div>
      </div>
    </>
  )
}
