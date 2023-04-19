import styles from "@/styles/Group.module.css"

export default function ItemMenuView({ listName, listId, goToList, onDelete }) {
  //original for svg... viewBox="0 0 21 3"
  return (
    <div className={styles.listTemplate} onClick={() => { goToList(listId) }}>
      <p className={styles.listNameP}>{listName}</p>
        
      <a className={styles.listNameAnchor}>
        <svg onClick={() => onDelete(listName)} xmlns="http://www.w3.org/2000/svg" width="21" height="3" viewBox="0 0 21 3" fill="none">
          <line x1="3.31924e-09" y1="1.75" x2="21" y2="1.75" stroke="#FE0A0A" stroke-width="2.5"/>
        </svg>
      </a>
    </div>
  );
}