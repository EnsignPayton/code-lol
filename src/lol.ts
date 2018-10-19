import { window, Range } from 'vscode';

function padString(str: string, targetLength: number, padStart: boolean = false, padWith: string = ' '): string {
  if (str.length >= targetLength) {
    return str;
  }

  // Ensure one char, default to space
  if (padWith.length === 0) {
    padWith = ' ';
  } else if (padWith.length > 1) {
    padWith = padWith[0];
  }

  const padLength = targetLength - str.length;
  const pad = padWith.repeat(padLength);

  return padStart ? pad + str : str = pad;
}

function makeColor(val: number, offset: number): string {
  const num = Math.floor(Math.sin(val + offset) * 127 + 128);
  const str = num.toString(16);
  return padString(str, 2, true, '0');
}

function rainbow(freq: number, i: number): string {
  const red   = makeColor(freq * i, 0);
  const green = makeColor(freq * i, 2 * Math.PI / 3);
  const blue  = makeColor(freq * i, 4 * Math.PI / 3);
  return `#${red}${green}${blue}`;
}

interface CharacterPosition {
  lineNum: number;
  linePos: number;
}

interface ColorDictionary {
  [key: string]: CharacterPosition[];
}

function addToDict(dict: ColorDictionary, color: string, pos: CharacterPosition): void {
  if (!dict[color]) {
    dict[color] = [];
  }

  dict[color].push(pos);
}

export function cat(freq: number = 0.3, spread: number = 8.0): void {
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }

  let os = Math.floor(Math.random() * 255);

  const dict: ColorDictionary = {};
  for (let i = 0; i < editor.document.lineCount; i++) {
    os++;
    const line = editor.document.lineAt(i).text;
    for (let j = 0; j < line.length; j++) {
      const color = rainbow(freq, os + j / spread);
      addToDict(dict, color, {lineNum: i, linePos: j});
    }
  }

  Object.keys(dict).forEach((key) => {
    const decorationType = window.createTextEditorDecorationType({color: key});
    const ranges = dict[key].map(({lineNum, linePos}) => {
      return new Range(lineNum, linePos, lineNum, linePos + 1);
    });
    editor.setDecorations(decorationType, ranges);
  });

  return;
}
