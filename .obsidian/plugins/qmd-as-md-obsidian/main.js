'use strict';

var obsidian = require('obsidian');
var child_process = require('child_process');
var path = require('path');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);

const DEFAULT_SETTINGS = {
    quartoPath: 'quarto',
    enableQmdLinking: true,
    quartoTypst: '',
    emitCompilationLogs: true, // Default is to emit logs
};
class QmdAsMdPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.activePreviewProcesses = new Map();
    }
    async onload() {
        console.log('Plugin is loading...');
        try {
            await this.loadSettings();
            console.log('Settings loaded:', this.settings);
            if (this.settings.enableQmdLinking) {
                this.registerQmdExtension();
            }
            this.addSettingTab(new QmdSettingTab(this.app, this));
            console.log('Settings tab added successfully');
            this.addRibbonIcon('eye', 'Toggle Quarto Preview', async () => {
                const activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                if (activeView?.file && this.isQuartoFile(activeView.file)) {
                    console.log(`Toggling preview for: ${activeView.file.path}`);
                    await this.togglePreview(activeView.file);
                }
                else {
                    new obsidian.Notice('Current file is not a Quarto document');
                }
            });
            console.log('Ribbon icon added');
            this.addCommand({
                id: 'toggle-quarto-preview',
                name: 'Toggle Quarto Preview',
                callback: async () => {
                    const activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                    if (activeView?.file && this.isQuartoFile(activeView.file)) {
                        console.log(`Command: Toggling preview for ${activeView.file.path}`);
                        await this.togglePreview(activeView.file);
                    }
                    else {
                        new obsidian.Notice('Current file is not a Quarto document');
                    }
                },
                hotkeys: [{ modifiers: ['Ctrl', 'Shift'], key: 'p' }],
            });
            console.log('Commands added');
        }
        catch (error) {
            console.error('Error loading plugin:', error);
            new obsidian.Notice('Failed to load QmdAsMdPlugin. Check the developer console for details.');
        }
    }
    onunload() {
        console.log('Plugin is unloading...');
        this.stopAllPreviews();
    }
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }
    isQuartoFile(file) {
        return file.extension === 'qmd';
    }
    registerQmdExtension() {
        console.log('Registering .qmd as markdown...');
        this.registerExtensions(['qmd'], 'markdown');
        console.log('.qmd registered as markdown');
    }
    async togglePreview(file) {
        if (this.activePreviewProcesses.has(file.path)) {
            await this.stopPreview(file);
        }
        else {
            await this.startPreview(file);
        }
    }
    async startPreview(file) {
        if (this.activePreviewProcesses.has(file.path)) {
            console.log(`Preview already running for: ${file.path}`);
            return; // Preview already running
        }
        try {
            const abstractFile = this.app.vault.getAbstractFileByPath(file.path);
            if (!abstractFile || !(abstractFile instanceof obsidian.TFile)) {
                new obsidian.Notice(`File ${file.path} not found`);
                return;
            }
            const filePath = this.app.vault.adapter.getFullPath(abstractFile.path);
            const workingDir = path__namespace.dirname(filePath);
            console.log(`Resolved file path: ${filePath}`);
            console.log(`Working directory: ${workingDir}`);
            const envVars = {
                ...process.env,
            };
            if (this.settings.quartoTypst.trim()) {
                envVars.QUARTO_TYPST = this.settings.quartoTypst.trim();
                console.log(`QUARTO_TYPST set to: ${envVars.QUARTO_TYPST}`);
            }
            const quartoProcess = child_process.spawn(this.settings.quartoPath, ['preview', filePath], {
                cwd: workingDir,
                env: envVars,
            });
            let previewUrl = null;
            quartoProcess.stdout?.on('data', (data) => {
                const output = data.toString();
                if (this.settings.emitCompilationLogs) {
                    console.log(`Quarto Preview Output: ${output}`);
                }
                if (output.includes('Browse at')) {
                    const match = output.match(/Browse at\s+(http:\/\/[^\s]+)/);
                    if (match && match[1]) {
                        previewUrl = match[1];
                        new obsidian.Notice(`Preview available at ${previewUrl}`);
                        const leaf = this.app.workspace.getLeaf('tab');
                        leaf.setViewState({
                            type: 'webviewer',
                            active: true,
                            state: {
                                url: previewUrl,
                            },
                        });
                        this.app.workspace.revealLeaf(leaf);
                    }
                }
            });
            quartoProcess.stderr?.on('data', (data) => {
                if (this.settings.emitCompilationLogs) {
                    console.error(`Quarto Preview Error: ${data}`);
                }
            });
            quartoProcess.on('close', (code) => {
                if (code !== null && code !== 0) {
                    new obsidian.Notice(`Quarto preview process exited with code ${code}`);
                }
                this.activePreviewProcesses.delete(file.path);
            });
            this.activePreviewProcesses.set(file.path, quartoProcess);
            new obsidian.Notice('Quarto preview started');
        }
        catch (error) {
            console.error('Failed to start Quarto preview:', error);
            new obsidian.Notice('Failed to start Quarto preview');
        }
    }
    async stopPreview(file) {
        const quartoProcess = this.activePreviewProcesses.get(file.path);
        if (quartoProcess) {
            if (!quartoProcess.killed) {
                quartoProcess.kill();
            }
            this.activePreviewProcesses.delete(file.path);
            new obsidian.Notice('Quarto preview stopped');
        }
    }
    stopAllPreviews() {
        this.activePreviewProcesses.forEach((quartoProcess, filePath) => {
            if (!quartoProcess.killed) {
                quartoProcess.kill();
            }
            this.activePreviewProcesses.delete(filePath);
        });
        if (this.activePreviewProcesses.size > 0) {
            new obsidian.Notice('All Quarto previews stopped');
        }
    }
}
class QmdSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        console.log('Rendering settings tab...');
        containerEl.createEl('h2', { text: 'Quarto Preview Settings' });
        new obsidian.Setting(containerEl)
            .setName('Quarto Path')
            .setDesc('Path to Quarto executable (e.g., quarto, /usr/local/bin/quarto)')
            .addText((text) => text
            .setPlaceholder('quarto')
            .setValue(this.plugin.settings.quartoPath)
            .onChange(async (value) => {
            console.log(`Quarto path changed to: ${value}`);
            this.plugin.settings.quartoPath = value;
            await this.plugin.saveSettings();
        }));
        new obsidian.Setting(containerEl)
            .setName('Enable Editing Quarto Files')
            .setDesc('By default, plugin allows editing .qmd files. Disable this feature if there is a conflict with .qmd editing enabled by another plugin')
            .addToggle((toggle) => toggle
            .setValue(this.plugin.settings.enableQmdLinking)
            .onChange(async (value) => {
            console.log(`Enable QMD Editing setting changed to: ${value}`);
            this.plugin.settings.enableQmdLinking = value;
            if (value) {
                this.plugin.registerQmdExtension();
            }
        }));
        new obsidian.Setting(containerEl)
            .setName('QUARTO_TYPST Variable')
            .setDesc('Define the QUARTO_TYPST environment variable (leave empty to unset)')
            .addText((text) => text
            .setPlaceholder('e.g., typst_path')
            .setValue(this.plugin.settings.quartoTypst)
            .onChange(async (value) => {
            console.log(`QUARTO_TYPST set to: ${value}`);
            this.plugin.settings.quartoTypst = value;
            await this.plugin.saveSettings();
        }));
        new obsidian.Setting(containerEl)
            .setName('Emit Compilation Logs')
            .setDesc('Toggle whether to emit detailed compilation logs in the console')
            .addToggle((toggle) => toggle
            .setValue(this.plugin.settings.emitCompilationLogs)
            .onChange(async (value) => {
            console.log(`Emit Compilation Logs set to: ${value}`);
            this.plugin.settings.emitCompilationLogs = value;
            await this.plugin.saveSettings();
        }));
        console.log('Settings tab rendered successfully');
    }
}

