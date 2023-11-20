
const core = require('@actions/core');
const gh = require('@actions/github');
const { Octokit } = require("@octokit/rest");
const retrieveDetails = require('./retrieve-details')

const getDetailsForPr = async() => {
 try {
    const GHtoken = core.getInput('token', {required: true});
    const jiraId = core.getInput('jiraId', {required: true});
    const orgUrl = core.getInput('orgUrl', {required: true});
    const jiraToken = core.getInput('jiraToken', {required: true});  
    const username= core.getInput('username', {required: true});
    const authToken = Buffer.from(`${username}:${jiraToken}`).toString('base64');
    const client = new Octokit({
        auth: GHtoken
    })
    const { context } = gh;
    const pull_number = context.payload.pull_request.body;
    const repo = constext.payload.pull_request.base.repo.name;
    const jiraAPIUrl = `${orgUrl}/rest/api/2/issue/${jiraId}`;
    const fields = await retrieveDetails({
        authToken,
        jiraAPIUrl
    })
    const title = `${jiraId} | ${fields.summary}`;
    core.info(`API :::  ${fields}`)
    await client.rest.pulls.update({
        repo,
        pull_number,
        title
    })
 } catch (error) {
    core.setFailed(`process failed with ::: ${error.message}`);
 }   
}

module.exports = {
    getDetailsForPr
}