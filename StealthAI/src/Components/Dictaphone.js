import React from 'react'
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition'

const Dictaphone = ({handleSpeech}) => {
    const {transcript, resetTranscript} = useSpeechRecognition();
    handleSpeech(transcript);
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null
    }

    return (
        <div>
            <div>
                <button style={{"display": "inline-table"}} className="button button-v3 button-sm" onClick={SpeechRecognition.startListening}>Speak</button>
                <button style={{"display": "inline-table"}} className="button button-v3 button-sm"  onClick={()=>{
                    SpeechRecognition.stopListening();
                    resetTranscript();
                }}>Reset</button>
            </div>

            {transcript ? <p><i>"{transcript}"</i></p>: ""}
        </div>
    )
}
export default Dictaphone