import styles from '@/styles/Home.module.css'


export default function Register() {

    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = {
          fname : event.target.fname.value ,
          lname : event.target.lname.value,
          email: event.target.email.value,
          remail: event.target.remail.value,
          password: event.target.password.value,
          rpassword : event.target.rpassword.value
        }

        const field_check = checkFields(data);
        if (!field_check.valid) {
          for (let i in field_check.elms) {
            field_check.elms[i].style = "outline: 1px solid #ff0101;";
            field_check.elms[i].addEventListener('keydown', function () {
              this.style = "";
              this.nextElementSibling.style = "";
            }, {once : true});
            field_check.elms[i].nextElementSibling.textContent = field_check.messages[i];
            field_check.elms[i].nextElementSibling.style = "display:block";
          }
          field_check.elms[0].focus();
          return;
        }
    
        const JSONdata = JSON.stringify(data)
        const endpoint = '/api/register_api'
        const options = {
          method: 'POST',
          mode : 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSONdata,
        }

    
        const response = await fetch(endpoint, options);
        if (response.status == 400) {
          alert("Unable to find form fields");
          return;
        }

        const result = await response.json();
        console.log(result);
        // if (result) {
        //   alert("worked!");
        // } else {
        //   alert("failed");
        // }
      }


      const checkFields = (target) => {
        let output = {valid : true, elms : [], messages : []}
        if (target.fname == "") {
          output.elms.push(document.querySelector('#fname'));
          output.messages.push("Cannot be empty");
        }
        if (target.lname == "") {
          output.elms.push(document.querySelector('#lname'));
          output.messages.push("Cannot be empty");
        }

        let regex = /[a-zA-z0-9]@[a-zA-z0-9.]/g;
        if (target.email == "" || target.email.search(regex) == -1) {
          output.elms.push(document.querySelector('#email'));
          output.messages.push("Invalid Email");
        }        
        // if (target.remail == "" || target.email != target.remail || target.remail.search(regex) == -1) {
        //   output.elms.push(document.querySelector('#remail'));
        //   output.messages.push("Invalid Email");
        // }
        if (target.email != target.remail) {
          output.elms.push(document.querySelector('#remail'));
          output.messages.push("Emails must match");
        }

        regex = /[a-zA-Z0-9]{5,}/g;
        if (target.password == "" || target.password.search(regex) == -1) {
          output.elms.push(document.querySelector('#password'));
          output.messages.push("Password must be at least 5 characters or numbers");
        }        
        // if (target.remail == "" || target.email != target.remail || target.remail.search(regex) == -1) {
        //   output.elms.push(document.querySelector('#remail'));
        //   output.messages.push("Invalid Email");
        // }
        if (target.password != target.rpassword) {
          output.elms.push(document.querySelector('#rpassword'));
          output.messages.push("Passwords must match");
        }

        if (output.elms.length > 0) {
          output.valid = false;
        }

        return output;
      }

    return(
<>
<div className={styles.signup_form}>
        <form onSubmit={handleSubmit} method="post">
            <div>
            <label htmlFor="fname">First Name:</label>
            <input type="text" id="fname" name="fname" />
            <span></span>
            </div>

            <div>
            <label htmlFor="lname">Last Name:</label>
            <input type="text" id="lname" name="lname" />
            <span></span>
            </div>

            <div>
            <label htmlFor="email">Email:</label>
            <input  type="text" id="email" name="email" />
            <span></span>
            </div>
            
            <div>
            <label htmlFor="remail">Re-type Email:</label>
            <input  type="text" id="remail" name="remail" />
            <span></span>
            </div>

            <div>
            <label htmlFor="password">Password:</label>
            <input
            type="password"
            id="password"
            name="password"
            pattern="[a-zA-Z0-9]+"
            title="Password should be digits (0 to 9) or alphabets (a to z)."
            
            />
            <span></span>
            </div>

            <div>
            <label htmlFor="rpassword">Re-type Password:</label>
            <input
            type="password"
            id="rpassword"
            name="rpassword"
            pattern="[a-zA-Z0-9]+"
            title="Password should be digits (0 to 9) or alphabets (a to z)."
            
            />
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