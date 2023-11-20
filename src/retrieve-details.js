const core = require('@actions/core');
const {fetch} = require('node-fetch');

module.exports = async ({authToken, jiraAPIUrl}) => {
try {
    core.info('fetching details...');
    const response = await fetch(jiraAPIUrl, {
        headers: {
           Authorization: `Basic ${authToken}`
        }
    });
    if (response.ok){
        const {fields} = await response.json();
        core.info(fields); //debug fields
        return fields;
    } else {
        throw new Error ('No response from Jira API');
    }
} catch (error) {
    core.setFailed(error.message);
}
};
