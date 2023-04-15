//Global HTML Imports
import styles from '@/styles/Group.module.css'
import Header, {HEADER_PATHS} from '../../global_components/groups_header.jsx'
import Footer from '../../global_components/footer_no_plus.jsx'
import CustomHead from '../../global_components/head.jsx'
import LoadingCircle from '../../global_components/loading_circle.jsx';

import { group_methods } from '@/lambda_service/groupService.js';
import { user_methods } from '@/lambda_service/userService.js';

//React and Redux stuff
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router.js';


//Recharts items
import {CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend,
    LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area } from 'recharts';
import { shopping_methods } from '@/lambda_service/shoppingService.js';
import { useFileSystemPublicRoutes } from '@/next.config.js';

//SHOW ANALYTICS HERE


var current_view = 0;

export default function Analytics() {
    //UNCOMMENT WHEN NEEDED
    const router = useRouter();
    const [isAuthenticated, setAuthentication] = useState(false);
    async function check() {
        let result = await user_methods.validateLoginJWT(router);
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
    const [responseData, setResponseData] = useState(undefined);
    const [warningPopup, setWarningPopup] = useState(null);
    useEffect(() => {
        if (isAuthenticated) {
            //fetchData(); //make the call

            //placeholder until the backend function is finished
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

            setResponseData(data);
            setLoading(false);
        }
    }, [isAuthenticated]);

    const matchedGroupId = (isAuthenticated) ? window.location.href.match('(groups)\/[a-zA-z\-0-9]+')[0] : null;
    const groupId = (matchedGroupId) ? matchedGroupId.substring(7) : null;
    const userId = (isAuthenticated) ? localStorage.getItem("tempId") : null;
    var gallery_graphs = null;
    var gallery_dots = null;
    var gallery_heading = null;
    var galleryIdx = 0;
    const graph_names = [
        "Group requests throughout the year", "Group relative debts" , "Group expenses by tag",
        "My requests through the year", "My relative debts", "My expenses by tag"
    ];

    const fetchData = async () => {
        console.log("fetching data");
        let response = await group_methods.getAnalytics(userId, groupId);
        if (response.errorType) {
            console.log("An error occured, check logs");
            return;
        } else if (response.success) {
            setResponseData(response);
            setLoading(false);
        } else {
            router.push("/home/");
        }
    }
    function advance() {
        if (gallery_graphs == null) {
            gallery_graphs = document.querySelector("#gallery_container");
            gallery_heading = document.querySelector("#gallery_heading");
            gallery_dots = document.querySelector("#gallery_dots");
        }
        gallery_graphs.children[galleryIdx].style = "";
        gallery_dots.children[galleryIdx % 3].style = "";
        galleryIdx = ((galleryIdx + 1) % 3) + 3 * current_view;
        gallery_graphs.children[galleryIdx].style = "display:block";
        gallery_heading.children[1].textContent = graph_names[galleryIdx];
        gallery_dots.children[galleryIdx % 3].style = "background:var(--green-background);";
    }
    function previous() {
        if (gallery_graphs == null) {
            gallery_graphs = document.querySelector("#gallery_container");
            gallery_heading = document.querySelector("#gallery_heading");
            gallery_dots = document.querySelector("#gallery_dots");
        }
        gallery_graphs.children[galleryIdx].style = "";
        gallery_dots.children[galleryIdx % 3].style = "";
        galleryIdx = ((galleryIdx + 2) % 3) + 3 * current_view;
        gallery_graphs.children[galleryIdx].style = "display:block";
        gallery_heading.children[1].textContent = graph_names[galleryIdx];
        gallery_dots.children[galleryIdx % 3].style = "background:var(--green-background);";
    }
    function updateView() {
        if (gallery_graphs == null) {
            gallery_graphs = document.querySelector("#gallery_container");
            gallery_heading = document.querySelector("#gallery_heading");
            gallery_dots = document.querySelector("#gallery_dots");
        }

        current_view = current_view ^ 1;
        gallery_graphs.children[galleryIdx].style = "";
        gallery_dots.children[galleryIdx % 3].style = "";
        galleryIdx = (current_view)? galleryIdx + 3 : galleryIdx - 3;
        gallery_graphs.children[galleryIdx].style = "display:block";
        gallery_heading.children[1].textContent = graph_names[galleryIdx];
        gallery_dots.children[galleryIdx % 3].style = "background:var(--green-background);";
    }
    function isGroupManager() {
        return false; //TODO: fix this
    }
    function exportData() {
        if (responseData == null) { //idk what empty is going to be yet
            setWarningPopup(["There is no data to download", 1.5]);
            return;
        }
        const fileData = JSON.stringify(responseData);
        const blob = new Blob([fileData], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = groupId + "-analytics.json";
        link.href = url;
        link.click();
      }

    if (isAuthenticated) {
        return (
            <>
                <CustomHead title={"Analytics"} description={"Your group analytics"}></CustomHead>
                <Header loading={loading} selected={HEADER_PATHS.GROUP|HEADER_PATHS.CALENDAR|HEADER_PATHS.SETTINGS|HEADER_PATHS.SHOPPINGLIST|HEADER_PATHS.RECURRING}
                getManagerStatus={isGroupManager} groupPath={window.location.href.match(".+?(?=\/analytics)")[0] }></Header>
                <main>
                    {(loading) ?
                        <LoadingCircle additionalStyles={{ margin: "15px auto" }}></LoadingCircle>
                        :
                        <>
                            <div className={styles.gallery_graphs_container}>
                            <div className={styles.gallery_heading} id="gallery_heading">
                                <div className={styles.gallery_arrows_type_container}>
                                    <select className={styles.gallery_type_select} onChange={updateView}>
                                        <option value="0">Group</option>
                                        <option value="1">Me</option>
                                    </select>
                                    <button onClick={exportData} className={styles.download_data}>Download</button>
                                    <button onClick={previous} className={styles.arrow + " " + styles.left}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path fill='currentColor' d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                                        </svg>
                                    </button>
                                    <button onClick={advance} className={styles.arrow}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path fill='currentColor' d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                                        </svg>
                                    </button>
                                </div>
                                <p style={ {textAlign : 'center', color : 'var(--main-background-font-color)'} }>Group requests throughout the year</p>
                            </div>
                            <div className={styles.gallery_container} id="gallery_container">
                                <div className={styles.gallery_item_wrapper} style={ {display : "block"} }>
                                    <ResponsiveContainer>
                                        <LineChart data={responseData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke='var(--dark-neutral-background)'/>
                                            <XAxis dataKey="name" stroke='var(--main-background-font-color)'/>
                                            <YAxis stroke='var(--main-background-font-color)'/>
                                            <Tooltip />
                                            <Line type="monotone" dataKey="uv" stroke="var(--green-muted-background)" strokeWidth={3}/>
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className={styles.gallery_item_wrapper}>
                                    <ResponsiveContainer>
                                        <BarChart data={responseData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke='var(--dark-neutral-background)'/>
                                            <XAxis dataKey="name" stroke='var(--main-background-font-color)'/>
                                            <YAxis stroke='var(--main-background-font-color)'/>
                                            <Tooltip />
                                            <Bar type="monotone" dataKey="amt" fill="var(--green-muted-background)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className={styles.gallery_item_wrapper}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie  animationDuration={1000} animationBegin={0} data={responseData} dataKey="pv" nameKey="name" cx="50%" cy="50%" 
                                            fill="var(--green-muted-background)" label></Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className={styles.gallery_item_wrapper}>
                                    <ResponsiveContainer>
                                        <LineChart data={responseData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke='var(--dark-neutral-background)'/>
                                            <XAxis dataKey="name" stroke='var(--main-background-font-color)'/>
                                            <YAxis stroke='var(--main-background-font-color)'/>
                                            <Tooltip />
                                            <Line type="monotone" dataKey="uv" stroke="var(--green-background)" strokeWidth={3}/>
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className={styles.gallery_item_wrapper}>
                                    <ResponsiveContainer>
                                        <BarChart data={responseData}>
                                        <   CartesianGrid strokeDasharray="3 3" stroke='var(--dark-neutral-background)'/>
                                            <XAxis dataKey="name" stroke='var(--main-background-font-color)'/>
                                            <YAxis stroke='var(--main-background-font-color)'/>
                                            <Tooltip />
                                            <Bar type="monotone" dataKey="amt" fill="var(--green-background)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className={styles.gallery_item_wrapper}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie  animationDuration={1000} animationBegin={0} data={responseData} dataKey="pv" nameKey="name" cx="50%" cy="50%" 
                                            fill="var(--green-background)" label></Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            </div>
                            <div className={styles.gallery_dots} id="gallery_dots">
                                <span style={ {background : "var(--green-background)"}}></span>
                                <span></span>
                                <span></span>
                            </div>
                        </>
                    }
                </main>

                { (warningPopup != null)?
                <>
                <div className={styles.transaction_background} style={{background : "transparent"}}>
                    <div className={styles.warningPopup} style={{animation : "popup "  + warningPopup[1] + "s ease-in forwards"}}>
                        <p>{warningPopup[0]}</p>
                    </div>
                    <div style={{display : "none"}}>
                    {
                        setTimeout(() => {
                            setWarningPopup(null);
                        }, warningPopup[1] * 1000)
                    }
                    </div>
                </div>
                </>
                :
                <></>
                }
                <Footer></Footer>
            </>


        )
    } else {
        return <></>
    }
}