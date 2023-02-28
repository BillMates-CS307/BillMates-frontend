import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router'

export default function Register() {
    let router = useRouter();
    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = {
          groupname : event.target.groupname.value ,
        }

        const field_check = checkFields(data);
        if (!field_check.valid) {
          for (let i in field_check.elms) {
            field_check.elms[i].style = "outline: 1px solid #ff0101;";
            field_check.elms[i].addEventListener('keydown', function () {
              this.style = "";
              this.parentElement.nextElementSibling.style = "";
            }, {once : true});
            field_check.elms[i].parentElement.nextElementSibling.textContent = field_check.messages[i];
            field_check.elms[i].parentElement.nextElementSibling.style = "display:block";
          }
          field_check.elms[0].focus();
          return;
        }
        data["name"] = data.groupname;
        const JSONdata = JSON.stringify(data)
        const endpoint = '/api/newgroup_api' //newgroup API endpoint
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

        if (!result.token_success) {
          alert("Failed to create a new group. Please try again.");
          return;
        }
        if (!result.creategroup_success) {
          const groupname = document.querySelector('#groupname');
          groupname.style = "outline: 1px solid var(--red-background);";
          groupname.addEventListener('keydown', function () {
            this.style = "";
            this.parentElement.nextElementSibling.style = "";
          }, {once : true});
          groupname.parentElement.nextElementSibling.textContent = "Group name already in use";
          groupname.parentElement.nextElementSibling.style = "display:block";
          groupname.focus();
        } else {
          router.push('/')
        }
      } 

      const checkFields = (target) => {
        let output = {valid : true, elms : [], messages : []}
        if (target.groupname.trim() == "") { //or   .value.trim()
          output.elms.push(document.querySelector('#groupname'));
          output.messages.push("Invalid group name");
        }        

        return output;
      }

    return(
        <>
            <div className={styles.signup_form}>
                <form onSubmit={handleSubmit} method="post">
                    <div>
                    <label htmlFor="groupname">Group Name:</label>
                    <empty>
                    <input type="text" id="groupname" name="groupname" />
                    </empty>
                    <span></span>
                    </div>
            
                    <button type="submit">Create Group</button>
                    
                    <a href="home">Go Back</a>
                    
                </form>
            </div>
        </>
    );

}