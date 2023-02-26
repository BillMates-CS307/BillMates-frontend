export async function getServerSideProps({req, res}) {
    return {props : {},
            redirect : {permanent: false,
            destination: "../Home"} }
}


export default function NoPage() {
    return (
      <>
      <p>Nothing Here</p>
  
      </>
    )
  }