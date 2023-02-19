import styles from '@/styles/Home.module.css'


export default function PageWithJSbasedForm() {
    const handleSubmit = async (event) => {
      event.preventDefault()
      // Get data from the form.
      const data = {
        email: event.target.email.value,
        password: event.target.password.value,
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
      const endpoint = '/api/signin_api'
  
      // Form the request for sending data to the server.
      const options = {
        method: 'POST',
        mode : 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSONdata
      }
      const response = await fetch(endpoint, options);
      if (response.status == 400) {
        alert("Unable to find form fields");
        return;
      }

      const result = await response.json();
      console.log(result);
      // if (result) {
      //   alert('worked');
      // } else {
      //   alert("failed");
      // }
    }

    const checkFields = (target) => {
      let output = {valid : true, elms : [], messages : []}
      let regex = /[a-zA-z0-9]+@[a-zA-z0-9]+[.][a-zA-Z0-9]+/g;
      if (target.email == "" || target.email.search(regex) == -1) {
        output.elms.push(document.querySelector('#email'));
        output.messages.push("Invalid Email");
      }

      if (target.password == "") {
        output.elms.push(document.querySelector('#password'));
        output.messages.push("Required");
      }
      regex = /[+^%\\'"]+/g;        
      if (target.password.search(regex) != -1) {
        output.elms.push(document.querySelector('#password'));
        output.messages.push("Invalid Password");
      }
      if (output.elms.length > 0) {
        output.valid = false;
      }

      return output;
    }

    return (
<>
    <div className={styles.signup_form}>
        <form onSubmit={handleSubmit} method="post">
            <div>
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" name="email" />
            <span></span>
            </div>
            <div>
            <label htmlFor="password">Password:</label>
            <input
            type="password"
            id="password"
            name="password"
            />
            <span></span>
            </div>
            <button type="submit">Sign In</button>
        </form>
    </div>

    <p>
    New to BillMates? <a href="/register">Register</a>
    </p>
</>
    )

}  