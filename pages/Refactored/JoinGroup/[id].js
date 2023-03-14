//global imports
import styles from '@/styles/Home.module.css'
import { user_methods } from "@/lambda_service/userService.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/router.js";

//sign in form imports
import SignIn from './_components_/sign_in_form';
import Loading from './_components_/loading';
import { group_methods } from '@/lambda_service/groupService';

export default function JoinGroup() {
    const router = useRouter();
    const [isAuthenticated, setAuthentication] = useState(false);
    const check = async () => {
        let result = await user_methods.validateLoginJWT(false);
        if (result && !isAuthenticated) {
            localStorage.setItem("tempId", result.payload.email);
            setAuthentication(true);
        }
    }
    useEffect(() => {
        check();
    }, []);

    const join = async () => {
        const groupId = (isAuthenticated) ? window.location.href.match('[a-zA-Z0-9\-]*$')[0] : null;
        const userId = (isAuthenticated) ? localStorage.getItem("tempId") : null;
        let result = await group_methods.addUserToGroup(userId, groupId);
        console.log(result);
        if (result.errorType) {
            console.log(result.errorMessage);
            return;
        } else if (result.success) {
            router.push("../Groups/" + groupId);
        } else {
            alert("Already in group or banned?");
        }
    }
    useEffect(() => {
        if (isAuthenticated) {
            join();
        }
    }, [isAuthenticated])

    return (
        <>
        { (!isAuthenticated)?
            <SignIn></SignIn>
            :
            <>
            <Loading></Loading>
            </>
        }
        </>
    )
}


