import styles from '@/styles/Group.module.css'
import { useStore } from 'react-redux';

export default function GroupHeading() {
    const store = useStore();
    //let hex = (amount == 0) ? "var(--neutral-background)" : (amount < 0) ? "var(--red-background)" : "var(--green-background)";
    const copyLink = (event) => {
        const target = event.target.parentNode.nextElementSibling;
        navigator.clipboard.writeText(target.textContent);
    }

    const renderGroupHeading = () => {
        const heading = document.querySelector("#group_heading");
        const state = store.getState().groupData;
        heading.children[0].children[0].children[0].textContent = state.name;
        heading.children[0].children[0].children[1].textContent = "Members: " + Object.keys(state.members).length;
        let hex = (state.balance == 0) ? "var(--main-background-font-color)" : (state.balance < 0) ? "var(--red-background)" : "var(--green-background)";
        heading.children[0].children[1].children[0].textContent = `$${((state.balance < 0) ? state.balance * -1 : state.balance * 1).toFixed(2)}`;
        heading.children[0].children[1].children[0].style = `color:${hex}`;
        heading.children[1].children[0].children[1].textContent = "localhost:8000/joingroup/" + state.groupId;
    }
    //set to update when getting the data
    store.subscribe(renderGroupHeading);
    return (
        <>
            <div className={styles.group_heading} id="group_heading">
                <div className={styles.group_info}>
                    <div className={styles.names_members}>
                        <p>Loading...</p>
                        <p>Members: 0</p>
                    </div>
                    <div className={styles.group_amount}>
                        <p style={{ color: "var(--neutral-background)" }}>$0.00</p>
                    </div>
                </div>
                <div className={styles.group_info}>
                    <div className={styles.names_members}>
                        <div style={{ display: "grid", gridTemplateColumns: "max-content 1fr", alignItems: "center" }}>
                            <p style={{ display: "inline-block" }}>Join Link</p> <svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 0 600 600" onClick={copyLink}><path style={{ pointerEvents: "none" }} fill="currentColor" d="M64 464H288c8.8 0 16-7.2 16-16V384h48v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h64v48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16zM224 304H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H224c-8.8 0-16 7.2-16 16V288c0 8.8 7.2 16 16 16zm-64-16V64c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V288c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64z" /></svg>
                        </div>
                        <p className={styles.word_break_all} id={styles.joinlink}>Generating Link...</p>
                    </div>
                </div>
                <div className={styles.banner}>
                    <p>EXPENSES</p>
                </div>
            </div>
        </>
    );
}