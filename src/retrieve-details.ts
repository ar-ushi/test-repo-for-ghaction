import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';

interface getDetailsInput{
    authToken: string;
    jiraAPIUrl: string;
}

export default async ({authToken, jiraAPIUrl} : getDetailsInput) => {
try {
    core.info('fetching details...');
    core.info(`${jiraAPIUrl}`)
    const octokit = new Octokit({
        request: {
            fetch : fetch,
        }
    })
    const response = await octokit.request(jiraAPIUrl, {
        headers: {
           Authorization: `Basic ${authToken}`
        }
    });
    if (response.status === 200){
        const {data} = response;
        core.info(JSON.stringify(response, null, 2)); //debug fields
        return data;
    } else {
        throw new Error ('No response from Jira API');
    }
} catch (error : any) {
    core.setFailed(error.message);
}
};
