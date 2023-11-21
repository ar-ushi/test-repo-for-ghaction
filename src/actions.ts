
import * as core from '@actions/core';
import * as gh from '@actions/github';
import { Octokit } from '@octokit/rest';
import retrieveDetails from './retrieve-details';

export default async function getDetailsForPr() {
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
    const owner = context!.payload!.repository!.owner.login;
    const pull_number = context!.payload!.pull_request!.number;
    const repo = context!.payload!.pull_request!.base.repo.name;
    const jiraAPIUrl = `${orgUrl}/rest/api/2/issue/${jiraId}`;
    const fields = await retrieveDetails({
        authToken,
        jiraAPIUrl
    })
    const title = `${jiraId} | ${fields.summary}`;
    core.info(`API :::  ${fields}`)
    await client.rest.pulls.update({
        owner,
        repo,
        pull_number,
        title
    })
 } catch (error : any) {
    core.setFailed(`process failed with ::: ${error.message}`);
 }   
}