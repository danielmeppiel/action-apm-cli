import * as core from '@actions/core';
import { AwdRunner } from './apm-runner';

/**
 * Main entry point for the APM GitHub Action
 */
async function run(): Promise<void> {
  try {
    core.info('🚀 Starting APM AI Workflow Runner...');
    
    const runner = new AwdRunner();
    const result = await runner.execute();
    
    // Set outputs for downstream actions
    core.setOutput('success', result.success);
    core.setOutput('output', result.output);
    
    if (!result.success) {
      core.setFailed('APM workflow execution failed');
    } else {
      core.info('✨ APM workflow completed successfully!');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    core.setFailed(`APM Action failed: ${message}`);
  }
}

// Run the action
run();
