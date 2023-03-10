import styles from "@/styles/Home.module.css";
import Head from 'next/head'
import { useRouter } from "next/router";
import { LAMBDA_RESP } from "@/lib/constants";
import { userService } from "@/pages/services/authorization";
import { ButtonLock } from "../Global_components/button_lock.js";

//import Register from "@/pages/forms/register_form";
import TextField from "./_components_/input_label.jsx";
import PasswordField from "./_components_/password.jsx";
import BareHeader from "../Global_components/bare_header.jsx";

export var fieldData = {
    fname : ["", null, true],
    lname : ["", null, true],
    email: ["", null, true],
    remail : ["", null, true],
    password :["", null, true],
    rpassword : ["", null, true]
}


export default function Register() { 
    const checkFieldData = () => {
        let isValid = true;
        let message = "";
        console.log(fieldData);
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
                    case "remail":
                        if (fieldData.remail[0] != fieldData.email[0]) {
                            message = "Emails must match";
                        }
                        break;
                    case "password":
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
                          } else 
                          if (fieldData[field][0].trim() == "") {
                            message = "Required";
                          }
                        break;
                    case "rpassword":
                        if (fieldData.password[0] != fieldData.rpassword[0]) {
                            message = "Passwords must match";
                        }
                        break;
                    case "fname" : 
                        if (fieldData.fname[0].trim() == "") {
                            message = "Required";
                        }
                        break;
                    case "lname" : 
                    if (fieldData.lname[0].trim() == "") {
                        message = "Required";
                    }
                    break;
                    default:
                        break;
                }
    
                if (message != "") {
                    isValid = false;
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
    const handleSubmit = async (event) => {
        console.log("submitting");
        event.preventDefault();
        if(!checkFieldData()) { return;}
        if (!ButtonLock.isLocked()) {
            ButtonLock.LockButton();
            console.log(fieldData);
            event.target.children[6].textContent = "Registering";
            event.target.children[6].style = "background-color : var(--green-muted-background)";
            setTimeout( () => {
                ButtonLock.UnlockButton();
                event.target.children[6].textContent = "Register";
                event.target.children[6].style = "";
            }, 5000);
        } else {
            console.log("locked");
        }
        console.log(fieldData);
    }

    return (
        <>
        <Head>
        <title>Register</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        </Head>
        <BareHeader></BareHeader>
        <main className = {styles.main}>
        <div className= {styles.position_box}>
        <div className={styles.signup_form}>
            <form onSubmit={handleSubmit} method="post">
                <TextField id={"fname"} label={"First Name"}></TextField>
                <TextField id={"lname"} label={"Last Name"}></TextField>
                <TextField id={"email"} label={"Email"}></TextField>
                <TextField id={"remail"} label={"Re-type Email"}></TextField>
                <PasswordField id={"password"} label={"Password"}></PasswordField>
                <PasswordField id={"rpassword"} label={"Re-type Password"}></PasswordField>
                <button type="submit">Register</button>
            </form>
        </div>
        <p>
            Already have an account? <a href="/">Sign In</a>
        </p>
        </div>
        </main>
        </>
    );

}
