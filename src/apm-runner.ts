import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { AwdInstaller } from './apm-installer';
import { ParameterHandler } from './parameter-handler';

export interface ExecutionResult {
  success: boolean;
  output: string;
}

/**
 * Core APM runner that handles installation, parameter processing, and execution
 */
export class AwdRunner {
  private installer: AwdInstaller;
  private paramHandler: ParameterHandler;

  constructor() {
    this.installer = new AwdInstaller();
    this.paramHandler = new ParameterHandler();
  }

  /**
   * Main execution flow for APM workflows
   */
  async execute(): Promise<ExecutionResult> {
    try {
      // 1. Install APM CLI if not available
      core.info('📦 Ensuring APM CLI is installed...');
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

      // 4. Install APM and MCP dependencies - unless explicitly skipped
      const skipInstall = core.getInput('skip-install') === 'true';
      if (!skipInstall) {
        core.info('📦 Installing APM and MCP dependencies...');
        await this.runAwdCommand('install', []);
        
        // 5. Compile AGENTS.md for agent compatibility
        core.info('🔄 Compiling AGENTS.md from dependencies...');
        await this.runAwdCommand('compile', []);
      } else {
        core.info('⏭️  Skipping dependency installation and compilation');
      }

      // 6. Gather parameters from all inputs
      const script = core.getInput('script') || 'start';
      
      // Handle special 'install' script case
      if (script === 'install') {
        core.info('✅ APM dependencies installation and compilation completed');
        return {
          success: true,
          output: 'Dependencies installed and AGENTS.md compiled successfully'
        };
      }
      const params = this.paramHandler.gatherParameters();
      
      core.info(`🎯 Running APM script: ${script}`);
      if (params.length > 0) {
        core.info(`📋 Parameters: ${params.join(', ')}`);
      }

      // 7. Execute APM command
      const command = `apm run ${script}`;
      const args = params;
      
      let output = '';
      const options = {
        listeners: {
          stdout: (data: Buffer) => {
            const text = data.toString();
            output += text;
            // Let GitHub Actions handle the logging automatically
          },
          stderr: (data: Buffer) => {
            const text = data.toString();
            output += text;
            // Let GitHub Actions handle the logging automatically
          }
        },
        silent: false,  // GitHub Actions will automatically log stdout/stderr
        ignoreReturnCode: true,
        env: {
          ...process.env,
          // GitHub Actions-specific: Required for Copilot CLI MCP server loading
          XDG_CONFIG_HOME: process.env.HOME || '/home/runner',
          COPILOT_AGENT_RUNNER_TYPE: 'STANDALONE'
        }
      };

      const exitCode = await exec.exec(command, args, options);
      
      return {
        success: exitCode === 0,
        output: output.trim()
      };

    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      core.error(`APM execution failed: ${message}`);
      return {
        success: false,
        output: message
      };
    }
  }

  /**
   * Helper method to run APM commands with proper error handling
   */
  private async runAwdCommand(command: string, args: string[]): Promise<void> {
    const fullCommand = `apm ${command}`;
    
    let output = '';
    const options = {
      listeners: {
        stdout: (data: Buffer) => {
          const text = data.toString();
          output += text;
          // Let GitHub Actions handle the logging automatically
        },
        stderr: (data: Buffer) => {
          const text = data.toString();
          output += text;
          // Let GitHub Actions handle the logging automatically
        }
      },
      silent: false,
      ignoreReturnCode: true,
      env: {
        ...process.env,
        // GitHub Actions-specific: Required for Copilot CLI MCP server loading
        XDG_CONFIG_HOME: process.env.HOME || '/home/runner',
        COPILOT_AGENT_RUNNER_TYPE: 'STANDALONE'
      }
    };

    const exitCode = await exec.exec(fullCommand, args, options);
    
    if (exitCode !== 0) {
      throw new Error(`APM command '${fullCommand}' failed with exit code ${exitCode}`);
    }
  }
}
