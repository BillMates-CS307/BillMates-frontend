
export function removeLoader () {
    document.querySelector("#loading_circle").style.display = "none";
    return;
}

export default function LoadingCircle({additionalStyles}) {
return (<><div id="loading_circle" style={additionalStyles}></div></>);
}