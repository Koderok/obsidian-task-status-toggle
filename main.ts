import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	s1: string;
	s2: string;
	s3: string;
	s4: string;
	s5: string;
	s6: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	s1: '🔥',
	s2: '🔺',
	s3: '🔸',
	s4: '✔︎ ',
	s5: '❌ ',
	s6: '❓'
}

interface SelectionRange {
	start: { line: number; ch: number };
	end: { line: number; ch: number };
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	private cmEditors: CodeMirror.Editor[];

	async onload() {
		await this.loadSettings();

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'set-status-1',
			name: 'Set task status 1',
			callback: () => this.setTaskStatus(this.settings.s1)
		});
		
		this.addCommand({
			id: 'set-status-2',
			name: 'Set task status 2',
			callback: () => this.setTaskStatus(this.settings.s2)
		});

		this.addCommand({
			id: 'set-status-3',
			name: 'Set task status 3',
			callback: () => this.setTaskStatus(this.settings.s3)
		});

		this.addCommand({
			id: 'set-status-4',
			name: 'Set task status 4',
			callback: () => this.setTaskStatus(this.settings.s4)
		});

		this.addCommand({
			id: 'set-status-5',
			name: 'Set task status 5',
			callback: () => this.setTaskStatus(this.settings.s5)
		});

		this.addCommand({
			id: 'set-status-6',
			name: 'Set task status 6',
			callback: () => this.setTaskStatus(this.settings.s6)
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.cmEditors = [];
		this.registerCodeMirror((cm) => {
			this.cmEditors.push(cm);
			// the callback has to be called through another function in order for 'this' to work
			// cm.on('keydown', (cm, event) => this.handleKeyDown(cm, event));
		});
	}

	setTaskStatus(status: string): void {
		let activeLeaf: any = this.app.workspace.activeLeaf;
		let editor = activeLeaf.view.sourceMode.cmEditor;
		var cursorSt = editor.getCursor();

		let lineRange = this.getLineUnderCursor(editor);
		editor.getDoc().setSelection(lineRange.start, lineRange.end);
		let lineText = editor.getSelection();

		let pos = lineText.indexOf(']');
		if (pos < 0) { return; }
		pos++;
		let prefix = lineText.substring(0, pos);
		let suffix = lineText.substring(pos).replace(/^\s+/g, '').replace(/[^\x00-\x80]/g, '').replace(/^\s+/g, '');
		let newText = prefix + ' ' + status + ' ' + suffix;

		editor.replaceSelection(newText);
	}

	getLineUnderCursor(editor: CodeMirror.Editor): SelectionRange {
		let fromCh, toCh: number;
		let cursor = editor.getCursor();

		fromCh = 0;
		toCh = editor.getLine(cursor.line).length;

		return {
			start: { line: cursor.line, ch: fromCh },
			end: { line: cursor.line, ch: toCh },
		};
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Symbol for status 1')
			.setDesc('Symbol for status 1')
			.addText(text => text
				.setPlaceholder('🔥')
				.setValue(this.plugin.settings.s1)
				.onChange(async (value) => {
					console.log('S1: ' + value);
					this.plugin.settings.s1 = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
				.setName('Symbol for status 2')
				.setDesc('Symbol for status 2')
				.addText(text => text
					.setPlaceholder('🔥')
					.setValue(this.plugin.settings.s2)
					.onChange(async (value) => {
						console.log('S2: ' + value);
						this.plugin.settings.s2 = value;
						await this.plugin.saveSettings();
					}));
		
		new Setting(containerEl)
					.setName('Symbol for status 3')
					.setDesc('Symbol for status 3')
					.addText(text => text
						.setPlaceholder('🔥')
						.setValue(this.plugin.settings.s3)
						.onChange(async (value) => {
							console.log('S3: ' + value);
							this.plugin.settings.s3 = value;
							await this.plugin.saveSettings();
						}));

		new Setting(containerEl)
						.setName('Symbol for status 4')
						.setDesc('Symbol for status 4')
						.addText(text => text
							.setPlaceholder('🔥')
							.setValue(this.plugin.settings.s4)
							.onChange(async (value) => {
								console.log('S4: ' + value);
								this.plugin.settings.s4 = value;
								await this.plugin.saveSettings();
							}));

		new Setting(containerEl)
							.setName('Symbol for status 5')
							.setDesc('Symbol for status 5')
							.addText(text => text
								.setPlaceholder('🔥')
								.setValue(this.plugin.settings.s5)
								.onChange(async (value) => {
									console.log('S5: ' + value);
									this.plugin.settings.s5 = value;
									await this.plugin.saveSettings();
								}));
					
		new Setting(containerEl)
								.setName('Symbol for status 6')
								.setDesc('Symbol for status 6')
								.addText(text => text
									.setPlaceholder('🔥')
									.setValue(this.plugin.settings.s6)
									.onChange(async (value) => {
										console.log('S6: ' + value);
										this.plugin.settings.s6 = value;
										await this.plugin.saveSettings();
									}));
	}
}
