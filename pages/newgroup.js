import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Creategroup from './Forms/newgroup_form'
import { userService } from './services/authorization'
import Header from './Globals/Header'

const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps({req, res}) {
  const {email, token} = userService.getEmailFromToken({req, res});
  if (email == null) {
    return {props : {},
            redirect : {permanent: false,
            destination: "/"} }
  }
  return {props: {}}
}

export default function Home() {
      
  return (
    <> 

    <header className={styles.header}>
    
        {/* change to just name with white background */}
            </header>
        <main className = {styles.main}>
            <div className= {styles.position_box}>
            <Head>
                <Header></Header>
                <title>Create a New Group</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

            </Head>
            <Creategroup></Creategroup>

            </div>

        </main>

    </>
    
  )
}