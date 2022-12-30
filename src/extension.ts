// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const MAX_COL_SIZE = 80;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vertical-displays-character-limit" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vertical-displays-character-limit.splitLines', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		
		const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
		vscode.window.showInformationMessage('Now splitting lines!');
        const selection = editor.selection;
        const text = editor.document.getText();
        const lines = text.split('\n');
		
        const newText = lines
            .map((line) => {
                if (line.length > MAX_COL_SIZE) {
                    // Split line into multiple lines at most 100 characters long
                    const lines: string[] = [];
                    let currentLine = "";
                    for (const word of line.split(" ")) {
                        if (currentLine.length + word.length + 1 > MAX_COL_SIZE) {
                            lines.push(currentLine);
                            currentLine = "";
                        }
                        currentLine += `${word} `;
                    }
                    lines.push(currentLine);
                    return lines.join('\n');
                }
                return line;
            })
            .join('\n');

        editor.edit((editBuilder) => {
			const document = editor.document;
			const fullRange = new vscode.Range(
				document.positionAt(0),
				document.positionAt(document.getText().length)
			)
            editBuilder.replace(fullRange, newText);
        });
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
