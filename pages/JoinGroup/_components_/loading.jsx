import CustomHead from '../../global_components/head.jsx'
import LoadingCircle from '../../global_components/loading_circle.jsx';




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