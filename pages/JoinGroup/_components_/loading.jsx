import CustomHead from '../../Global_components/head.jsx'
import LoadingCircle from '../../Global_components/loading_circle.jsx';




export default function Loading() {


    return (
        <>
        <CustomHead title={"Join Group"} description={"page to join a given group"}></CustomHead>
        <main>
            <LoadingCircle additionalStyles={{margin : "15px auto"}}></LoadingCircle>
        </main>
        </>
    )
}