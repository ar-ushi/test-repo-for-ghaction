import * as core from '@actions/core';
import fetch from 'node-fetch';

interface getDetailsInput{
    authToken: string;
    jiraAPIUrl: string;
}

interface JiraResponse {
    expand: string;
    fields : {
        [key:string] : any;
    }
}


export default async ({authToken, jiraAPIUrl} : getDetailsInput) => {
try {
    core.info('fetching details...');
    const response = await fetch(jiraAPIUrl, {
        headers: {
           Authorization: `Basic ${authToken}`
        }
    });
    if (response.ok){
        const { fields }= await (response.json() as any);
        core.info(fields); //debug fields
        return fields;
    } else {
        throw new Error ('No response from Jira API');
    }
} catch (error : any) {
    core.setFailed(error.message);
}
};
