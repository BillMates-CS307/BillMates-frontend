import styles from "@/styles/Home.module.css"
import groupStyles from "@/styles/Group.module.css"
import { shopping_methods } from "@/lambda_service/shoppingService.js";
import { ButtonLock } from "../../global_components/button_lock";

export default function ShoppingListCreateItem({ hideParent, listId }) {
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!ButtonLock.isLocked()) {
            ButtonLock.LockButton();
            const inputElm = document.querySelector("#newitemlist"); //might need to fix
            const value = inputElm.value;

            if (value.trim() == "") {
                inputElm.style = "outline: 1px solid #ff0101;";
                inputElm.addEventListener('keydown', function () {
                    this.style = "";
                    this.parentElement.nextElementSibling.style = "";
                }, { once: true });
                inputElm.parentElement.nextElementSibling.textContent = "Cannot be blank";
                inputElm.parentElement.nextElementSibling.style = "display:block";
                inputElm.focus();
                ButtonLock.UnlockButton();
                return;
            }

            event.target.children[1].textContent = "Create Item List";
            event.target.children[1].style = "background : var(--green-muted-background)";
            console.log(value);
            let response = await shopping_methods.addItem(value, listId);
            //console.log("test createItem response" + JSON.stringify(response));
            if (response.success) {
                window.location.reload();
                return;
            } else {
                alert("This list has been finalized");
            }
            ButtonLock.UnlockButton();
            event.target.children[1].textContent = "Add Item";
            event.target.children[1].style = "";
            window.location.reload(true);
        } else {
            console.log("Button is locked");
        }


        return;
    }


    return (
        <div className={groupStyles.transaction_background}>
            <div className={styles.signup_form}>
                <div className={groupStyles.x_button} onClick={() => hideParent(false)}></div>
                <form onSubmit={handleSubmit} method="post">
                    <div>
                        <label htmlFor="newitemlist">Item name:</label>
                        <empty>
                            <input type="text" id="newitemlist" name="newitemlist" />
                        </empty>
                        <span></span>
                    </div>

                    <button type="submit">Add Item</button>
                </form>
            </div>
        </div>
    )
}