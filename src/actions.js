
const core = require('@actions/core');
const gh = require('@actions/github');
const { Octokit } = require("@octokit/rest");
const retrieveDetails = require('./retrieve-details')

const getDetailsForPr = async() => {
 try {
    const GHtoken = core.getInput('token', {required: true});
    const jid = core.getInput('jiraId', {required: true});
    const orgUrl = core.getInput('orgUrl', {required: true});
    const jiraToken = core.getInput('jiraToken', {required: true});  
    const username= core.getInput('username', {required: true});
    const authToken = Buffer.from(`${username}:${jiraToken}`).toString('base64');
    const client = new Octokit({
        auth: GHtoken
    })
    const {context} = gh;
    const jiraAPIUrl = `${orgUrl}/rest/api/2/issue/${jid}`;
    const fields = await retrieveDetails({
        authToken,
        jiraAPIUrl
    })
    core.info(`API :::  ${fields}`)
 } catch (error) {
    
 }   
}

module.exports = {
    getDetailsForPr
}