import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	s1: string;
	s2: string;
	s3: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	s1: '🔥',
	s2: '🔺',
	s3: '🔸'
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

		let newText = lineText + status;
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

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
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
	}
}
