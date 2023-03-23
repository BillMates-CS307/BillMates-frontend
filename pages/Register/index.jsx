import styles from "@/styles/Home.module.css";
import CustomHead from '../global_components/head.jsx'
import { useRouter } from "next/router";
import { ButtonLock } from "../global_components/button_lock.js";
import { useEffect, useState } from "react";
import { user_methods } from "@/lambda_service/userService.js";

//import Register from "@/pages/forms/register_form";
import TextField from "./_components_/input_label.jsx";
import PasswordField from "./_components_/password.jsx";
import BareHeader from "../global_components/bare_header.jsx";

export var fieldData = {
    fname : ["", null, true],
    lname : ["", null, true],
    email: ["", null, true],
    remail : ["", null, true],
    password :["", null, true],
    rpassword : ["", null, true]
}


export default function Register() { 
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

            let response = await user_methods.registerAccount(fieldData.email[0], fieldData.password[0], fieldData.fname[0] + " " + fieldData.lname[0]);
            if (response.errorMessage != undefined) {
                console.log(response.errorMessage);
                return;
            }
            if (response.success) {
                router.push("/");
            } else {
                const email = document.querySelector('#email');
                email.style = "outline: 1px solid var(--red-background)";
                email.addEventListener('keydown', function () {
                  this.style = "";
                  this.parentElement.nextElementSibling.style = "";
                }, {once : true});
                email.parentElement.nextElementSibling.textContent = "Email already in use";
                email.parentElement.nextElementSibling.style = "display:block";
                email.focus();
            }
            ButtonLock.UnlockButton();
            event.target.children[6].textContent = "Register";
            event.target.children[6].style = "";
        } else {
            console.log("locked");
        }
        console.log(fieldData);
    }
if (isAuthenticated) {
    return (
        <>
<CustomHead title={"Register"} description={"Create your BillMates account"}></CustomHead>
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
    } else {
        return <></>;
    }
}
