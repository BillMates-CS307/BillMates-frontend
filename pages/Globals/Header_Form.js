import Image from 'next/image'


export default function Header() {


    return (
        <>
        <header className={header}>
            <Image
                src = "/billmates_logo_trans.png"
                alt={"Billmates Logo"}
                width={500}
                height={500}
            ></Image>
        </header>
        </>
    )
}