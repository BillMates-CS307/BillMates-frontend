//import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import Footer from './Globals/Footer'
import Header from './Globals/Header'
import { Inter } from '@next/font/google'
import styles from "@/styles/Home.module.css";


export default function Home() {
    return ( 
        <div className={styles.mainpg}>
            <Header></Header>
            <img className={styles.mainpgChild} alt="" src="../line-1.svg" />
            <img className={styles.mainpgItem} alt="" src="../rectangle-21.svg" />
            <img className={styles.mainpgInner} alt="" src="../greenbar.svg" />
            <div className={styles.myGroups}>MY GROUPS</div>
            <img className={styles.image5Icon} alt="" src="../image-5@2x.png" />
            <div className={styles.yourNameTotalContainer}>
                <span className={styles.yourNameTotalContainer1}>
                    <p className={styles.yourName}>[Your name]</p>
                    <p className={styles.totalDebt2250}>Total debt: $22.50</p>
                </span>
            </div>
            <Footer></Footer>
        </div>
    )

        // <div>
        //     
        //     <h1>test page</h1>
        //     <h2>hello!</h2>

            

        //     <Footer></Footer>
        // </div>
        

}