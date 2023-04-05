//Global HTML Imports
import styles from '@/styles/Group.module.css'
import Header from '../../global_components/groups_header.jsx'
import Footer from '../../global_components/footer_no_plus.jsx'
import CustomHead from '../../global_components/head.jsx'
import LoadingCircle from '../../global_components/loading_circle.jsx';

import { group_methods } from '@/lambda_service/groupService.js';
import { user_methods } from '@/lambda_service/userService.js';

//React and Redux stuff
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router.js';


//Recharts items
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';


//SHOW ANALYTICS HERE

export default function Analytics() {
    //UNCOMMENT WHEN NEEDED
    const router = useRouter();
    const [isAuthenticated, setAuthentication] = useState(false);
    async function check() {
        //let result = await user_methods.validateLoginJWT(router);
        let result = { success: true, payload: { "email": "test@test.com" } };
        if (result.success) {
            localStorage.setItem("tempId", result.payload.email);
            setAuthentication(true);
        }
    }
    useEffect(() => {
        if (!isAuthenticated) {
            console.log("authenticating");
            check();
        }
    }, [isAuthenticated]);
    //define loading circle and refresh when loading is done
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (isAuthenticated) {
            placeHolder(); //make the call
        }
    }, [isAuthenticated]);

    const matchedGroupId = (isAuthenticated) ? window.location.href.match('(groups)\/[a-zA-z\-0-9]+')[0] : null;
    const groupId = (matchedGroupId) ? matchedGroupId.substring(7) : null;
    const userId = (isAuthenticated) ? localStorage.getItem("tempId") : null;
    function groupSettingsRoute() {
        if (userId == response_data.manager) {
            router.push("/groupsettings/" + groupId);
        } else {
            router.push("/groupsettings_members/" + groupId);
        }
    }
    async function placeHolder(isCallback) {
        console.log("TODO");
        if (loading) {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
        if (isCallback) {
            console.log("Over Here!");
        }
        return;
    }
    const data = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];
    var galleryIdx = 0;
    function advance() {
        const target = document.querySelector("#here");
        target.children[galleryIdx].style = "";
        galleryIdx = (galleryIdx + 1) % 3;
        target.children[galleryIdx].style = "display:block";
    }

    if (isAuthenticated) {
        return (
            <>
                <CustomHead title={"Analytics"} description={"Your group analytics"}></CustomHead>
                <Header groupId={groupSettingsRoute}></Header>
                <main className={styles.main}>
                    {(loading) ?
                        <LoadingCircle additionalStyles={{ margin: "15px auto" }}></LoadingCircle>
                        :
                        <>
   <button onClick={advance}>next chart</button>
<div className={styles.testing} id="here">
        <div className={styles.gallery_item_wrapper}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
        </div>
        <div className={styles.gallery_item_wrapper}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="amt" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
        </div>
        <div className={styles.gallery_item_wrapper}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="pv" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
        </div>
      </div>
                        </>
                    }
                </main>


                <Footer></Footer>
            </>


        )
    } else {
        return <></>
    }
}