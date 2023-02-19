import styles from '@/styles/Home.module.css'


export default function PageWithJSbasedForm() {
    const handleSubmit = async (event) => {
      event.preventDefault()
      // Get data from the form.
      const data = {
        email: event.target.email.value,
        password: event.target.password.value,
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

    return (
<>
    <div className={styles.signup_form}>
        <form onSubmit={handleSubmit} method="post">
            <div>
            <label htmlFor="email">Email:</label>
            <input required type="email" id="email" name="email" />
            </div>
            <div>
            <label htmlFor="password">Password:</label>
            <input
            type="password"
            id="password"
            name="password"
            required
            />
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