import React from "react";
import './Home.css'
import axios from "axios/index";
import YoutubeIFrame from "../../Components/YoutubeIFrame";
import Loader from "../../Components/Loader";
import Chart from "chart.js";
import LanguageSelector from "../../Components/LanguageSelector";
import {StartBanner} from "../../Components/StartBanner";
import {RedOutlineButton} from "../../Components/RedOutlineButton";
import Dictaphone from "../../Components/Dictaphone";
import {SimilarWords} from "../../Components/SimilarWords";
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition'
import {GenerateQuiz} from "../../Components/GenerateQuiz";

const _ = require('lodash');
const punctuator = require('punctuator');
const pos = require('pos');


const Home = () => {

    const [token, setToken] = React.useState("");
    const [matchedCaptions, setMatchedCaptions] = React.useState([]);
    const [keyMatchedCaptions, setKeyMatchedCaptions] = React.useState([]);
    const [captions, setCaptions] = React.useState([]);
    const [url, setUrl] = React.useState("");
    const [videoId, setVideoId] = React.useState("");
    const [phrase, setPhrase] = React.useState("");
    const [topics, setTopics] = React.useState([]);
    const [transcript, setTranscript] = React.useState("");
    const [startTime, setStartTime] = React.useState(0);
    const [keyNotes, setKeyNotes] = React.useState([]);
    const [summary, setSummary] = React.useState([]);
    const [quiz, setQuiz] = React.useState([]);
    const [matchedCaptionFound, setMatchedCaptionFound] = React.useState(true);
    const [keyMatchedCaptionFound, setKeyMatchedCaptionFound] = React.useState(true);
    const [langValue, setLangValue] = React.useState(-1);

    const [vis1, setVis1] = React.useState(false);
    const [vis2, setVis2] = React.useState(false);
    const [vis3, setVis3] = React.useState(false);
    const [vis4, setVis4] = React.useState(false);
    const [vis5, setVis5] = React.useState(false);
    const [loader, setLoader] = React.useState(false);
    const [summaryLoader, setSummaryLoader] = React.useState(false);
    const [spLoader, setSpLoader] = React.useState(false);
    const [knLoader, setKnLoader] = React.useState(false);
    const [saLoader, setSaLoader] = React.useState(false);
    const [quizLoader, setQuizLoader] = React.useState(false);
    const [phraseAutoArray, setPhraseAutoArray] = React.useState([]);
    const [overallSentiment, setOverallSentiment] = React.useState(0);
    const [speech, setSpeech] = React.useState("");


    const baseURL = "https://nlapi.expert.ai";
    const language = "en";

    const getToken = async () => {

        let obj = JSON.parse(localStorage.getItem("key"));
        const time_spend = (new Date().getTime() - obj?.timestamp) /1000;
        if (obj === null ||  time_spend > 3600) {
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
        } else{
            setToken(obj.token);
            return obj.token;
        }
    }

    const getTranscriptHandler = async () => {
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            setVideoId(match[2]);
            setLoader(true);
            axios.get(`https://ytb-api.azurewebsites.net/api/ytb-t01?video_id=${match[2]}`)
                .then(async res => {
                    setLoader(false)
                    const tempTranscript = punctuator.punctuate(res.data.summary);
                    await setTranscript(tempTranscript);
                    setCaptions(res.data.transcripts);
                    getKeyElements(tempTranscript).then(data => {
                        console.log(data);
                        let topics = [];
                        data['topics'].forEach(topic => {
                            topics.push(topic.label);
                        });
                        setTopics(topics.slice(0, 4));
                        setSummary(data['mainSentences']);
                        setKeyNotes(data['mainLemmas']);
                        setQuiz([]);
                    });
                })
                .catch(err => {
                    console.error(err);
                    setLoader(false);
                });
        } else {
            alert("Invalid URL");
            setVideoId("");
        }
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
                    captions.forEach(caption => {
                        for (let i = 0; i < arr.length; i++) {
                            if (_.includes(caption.text, arr[i].lemma.replace("_", " "))) {
                                matches.push({...caption, matchedPhrase: arr[i].lemma});
                                break;
                            }
                        }
                    });
                    setKeyMatchedCaptions(matches);
                    setKeyMatchedCaptionFound(matches.length > 0);
                }).catch(err => console.log(err));
        });
    };
    const searchPhraseHandler = async () => {
        let englishLangPhrase = phrase.trim() || speech.trim();
        if (englishLangPhrase.length === 0) {
            setMatchedCaptionFound(englishLangPhrase.length > 0);
            return;
        }
        setSpeech("");
        setPhrase("");
        setSpLoader(true);
        const lemmas = [englishLangPhrase];
        const data = await getKeyElements(englishLangPhrase);
        data['mainLemmas'].forEach(lemma => {
            if (lemma.value !== englishLangPhrase) lemmas.push(lemma.value);
        });
        let matches = [];
        const similar_words = await SimilarWords([lemmas[0]]) || {};
        setSpLoader(false);
        let arr = [...similar_words[lemmas[0]].synms, ...lemmas];
        captions.forEach(caption => {
            for (let i = 0; i < arr.length; i++) {
                if (_.includes(caption.text, arr[i].replace("_", " "))) {
                    matches.push({...caption, matchedPhrase: arr[i]});
                    break;
                }
            }
        });
        setMatchedCaptions(matches);
        setMatchedCaptionFound(matches.length > 0);
    };

    const getSentimentAnalysis = () => {
        setSaLoader(true);
        axios.get(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&order=relevance&videoId=${videoId}&key=AIzaSyApX3bSpv8b3y1PEiA29VYI5jh1ZEyd7EQ`)
            .then(res => {
                let comments = "";
                let commentObjs = res.data.items;
                console.log(commentObjs)
                commentObjs.forEach(comObj => {
                    comments += comObj.snippet.topLevelComment.snippet.textDisplay + " "
                });
                getToken().then(t => {
                    const payload = {
                        document: {
                            text: comments
                        }
                    }
                    const headers = {
                        "accept": "application/json",
                        "Authorization": t,
                        "Content-Type": "application/json; charset=utf-8"
                    }
                    axios.post(`${baseURL}/v2/analyze/standard/${language}/sentiment`, payload, {headers: headers})
                        .then(r => {
                            setSaLoader(false);
                            let sentiment = r.data.data.sentiment;
                            let sentimentsArray = sentiment.items;
                            setOverallSentiment(sentiment.overall);
                            console.log(sentimentsArray)
                            let chartData = [
                                _.meanBy(_.filter(sentimentsArray, o => o.sentiment < -8), o => o.sentiment),
                                _.meanBy(_.filter(sentimentsArray, o => o.sentiment < 0 && o.sentiment >= -8), o => o.sentiment),
                                _.meanBy(_.filter(sentimentsArray, o => o.sentiment < 3 && o.sentiment >= 0), o => o.sentiment),
                                _.meanBy(_.filter(sentimentsArray, o => o.sentiment < 8 && o.sentiment >= 3), o => o.sentiment),
                                _.meanBy(_.filter(sentimentsArray, o => o.sentiment >= 8), o => o.sentiment)
                            ]
                            const ctx = document.getElementById("sa-chart");
                            new Chart(ctx, {
                                type: "pie",
                                data: {
                                    labels: ["Don't even think about it", "Not Good", "Okaish", "Good", "Awesome"],
                                    datasets: [
                                        {
                                            label: "# of Votes",
                                            data: chartData,
                                            backgroundColor: [
                                                "#cfcece",
                                                "#f3e5ea",
                                                "#fdaac8",
                                                "#F9679C",
                                                "#ff0560"
                                            ],
                                            borderColor: ["Dont even think about it", "Not Good", "Okaish", "Good", "Awesome"],
                                            borderWidth: 1
                                        }
                                    ]
                                }
                            });
                        })
                        .catch(er => console.error(er));
                }).catch(err => console.error(err));
            }).catch(err => console.error(err));
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

    const getQuiz = async () => {

        if (quiz.length > 0) return;
        setQuizLoader(true);

        let questions = await getToken().then(async t => {
            return await GenerateQuiz(transcript, keyNotes, t);
        });
        await setQuiz(questions);
        setQuizLoader(false);
    };

    const update = (vis) => {
        setVis1(false);
        setVis2(false);
        setVis3(false);
        setVis4(false);
        setVis5(false);
        switch (vis) {
            case 1:
                setVis1(true);
                break;
            case 2:
                setVis2(true);
                break;
            case 3:
                setVis3(true);
                break;
            case 4:
                setVis4(true);
                break;
            case 5:
                setVis5(true);
                break;
        }

    };
    const handleSpeech = (res) => {
        setSpeech(res);
    }

    return (<div>
        <StartBanner/>
        <div className="container transcript" id="getstarted">
            <div className="text-centre"><h1 className="color-dark">Get Started</h1></div>
            <div className="row">
                <div className="col-md-6">
                    <div className="inner">
                        <label itemID="youtubeUrl">Youtube URL *</label>
                        <input className="input" type="url" name="Youtube Url" id="youtubeUrl" value={url}
                               placeholder="Enter Youtube URL"
                               onChange={(e) => setUrl(e.target.value)}/>
                        <button type="submit" className="button button-v2" onClick={getTranscriptHandler}>Get Video
                        </button>
                        {loader ? <Loader/> : ""}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="grid-item">
                        <header className="App-header">
                            {videoId.length === 11 ?
                                <YoutubeIFrame videoId={videoId} startTimeInSeconds={Math.floor(startTime)}/> :
                                <div className="dummy"/>}
                        </header>
                    </div>
                    {topics.length > 0 ? topics.map(topic => <div style={{"display": "inline-table"}}><span
                        className="button button-v4 button-sm">#{topic}</span></div>) : ""}
                </div>
            </div>
            {videoId.length > 0 && transcript.length > 0 ?
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
                                <RedOutlineButton onClick={() => {
                                    update(3)
                                }}> Search Phrase
                                </RedOutlineButton>
                            </div>
                            <div className="inline">
                                {transcript.length > 0 ?
                                    <RedOutlineButton onClick={() => {
                                        update(1);
                                    }}>Get Summary</RedOutlineButton> : null}
                            </div>
                            <div className="inline">
                                <RedOutlineButton
                                    onClick={() => {
                                        getQuiz();
                                        update(5)
                                    }}>Generate Quiz
                                </RedOutlineButton>
                            </div>
                            <div className="inline">
                                <RedOutlineButton
                                    onClick={() => {
                                        getSentimentAnalysis();
                                        update(4)
                                    }}>Analyse
                                    Sentiment
                                </RedOutlineButton>
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
                                            onClick={() => setStartTime(c.start)}
                                            type="submit">{c.matchedPhrase} - {c.start}</button>
                                </div>)}
                                {!keyMatchedCaptionFound ? "Try with a different phrase" : null}
                            </div> : ""
                        }
                        {vis3 ?
                            <div className="col-md-12">
                                <div>
                                    <h2>Search Phrase</h2>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label itemID="phrase">Phrase *</label>
                                            <input className="input" type="text" name="Phrase"
                                                   id="phrase"
                                                   value={phrase}
                                                   placeholder="Enter Phrase"
                                                   onChange={(e) => setPhrase(e.target.value)}/>
                                        </div>
                                        {/*<div className="col-md-6">*/}
                                        {/*    <LanguageSelector langValue={langValue} setLangValue={(v) => {*/}
                                        {/*        setLangValue(parseInt(v));*/}
                                        {/*    }}/>*/}
                                        {/*</div>*/}
                                        <div className="col-md-6">
                                            <label itemID="phrase">Try Speaking Instead</label>
                                            <Dictaphone handleSpeech={handleSpeech}></Dictaphone>
                                        </div>
                                        <div className="col-md-12">
                                            <button className="button button-v2" type="submit"
                                                    onClick={searchPhraseHandler}>Search
                                            </button>
                                        </div>
                                    </div>
                                    {spLoader ? <Loader/> : ""}
                                    {matchedCaptions.map(c => <div style={{"display": "inline-table"}}>
                                        <button className="button button-v3 button-sm"
                                                onClick={() => setStartTime(c.start)}
                                                type="submit">{c.matchedPhrase} - {c.start}</button>
                                    </div>)}
                                    {!matchedCaptionFound ? "Try with a different phrase" : null}
                                </div>
                            </div> : ""
                        }
                        {vis4 ?
                            <div className="col-md-12">
                                <h2>Sentimental Analysis</h2>
                                {saLoader ? <Loader/> : ""}
                                <div className={"row"}>
                                    <div className={"col-md-7"}>
                                        <canvas id="sa-chart"/>
                                    </div>
                                    <div className={"col-md-5"}>
                                        <h4 className={"text-centre"}>Overall Sentiment</h4>
                                        <p className={"fontsize-lg text-centre color-primary sentiment-score"}>{overallSentiment}</p>
                                        <p className={"fontsize-xs text-right"}>-100 Most Negative <br/> 100 Most
                                            Positive</p>
                                    </div>
                                </div>
                            </div> : ""
                        }
                        {vis5 ?
                            <div className="col-md-12">
                                <h2>Quiz</h2>
                                {quizLoader ? <Loader/> : ""}
                                <ol>
                                    {quiz.length > 0 ? quiz.map(q => (<li>
                                        <h4 className="color-primary fontsize-sm">{q?.sentence}</h4>
                                        <ol>
                                            {q?.options.map(o => <li onClick={(o) => {
                                                if (o.target.outerText.toLowerCase() === q.answer.toLowerCase() ) {
                                                    document.getElementById(q.answer).innerHTML = 'Your Answer is Correct'
                                                } else document.getElementById(q.answer).innerHTML = 'Incorrect Answer'
                                            }
                                            } className="color-dark fontsize-sm option"
                                                                     style={{"text-transform": "capitalize"}}>{o}</li>)}
                                        </ol>
                                        <p id={q.answer} className="color-primary"/>
                                    </li>)) : "Generating Quiz..."}
                                </ol>
                            </div> : ""
                        }

                    </div>
                </div>
                : ""}
        </div>
    </div>)

};

export default Home;
