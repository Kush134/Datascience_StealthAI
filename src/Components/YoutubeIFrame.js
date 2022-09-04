import React from 'react';

const YoutubeIFrame = (props) => {
    const {videoId, startTimeInSeconds} = props;
    return (
        <iframe title="Hackcelerrate" width="100%" height="315" src={`https://www.youtube.com/embed/${videoId}?start=${startTimeInSeconds}&autoplay=1`}
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
                allowFullScreen/>)
};

export default YoutubeIFrame;
