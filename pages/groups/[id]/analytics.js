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

const graph_names = [
    ["Group relative debts", "Group requests throughout the year", "Group expenses by tag"],
    ["My relative debts", "My requests through the year", "My expenses by tag"]
];
var current_view = 0;

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
    var gallery_graphs = null;
    var gallery_dots = null;
    var galleryIdx = 0;
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
    function advance() {
        if (gallery_graphs == null) {
            gallery_graphs = document.querySelector("#gallery_container");
        }
        if (gallery_dots == null) {
            gallery_dots = document.querySelector("#gallery_dots");
        }
        gallery_graphs.children[galleryIdx].style = "";
        gallery_dots.children[galleryIdx % 3].style = "";
        galleryIdx = ((galleryIdx + 1) % 3) + 3 * current_view;
        gallery_graphs.children[galleryIdx].style = "display:block";
        gallery_dots.children[galleryIdx % 3].style = "background:var(--green-background);";
    }
    function previous() {
        if (gallery_graphs == null) {
            gallery_graphs = document.querySelector("#gallery_container");
        }
        if (gallery_dots == null) {
            gallery_dots = document.querySelector("#gallery_dots");
        }
        gallery_graphs.children[galleryIdx].style = "";
        gallery_dots.children[galleryIdx % 3].style = "";
        galleryIdx = ((galleryIdx + 2) % 3) + 3 * current_view;
        gallery_graphs.children[galleryIdx].style = "display:block";
        gallery_dots.children[galleryIdx % 3].style = "background:var(--green-background);";
    }
    function updateView() {
        if (gallery_graphs == null) {
            gallery_graphs = document.querySelector("#gallery_container");
        }
        if (gallery_dots == null) {
            gallery_dots = document.querySelector("#gallery_dots");
        }
        current_view = current_view ^ 1;
        gallery_graphs.children[galleryIdx].style = "";
        gallery_dots.children[galleryIdx % 3].style = "";
        galleryIdx = (current_view)? galleryIdx + 3 : galleryIdx - 3;
        gallery_graphs.children[galleryIdx].style = "display:block";
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
                                <div>
                                    <select className={styles.gallery_type_select} onChange={updateView}>
                                        <option value="0">Group</option>
                                        <option value="1">Me</option>
                                    </select>
                                    <button onClick={previous}>previous</button>
                                    <button onClick={advance}>next</button>
                                </div>
                                <p></p>
                            </div>
                            <div className={styles.gallery_container} id="gallery_container">
                                <div className={styles.gallery_item_wrapper} style={ {display : "block"} }>
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
                                            <Area type="monotone" dataKey="uv" stroke="var(--green-background)" fill="var(--green-background)" />
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
                                            <Area type="monotone" dataKey="amt" stroke="var(--green-background)" fill="var(--green-background)" />
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
                                            <Area type="monotone" dataKey="pv" stroke="var(--green-background)" fill="var(--green-background)" />
                                        </AreaChart>
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