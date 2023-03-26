import Image from 'next/image';
export default function Footer({ callback, args, lockStatus }) {
    return (
        <>
            <div className="footer_div">
                <a href='/home'>
                    <Image
                        src="/billmates_logo_person_trans.png"
                        alt={"Billmates Logo"}
                        width={50}
                        height={50}

                    ></Image>
                </a>
            </div>
            <div id='plus_button' onClick={() => { if (!lockStatus) { callback(args) } }} className="footer_div">
            </div>
        </>
    );
}