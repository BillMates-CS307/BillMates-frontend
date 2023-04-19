import styles from "@/styles/Group.module.css"

export default function ListMenuView({ listName, listId, goToList, onDelete }) {
  //original for svg... viewBox="0 0 21 3"
  return (
    <div className={styles.listTemplate} onClick={() => { goToList(listId) }}>
      <p className={styles.listNameP}>{listName}</p>
    </div>
  );
}