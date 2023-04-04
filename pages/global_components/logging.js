export function printLogHeading(funcName, status) {
    if (status == 200) {
        console.log(`\x1b[32m======================${funcName}======================\x1b[0m`);
    } else {
        console.log(`\x1b[31m======================${funcName}======================\x1b[0m`);
    }
    
}

export default function loggingPage() {
    return <></>;
}