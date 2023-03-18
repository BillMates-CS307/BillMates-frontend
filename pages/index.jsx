import TextField from "./Register/_components_/input_label.jsx";
import PasswordField from "./Register/_components_/password.jsx";
import BareHeader from "./Global_components/bare_header.jsx";
import styles from "@/styles/Home.module.css";
import CustomHead from './Global_components/head.jsx'

import { fieldData } from "./Register/index.jsx";
import {ButtonLock} from "./Global_components/button_lock.js";
import { user_methods } from "@/lambda_service/userService.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/router.js";


fieldData.fname[2] = false;
fieldData.lname[2] = false;
fieldData.remail[2] = false;
fieldData.rpassword[2] = false;

export default function SignIn () {
    const router = useRouter();
    const [isAuthenticated, setAuthentication] = useState(false);
    const check = async () => {
      let result = await user_methods.validateLoginJWT();
        if (result) {
          router.push("/Home");
        } else if (!isAuthenticated){
          setAuthentication(true);
        }
    }
    useEffect(() => {
        check();
    }, []);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (
            localStorage.getItem("timeout") != null &&
            Date.parse(localStorage.getItem("timeout")) >= Date.now()
          ) {
            alert("You have been timed out for 1 hour");
            return;
          }
        if (!checkFieldData()) {return;}
        if (!ButtonLock.isLocked()) {
            ButtonLock.LockButton();
            console.log(fieldData);

            //set button visually to be locked
            event.target.children[2].textContent = "Signing In";
            event.target.children[2].style = "background-color : var(--green-muted-background)";
            
            //make API call
            let response = await user_methods.validateLoginCredential(fieldData.email[0], fieldData.password[0], true);
            if (response.success) {
                router.push("/Home");
            } else {
                //check if no user or bad attempt
                const element = document.querySelector("#incorrect");
                if (response.attempsLeft != undefined) {
                  element.children[0].innerHTML =
                    "Email or Password is incorrect. </br>Attempts Left : " + response.attempsLeft;
                  if (response.attempsLeft == 0) {
                    localStorage.setItem("timeout", new Date(Date.now() + 3600000));
                  }
                } else {
                  element.children[0].innerHTML = "Email or Password is incorrect.";
                }
                const inputs = document.querySelectorAll("input");
                inputs[0].style = "outline: 1px solid #ff0101;";
                inputs[1].style = "outline: 1px solid #ff0101;";
                inputs[1].value = "";
                element.style = "display:block";
            }
            //on success, route to home where first Redux state is created
            //default to test locking
            ButtonLock.UnlockButton();
            event.target.children[2].textContent = "Sign In";
            event.target.children[2].style = "";
        } else {
            console.log("locked");
        }
    }

    const checkFieldData = () => {
        let isValid = true;
        let message = "";
        for (let field in fieldData) {
            if (fieldData[field][2]) {
                message = "";
                if (fieldData[field][1] == null) {
                    fieldData[field][1] = document.querySelector(`#${field}`);
                }
                fieldData[field][0] = fieldData[field][1].value;
                switch (field) {
                    case "email":
                        if (fieldData[field][0].trim() == "") {
                            message = "Required";
                        } else 
                        if (fieldData[field][0].search(/[a-zA-z0-9]+@[a-zA-z0-9]+[.][a-zA-Z0-9]+/g) == -1) {
                            message = "Invalid email format";
                        }
                        break;
                    case "password": //prevent users from entering passwords not even possible
                    if (fieldData[field][0].trim() == "") {
                        message = "Required";
                      } else 
                        if (fieldData[field][0].search(/(?=(.*[a-z]){3,})/g) == -1) {
                            message = "Must have at least 3 lower case letters";
                          } else 
                          if (fieldData[field][0].search(/(?=(.*[A-Z]){3,})/g) == -1) {
                            message = "Must have at least 3 upper case letters";
                          } else 
                          if (fieldData[field][0].search(/(?=(.*[0-9]){3,})/g) == -1) {
                            message = "Must have at least 3 numbers";
                          } else 
                          if (fieldData[field][0].search(/(?=(.*[?#@!*()])+)/g) == -1) {
                            message = "Must have at least 1 special character ? # @ ! * ( )";
                          }
                          
                        break;
                    default:
                        break;
                }
    
                if (message != "") {
                    isValid = false;
                    if (fieldData[field][1] == null) {
                        fieldData[field][1] = document.querySelector(`#${field}`);
                    }
                    fieldData[field][1].style = "outline: 1px solid var(--red-background);";
                    fieldData[field][1].parentNode.nextElementSibling.textContent = message;
                    fieldData[field][1].parentNode.nextElementSibling.style = "display:block";
                    fieldData[field][1].addEventListener(
                        "input",
                        function () {
                          this.style = "";
                          this.parentElement.nextElementSibling.style = "";
                        },
                        { once: true }
                      );
                }
            }
        }
        return isValid;
    }
    if (isAuthenticated) {
    return (
        <>
<CustomHead title={"Sign In"} description={"Sign in to your BillMates account"}></CustomHead>
        <BareHeader></BareHeader>
        <main className = {styles.main}>
        <div id="incorrect" className={styles.incorrect_box}>
        <p></p>
        </div>
        <div className= {styles.position_box}>
        <div className={styles.signup_form}>
            <form onSubmit={handleSubmit} method="post">
                <TextField id={"email"} label={"Email"}></TextField>
                <PasswordField id={"password"} label={"Password"}></PasswordField>
                <button type="submit">Sign In</button>
            </form>
        </div>
        <p>
        New to BillMates? <a href="/Register">Create Account</a>
        </p>
        </div>
        </main>
        </>
    )
    } else {
        return <></>
    }
}
