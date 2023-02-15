import styles from '@/styles/Home.module.css'


export default function PageWithJSbasedForm() {
    // Handles the submit event on form submit.
    const handleSubmit = async (event) => {
      // Stop the form from submitting and refreshing the page.
      event.preventDefault()
  
      // Get data from the form.
      const data = {
        email: event.target.email.value,
        password: event.target.password.value,
      }
  
      // Send the data to the server in JSON format.
      const JSONdata = JSON.stringify(data)
  
      // API endpoint where we send form data.
      const endpoint = '/api/signup_form'
  
      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: 'POST',
        // Tell the server we're sending JSON.
        headers: {
          'Content-Type': 'application/json',
        },
        // Body of the request is the JSON data we created above.
        body: JSONdata,
      }
  
      // Send the form data to our forms API on Vercel and get a response.
      const response = await fetch(endpoint, options);

      if (response.status == 400) {
        alert("Unable to find form fields");
        return;
      }
  
      // Get the response data from server as JSON.
      // If server returns the name submitted, that means the form works.
      const result = await response.json();
      //console.log(response);
      console.log(result);
      if (result) {
        alert("worked!");
      } else {
        alert("failed");
      }
    }

    return (
        <form onSubmit={handleSubmit} method="post" className={styles.signup_form}>
        <label htmlFor="email">Email:</label>
        <input required type="email" id="email" name="email" />
        <label htmlFor="password">Password:</label>
  <input
    type="password"
    id="password"
    name="password"
    pattern="[a-zA-Z0-9]+"
    title="Password should be digits (0 to 9) or alphabets (a to z)."
    required
  />
        <button type="submit">Submit</button>
      </form>
    )

}  