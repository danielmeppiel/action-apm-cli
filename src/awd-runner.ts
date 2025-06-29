import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { AwdInstaller } from './awd-installer';
import { ParameterHandler } from './parameter-handler';

export interface ExecutionResult {
  success: boolean;
  output: string;
}

/**
 * Core AWD runner that handles installation, parameter processing, and execution
 */
export class AwdRunner {
  private installer: AwdInstaller;
  private paramHandler: ParameterHandler;

  constructor() {
    this.installer = new AwdInstaller();
    this.paramHandler = new ParameterHandler();
  }

  /**
   * Main execution flow for AWD workflows
   */
  async execute(): Promise<ExecutionResult> {
    try {
      // 1. Install AWD CLI if not available
      core.info('📦 Ensuring AWD CLI is installed...');
      await this.installer.ensureAwdInstalled();

      // 2. Setup runtime automatically
      core.info('⚙️  Setting up AI runtime...');
      await this.installer.setupRuntime();

      // 3. Change to working directory if specified
      const workingDir = core.getInput('working-directory') || '.';
      if (workingDir !== '.') {
        core.info(`📁 Changing to working directory: ${workingDir}`);
        process.chdir(workingDir);
      }

      // 4. Install MCP dependencies (like npm install) - unless explicitly skipped
      const skipInstall = core.getInput('skip-install') === 'true';
      if (!skipInstall) {
        core.info('📦 Installing MCP dependencies...');
        await this.runAwdCommand('install', []);
      } else {
        core.info('⏭️  Skipping MCP dependency installation');
      }

      // 5. Gather parameters from all inputs
      const script = core.getInput('script') || 'start';
      
      // Handle special 'install' script case
      if (script === 'install') {
        core.info('✅ MCP dependencies installation completed');
        return {
          success: true,
          output: 'Dependencies installed successfully'
        };
      }
      const params = this.paramHandler.gatherParameters();
      
      core.info(`🎯 Running AWD script: ${script}`);
      if (params.length > 0) {
        core.info(`📋 Parameters: ${params.join(', ')}`);
      }

      // 5. Execute AWD command
      const command = `awd run ${script}`;
      const args = params;
      
      let output = '';
      const options = {
        listeners: {
          stdout: (data: Buffer) => {
            const text = data.toString();
            output += text;
            core.info(text.trim());
          },
          stderr: (data: Buffer) => {
            const text = data.toString();
            output += text;
            core.warning(text.trim());
          }
        },
        silent: false,
        ignoreReturnCode: true
      };

      const exitCode = await exec.exec(command, args, options);
      
      return {
        success: exitCode === 0,
        output: output.trim()
      };

    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      core.error(`AWD execution failed: ${message}`);
      return {
        success: false,
        output: message
      };
    }
  }

  /**
   * Helper method to run AWD commands with proper error handling
   */
  private async runAwdCommand(command: string, args: string[]): Promise<void> {
    const fullCommand = `awd ${command}`;
    
    let output = '';
    const options = {
      listeners: {
        stdout: (data: Buffer) => {
          const text = data.toString();
          output += text;
          core.info(text.trim());
        },
        stderr: (data: Buffer) => {
          const text = data.toString();
          output += text;
          core.warning(text.trim());
        }
      },
      silent: false,
      ignoreReturnCode: true
    };

    const exitCode = await exec.exec(fullCommand, args, options);
    
    if (exitCode !== 0) {
      throw new Error(`AWD command '${fullCommand}' failed with exit code ${exitCode}`);
    }
  }
}
