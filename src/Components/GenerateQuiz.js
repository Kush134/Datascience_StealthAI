import axios from "axios/index";
import {SimilarWords} from "./SimilarWords";

const _ = require('lodash');
const baseURL = "https://nlapi.expert.ai";
const language = "en";
export const GenerateQuiz = async (transcript, keyNotes, token) => {
    const payload = {
        document: {
            text: transcript
        }
    }
    const headers = {
        "accept": "application/json",
        "Authorization": token,
        "Content-Type": "application/json; charset=utf-8"
    }
    return axios.post(`${baseURL}/v2/analyze/standard/${language}/disambiguation`, payload, {headers: headers})
        .then(async res => {

            const data = res.data['data'];
            const sentences = data['sentences'];
            const phrases = data['phrases'];
            const tokens = data['tokens'];
            const quiz = {};
            const keyWords = [];
            sentences.forEach(sentence => {
                const sentence_text = transcript.substring(sentence['start'], sentence['end']);
                let flag = false;
                for (let p in sentence['phrases']) {
                    const phrase = phrases[sentence['phrases'][p]];
                    for (let t in phrase['tokens']) {
                        const key = tokens[phrase['tokens'][t]];
                        let lemma = key['lemma'];
                        let lemma_key = lemma.replace(/\s+/g, '-').toLowerCase();
                        if (!(lemma_key in quiz) && lemmaExists(lemma) && lemma.length > 2 && sentence_text.length > 80) {
                            let question = transcript.substring(sentence['start'], sentence['end']);
                            question = question.replace(lemma, "__________").trim()
                            quiz[lemma_key] = {
                                sentence: question,
                                answer: lemma,
                                options: []
                            }
                            keyWords.push(lemma_key);
                            flag = true;
                            break;
                        }
                    }
                    if (flag) break;
                }
            });
            const similar_words = await SimilarWords(keyWords);
            keyWords.forEach(word => {
                let options = similar_words[word].synms.slice(0, 3);
                options.push(quiz[word]['answer']);
                shuffleArray(options);
                if (options.length === 3) options.push("None of these");
                quiz[word]['options'] = options
            });
            const quiz_results = []
            for (let q in quiz) {
                quiz_results.push(quiz[q]);
            }
            console.log(quiz_results);
            return quiz_results;

        }).catch(err => console.log(err));

    function lemmaExists(lemma) {
        return keyNotes.some(function (el) {
            return el.value === lemma;
        });
    }
}
const shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
};