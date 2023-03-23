import Head from "next/head"

export default function CustomHead({title, description="BillMates Web Page"}) {
    if (typeof window !== "undefined") {
        const useDark = (localStorage.getItem("theme") == "dark");
        if (useDark) {
            document.documentElement.className = "dark";
        }
    }
    return (
        <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}