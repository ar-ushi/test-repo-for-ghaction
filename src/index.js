const getDetailsForPr = require('./actions');
const core = require('@actions/core');

getDetailsForPr().catch(e =>
    core.setFailed(e.message));
    
