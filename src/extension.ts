import * as vscode from 'vscode';
const groupMatcher = new RegExp("^\\s*Group\\([^\\(\\)]*\\)\\[\\s*$");
const scriptMatcher = new RegExp("^\\s*(?:PreScript|PostScript)\\([^\\(\\)]*\\)\\[\\s*$");
const valueMatcher = new RegExp("^\\s*(?:///\\s*)?Value\\(.*?\\)\\s*$");
const conditionMatcher = new RegExp("^\\s*(?:///\\s*)?Condition\\(.*?\\)\\s*$");
export function activate(context: vscode.ExtensionContext){
  context.subscriptions.push(vscode.languages.registerHoverProvider('acesebconfig',{
    provideHover(document, position, token){
      const r = document.getWordRangeAtPosition(position);
      const word = document.getText(r);
      const line = document.lineAt(position.line).text;
      const markdown = new vscode.MarkdownString();
      //TODO - edit the PreScript,PostScript,Value,Condition hover text to mimic the Group format.
      //
      switch (word){
        case "Group": {
          if (groupMatcher.test(line)){
            markdown.appendMarkdown(
              " **Usage**  \n"+
              " - Group(*min*, *max*)  \n"+
              " - Group(*max*)  \n  \n"+
              " **Parameters**  \n"+
              " - *min* - The minimum number of selections to be enforced for this grouping.  \n"+
              "   Any positive integer.  \n"+
              " - *max* - The maximum number of selections to be enforced for this grouping.  \n"+
              "   Any positive integer or INF to represent infinity."
            );
          }else{
            return;
          }
          break;
        }
        case "PreScript": case "PostScript": {
          if (scriptMatcher.test(line)){
            markdown.appendCodeblock('/* Usage: '+word+'(item) or '+word+'().\n     item - contents will be used for script generation whenever this item is selected.\n       If item is not specified, then contents are included whenever the parent directory is selected.\n       PreScript/PostScript sections are included before/after item is processed, respectively.\nExample: */\n'+word+'(item)[\n  System.out.println("[<item|VALUE>]");\n]', 'acesebconfig');
          }else{
            return;
          }
          break;
        }
        case "Value": {
          if (valueMatcher.test(line)){
            markdown.appendCodeblock('/* Usage Value(item,def,min,inc,max) or Value(def,min,inc,max).\n     item - specifies the item to .\n       If item is not specified, then this statement corresponds to the parent directory.\n     ', 'acesebconfig');
          }else{
            return;
          }
          break;
        }
        case "Condition": {
          if (conditionMatcher.test(line)){
            markdown.appendCodeblock('', 'acesebconfig');
          }else{
            return;
          }
          break;
        }
        default: {
          return;
        }
      }
      return new vscode.Hover(markdown, r);
    }
  }));
}
export function deactivate(){}