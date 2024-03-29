import styles from "@/styles/Group.module.css"
import { shopping_methods } from "@/lambda_service/shoppingService.js";

export default function ItemMenuView({ itemName, itemId, listId, onDelete, isActive }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) {
      return;
    }
  
    const delete_response = await shopping_methods.removeItem(itemName, listId);
    console.log(delete_response);
    if (delete_response.errorType) {
      alert("This list has been finalized");
        window.location.reload();
      return;
    } else if (delete_response.success) {
            // Call the onDelete prop
            onDelete(itemId);
    } else {
        alert("This list has been finalized");
        window.location.reload();
    }
  };
  
  return (
    <div className={styles.listTemplate}>
      <p className={styles.listNameP}>{itemName}</p>
      { (isActive)?
      <>
        <a className={styles.listNameAnchor} onClick={(event) => handleDelete(itemId, listId)}>
          
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="3" viewBox="0 0 21 3" fill="none">
          <line x1="3.31924e-09" y1="1.75" x2="21" y2="1.75" stroke="#FE0A0A" strokeWidth="2.5"/>
        </svg>
        </a>
      </> :
      <></>
      }
    </div>
  );
}