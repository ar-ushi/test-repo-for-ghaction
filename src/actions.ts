
import * as core from '@actions/core';
import * as gh from '@actions/github';
import { Octokit } from '@octokit/rest';
import retrieveDetails from './retrieve-details';
import fetch from 'node-fetch';

export default async function getDetailsForPr() {
 try {
    interface JiraDetail {
        id: string;
        summary: string;
        description: string;
        issueType: string;
    }      
    const GHtoken = core.getInput('token', {required: true});
    const jiraKey = core.getInput('jiraKey', { required: true }).split(',').map(key => key.trim());
    const orgUrl = core.getInput('orgUrl', {required: true});
    const jiraToken = core.getInput('jiraToken', {required: true});  
    const username= core.getInput('username', {required: true});
    const authToken = Buffer.from(`${username}:${jiraToken}`).toString('base64');
    const client = new Octokit({
        auth: GHtoken,
        request: {
            fetch,
        }
    })
    const { context } = gh;
    const owner = context!.payload!.repository!.owner.login;
    const pull_number = context!.payload!.pull_request!.number;
    const repo = context!.payload!.pull_request!.base.repo.name;
    const bodyContent = context!.payload.pull_request!.body;
    const branch_name = context.payload!.pull_request!.head.ref;
    const pullRequestTitle = context.payload!.pull_request!.title;
    let jiraIds: string[] = [];
    let jiraDetails: JiraDetail[] = [];

    for (const key of jiraKey) {
        const jiraIdMatches = pullRequestTitle.match(new RegExp(`${key}-\\d+`, 'g'));
        if (jiraIdMatches) {
            jiraIds.push(...jiraIdMatches);
        }
    }
    // If no Jira IDs found in the title, check the branch name
    if (jiraIds.length === 0) {
        for (const key of jiraKey) {
            const jiraIdMatch = branch_name.match(new RegExp(`${key}-\\d+`));
            if (jiraIdMatch) {
            jiraIds.push(jiraIdMatch[0]);
            break; 
            }
        }
    }

    if (jiraIds.length === 0) {
        throw new Error(`Could not find any Jira IDs in the PR title or branch name matching any of the Jira keys: ${jiraKey.join(', ')}`);
    }
    for (const jiraId of jiraIds) {
        const jiraAPIUrl = `${orgUrl}/rest/api/2/issue/${jiraId}`;
        const fields = await retrieveDetails({
          authToken,
          jiraAPIUrl,
    });
        core.info(`API :::  ${fields.issueType}`)
        jiraDetails.push({id: jiraId, summary: fields.summary, description: fields.description, issueType: fields.issueType.name})
    }

    const title = jiraDetails.length === 1 ?`${jiraDetails[0].id} | ${jiraDetails[0].summary}` :  jiraDetails.map(jira => jira.id).join(' & ');
    const jiraDescriptions = jiraDetails.map(jira => `${jira.id}: ${jira.description}`).join('\n\n');
    const issueTypes = jiraDetails.map(jira => jira.issueType.toLowerCase());

    const body = `**Jira Description** \n\n${jiraDescriptions}\n\n## ${bodyContent}`;
    await client.rest.pulls.update({
        owner,
        repo,
        pull_number,
        title,
        body, 
    })
    await client.rest.issues.addLabels({
        owner,
        repo,
        issue_number : pull_number,
        labels: issueTypes
    })
 } catch (error : any) {
    core.setFailed(`process failed with ::: ${error.message}`);
 }   
}