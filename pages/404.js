import BareHeader from "./Refactored/Global_components/bare_header"
import Footer from "./Refactored/Global_components/footer_no_plus"

export default function Custom404() {
    return <>
    <BareHeader></BareHeader>
    <main style={{textAlign : "center", display : "flex", justifyContent : "center", flexDirection : "column"}}>
        <h1>404 Not Found</h1>
        <h2>Sorry, this page does not exist</h2>
    </main>
    <Footer></Footer>
    </>
}