import React from "react";

export const StartBanner = () =>
    <div id="home">
        <div className="container fullheight home">
            <div className="row">
                <div className="col-md-6 col-md-offset-3 col-xs-12">
                    <h1 className="color-primary"><b>Stealth AI</b></h1>
                    <p className="color-dark fontsize-md">
                        <span className="color-dark fontsize-md"><i><b>Learning made efficient</b></i></span> <br/>
                        A NLP tool for remove those hassles of finding the most relevant content in the videos and documents.
                    </p>
                    <div style={{"display": "inline-table"}}>
                         <a href="#getstarted" className="button button-v2">Get Started</a>
                    </div>
                </div>
            </div>
        </div>
    </div>;