import BareHeader from "./global_components/bare_header"
import Footer from "./global_components/footer_no_plus"
import CustomHead from "./global_components/head"

export default function Custom404() {
    return <>
        <CustomHead title={"404 Not Found"} description={"This page does not exist"}></CustomHead>
        <BareHeader></BareHeader>
        <main style={{ textAlign: "center", display: "flex", justifyContent: "center", flexDirection: "column" }}>
            <h1>404 Not Found</h1>
            <h2>Sorry, this page does not exist</h2>
        </main>
        <Footer></Footer>
    </>
}