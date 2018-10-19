import { commands, ExtensionContext } from 'vscode';
import { cat } from './lol';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(commands.registerCommand('lol.cat', cat));
}
