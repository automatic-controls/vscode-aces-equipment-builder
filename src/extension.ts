import * as vscode from 'vscode';
export function activate(context: vscode.ExtensionContext){
  context.subscriptions.push(vscode.languages.registerHoverProvider('acesebconfig',{
    provideHover(document, position, token){
      let str = document.lineAt(position.line).text;
      return new vscode.Hover(str);
    }
  }));
}
export function deactivate(){}