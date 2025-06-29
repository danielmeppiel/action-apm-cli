import * as core from '@actions/core';
import * as exec from '@actions/exec';

/**
 * Handles AWD CLI installation and runtime setup
 */
export class AwdInstaller {
  
  /**
   * Ensure AWD CLI is installed and available
   */
  async ensureAwdInstalled(): Promise<void> {
    const awdVersion = core.getInput('awd-version') || 'latest';
    
    try {
      // First check if AWD is already available
      const checkResult = await exec.exec('awd', ['--version'], {
        ignoreReturnCode: true,
        silent: true
      });
      
      if (checkResult === 0) {
        core.info('✅ AWD CLI already installed');
        return;
      }
    } catch (error) {
      // AWD not found, need to install
    }

    core.info(`⬇️  Installing AWD CLI version: ${awdVersion}...`);
    
    try {
      // Install AWD using the official install script
      // The install script supports version selection via environment variable
      const installEnv = {
        ...process.env,
        AWD_VERSION: awdVersion === 'latest' ? '' : awdVersion
      };

      await exec.exec('sh', ['-c', 'curl -sSL https://raw.githubusercontent.com/danielmeppiel/awd-cli/main/install.sh | sh'], {
        env: installEnv
      });
      
      // Add AWD to PATH if it's not already there
      const awdPath = process.env.HOME + '/.awd/bin';
      if (process.env.PATH && !process.env.PATH.includes(awdPath)) {
        process.env.PATH = `${awdPath}:${process.env.PATH}`;
        core.addPath(awdPath);
        core.info(`📍 Added ${awdPath} to PATH`);
      }
      
      // Verify installation
      const verifyResult = await exec.exec('awd', ['--version'], {
        ignoreReturnCode: true
      });
      
      if (verifyResult !== 0) {
        throw new Error('AWD CLI installation verification failed');
      }
      
      core.info('✅ AWD CLI installed successfully');
      
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to install AWD CLI: ${message}`);
    }
  }

  /**
   * Setup AI runtime (codex by default)
   */
  async setupRuntime(): Promise<void> {
    try {
      core.info('🤖 Setting up Codex runtime with GitHub Models...');
      
      const result = await exec.exec('awd', ['runtime', 'setup', 'codex'], {
        ignoreReturnCode: true,
        env: {
          ...process.env,
          // Ensure GITHUB_TOKEN is available for runtime setup
          GITHUB_TOKEN: process.env.GITHUB_TOKEN || core.getInput('github_token') || ''
        }
      });
      
      if (result === 0) {
        core.info('✅ Runtime setup completed');
        
        // Temporary workaround: Add AWD runtime directory to PATH for this session
        // TODO: Remove this once https://github.com/danielmeppiel/awd-cli/issues/XXX is fixed
        await this.addAwdRuntimeToPath();
      } else {
        core.warning('⚠️  Runtime setup had issues but continuing...');
      }
      
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      core.warning(`Runtime setup warning: ${message}`);
      // Don't fail the action for runtime setup issues
    }
  }

  /**
   * Temporary workaround: Add AWD runtime directory to PATH for the current session
   * This fixes the issue where runtime binaries aren't available immediately after setup
   * TODO: Remove this once AWD-CLI properly updates PATH in current session
   */
  private async addAwdRuntimeToPath(): Promise<void> {
    try {
      const awdRuntimePath = process.env.HOME + '/.awd/runtimes';
      
      // Add to current process PATH
      if (process.env.PATH && !process.env.PATH.includes(awdRuntimePath)) {
        process.env.PATH = `${awdRuntimePath}:${process.env.PATH}`;
        core.addPath(awdRuntimePath);
        core.info(`📍 Added ${awdRuntimePath} to PATH for runtime binaries`);
      }
      
    } catch (error) {
      core.warning(`Could not update PATH for AWD runtime: ${error}`);
    }
  }
}
