import Image from 'next/image';
export default function Footer({callback, args}) {
    return (
        <>
                <div className="footer_div">
                <a href='./'>
                    <Image
                    src = "/billmates_logo_person_trans.png"
                    alt={"Billmates Logo"}
                    width={50}
                    height={50}
                    
                    ></Image>
                </a>
                </div>
                <div id='plus_button' onClick={(args) => callback(args)} className="footer_div">
                </div>
        </>
    );
}