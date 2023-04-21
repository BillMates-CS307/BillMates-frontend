//Global HTML Imports
import styles from '@/styles/Group.module.css'
import Header, { HEADER_PATHS } from '../../global_components/groups_header.jsx'
import Footer from '../../global_components/footer_no_plus.jsx'
import CustomHead from '../../global_components/head.jsx'
import LoadingCircle from '../../global_components/loading_circle.jsx';

import { group_methods } from '@/lambda_service/groupService.js';
import { user_methods } from '@/lambda_service/userService.js';

//React and Redux stuff
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router.js';


//Recharts items
import {
    CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend,
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

//SHOW ANALYTICS HERE

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
    const [userLineGraph, setUserLineGraph] = useState([]);
    const [userBarGraph, setUserBarGraph] = useState([]);
    const [userPieChart, setUserPieChart] = useState([]);
    const [userPieLabel, setUserPieLabel] = useState(false);

    const [groupLineGraph, setGroupLineGraph] = useState([]);
    const [groupBarGraph, setGroupBarGraph] = useState([]);
    const [groupPieChart, setGroupPieChart] = useState([]);
    const [groupPieLabel, setGroupPieLabel] = useState(false);

    const [warningPopup, setWarningPopup] = useState(null);
    const [current_view, setCurrentView] = useState(0);
    const [galleryIdx, setGalleryIdx] = useState(0);


    useEffect(() => {
        if (isAuthenticated) {
            fetchData(); //make the call
        }
    }, [isAuthenticated]);

    const matchedGroupId = (isAuthenticated) ? window.location.href.match('(groups)\/[a-zA-z\-0-9]+')[0] : null;
    const groupId = (matchedGroupId) ? matchedGroupId.substring(7) : null;
    const userId = (isAuthenticated) ? localStorage.getItem("tempId") : null;
    const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#AF19FF", "#000"];
    var gallery_graphs = null;
    var gallery_dots = null;
    var gallery_heading = null;

    const graph_names = [
        "Group requests throughout the year", "Group relative debts", "Group expenses by tag",
        "My requests through the year", "My relative debts", "My expenses by tag"
    ];

    const fetchData = async () => {
        console.log("fetching data");
        let response = await group_methods.getAnalytics(userId, groupId);
        if (response.errorType) {
            console.log("An error occured, check logs");
            return;
        } else if (response.success) {
            //parse the data for the individual user
            console.log(response);
            let userLG = [],
                userBG = [],
                userPC = [];
            for (let month in response.data[userId].month) {
                userLG.push({
                    month: month,
                    num: response.data[userId].month[month]
                });
            }
            let userHasData = false;
            for (let tag in response.data[userId].tags) {
                userPC.push({
                    tag: tag,
                    amt: response.data[userId].tags[tag]
                });
                if (response.data[userId].tags[tag] != 0) {
                    userHasData = true;
                }
            }
            for (let person in response.data.expense_relations) {
                userBG.push({
                    name: response.data.email_map[person],
                    amt: Math.abs(response.data.expense_relations[person]).toFixed(2),
                    isNeg: response.data.expense_relations[person] < 0
                });
            }

            let groupLG = JSON.parse(JSON.stringify(userLG)),
                groupBG = [],
                groupPC = JSON.parse(JSON.stringify(userPC)),
                i = 0;
            //have to move after bc group still could have data
            if (!userHasData) {
                userPC = [{ tag: "No Data", amt: 0.001 }];
                userBG = [{name : "No Data", amt : 0}];
            }

            let groupHasData = userHasData;
            for (let user in response.data) {
                if (user == "expense_relations" || user == "user_totals" || user == "email_map") { //this is the bar graph data
                    continue;
                }
                if (user != userId) {
                    for (let month in response.data[user].month) {
                        groupLG[i++].num += response.data[user].month[month];
                    }
                    i = 0;
                    for (let tag in response.data[user].tags) {
                        console.log("tag data : " + response.data[user].tags[tag]);
                        groupPC[i++].amt += response.data[user].tags[tag];
                        if (parseFloat(response.data[user].tags[tag]) != 0) {
                            groupHasData = true;
                        }
                    }
                    i = 0;
                }
            }
            if (!groupHasData) {
                groupPC = [{ tag: "No Data", amt: 0.001 }];
            }

            for (let person in response.data.user_totals) {
                groupBG.push({
                    name: response.data.email_map[person],
                    amt: Math.abs(response.data.user_totals[person]).toFixed(2),
                    isNeg: response.data.user_totals[person] < 0
                });
            }

            setUserLineGraph(userLG);
            setUserBarGraph(userBG);
            setUserPieChart(userPC);
            setUserPieLabel(userHasData);

            setGroupLineGraph(groupLG);
            setGroupBarGraph(groupBG);
            setGroupPieChart(groupPC);
            setGroupPieLabel(groupHasData);
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
        let gi = ((galleryIdx + 1) % 3) + 3 * current_view;
        gallery_graphs.children[gi].style = "display:block";
        gallery_heading.children[1].textContent = graph_names[gi];
        gallery_dots.children[gi % 3].style = "background:var(--green-background);";

        setGalleryIdx(gi);
    }
    function previous() {
        if (gallery_graphs == null) {
            gallery_graphs = document.querySelector("#gallery_container");
            gallery_heading = document.querySelector("#gallery_heading");
            gallery_dots = document.querySelector("#gallery_dots");
        }
        gallery_graphs.children[galleryIdx].style = "";
        gallery_dots.children[galleryIdx % 3].style = "";
        let gi = ((galleryIdx + 2) % 3) + 3 * current_view;
        gallery_graphs.children[gi].style = "display:block";
        gallery_heading.children[1].textContent = graph_names[gi];
        gallery_dots.children[gi % 3].style = "background:var(--green-background);";

        setGalleryIdx(gi);
    }
    function updateView() {
        if (gallery_graphs == null) {
            gallery_graphs = document.querySelector("#gallery_container");
            gallery_heading = document.querySelector("#gallery_heading");
            gallery_dots = document.querySelector("#gallery_dots");
        }
        let cw = current_view ^ 1;
        gallery_graphs.children[galleryIdx].style = "";
        gallery_dots.children[galleryIdx % 3].style = "";
        let gi = (cw) ? galleryIdx + 3 : galleryIdx - 3;
        gallery_graphs.children[gi].style = "display:block";
        gallery_heading.children[1].textContent = graph_names[gi];
        gallery_dots.children[gi % 3].style = "background:var(--green-background);";

        setCurrentView(cw);
        setGalleryIdx(gi);
    }
    function isGroupManager() {
        return true; //TODO: fix this
    }
    function exportData() {
        console.log(galleryIdx);
        let sum = 0;
        let name = "";
        let responseData = {};
        switch (galleryIdx) {
            case  0:
                name = "group_requests";
                responseData = {
                    "group_requests_yearly": groupLineGraph
                }
                for (let item of groupLineGraph) {
                    sum += item.num;
                }
                break;
            case  1:
                name = "group_balances";
                responseData = {
                    "group_relative_balances": groupBarGraph
                }
                for (let item of groupBarGraph) {
                    sum += parseFloat(item.amt);
                }
                break;
            case  2:
                name = "group_tags";
                responseData = {
                    "group_relative_tag": groupPieChart
                }
                for (let item of groupPieChart) {
                    sum += parseFloat(item.amt.toFixed(2));
                }
                break;
            case  3:
                name = "my_requests";
                responseData = {
                    "my_requests_yearly": userLineGraph
                }
                for (let item of userLineGraph) {
                    sum += item.num;
                }
                break;
            case  4:
                name = "my_balances";
                responseData = {
                    "my_relative_balances": userBarGraph
                }
                console.log(userBarGraph);
                for (let item of userBarGraph) {
                    sum += parseFloat(item.amt);
                }
                break;
            case  5:
                name = "my_tags";
                responseData = {
                    "my_requests_tag": userPieChart
                }
                for (let item of userPieChart) {
                    sum += parseFloat(item.amt.toFixed(2));
                }
                break;
        }
        console.log(sum);
        if (sum == 0) { //only occurs if there are no expense requests ever created
            setWarningPopup(["There is no data to download", 1.5]);
            return;
        }
        // let responseData = {
        //     "my_requests_yearly": userLineGraph,
        //     "my_relative_balances": userBarGraph,
        //     "my_requests_tag": userPieChart,
        //     "group_requests_yearly": groupLineGraph,
        //     "group_relative_balances": groupBarGraph,
        //     "group_relative_tag": groupPieChart
        // }
        const fileData = JSON.stringify(responseData);
        const blob = new Blob([fileData], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = groupId + "-" + name + "-analytics.json";
        link.href = url;
        link.click();
    }

    if (isAuthenticated) {
        return (
            <>
                <CustomHead title={"Analytics"} description={"Your group analytics"}></CustomHead>
                <Header loading={loading} selected={HEADER_PATHS.GROUP | HEADER_PATHS.CALENDAR | HEADER_PATHS.SETTINGS | HEADER_PATHS.SHOPPINGLIST | HEADER_PATHS.RECURRING}
                    getManagerStatus={isGroupManager} groupPath={window.location.href.match(".+?(?=\/analytics)")[0]}></Header>
                <main>
                    {(loading) ?
                        <LoadingCircle additionalStyles={{ margin: "15px auto" }}></LoadingCircle>
                        :
                        <>
                            <div className={styles.gallery_graphs_container}>
                                <div className={styles.gallery_heading} id="gallery_heading">
                                    <div className={styles.gallery_arrows_type_container}>
                                        <select className={styles.gallery_type_select} onChange={updateView}>
                                            <option value="0">Group Analytics</option>
                                            <option value="1">My Analytics</option>
                                        </select>
                                        <button onClick={exportData} className={styles.download_data}>Download</button>
                                        <button onClick={previous} className={styles.arrow + " " + styles.left}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                <path fill='currentColor' d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                                            </svg>
                                        </button>
                                        <button onClick={advance} className={styles.arrow}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                <path fill='currentColor' d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p style={{ textAlign: 'center', color: 'var(--main-background-font-color)' }}>Group requests throughout the year</p>
                                </div>
                                <div className={styles.gallery_container} id="gallery_container">
                                    <div className={styles.gallery_item_wrapper} style={{ display: "block" }}>
                                        <ResponsiveContainer>
                                            <LineChart data={groupLineGraph}>
                                                <CartesianGrid strokeDasharray="3 3" stroke='var(--dark-neutral-background)' />
                                                <XAxis dataKey="month" stroke='var(--main-background-font-color)'
                                                    minTickGap={-200}
                                                    hide={true}
                                                />
                                                <YAxis stroke='var(--main-background-font-color)' allowDecimals={false} width={40} />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="num" stroke="var(--green-background)" strokeWidth={3} />

                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className={styles.gallery_item_wrapper}>
                                        <ResponsiveContainer>
                                            <BarChart data={groupBarGraph}>
                                                <CartesianGrid strokeDasharray="3 3" stroke='var(--dark-neutral-background)' />
                                                <XAxis dataKey="name" stroke='var(--main-background-font-color)' hide={true} />
                                                <YAxis stroke='var(--main-background-font-color)'
                                                    dataKey={(v) => { return parseFloat(v.amt) }}
                                                    domain={[0, 'auto']}
                                                    tickCount={6}
                                                />
                                                <Tooltip />
                                                <Bar type="monotone" dataKey="amt" fill="var(--green-background)">
                                                    {groupBarGraph.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={(groupPieLabel) ? ((groupBarGraph[index].isNeg) ? "var(--red-background)" : "var(--green-background)")
                                                                : "var(--dark-neutral-background)"}

                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className={styles.gallery_item_wrapper}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Legend></Legend>
                                                <Pie
                                                    data={groupPieChart}
                                                    color="#000000"
                                                    dataKey="amt"
                                                    nameKey="tag"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={120}
                                                    fill="#8884d8"
                                                    label={ (groupPieChart)? (v) => {return v.amt.toFixed(2)} : false  }
                                                    
                                                    animationBegin={0}
                                                    animationDuration={750}
                                                >
                                                    {groupPieChart.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={(groupPieLabel) ? COLORS[index % COLORS.length] : "var(--dark-neutral-background)"}
                                                        />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className={styles.gallery_item_wrapper}>
                                        <ResponsiveContainer>
                                            <LineChart data={userLineGraph}>
                                                <CartesianGrid strokeDasharray="3" stroke='var(--dark-neutral-background)' />
                                                <XAxis stroke='var(--main-background-font-color)' dataKey="month"
                                                    minTickGap={-200}
                                                    hide={true} />
                                                <YAxis stroke='var(--main-background-font-color)' allowDecimals={false} />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="num" stroke="var(--green-background)" strokeWidth={3} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className={styles.gallery_item_wrapper}>
                                        <ResponsiveContainer>
                                            <BarChart data={userBarGraph}>
                                                <   CartesianGrid strokeDasharray="3 3" stroke='var(--dark-neutral-background)' />
                                                <XAxis dataKey="name" stroke='var(--main-background-font-color)' hide={true} />
                                                <YAxis stroke='var(--main-background-font-color)'
                                                    dataKey={(v) => { return parseFloat(v.amt) }}
                                                    domain={[0, 'auto']}
                                                    tickCount={6}
                                                />

                                                <Tooltip />
                                                <Bar type="monotone" dataKey="amt" fill="var(--green-background)">
                                                    {userBarGraph.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={(groupPieLabel) ? (userBarGraph[index].isNeg) ? "var(--red-background)" : "var(--green-background)"
                                                                : "var(--dark-neutral-background)"}

                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className={styles.gallery_item_wrapper}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Legend></Legend>
                                                <Pie
                                                    data={userPieChart}
                                                    color="#000000"
                                                    dataKey="amt"
                                                    nameKey="tag"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={120}
                                                    fill="#8884d8"
                                                    label={ (groupPieChart)? (v) => {return v.amt.toFixed(2)} : false  }
                                                    animationBegin={0}
                                                    animationDuration={750}
                                                >
                                                    {userPieChart.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={(userPieLabel) ? COLORS[index % COLORS.length] : "var(--dark-neutral-background)"}
                                                        />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.gallery_dots} id="gallery_dots">
                                <span style={{ background: "var(--green-background)" }}></span>
                                <span></span>
                                <span></span>
                            </div>
                        </>
                    }
                </main>

                {(warningPopup != null) ?
                    <>
                        <div className={styles.transaction_background} style={{ background: "transparent" }}>
                            <div className={styles.warningPopup} style={{ animation: "popup " + warningPopup[1] + "s ease-in forwards" }}>
                                <p>{warningPopup[0]}</p>
                            </div>
                            <div style={{ display: "none" }}>
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