import * as core from '@actions/core';
import * as gh from '@actions/github';
import { Octokit } from '@octokit/rest';
import retrieveDetails from './retrieve-details';

export async function getDetailsForPr() {
 try {
    const GHtoken = core.getInput('token', {required: true});
    const jid = core.getInput('jiraId', {required: true});
    const orgUrl = core.getInput('orgUrl', {required: true});
    const jiraToken = core.getInput('jiraToken', {required: true});  
    const username= core.getInput('username', {required: true});
    const authToken = btoa(`${username}:${jiraToken}`);
    const client = new Octokit({
        auth: GHtoken
    })
    const {context} = gh;
    const jiraAPIUrl = `${orgUrl}/rest/api/2/issue/${jid}`;
    const fields = await retrieveDetails({
        authToken,
        jiraAPIUrl
    })
 } catch (error) {
    
 }   
}