module.exports = QmdAsMdPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsic3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgUGx1Z2luLFxuICBOb3RpY2UsXG4gIFRGaWxlLFxuICBNYXJrZG93blZpZXcsXG4gIFBsdWdpblNldHRpbmdUYWIsXG4gIEFwcCxcbiAgU2V0dGluZyxcbn0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgc3Bhd24sIENoaWxkUHJvY2VzcyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuaW50ZXJmYWNlIFFtZFBsdWdpblNldHRpbmdzIHtcbiAgcXVhcnRvUGF0aDogc3RyaW5nO1xuICBlbmFibGVRbWRMaW5raW5nOiBib29sZWFuO1xuICBxdWFydG9UeXBzdDogc3RyaW5nO1xuICBlbWl0Q29tcGlsYXRpb25Mb2dzOiBib29sZWFuOyAvLyBOZXcgc2V0dGluZ1xufVxuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBRbWRQbHVnaW5TZXR0aW5ncyA9IHtcbiAgcXVhcnRvUGF0aDogJ3F1YXJ0bycsXG4gIGVuYWJsZVFtZExpbmtpbmc6IHRydWUsXG4gIHF1YXJ0b1R5cHN0OiAnJyxcbiAgZW1pdENvbXBpbGF0aW9uTG9nczogdHJ1ZSwgLy8gRGVmYXVsdCBpcyB0byBlbWl0IGxvZ3Ncbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFFtZEFzTWRQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICBzZXR0aW5nczogUW1kUGx1Z2luU2V0dGluZ3M7XG4gIGFjdGl2ZVByZXZpZXdQcm9jZXNzZXM6IE1hcDxzdHJpbmcsIENoaWxkUHJvY2Vzcz4gPSBuZXcgTWFwKCk7XG5cbiAgYXN5bmMgb25sb2FkKCkge1xuICAgIGNvbnNvbGUubG9nKCdQbHVnaW4gaXMgbG9hZGluZy4uLicpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuICAgICAgY29uc29sZS5sb2coJ1NldHRpbmdzIGxvYWRlZDonLCB0aGlzLnNldHRpbmdzKTtcblxuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZW5hYmxlUW1kTGlua2luZykge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyUW1kRXh0ZW5zaW9uKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgUW1kU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xuICAgICAgY29uc29sZS5sb2coJ1NldHRpbmdzIHRhYiBhZGRlZCBzdWNjZXNzZnVsbHknKTtcblxuICAgICAgdGhpcy5hZGRSaWJib25JY29uKCdleWUnLCAnVG9nZ2xlIFF1YXJ0byBQcmV2aWV3JywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBhY3RpdmVWaWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgaWYgKGFjdGl2ZVZpZXc/LmZpbGUgJiYgdGhpcy5pc1F1YXJ0b0ZpbGUoYWN0aXZlVmlldy5maWxlKSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBUb2dnbGluZyBwcmV2aWV3IGZvcjogJHthY3RpdmVWaWV3LmZpbGUucGF0aH1gKTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnRvZ2dsZVByZXZpZXcoYWN0aXZlVmlldy5maWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXcgTm90aWNlKCdDdXJyZW50IGZpbGUgaXMgbm90IGEgUXVhcnRvIGRvY3VtZW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coJ1JpYmJvbiBpY29uIGFkZGVkJyk7XG5cbiAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICAgIGlkOiAndG9nZ2xlLXF1YXJ0by1wcmV2aWV3JyxcbiAgICAgICAgbmFtZTogJ1RvZ2dsZSBRdWFydG8gUHJldmlldycsXG4gICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgYWN0aXZlVmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgICAgaWYgKGFjdGl2ZVZpZXc/LmZpbGUgJiYgdGhpcy5pc1F1YXJ0b0ZpbGUoYWN0aXZlVmlldy5maWxlKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYENvbW1hbmQ6IFRvZ2dsaW5nIHByZXZpZXcgZm9yICR7YWN0aXZlVmlldy5maWxlLnBhdGh9YCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnRvZ2dsZVByZXZpZXcoYWN0aXZlVmlldy5maWxlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3IE5vdGljZSgnQ3VycmVudCBmaWxlIGlzIG5vdCBhIFF1YXJ0byBkb2N1bWVudCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbJ0N0cmwnLCAnU2hpZnQnXSwga2V5OiAncCcgfV0sXG4gICAgICB9KTtcblxuICAgICAgY29uc29sZS5sb2coJ0NvbW1hbmRzIGFkZGVkJyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGxvYWRpbmcgcGx1Z2luOicsIGVycm9yKTtcbiAgICAgIG5ldyBOb3RpY2UoXG4gICAgICAgICdGYWlsZWQgdG8gbG9hZCBRbWRBc01kUGx1Z2luLiBDaGVjayB0aGUgZGV2ZWxvcGVyIGNvbnNvbGUgZm9yIGRldGFpbHMuJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBvbnVubG9hZCgpIHtcbiAgICBjb25zb2xlLmxvZygnUGx1Z2luIGlzIHVubG9hZGluZy4uLicpO1xuICAgIHRoaXMuc3RvcEFsbFByZXZpZXdzKCk7XG4gIH1cblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7XG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxuXG4gIGlzUXVhcnRvRmlsZShmaWxlOiBURmlsZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmaWxlLmV4dGVuc2lvbiA9PT0gJ3FtZCc7XG4gIH1cblxuICByZWdpc3RlclFtZEV4dGVuc2lvbigpIHtcbiAgICBjb25zb2xlLmxvZygnUmVnaXN0ZXJpbmcgLnFtZCBhcyBtYXJrZG93bi4uLicpO1xuICAgIHRoaXMucmVnaXN0ZXJFeHRlbnNpb25zKFsncW1kJ10sICdtYXJrZG93bicpO1xuICAgIGNvbnNvbGUubG9nKCcucW1kIHJlZ2lzdGVyZWQgYXMgbWFya2Rvd24nKTtcbiAgfVxuXG4gIGFzeW5jIHRvZ2dsZVByZXZpZXcoZmlsZTogVEZpbGUpIHtcbiAgICBpZiAodGhpcy5hY3RpdmVQcmV2aWV3UHJvY2Vzc2VzLmhhcyhmaWxlLnBhdGgpKSB7XG4gICAgICBhd2FpdCB0aGlzLnN0b3BQcmV2aWV3KGZpbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCB0aGlzLnN0YXJ0UHJldmlldyhmaWxlKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzdGFydFByZXZpZXcoZmlsZTogVEZpbGUpIHtcbiAgICBpZiAodGhpcy5hY3RpdmVQcmV2aWV3UHJvY2Vzc2VzLmhhcyhmaWxlLnBhdGgpKSB7XG4gICAgICBjb25zb2xlLmxvZyhgUHJldmlldyBhbHJlYWR5IHJ1bm5pbmcgZm9yOiAke2ZpbGUucGF0aH1gKTtcbiAgICAgIHJldHVybjsgLy8gUHJldmlldyBhbHJlYWR5IHJ1bm5pbmdcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgYWJzdHJhY3RGaWxlID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGZpbGUucGF0aCk7XG4gICAgICBpZiAoIWFic3RyYWN0RmlsZSB8fCAhKGFic3RyYWN0RmlsZSBpbnN0YW5jZW9mIFRGaWxlKSkge1xuICAgICAgICBuZXcgTm90aWNlKGBGaWxlICR7ZmlsZS5wYXRofSBub3QgZm91bmRgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZmlsZVBhdGggPSAodGhpcy5hcHAudmF1bHQuYWRhcHRlciBhcyBhbnkpLmdldEZ1bGxQYXRoKGFic3RyYWN0RmlsZS5wYXRoKTtcbiAgICAgIGNvbnN0IHdvcmtpbmdEaXIgPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpO1xuXG4gICAgICBjb25zb2xlLmxvZyhgUmVzb2x2ZWQgZmlsZSBwYXRoOiAke2ZpbGVQYXRofWApO1xuICAgICAgY29uc29sZS5sb2coYFdvcmtpbmcgZGlyZWN0b3J5OiAke3dvcmtpbmdEaXJ9YCk7XG5cbiAgICAgIGNvbnN0IGVudlZhcnM6IE5vZGVKUy5Qcm9jZXNzRW52ID0ge1xuICAgICAgICAuLi5wcm9jZXNzLmVudixcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLnF1YXJ0b1R5cHN0LnRyaW0oKSkge1xuICAgICAgICBlbnZWYXJzLlFVQVJUT19UWVBTVCA9IHRoaXMuc2V0dGluZ3MucXVhcnRvVHlwc3QudHJpbSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhgUVVBUlRPX1RZUFNUIHNldCB0bzogJHtlbnZWYXJzLlFVQVJUT19UWVBTVH1gKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcXVhcnRvUHJvY2VzcyA9IHNwYXduKHRoaXMuc2V0dGluZ3MucXVhcnRvUGF0aCwgWydwcmV2aWV3JywgZmlsZVBhdGhdLCB7XG4gICAgICAgIGN3ZDogd29ya2luZ0RpcixcbiAgICAgICAgZW52OiBlbnZWYXJzLFxuICAgICAgfSk7XG5cbiAgICAgIGxldCBwcmV2aWV3VXJsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAgICAgcXVhcnRvUHJvY2Vzcy5zdGRvdXQ/Lm9uKCdkYXRhJywgKGRhdGE6IEJ1ZmZlcikgPT4ge1xuICAgICAgICBjb25zdCBvdXRwdXQgPSBkYXRhLnRvU3RyaW5nKCk7XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmVtaXRDb21waWxhdGlvbkxvZ3MpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgUXVhcnRvIFByZXZpZXcgT3V0cHV0OiAke291dHB1dH1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvdXRwdXQuaW5jbHVkZXMoJ0Jyb3dzZSBhdCcpKSB7XG4gICAgICAgICAgY29uc3QgbWF0Y2ggPSBvdXRwdXQubWF0Y2goL0Jyb3dzZSBhdFxccysoaHR0cDpcXC9cXC9bXlxcc10rKS8pO1xuICAgICAgICAgIGlmIChtYXRjaCAmJiBtYXRjaFsxXSkge1xuICAgICAgICAgICAgcHJldmlld1VybCA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgbmV3IE5vdGljZShgUHJldmlldyBhdmFpbGFibGUgYXQgJHtwcmV2aWV3VXJsfWApO1xuXG4gICAgICAgICAgICBjb25zdCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoJ3RhYicpO1xuICAgICAgICAgICAgbGVhZi5zZXRWaWV3U3RhdGUoe1xuICAgICAgICAgICAgICB0eXBlOiAnd2Vidmlld2VyJyxcbiAgICAgICAgICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgICAgICAgICBzdGF0ZToge1xuICAgICAgICAgICAgICAgIHVybDogcHJldmlld1VybCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLnJldmVhbExlYWYobGVhZik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcXVhcnRvUHJvY2Vzcy5zdGRlcnI/Lm9uKCdkYXRhJywgKGRhdGE6IEJ1ZmZlcikgPT4ge1xuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5lbWl0Q29tcGlsYXRpb25Mb2dzKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihgUXVhcnRvIFByZXZpZXcgRXJyb3I6ICR7ZGF0YX1gKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHF1YXJ0b1Byb2Nlc3Mub24oJ2Nsb3NlJywgKGNvZGU6IG51bWJlciB8IG51bGwpID0+IHtcbiAgICAgICAgaWYgKGNvZGUgIT09IG51bGwgJiYgY29kZSAhPT0gMCkge1xuICAgICAgICAgIG5ldyBOb3RpY2UoYFF1YXJ0byBwcmV2aWV3IHByb2Nlc3MgZXhpdGVkIHdpdGggY29kZSAke2NvZGV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hY3RpdmVQcmV2aWV3UHJvY2Vzc2VzLmRlbGV0ZShmaWxlLnBhdGgpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuYWN0aXZlUHJldmlld1Byb2Nlc3Nlcy5zZXQoZmlsZS5wYXRoLCBxdWFydG9Qcm9jZXNzKTtcbiAgICAgIG5ldyBOb3RpY2UoJ1F1YXJ0byBwcmV2aWV3IHN0YXJ0ZWQnKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHN0YXJ0IFF1YXJ0byBwcmV2aWV3OicsIGVycm9yKTtcbiAgICAgIG5ldyBOb3RpY2UoJ0ZhaWxlZCB0byBzdGFydCBRdWFydG8gcHJldmlldycpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHN0b3BQcmV2aWV3KGZpbGU6IFRGaWxlKSB7XG4gICAgY29uc3QgcXVhcnRvUHJvY2VzcyA9IHRoaXMuYWN0aXZlUHJldmlld1Byb2Nlc3Nlcy5nZXQoZmlsZS5wYXRoKTtcbiAgICBpZiAocXVhcnRvUHJvY2Vzcykge1xuICAgICAgaWYgKCFxdWFydG9Qcm9jZXNzLmtpbGxlZCkge1xuICAgICAgICBxdWFydG9Qcm9jZXNzLmtpbGwoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYWN0aXZlUHJldmlld1Byb2Nlc3Nlcy5kZWxldGUoZmlsZS5wYXRoKTtcbiAgICAgIG5ldyBOb3RpY2UoJ1F1YXJ0byBwcmV2aWV3IHN0b3BwZWQnKTtcbiAgICB9XG4gIH1cblxuICBzdG9wQWxsUHJldmlld3MoKSB7XG4gICAgdGhpcy5hY3RpdmVQcmV2aWV3UHJvY2Vzc2VzLmZvckVhY2goKHF1YXJ0b1Byb2Nlc3MsIGZpbGVQYXRoKSA9PiB7XG4gICAgICBpZiAoIXF1YXJ0b1Byb2Nlc3Mua2lsbGVkKSB7XG4gICAgICAgIHF1YXJ0b1Byb2Nlc3Mua2lsbCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5hY3RpdmVQcmV2aWV3UHJvY2Vzc2VzLmRlbGV0ZShmaWxlUGF0aCk7XG4gICAgfSk7XG4gICAgaWYgKHRoaXMuYWN0aXZlUHJldmlld1Byb2Nlc3Nlcy5zaXplID4gMCkge1xuICAgICAgbmV3IE5vdGljZSgnQWxsIFF1YXJ0byBwcmV2aWV3cyBzdG9wcGVkJyk7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFFtZFNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgcGx1Z2luOiBRbWRBc01kUGx1Z2luO1xuXG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IFFtZEFzTWRQbHVnaW4pIHtcbiAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gIH1cblxuICBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIGNvbnNvbGUubG9nKCdSZW5kZXJpbmcgc2V0dGluZ3MgdGFiLi4uJyk7XG5cbiAgICBjb250YWluZXJFbC5jcmVhdGVFbCgnaDInLCB7IHRleHQ6ICdRdWFydG8gUHJldmlldyBTZXR0aW5ncycgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdRdWFydG8gUGF0aCcpXG4gICAgICAuc2V0RGVzYygnUGF0aCB0byBRdWFydG8gZXhlY3V0YWJsZSAoZS5nLiwgcXVhcnRvLCAvdXNyL2xvY2FsL2Jpbi9xdWFydG8pJylcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCdxdWFydG8nKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5xdWFydG9QYXRoKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBRdWFydG8gcGF0aCBjaGFuZ2VkIHRvOiAke3ZhbHVlfWApO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MucXVhcnRvUGF0aCA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdFbmFibGUgRWRpdGluZyBRdWFydG8gRmlsZXMnKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgICdCeSBkZWZhdWx0LCBwbHVnaW4gYWxsb3dzIGVkaXRpbmcgLnFtZCBmaWxlcy4gRGlzYWJsZSB0aGlzIGZlYXR1cmUgaWYgdGhlcmUgaXMgYSBjb25mbGljdCB3aXRoIC5xbWQgZWRpdGluZyBlbmFibGVkIGJ5IGFub3RoZXIgcGx1Z2luJ1xuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGVcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlUW1kTGlua2luZylcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRW5hYmxlIFFNRCBFZGl0aW5nIHNldHRpbmcgY2hhbmdlZCB0bzogJHt2YWx1ZX1gKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZVFtZExpbmtpbmcgPSB2YWx1ZTtcblxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyUW1kRXh0ZW5zaW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdRVUFSVE9fVFlQU1QgVmFyaWFibGUnKVxuICAgICAgLnNldERlc2MoJ0RlZmluZSB0aGUgUVVBUlRPX1RZUFNUIGVudmlyb25tZW50IHZhcmlhYmxlIChsZWF2ZSBlbXB0eSB0byB1bnNldCknKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ2UuZy4sIHR5cHN0X3BhdGgnKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5xdWFydG9UeXBzdClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgUVVBUlRPX1RZUFNUIHNldCB0bzogJHt2YWx1ZX1gKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnF1YXJ0b1R5cHN0ID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0VtaXQgQ29tcGlsYXRpb24gTG9ncycpXG4gICAgICAuc2V0RGVzYygnVG9nZ2xlIHdoZXRoZXIgdG8gZW1pdCBkZXRhaWxlZCBjb21waWxhdGlvbiBsb2dzIGluIHRoZSBjb25zb2xlJylcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVtaXRDb21waWxhdGlvbkxvZ3MpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEVtaXQgQ29tcGlsYXRpb24gTG9ncyBzZXQgdG86ICR7dmFsdWV9YCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbWl0Q29tcGlsYXRpb25Mb2dzID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KVxuICAgICAgKTtcblxuICAgIGNvbnNvbGUubG9nKCdTZXR0aW5ncyB0YWIgcmVuZGVyZWQgc3VjY2Vzc2Z1bGx5Jyk7XG4gIH1cbn0iXSwibmFtZXMiOlsiUGx1Z2luIiwiTWFya2Rvd25WaWV3IiwiTm90aWNlIiwiVEZpbGUiLCJwYXRoIiwic3Bhd24iLCJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxNQUFNLGdCQUFnQixHQUFzQjtBQUMxQyxJQUFBLFVBQVUsRUFBRSxRQUFRO0FBQ3BCLElBQUEsZ0JBQWdCLEVBQUUsSUFBSTtBQUN0QixJQUFBLFdBQVcsRUFBRSxFQUFFO0lBQ2YsbUJBQW1CLEVBQUUsSUFBSTtDQUMxQixDQUFDO0FBRW1CLE1BQUEsYUFBYyxTQUFRQSxlQUFNLENBQUE7QUFBakQsSUFBQSxXQUFBLEdBQUE7O0FBRUUsUUFBQSxJQUFBLENBQUEsc0JBQXNCLEdBQThCLElBQUksR0FBRyxFQUFFLENBQUM7S0F1TC9EO0FBckxDLElBQUEsTUFBTSxNQUFNLEdBQUE7QUFDVixRQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUNwQyxRQUFBLElBQUk7QUFDRixZQUFBLE1BQU0sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9DLFlBQUEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFF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
