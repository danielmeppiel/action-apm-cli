import * as core from '@actions/core';
import { AwdRunner } from './awd-runner';

/**
 * Main entry point for the AWD GitHub Action
 */
async function run(): Promise<void> {
  try {
    core.info('🚀 Starting AWD AI Workflow Runner...');
    
    const runner = new AwdRunner();
    const result = await runner.execute();
    
    // Set outputs for downstream actions
    core.setOutput('success', result.success);
    core.setOutput('output', result.output);
    
    if (!result.success) {
      core.setFailed('AWD workflow execution failed');
    } else {
      core.info('✨ AWD workflow completed successfully!');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    core.setFailed(`AWD Action failed: ${message}`);
  }
}

// Run the action
run();
