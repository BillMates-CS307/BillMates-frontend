import styles from "@/styles/Home.module.css"
import groupStyles from "@/styles/Group.module.css"
import { user_methods } from "@/lambda_service/userService";
import { ButtonLock } from "../../global_components/button_lock";


export function ShoppingListCreateList({ hideParent, userId }) {
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!ButtonLock.isLocked()) {
            ButtonLock.LockButton();
            const inputElm = document.querySelector("#shoppinglist"); //might need to fix
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

            event.target.children[1].textContent = "Create Shopping List";
            event.target.children[1].style = "background : var(--green-muted-background)";
            console.log(value);
            let response = await user_methods.createGroup(userId, value);
            console.log(response);
            if (response.success) {
                window.location.reload();
                return;
            } else {
                alert("You already have a shopping list with this name");
            }
            ButtonLock.UnlockButton();
            event.target.children[1].textContent = "Create List";
            event.target.children[1].style = "";
            alert("Something went wrong");
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
                        <label htmlFor="newshoppinglist">Shopping List Name:</label>
                        <empty>
                            <input type="text" id="newshoppinglist" name="newshoppinglist" />
                        </empty>
                        <span></span>
                    </div>

                    <button type="submit">Create Shopping List</button>
                </form>
            </div>
        </div>
    )
}