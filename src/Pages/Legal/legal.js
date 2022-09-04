import React from "react";
import axios from "axios/index";
import Loader from "../../Components/Loader";
import './legal.css'
import {RedOutlineButton} from "../../Components/RedOutlineButton";
import Dictaphone from "../../Components/Dictaphone";
import {SimilarWords} from "../../Components/SimilarWords";
import {GenerateQuiz} from "../../Components/GenerateQuiz";

const _ = require('lodash');
const punctuator = require('punctuator');
const pos = require('pos');
const baseURL = "https://nlapi.expert.ai";
const language = "en";
const Legal = () => {
    const [transcript, setTranscript] = React.useState("");
    const [token, setToken] = React.useState("");
    const [keyMatchedCaptions, setKeyMatchedCaptions] = React.useState([]);
    const [captions, setCaptions] = React.useState([]);
    const [topics, setTopics] = React.useState([]);
    const [keyNotes, setKeyNotes] = React.useState([]);
    const [summary, setSummary] = React.useState([]);
    const [keyMatchedCaptionFound, setKeyMatchedCaptionFound] = React.useState(true);
    const [vis1, setVis1] = React.useState(false);
    const [vis2, setVis2] = React.useState(false);
    const [loader, setLoader] = React.useState(false);
    const [summaryLoader, setSummaryLoader] = React.useState(false);
    const [knLoader, setKnLoader] = React.useState(false);

    const showFile = async (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => {
            let text = (e.target.result);
            text = text.replace(/\r?\n|\r/g, " ");
            text = text.split('"').join('');
            console.log(text);
            setCaptions(text);
            setTranscript(text);
        };
        reader.readAsText(e.target.files[0]);
    }

    const zoomHandler = () => {
        setLoader(true);
        const payload = {
            text: transcript,
            word_count: 500
        }
        const headers = {
            "accept": "application/json",
            "Content-Type": "application/json; charset=utf-8"
        }
        axios.post(`https://ytb-api.azurewebsites.net/api/ytb-summary-01`, payload, {headers: headers})
            .then(res => {
                console.log(res);
                if (res.data !== null) {
                    setTranscript(res.data['summary']);
                    getKeyElements(res.data['summary']).then(data => {
                        console.log(data);
                        setLoader(false);
                        let topics = [];
                        data['topics'].forEach(topic => {
                            topics.push(topic.label);
                        });
                        setTopics(topics.slice(0, 4));
                        setSummary(data['mainSentences']);
                        setKeyNotes(data['mainLemmas']);
                    });
                }
            }).catch(err => console.log(err));
    }
    const getToken = async () => {

        let obj = JSON.parse(localStorage.getItem("key"));
        const time_spend = (new Date().getTime() - obj?.timestamp) / 1000;
        if (obj === null || time_spend > 3600) {
            return axios.post(`https://developer.expert.ai/oauth2/token/`, {
                "username": "sagarbansal099@gmail.com",
                "password": "h2kvK9hNHJVj!E2"
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(async res => {
                if (res.status === 200) {
                    const t = "Bearer " + res.data
                    await setToken(t);
                    var object = {token: t, timestamp: new Date().getTime()}
                    localStorage.setItem("key", JSON.stringify(object));
                    return t;
                }
            });
        } else {
            setToken(obj.token);
            return obj.token;
        }
    }
    const getKeyNotes = () => {
        setKnLoader(true);
        getToken().then(t => {
            const payload = {
                document: {
                    text: transcript
                }
            }
            const headers = {
                "accept": "application/json",
                "Authorization": t,
                "Content-Type": "application/json; charset=utf-8"
            }
            axios.post(`${baseURL}/v2/analyze/standard/${language}/entities`, payload, {headers: headers})
                .then(res => {
                    setKnLoader(false);
                    let arr = res.data['data']['entities'];
                    const matches = []
                    for (let i = 0; i < arr.length; i++) {
                        matches.push(arr[i].lemma)
                        // if (_.includes(transcript, arr[i].lemma.replace("_", " "))) {
                        //     matches.push({...transcript, matchedPhrase: arr[i].lemma});
                        //     break;
                        // }
                    }
                    setKeyMatchedCaptions(matches);
                    setKeyMatchedCaptionFound(matches.length > 0);
                }).catch(err => console.log(err));
        });
    };

    const getSummary = () => {
        summary.sort((a, b) => {
            if (a.start >= b.start) return 1;
            else return -1;
        });
        let prev = 0;
        let html = [];
        for (let s in summary) {
            const start = summary[s]['start'];
            const end = summary[s]['end'];
            html.push(<span>
                <span>{transcript.substring(prev, start)}</span>
                <br/>
                <span className={'highlight'}>{transcript.substring(start, end)}</span>
            </span>);
            prev = end;
        }
        html.push(<span>{transcript.substring(prev)}</span>);
        return <div>{html}</div>;
    };

    const getKeyElements = async (transcript) => {
        return getToken().then(t => {
            const payload = {
                document: {
                    text: transcript
                }
            }
            const headers = {
                "accept": "application/json",
                "Authorization": t,
                "Content-Type": "application/json; charset=utf-8"
            }
            return axios.post(`${baseURL}/v2/analyze/standard/${language}/relevants`, payload, {headers: headers})
                .then(res => {
                    return res.data['data'];
                }).catch(err => console.log(err));
        });
    }

    const update = (vis) => {
        setVis1(false);
        setVis2(false);
        switch (vis) {
            case 1:
                setVis1(true);
                break;
            case 2:
                setVis2(true);
                break;
        }

    };

    return (<div>
        <div className="container transcript">
            <div className="text-centre"><h1 className="color-dark">Get Started</h1></div>
            <div className="row">
                <div className="col-md-6">
                    <div className="inner">
                        <label itemID="youtubeUrl">Legal Document *</label>
                        <input className="input" type="file" name="Zoom Transcript" id="youtubeUrl"
                               placeholder="Select Zoom Transcript"
                               onChange={async (e) => {
                                   await showFile(e);
                               }}/>
                        <button type="submit" className="button button-v2" onClick={zoomHandler}>Get Started</button>
                        {loader ? <Loader/> : ""}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="grid-item">
                        <header className="App-header">
                            {captions.length > 0 ?
                                <div className="transcript-legal">
                                    <p>{captions}</p>
                                </div> :
                                <div className="dummy-legal"/>}
                        </header>
                    </div>
                    {topics.length > 0 ? topics.map(topic => <div style={{"display": "inline-table"}}><span
                        className="button button-v4 button-sm">#{topic}</span></div>) : ""}
                </div>
            </div>
            {captions.length > 0 && transcript.length > 0 && topics.length > 0 ?
                <div>
                    <div className="row" style={{"margin-bottom": "40px"}}>
                        <h3 className="fontsize-md color-dark">Select Any</h3>
                        <div className="col-md-8">
                            <div className="inline">
                                {transcript.length > 0 ?
                                    <RedOutlineButton onClick={() => {
                                        getKeyNotes();
                                        update(2)
                                    }}>
                                        Key Notes</RedOutlineButton> : null}

                            </div>
                            <div className="inline">
                                {transcript.length > 0 ?
                                    <RedOutlineButton onClick={() => {
                                        update(1);
                                    }}>Get Summary</RedOutlineButton> : null}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {vis1 ?
                            <div className="col-md-12">
                                <h2>Summary</h2>
                                {summaryLoader ? <Loader/> : ""}
                                {transcript.length > 0 ? <span>{getSummary()}</span> : ""}
                            </div>
                            : ""}
                        {vis2 ?
                            <div className="col-md-12">
                                <h2>Key Notes</h2>
                                {knLoader ? <Loader/> : ""}
                                {keyMatchedCaptions.map(c => <div style={{"display": "inline-table"}}>
                                    <button className="button button-v3 button-sm"
                                            type="submit">{c}</button>
                                </div>)}
                                {!keyMatchedCaptionFound ? "Try with a different phrase" : null}
                            </div> : ""
                        }

                    </div>
                </div>
                : ""}
        </div>
    </div>)
}
export default Legal;