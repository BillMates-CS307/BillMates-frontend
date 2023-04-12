import styles from '@/styles/Group.module.css';

export default function HamburgerPanel(goToSettings, goToAnalytics, goToCalendar, goToShoppingList) {
    //I'm just going to make it custom to this page
    function closeContainer(e) {
        const target = e.target.parentNode;
        target.style = "";
        target.parentNode.style = "display:none";
    }
    return (
        <>
            <div className={styles.hamburger_panel}>
                <div className={styles.x_button} onClick={ (e) => {closeContainer(e)}}></div>
                <ul>
                    <ui onClick={goToSettings}>
                        Settings
                    </ui>
                    <ui onClick={goToAnalytics}>
                        Analytics
                    </ui>
                    <ui onClick={goToCalendar}>
                        Calendar
                    </ui>
                    <ui onClick={goToShoppingList}>
                        Shopping List
                    </ui>
                </ul>
            </div>
        </>
    )
}