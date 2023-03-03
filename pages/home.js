import Footer from './globals/Footer'
import Header from './globals/Header'
import { Inter } from '@next/font/google'
import styles from "@/styles/Group.module.css";
import { useRouter } from 'next/router';
import { userService } from './services/authorization';
import { LAMBDA_RESP } from './lib/constants';

const inter = Inter({ subsets: ['latin'] })


export async function getServerSideProps({req, res}) {
  const {email} = userService.getEmailFromToken({req, res});
  if (email == null) {
    return {props : {},
            redirect : {permanent: false,
            destination: "/"} }
  }
  const {status, user} = await userService.getUserData(email);
  console.log(status);
  console.log(user);
  //temp data because there is an error in lambda
  //const status = "success";
  //const user = { groups : {"1" : 2.00,"2" : 0.00,"3" : -1.00}, name : "Logan C" }

  if (status == LAMBDA_RESP.ERROR || status == LAMBDA_RESP.INVALID_TOKEN) {
    return {props : {},
    redirect : {permanent: false,
    destination: "/"} }
  }
  if (status == LAMBDA_RESP.INVALID) {
    userService.deleteJwtTokenServerSide({req, res});
    return {props : {},
    redirect : {permanent: false,
      destination: "/"}}
  }
  if (status == LAMBDA_RESP.SUCCESS) {
    return {
      props : {
        userData : user
      }
    }
  }
}


export default function Homeheading({userData}) {
  console.log(userData);
  let router = useRouter();
  
  function handleClick() {
    router.push('/newgroup');
  }
  function sumDebts(userGroups) {
    let total = 0;
    for (let group of userGroups) {
      total += Math.trunc(group.balance * 100);
    }
    return (total / 100).toFixed(2);
  }
  let hex = (sumDebts(userData.groups) == 0) ? "black" : (sumDebts(userData.groups) < 0) ? "var(--red-background)" : "var(--green-background)";
  let hexBox = (sumDebts(userData.groups) == 0) ? "lightgray" : (sumDebts(userData.groups) < 0) ? "var(--red-background)" : "var(--green-background)";

  function goToGroup(groupId) {
    //console.log("/Groups/" + groupId);
    router.push("/Groups/" + groupId);
  }
  function GroupTemplate({groupName, debtOwed, groupId}) {
    return (
      <div className={styles.groupTemplate} onClick={() => {goToGroup(groupId)}}>
          <p className={styles.groupNameP}>{groupName}</p>
          {/* <p className={styles.debtInGroupP}>${debtOwed}</p> */}
          <p className={styles.debtInGroupP} style={{background:hexBox}} >${((debtOwed < 0) ? debtOwed * -1 : debtOwed * 1).toFixed(2)}</p>

      </div>
    );
  }
  return ( 
    <>
    
    <Header></Header>
    <main className={styles.main}>
      <div className={styles.group_heading}>  
        <div className={styles.yourNameTotalContainer}>
            <p className={styles.yourName}>{userData.name}</p>
            {/* <p className={styles.individualDebt}>Total debt: ${sumDebts(userData.groups)}</p> */}
            <p classname={styles.individualDebt} style={{color:hex}} >Total debt: ${((sumDebts(userData.groups) < 0) ? sumDebts(userData.groups) * -1 : sumDebts(userData.groups) * 1).toFixed(2)}</p>
        </div>
        <div className={styles.banner}>
          <p>MY GROUPS</p>
        </div> 
      </div>
    <div className={styles.myGroupsListContainer}>
      {  
        userData.groups.map( (group) => {
          //groupId not working. Don't know how backend is formatting this data
          return <GroupTemplate groupName={group.name} debtOwed={group.balance.toFixed(2)} groupId={group.group_id}></GroupTemplate>;
        })
      }
      <div className={styles.buffer_block}></div>
    </div>
        
    </main>
    
    <Footer callback={handleClick}></Footer>

    </>
  )
}

// export default function Grouplist ({groupName, groupId}) {
//     //import header, home banner, add dynamic list, then footer
// }


