import Footer from './Globals/Footer'
import Header from './Globals/Header'
import { Inter } from '@next/font/google'
import styles from "@/styles/Group.module.css";
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })

function NewGroupButton() {
  const router = useRouter();

  function handleClick() {
    router.push('/newgroup');
  }

  return (
    <Footer callback={handleClick} />
  );
}


export default function Homeheading(name) {
  return ( 
    <>
    
    <Header></Header>
    <main className={styles.main}>
        <div className={styles.group_info}>  
            <div className={styles.yourNameTotalContainer}>
                <span className={styles.yourNameTotalContainer1}>
                    <p className={styles.yourName}>[Your name]</p>
                    <p className={styles.totalDebt2250}>Total debt: $22.50</p>
                </span>
            </div> 
        </div>
        
    </main>
    <div className={styles.banner}>
                <p>MY GROUPS</p>
    </div>

    
    <NewGroupButton />

    </>
  )
}

// export default function Grouplist ({groupName, groupId}) {
//     //import header, home banner, add dynamic list, then footer
// }