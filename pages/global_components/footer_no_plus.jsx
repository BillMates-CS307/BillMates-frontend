import Image from 'next/image';
export default function Footer({callback, args}) {
    return (
        <>
                <div className="footer_div">
                <a href='/Home'>
                    <Image
                    src = "/billmates_logo_person_trans.png"
                    alt={"Billmates Logo"}
                    width={50}
                    height={50}
                    
                    ></Image>
                </a>
                </div>
        </>
    );
}