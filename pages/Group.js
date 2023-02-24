import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Group.module.css'
import Header from './Globals/Header.js'
import Footer from './Globals/Footer.js'

function Transaction ({jsonString}) {
    console.log(amount);
    const body = JSON.parse(jsonString);
    return (
        <div className={styles.transaction_container}>
        <div className={styles.transaction_info}>
            <div className={styles.transaction_name_amount}>
                <p>{item}</p>
                <p>${amount}</p>
            </div>
            <div className={styles.transaction_owner_date}>
                <p>{name}</p>
                <p>{date}</p>
            </div>
        </div>
        <div className={styles.relative_amount}>
            <p>${relative}</p>
        </div>
    
    </div>
    );
}

export default function Group () {




return (
<>
<Header></Header>
<main className={styles.main}>
    <div className={styles.group_heading}>
        <div className={styles.group_info}>
            <div className={styles.names_members}>
                <p>Baller Mates</p>
                <p>Members: 3</p>
            </div>
            <div className={styles.group_amount}>
                <p>$42.50</p>
            </div>
        </div>
        <div className={styles.banner}>
                <p>EXPENSES</p>
        </div>
    </div>
    <div className={styles.transaction_history}>
        {/* <Transaction name="Logan Cover" item="Testing" amount="10.00" date="02/24/2023" relative="5.00"/> */}
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>Dinner</p>
                    <p>$60.00</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>Giannis Antetokounmpo</p>
                    <p>02/23/2023</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$50.00</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>Starbies</p>
                    <p>$10.00</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>Luka Doncic</p>
                    <p>02/22/2023</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$7.50</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
        <div className={styles.transaction_container}>
            <div className={styles.transaction_info}>
                <div className={styles.transaction_name_amount}>
                    <p>ITEM HERE</p>
                    <p>$####.##</p>
                </div>
                <div className={styles.transaction_owner_date}>
                    <p>NAME HERE</p>
                    <p>##/##/####</p>
                </div>
            </div>
            <div className={styles.relative_amount}>
                <p>$####.##</p>
            </div>
        
        </div>
    </div>
    
</main>
<Footer></Footer>
</>
);
}