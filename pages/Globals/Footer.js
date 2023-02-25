import Image from 'next/image'

export default function Footer({callback, args}) {
    return (
        <>
            <footer>
                <div>
                <a href='./'>
                    <Image
                    src = "/billmates_logo_person_trans.png"
                    alt={"Billmates Logo"}
                    width={50}
                    height={50}
                    
                    ></Image>
                </a>
                </div>
                <span></span>
                <div id='plus_button' onClick={(args) => callback(args)}>
                </div>
            </footer>
        </>
    );
}