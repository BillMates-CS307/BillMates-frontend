import styles from "@/styles/Group.module.css"

export default function GroupTemplate({groupName, debtOwed, groupId, goToGroup}) {
    let hexBox = (debtOwed == 0) ? "#e8e8e8" : (debtOwed < 0) ? "var(--red-background)" : "var(--green-background)";
    return (
      <div className={styles.groupTemplate} onClick={() => {goToGroup(groupId)}}>
          <p className={styles.groupNameP}>{groupName}</p>
          {/* <p className={styles.debtInGroupP}>${debtOwed}</p> */}
          <p className={styles.debtInGroupP} style={{background:hexBox}} >${((debtOwed < 0) ? debtOwed * -1 : debtOwed * 1).toFixed(2)}</p>

      </div>
    );
  }