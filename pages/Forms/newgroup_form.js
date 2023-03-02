import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router'
import { userService } from '../services/authorization'
import { LAMBDA_RESP } from '../lib/constants';

export default function CreateGroup({user}) {
    let router = useRouter();
    const handleSubmit = async (event) => {
        event.preventDefault()
        const inputs = event.target.querySelector("input")
        const data = {
          groupname : inputs.value
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

        data["manager"] = user;

        // if (status == LAMBDA_RESP.ERROR || status == LAMBDA_RESP.INVALID_TOKEN) {
        //   alert("Please try again later");
        //   return;
        // }
        const JSONdata = JSON.stringify(data)
        console.log(JSONdata)
        const endpoint = '/api/newGroup_api' //newgroup API endpoint
        const options = {
          method: 'POST',
          mode : 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSONdata,
        }
        const response = await fetch(endpoint, options);
        const result = await response.json(); //const

        //TEST RESULT ------------------------------------------
        //var result = {token_success: true, creategroup_success: true, groupID: "9"}
        
        //const {status} = await userService.authenticateToken(data.groupname);
        
        if (result.token_success == false) {
          alert("Failed to create a new group. Please try again.");
          return;
        }
        if (result.token_success == true && result.make_group_success == false ) {
          const groupname = document.querySelector('#groupname');
          groupname.style = "outline: 1px solid var(--red-background);";
          groupname.addEventListener('keydown', function () {
            this.style = "";
            this.parentElement.nextElementSibling.style = "";
          }, {once : true});
          groupname.parentElement.nextElementSibling.textContent = "Group already exists";
          groupname.parentElement.nextElementSibling.style = "display:block";
          groupname.focus();
        } else if (result.ERROR == "Malformed Body") {
          alert("Payload doesn't have the correct fields");
          groupname.parentElement.nextElementSibling.textContent = "Payload doesn't have the correct fields";
          groupname.parentElement.nextElementSibling.style = "display:block";
          groupname.focus();
        } else {
          router.push('/home');
        }
        
      } 

      const checkFields = (target) => {
        console.log(target)
        let output = {valid : true, elms : [], messages : []}
        if (target.groupname.trim() == "") { //or   .value.trim()
          output.elms.push(document.querySelector('#groupname'));
          output.messages.push("Invalid group name");
          output.valid = false;
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