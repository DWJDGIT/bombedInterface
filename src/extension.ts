// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "bombedInterface" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let bombed = vscode.commands.registerTextEditorCommand(
    "extension.bombedInterface",
    (textEditor) => {
      const { document, selections, selection } = textEditor;
      const selectionTransformed = selections.map((selection) => {
        const text = document.getText(selection);
        if (text.length) {
          return text;
        } else {
          return "no select";
        }
      });
      if (selectionTransformed[0] === "no select") {
        vscode.window.showErrorMessage("No valid selected content!");
      } else {
        const selectItem = selectionTransformed[0].split("\n");
        const result = selectItem.map((item) => {
          let property = "";
          let match = item.split(":")[0].includes("?");
          if (match) {
            property = item.split(":")[0].split("?")[0].trim();
          } else {
            property = item.split(":")[0].trim();
          }
          let type = "";
          let exegesis = "";
          if (item.includes("//")) {
            const left = item.split("//")[0];
            if (left.includes(";")) {
              type = item.split(":")[1].split(";")[0].trim();
            } else {
              type = item.split(":")[1].split("//")[0].trim();
            }
            exegesis = item.split("//")[1].trim();
            return { property, type, exegesis };
          } else {
            if (item.includes(";")) {
              type = item.split(":")[1].split(";")[0].trim();
            } else {
              type = item.split(":")[1].trim();
            }
            return { property, type };
          }
        });
        console.log(result);
        let exegesis = "/**\n" + " * @description:  \n";
        result.forEach((item) => {
          exegesis +=
            ` * @param { ${item.type} } ${item.property}` +
            `${item.exegesis ? " " + item.exegesis : ""}\n`;
        });
        exegesis += " */\n";
        console.log(exegesis);
        vscode.window.activeTextEditor?.edit((editBuilder) => {
          let startLine = selection.start.line;
          let lastCharIndex = document.lineAt(startLine).text.length;
          let position = new vscode.Position(
            startLine - 2 <= 0 ? 0 : startLine - 1,
            0
          );
          editBuilder.insert(position, exegesis);
          vscode.window.setStatusBarMessage(
            "Here are your TypeScript interfaces exegesis... Happy! :)"
          );
        });
      }
    }
  );

  context.subscriptions.push(bombed);
}

// this method is called when your extension is deactivated
export function deactivate() {}
