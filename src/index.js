const entryPoint= require('./actions');
const core = require('@actions/core');

entryPoint.getDetailsForPr().catch(e =>
    core.setFailed(e.message));
    
