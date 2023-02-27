import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";

export default function Register() {
  let router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      fname: event.target.fname.value,
      lname: event.target.lname.value,
      email: event.target.email.value,
      remail: event.target.remail.value,
      password: event.target.password.value,
      rpassword: event.target.rpassword.value,
    };

    const field_check = checkFields(data);
    if (!field_check.valid) {
      for (let i in field_check.elms) {
        field_check.elms[i].style = "outline: 1px solid #ff0101;";
        field_check.elms[i].addEventListener(
          "keydown",
          function () {
            this.style = "";
            this.parentElement.nextElementSibling.style = "";
          },
          { once: true }
        );
        field_check.elms[i].parentElement.nextElementSibling.textContent =
          field_check.messages[i];
        field_check.elms[i].parentElement.nextElementSibling.style =
          "display:block";
      }
      field_check.elms[0].focus();
      return;
    }
    data["name"] = data.fname + " " + data.lname;
    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/register_api";
    const options = {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };

    let response = await fetch(endpoint, options);
    if (response.status == 400) {
      alert("Unable to find form fields");
      return;
    }

    const result = await response.json();

    if (!result.token_success) {
      alert("Failed to validate signup attempt, please try again later");
      return;
    }
    if (!result.signup_success) {
      const email = document.querySelector("#email");
      email.style = "outline: 1px solid var(--red-background);";
      email.addEventListener(
        "keydown",
        function () {
          this.style = "";
          this.parentElement.nextElementSibling.style = "";
        },
        { once: true }
      );
      email.parentElement.nextElementSibling.textContent =
        "Email already in use";
      email.parentElement.nextElementSibling.style = "display:block";
      email.focus();
    } else {
      router.push("/");
    }

    response = await fetch(endpoint, options);
    if (response.status == 400) {
      alert("Unable to find form fields");
      return;
    }

    let regex = /[a-zA-z0-9]@[a-zA-z0-9.]/g;
    if (target.email == "" || target.email.search(regex) == -1) {
      output.elms.push(document.querySelector("#email"));
      output.messages.push("Invalid Email");
    }
    // if (target.remail == "" || target.email != target.remail || target.remail.search(regex) == -1) {
    //   output.elms.push(document.querySelector('#remail'));
    //   output.messages.push("Invalid Email");
    // }
    if (target.email != target.remail) {
      output.elms.push(document.querySelector("#remail"));
      output.messages.push("Emails must match");
    }
    let message = "";
    if (target.password.search(/(?=(.*[a-z]){3,})/g) == -1) {
      message = "Must have at least 3 lower case letters";
    }
    if (target.password.search(/(?=(.*[A-Z]){3,})/g) == -1) {
      message = "Must have at least 3 upper case letters";
    }
    if (target.password.search(/(?=(.*[0-9]){3,})/g) == -1) {
      message = "Must have at least 3 numbers";
    }
    if (target.password.search(/(?=(.*[?#@!*()])+)/g) == -1) {
      message = "Must have at least 1 special character ? # @ ! * ( )";
    }
    if (target.password == "" || target.password.length < 10) {
      message = "Password must be at least 10 characters in length";
    }
    if (message != "") {
      output.elms.push(document.querySelector("#password"));
      output.messages.push(message);
    }
  };
  const checkFields = (target) => {
    let output = { valid: true, elms: [], messages: [] };
    if (target.fname == "") {
      output.elms.push(document.querySelector("#fname"));
      output.messages.push("Cannot be empty");
    }
    if (target.lname == "") {
      output.elms.push(document.querySelector("#lname"));
      output.messages.push("Cannot be empty");
    }

    let regex = /[a-zA-z0-9]@[a-zA-z0-9.]/g;
    if (target.email == "" || target.email.search(regex) == -1) {
      output.elms.push(document.querySelector("#email"));
      output.messages.push("Invalid Email");
    }
    // if (target.remail == "" || target.email != target.remail || target.remail.search(regex) == -1) {
    //   output.elms.push(document.querySelector('#remail'));
    //   output.messages.push("Invalid Email");
    // }
    if (target.email != target.remail) {
      output.elms.push(document.querySelector("#remail"));
      output.messages.push("Emails must match");
    }
    let message = "";
    if (target.password.search(/(?=(.*[a-z]){3,})/g) == -1) {
      message = "Must have at least 3 lower case letters";
    }
    if (target.password.search(/(?=(.*[A-Z]){3,})/g) == -1) {
      message = "Must have at least 3 upper case letters";
    }
    if (target.password.search(/(?=(.*[0-9]){3,})/g) == -1) {
      message = "Must have at least 3 numbers";
    }
    if (target.password.search(/(?=(.*[?#@!*()])+)/g) == -1) {
      message = "Must have at least 1 special character ? # @ ! * ( )";
    }
    if (target.password == "" || target.password.length < 5) {
      message = "Password must be at least 5 characters in length";
    }
    if (message != "") {
      output.elms.push(document.querySelector("#password"));
      output.messages.push(message);
    }

    if (target.password != target.rpassword) {
      output.elms.push(document.querySelector("#rpassword"));
      output.messages.push("Passwords must match");
    }

    if (output.elms.length > 0) {
      output.valid = false;
    }

    return output;
  };

  const showPassword = (event) => {
    const target = event.target;
    if (target.firstChild.style.display == "none") {
      target.children[0].style = "";
      target.children[1].style = "display:none";
      target.parentNode.firstChild.type = "password";
    } else {
      target.children[1].style = "";
      target.children[0].style = "display:none";
      target.parentNode.firstChild.type = "text";
    }
  };

  return (
    <>
      <div className={styles.signup_form}>
        <form onSubmit={handleSubmit} method="post">
          <div>
            <label htmlFor="fname">First Name:</label>
            <empty>
              <input type="text" id="fname" name="fname" />
            </empty>
            <span></span>
          </div>

          <div>
            <label htmlFor="lname">Last Name:</label>
            <empty>
              <input type="text" id="lname" name="lname" />
            </empty>
            <span></span>
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <empty>
              <input type="text" id="email" name="email" />
            </empty>
            <span></span>
          </div>

          <div>
            <label htmlFor="remail">Re-type Email:</label>
            <empty>
              <input type="text" id="remail" name="remail" />
            </empty>
            <span></span>
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <div className={styles.inode}>
              <input type="password" id="password" name="password" />
              <i onClick={showPassword}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                  <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                </svg>
                <svg
                  style={{ display: "none" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
                </svg>
              </i>
            </div>
            <span></span>
          </div>

          <div>
            <label htmlFor="rpassword">Re-type Password:</label>
            <div className={styles.inode}>
              <input type="password" id="rpassword" name="rpassword" />
              <i onClick={showPassword}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                  <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                </svg>
                <svg
                  style={{ display: "none" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
                </svg>
              </i>
            </div>
            <span></span>
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>

      <p>
        Already have an account? <a href="/">Sign In</a>
      </p>
    </>
  );
}
