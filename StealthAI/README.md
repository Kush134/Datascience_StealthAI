# `Stealth AI`
This is me and my team stealth
## An NLP tool for remove those hassles of finding the most relevant content in the videos and documents.
## Inspiration
Everyday people watch one billion hours of videos on YouTube and generate billions of views (YouTube, 2019). Another interesting fact is that searches related to the term “how to” are growing 70 percent year over year, according to searchengineland.com. This means that when users are searching for ways to learn something, they rely on video content. 
In the limits of COVID-19, the whole world realizes the power of online education and the impact it can have on millions of people. 

## Problem
Many times we find ourselves skipping through a YouTube timeline trying to find a punchline or a specific part of a tutorial. It can be time-consuming and mind-numbing to try and find a specific moment in a YouTube video. (And this doesn’t end after one or two videos)​

Although plenty of video solutions available online and usage is extravagant, often these lectures can be too long and monotonous. People zone out frequently and lose track of what is going on and end up rewinding the video and watching again and again.
​
​Also, in this process there is a lack of feedback and there is no one to test you if you have really understood what you are listening to.

The transition to online classes has, contrary to expectations, increased the average time spent for classes. To improve studying efficiency, we decided to tackle a major part of our long study times and comprehension ability: Zoom lectures. We thought it’d be nice if we could somehow condense lecture material without losing comprehension and possibly even increasing our understanding.

In 2008 a study estimated that it would take 244 hours a year for the typical American internet user to read the privacy policies of all websites he or she visits – and that was before everyone carried smartphones with dozens of apps, before cloud services, and before smart home technologies. 

## What it does
The core of the idea is to remove those hassles of finding that “the” moment in the video to give user quick and most relevant content.​

Keeping this in mind with the help of Expert.ai services we want to provide users with a  seamless learning experience by giving a fully-fledged solution that aims to reduce the time and hassles we faced while watching the long educational videos and provide a AI solution so as to make your learning efficient.

1. Youtube Video Analyser: We find ourselves skipping through a YouTube timeline trying to find a punchline or a specific part of a tutorial and end up spending a lot of time. To remove this hassle we have created a youtube video analyser, where we can get the key moments, summary, searching through phrases, voice searching by just putting the youtube video link. Also, after the learning, there is an automated smart quiz which can be helpful in the self-check. We can also get the quick sentiments of the video from its latest comments which can be helpful beforehand to know whether the video suits our current sentiments.

2. Zoom Online Lectures Analyser: It condenses lecture material without losing comprehension to summarize these Lectures using the lecture transcripts. Here also we can get the key moments, summary, phrases searching, voice searching and self-check smart quiz.

3. Legal Document Analyser: With the use of Stealth ai you can upload a privacy policy in text format and the API will summarize the text for you. For example, we will upload a google privacy policy in text format, and based on the score the important sentences are highlighted in red making it easier to understand before accepting the policies.

## How we built it
1. **Youtube Video Analyser:** For the youtube analyzer, we first generate the summary of the available youtube transcripts/closed captions using nltk summarizer, which is done on the azure function which we have developed. This azure function returns the summary and transcript of the youtube video to the web app. With the help of this summary of the video, we generate the keynotes from the entities API, highlight key main sentences in the summary, showing the main topic using the relevant API. We also do the sentimental analysis of the youtube latest comments using the sentiment API. For the quiz generation, we use the disambiguation API which gives the sentences with the tokens which further uses the azure function from where we get similar words for the options of the question.
*API Used:*
	/relevents
	/sentiments
	/entities
	/disambiguation 

2. **Zoom Online Lectures Analyser:** Here we used the zoom video transcripts and led by the text cleaning and generating summary with the previous summarizer azure function. After generating the summary we used the expert.ai APIs for generating the key elements, phrase searching, voice searching, highlighting the main sentences and generating the smart quiz as mentioned above.
*API Used:*
	/relevents
	/sentiments
	/entities
	/disambiguation 

3. **Legal Document Analyser:** For a legal document analyser we read any privacy policy from the text file and generate the summary of it and use the relevant API for the main sentences and main lemmas for highlighting the important information of any legal document.
*API Used:*
	/relevents

In the below diagram we have shown the deployment architecture diagram describing how the application is communicating with the different resources and expert.ai APIs.
![image](https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/001/410/402/datas/gallery.jpg)
## How to run locally
In the project directory, you can run:
#### `npm install`

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
