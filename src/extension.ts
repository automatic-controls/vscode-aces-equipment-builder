import * as vscode from 'vscode';
export function activate(context: vscode.ExtensionContext){
  const groupMatcher = new RegExp("^\\s*Group\\([^\\(\\)]*\\)\\[\\s*$");
  const groupRefMatcher = new RegExp("^\\(\\s*\\d+\\s*,\\s*\\d+\\s*\\)");
  const scriptMatcher = new RegExp("^\\s*(?:PreScript|PostScript)\\([^\\(\\)]*\\)\\[\\s*$");
  const valueMatcher = new RegExp("^\\s*(?:///\\s*)?Value\\(.*?\\)\\s*$");
  const conditionMatcher = new RegExp("^\\s*(?:///\\s*)?Condition\\(.*?\\)\\s*$");
  const ifThenMatcher = new RegExp("^\\s*(?:If ?\\[|\\]( ?)Then\\1\\[)\\s*$", "i");
  //TODO - add error checking and auto-completion for ref names and paths
  //TODO - add auto-completion for <path|var> variables
  context.subscriptions.push(vscode.languages.registerHoverProvider('acesebconfig',{
    provideHover(document, position, token){
      const r = document.getWordRangeAtPosition(position);
      if (r===undefined){
        return;
      }
      const word = document.getText(r);
      const word_ = word.toUpperCase();
      const line = document.lineAt(position.line).text;
      const markdown = new vscode.MarkdownString();
      function checkVariables(){
        const len = line.length;
        var b = false;
        var c:string;
        for (var i = r!.end.character;i<len;++i){
          c = line.charAt(i);
          if (c==='>'){
            b = true;
            break;
          }else if (c!==' '){
            break;
          }
        }
        if (b){
          b = false;
          for (i = r!.start.character-1;i>=0;--i){
            c = line.charAt(i);
            if (c==='|'){
              b = true;
              break;
            }else if (c==='<' || c==='>'){
              break;
            }
          }
          if (b){
            b = false;
            for (--i;i>=0;--i){
              c = line.charAt(i);
              if (c==='<'){
                b = true;
                break;
              }else if (c==='|' || c==='>'){
                break;
              }
            }
            if (b){
              switch (word_){
                case "SELECTED": {
                  markdown.appendMarkdown(
                    " **Description**  \n"+
                    " - `true` if this item is selected. Also requires that all parents are selected.  \n"+
                    " - `false` otherwise."
                  );
                  break;
                }
                case "@SELECTED": {
                  markdown.appendMarkdown(
                    " **Description**  \n"+
                    " - `true` if this item is selected.  \n"+
                    " - `false` otherwise."
                  );
                  break;
                }
                case "VISIBLE": {
                  markdown.appendMarkdown(
                    " **Description**  \n"+
                    " - `true` if this item is visible. Also requires that all parents are selected and visible.  \n"+
                    " - `false` otherwise."
                  );
                  break;
                }
                case "@VISIBLE": {
                  markdown.appendMarkdown(
                    " **Description**  \n"+
                    " - `true` if this item is visible.  \n"+
                    " - `false` otherwise."
                  );
                  break;
                }
                case "LOCKED": {
                  markdown.appendMarkdown(
                    " **Description**  \n"+
                    " - `true` if this item is locked.  \n"+
                    " - `false` otherwise."
                  );
                  break;
                }
                case "VALUECHANGING": {
                  markdown.appendMarkdown(
                    " **Description**  \n"+
                    " - `true` if this item's value is currently controlled by the arrow keys.  \n"+
                    " - `false` otherwise."
                  );
                  break;
                }
                case "EXISTS": {
                  markdown.appendMarkdown(
                    " **Description**  \n"+
                    " - `true` if this item exists.  \n"+
                    " - `false` otherwise."
                  );
                  break;
                }
                case "VALUE": {
                  markdown.appendMarkdown(
                    " **Description**  \n"+
                    " - The integral value given to this item by the user.  \n"+
                    " - Typically paired with a `Value` statement as shown below.  \n"
                  );
                  markdown.appendCodeblock("item \"Item[<|SELECTED>? <|VALUE>:]\"\nValue(item, 0, 0, 1, 10)", "acesebconfig");
                  break;
                }
                case "MIN": case "MINIMUM": {
                  markdown.appendMarkdown(
                    " **Description**  \n"+
                    " - The minimum value as specified by a `Value` statement."
                  );
                  break;
                }
                case "MAX": case "MAXIMUM": {
                  markdown.appendMarkdown(
                    " **Description**  \n"+
                    " - The miximum value as specified by a `Value` statement."
                  );
                  break;
                }
                case "INCREMENT": {
                  markdown.appendMarkdown(
                    " **Description**  \n"+
                    " - The increment as specified by a `Value` statement."
                  );
                  break;
                }
                case "DISPLAYNAME": {
                  markdown.appendMarkdown(
                    " **Description**  \n"+
                    " - The display name of an item as shown in the application."
                  );
                  break;
                }
                case "REFERENCENAME": {
                  markdown.appendMarkdown(
                    " **Description**  \n"+
                    " - The reference name of an item."
                  );
                  break;
                }
                case "EQUIPMENTNAME": {
                  markdown.appendMarkdown(
                    " **Description**  \n"+
                    " - The equipment name entered into the application by the user."
                  );
                  break;
                }
                case "FILEPATH": {
                  markdown.appendMarkdown(
                    " **Description**  \n"+
                    " - The filepath of the locally stored file corresponding to an item.  \n"+
                    " - File extensions (.logicsymbol) are omitted."
                  );
                  break;
                }
                default: {
                  markdown.appendMarkdown(
                    " **Error**  \n"+
                    " - "+word+" is not a valid attribute.  \n  \n"+
                    " **Attribute List**  \n"+
                    " - `SELECTED`  \n"+
                    "   - Whether this item is selected to be included in script generation.  \n"+
                    " - `@SELECTED`  \n"+
                    "   - Whether this item is selected. Ignores parent properties.  \n"+
                    " - `VISIBLE`  \n"+
                    "   - Whether this item is visible to the user in the application.  \n"+
                    " - `@VISIBLE`  \n"+
                    "   - Whether this item is visible. Ignores parent properties.  \n"+
                    " - `LOCKED`  \n"+
                    "   - Whether this item is locked.  \n"+
                    " - `VALUECHANGING`  \n"+
                    "   - Whether this item's value is currently controlled by the arrow keys.  \n"+
                    " - `EXISTS`  \n"+
                    "   - Whether this item exists.  \n"+
                    " - `VALUE`  \n"+
                    "   - The integral value given to this item by the user.  \n"+
                    " - `MIN`  \n"+
                    "   - The minimum value as specified by a `Value` statement.  \n"+
                    " - `MINIMUM`  \n"+
                    "   - The minimum value as specified by a `Value` statement.  \n"+
                    " - `MAX`  \n"+
                    "   - The maximum value as specified by a `Value` statement.  \n"+
                    " - `MAXIMUM`  \n"+
                    "   - The maximum value as specified by a `Value` statement.  \n"+
                    " - `INCREMENT`  \n"+
                    "   - The increment as specified by a `Value` statement.  \n"+
                    " - `DISPLAYNAME`  \n"+
                    "   - The display name of an item as shown in the application.  \n"+
                    " - `REFERENCENAME`  \n"+
                    "   - The reference name of an item.  \n"+
                    " - `EQUIPMENTNAME`  \n"+
                    "   - The equipment name entered into the application by the user.  \n"+
                    " - `FILEPATH`  \n"+
                    "   - The filepath of the locally stored file corresponding to an item."
                  );
                }
              }
            }else{
              return;
            }
          }else{
            return;
          }
        }else{
          return;
        }
      }
      switch (word_){
        case "GROUP": {
          if (groupMatcher.test(line)){
            markdown.appendMarkdown(
              " **Usage**  \n"+
              " - `Group(min, max)[ ... ]`  \n"+
              " - `Group(max)[ ... ]`  \n"+
              " **Parameters**  \n"+
              " - `min` - The minimum number of selections to enforce for this grouping.  \n"+
              "   - Any positive integer.  \n"+
              " - `max` - The maximum number of selections to enforce for this grouping.  \n"+
              "   - Any positive integer or `INF` to specify infinity.  \n"+
              " **Description**  \n"+
              " - Specifies a grouping of items which affects the application in the following ways.  \n"+
              "   - If less than `min` items are selected, then grouped items are shown in red, and script generation is disabled.  \n"+
              "   - When `max` items are selected, the leftover items are hidden, effectively preventing the user from exceeding `max` selections.  \n"+
              " **Example**  \n"
            );
            markdown.appendCodeblock("Group(1,1)[\n  item1\n  item2\n]", "acesebconfig");
          }else if (groupRefMatcher.test(line.substring(r.end.character))){
            markdown.appendMarkdown(
              " **Usage**  \n"+
              " - `...\\Group(n,m)\\...`  \n"+
              " **Parameters**  \n"+
              " - `n` - Refers to the `nth` grouping defined in the configuration file of the previous item.  \n"+
              "   - Any positive integer.  \n"+
              " - `m` - Refers to the `mth` selected element of the group specified by `n`.  \n"+
              "   - Any positive integer.  \n"+
              " **Description**  \n"+
              " - This syntax may be used as an element of a relative or absolute path to refer to the `mth` selected item of the `nth` group.  \n"+
              " - Cannot be used inside standard `IF`-`THEN` statement blocks. Expressions can be used as a workaround as shown in the example.  \n"+
              " **Example**  \n"
            );
            markdown.appendCodeblock("If [\n  //Bad:\n  ~\\Group(1,1)\n  //Good:\n  < ~\\Group(1,1) | SELECTED >\n] Then [\n  !-!*dir\\item\n]", "acesebconfig");
          }else{
            return;
          }
          break;
        }
        case "PRESCRIPT": case "POSTSCRIPT": {
          if (scriptMatcher.test(line)){
            markdown.appendMarkdown(
              " **Usage**  \n"+
              " - `"+word+"(item)`  \n"+
              " - `"+word+"()`  \n"+
              " **Parameters**  \n"+
              " - `item` - When `item` is selected, the contents of this codeblock will be included in the generated script."+
              " If `item` is unspecified, then contents are included whenever the parent directory is selected (as specified by the location of this configuration file).  \n"+
              " **Desciption**  \n"+
              " - Specifies a codeblock that is included in the generated EIKON script when `item` is selected."+
              " The application recursively generates the script using a depth-first search starting with the root library folder."+
              " `PreScript`/`PostScript` codeblocks are included before/after `item`'s children are processed, respectively.  \n"+
              " - `[< path | variable >]` constructs may be used to reference application variables within codeblocks."+
              " `path` is resolved relative to `item`.  \n"+
              " **Example**  \n"
            );
            markdown.appendCodeblock(word+"()[\n  System.out.println(\"[<|FILEPATH>]\");\n]", "acesebconfig");
          }else{
            return;
          }
          break;
        }
        case "VALUE": {
          if (valueMatcher.test(line)){
            markdown.appendMarkdown(
              " **Usage**  \n"+
              " - `Value(item, def, min, inc, max)`  \n"+
              " - `Value(def, min, inc, max)`  \n"+
              " **Parameters**  \n"+
              " - `item` - Indicates the item that this statement applies to."+
              " If `item` is unspecified, then this statement applies to the parent directory (as specified by the location of this configuration file).  \n"+
              " - `def` - The default value.  \n"+
              "   - Any integer that satisfies `min<=def<=max`.  \n"+
              " - `min` - The minimum value.  \n"+
              "   - Any integer or `-INF` to specify negative infinity.  \n"+
              " - `inc` - The increment used for value modification.  \n"+
              "   - Any positive integer.  \n"+
              " - `max` - The maximum value.  \n"+
              "   - Any integer or `INF` to specify infinity.  \n"+
              " **Description**  \n"+
              " - If `item` is selected in the application, then arrow keys may be used to change the `VALUE` parameter corresponding to `item`."+
              " The arrow keys increase or decrease `VALUE` by `inc` with each keystoke."+
              " `VALUE` is constrained to lie between `min` and `max` (inclusive)."+
              " `VALUE` is given the default value `def` on initialization.  \n"+
              " - For transparency, it is recommended to show `VALUE` in the display name of `item`.  \n"+
              " **Example**  \n"
            );
            markdown.appendCodeblock("item \"Item[<|SELECTED>? <|VALUE>:]\"\nValue(item, 0, 0, 1, 10)", "acesebconfig");
          }else{
            checkVariables();
          }
          break;
        }
        case "CONDITION": {
          if (conditionMatcher.test(line)){
            markdown.appendMarkdown(
              " **Usage**  \n"+
              " - `Condition(item, expr, \"msg\")`  \n"+
              " - `Condition(expr, \"msg\")`  \n"+
              " **Parameters**  \n"+
              " - `item` - Indicates the item that this statement applies to."+
              " If `item` is unspecified, then this statement applies to the parent directory (as specified by the location of this configuration file).  \n"+
              " - `expr` - Any expression evaluating to `1` (true) or `0` (false). Paths in `expr` are resolved relative to `item`.  \n"+
              " - `msg` - The error message to display if `expr` evaluates to `0` (false) when attempting to generate an EIKON script. Note this parameter must be enclosed in double quotes.  \n"+
              " **Description**  \n"+
              " - Specifies a condition (`expr`) that must be satisfied in order to generate a script."+
              " If `expr` is not satisfied, then `msg` will be shown to the user as an error message."+
              " Conditions are evaluated only when the corresponding `item` is selected.  \n"+
              " **Example**  \n"
            );
            markdown.appendCodeblock("Condition(item, <|VALUE>!=0, \"Please give item a non-zero value.\")", "acesebconfig");
          }else{
            return;
          }
          break;
        }
        case "IF": case "THEN": {
          if (ifThenMatcher.test(line)){
            markdown.appendMarkdown(
              " **Description**  \n"+
              " - `IF`-`THEN` statements are used to trigger actions in the application when certain conditions are met."+
              " The `IF` block specifies a list of conditions which are to be satisfied."+
              " The `THEN` block specifies a list of conditions to enforce when all `IF` block conditions have been satisfied."+
              " `IF`-`THEN` statements are evaluated only when the parent directory is selected (as specified by the location of this configuration file).  \n"+
              " **Modifiers**  \n"+
              " - Either block can refer to an item using reference name paths (relative and absolute). Relative paths are resolved relative to the parent directory."+
              " Once an item has been specified, modifiers (listed below) tell the application what to do.  \n"+
              "   - `+` Requires that the item is selected. Additionally requires that all parents are selected.  \n"+
              "   - `!+` Requires that the item is deselected. Also satisfied in `IF` blocks when any parent is deselected.  \n"+
              "   - `-` Requires that the item is hidden. Also satisfied in `IF` blocks when any parent is hidden or deselected.  \n"+
              "   - `!-` Requires that the item is visible. Additionally requires that all parents are selected and visible.  \n"+
              "   - `*` Requires that the item is locked.  \n"+
              "   - `!*` Requires that the item is unlocked.  \n"+
              "   - `@` Tells the application to ignore parent properties for all other modifiers."+
              " For instance, `@+` requires the item is selected without imposing any conditions on whether parents are selected.  \n"+
              " - Modifers can be used in any combination and order. If no modifier is specified, then `+` is given as the default modifer. If `!` is the only modifier, then `!+` is given as the default modifier.  \n"+
              " **Additional Syntax**  \n"+
              " - `IF` blocks may contain any expression evaluating to `1` (true) or `0` (false).  \n"+
              " - `THEN` blocks can contain assignment expressions for the variables `VALUE`, `MIN`, `MAX`, `MINIMUM`, `MAXIMUM`, and `INCREMENT`. Refer to the last line of the example.  \n"+
              " **Warning** \n"+
              " - Be careful not to create infinite loops.  \n"+
              " - `...\\Group(n,m)\\...` syntax cannot be used in standard `IF`-`THEN` statements since each path is resolved on initialization (to improve performance)."+
              " However, group references can be used inside expressions as specified in the *Additional Syntax* section.  \n"+
              " **Example**  \n"
            );
            markdown.appendCodeblock("If [\n  dir1\\dir2\\item1\n  + !- @ item2\n  < item3\\Group(1,2) | VALUE >!=0\n] Then [\n  !dir3\\item4\n  <item5|MIN> = <item3|VALUE>\n]", "acesebconfig");
          }else{
            return;
          }
          break;
        }
        default: {
          checkVariables();
        }
      }
      return new vscode.Hover(markdown, r);
    }
  }));
}
export function deactivate(){}