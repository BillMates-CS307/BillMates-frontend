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
        "Group relative debts", "Group requests throughout the year", "Group expenses by tag",
        "My relative debts", "My requests through the year", "My expenses by tag"
    ];

    function goToSettings() {
        if (userId == response_data.manager) {
            router.push("/groupsettings/" + groupId);
        } else {
            router.push("/groupsettings_members/" + groupId);
        }
    }
    function goToGroup() {
        router.push("../[pid]", `../${groupId}`);
    }
    function goToCalendar() {
        router.push("/calendar");
    }
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

    if (isAuthenticated) {
        return (
            <>
                <CustomHead title={"Analytics"} description={"Your group analytics"}></CustomHead>
                <Header calendar={goToCalendar} group={goToGroup} settings={goToSettings}></Header>
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
                                <p style={ {textAlign : 'center'} }>Group relative debts</p>
                            </div>
                            <div className={styles.gallery_container} id="gallery_container">
                                <div className={styles.gallery_item_wrapper} style={ {display : "block"} }>
                                    <ResponsiveContainer>
                                        <LineChart data={responseData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="uv" stroke="var(--green-muted-background)" strokeWidth={3}/>
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className={styles.gallery_item_wrapper}>
                                    <ResponsiveContainer>
                                        <BarChart data={responseData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
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
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="uv" stroke="var(--green-background)" strokeWidth={3}/>
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className={styles.gallery_item_wrapper}>
                                    <ResponsiveContainer>
                                        <BarChart data={responseData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
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


                <Footer></Footer>
            </>


        )
    } else {
        return <></>
    }
}