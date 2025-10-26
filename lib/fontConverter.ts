import opentype from 'opentype.js';

export interface ConversionOptions {
  reverseWinding?: boolean;
  restrictCharacters?: boolean;
  characterRange?: string;
  characterSet?: string;
  outputFormat: 'json' | 'javascript';
}

export interface FontData {
  glyphs: {
    [char: string]: {
      ha: number;
      x_min: number;
      x_max: number;
      o: string;
    };
  };
  familyName: string;
  ascender: number;
  descender: number;
  underlinePosition: number;
  underlineThickness: number;
  boundingBox: {
    yMin: number;
    yMax: number;
    xMin: number;
    xMax: number;
  };
  resolution: number;
  original_font_information: {
    format: number;
    copyright?: string;
    postscript_name?: string;
    version_string?: string;
    full_font_name?: string;
    font_family_name?: string;
    font_subfamily_name?: string;
  };
}

function reverseCommands(commands: string): string {
  const cmdArray: string[] = [];
  const commandParts = commands.split(' ');

  for (let i = 0; i < commandParts.length; i++) {
    const cmd = commandParts[i];
    if (cmd === 'm' || cmd === 'l') {
      cmdArray.push(cmd);
      cmdArray.push(commandParts[++i]);
      cmdArray.push(commandParts[++i]);
    } else if (cmd === 'q') {
      cmdArray.push(cmd);
      cmdArray.push(commandParts[++i]);
      cmdArray.push(commandParts[++i]);
      cmdArray.push(commandParts[++i]);
      cmdArray.push(commandParts[++i]);
    } else if (cmd === 'b') {
      cmdArray.push(cmd);
      cmdArray.push(commandParts[++i]);
      cmdArray.push(commandParts[++i]);
      cmdArray.push(commandParts[++i]);
      cmdArray.push(commandParts[++i]);
      cmdArray.push(commandParts[++i]);
      cmdArray.push(commandParts[++i]);
    }
  }

  const reversed: string[] = [];
  for (let i = cmdArray.length - 1; i >= 0; ) {
    const cmd = cmdArray[i];
    if (cmd === 'm' || cmd === 'l') {
      reversed.push(cmdArray[i - 2]);
      reversed.push(cmdArray[i - 1]);
      reversed.push(cmdArray[i]);
      i -= 3;
    } else if (cmd === 'q') {
      reversed.push(cmdArray[i - 4]);
      reversed.push(cmdArray[i - 3]);
      reversed.push(cmdArray[i - 2]);
      reversed.push(cmdArray[i - 1]);
      reversed.push(cmdArray[i]);
      i -= 5;
    } else if (cmd === 'b') {
      reversed.push(cmdArray[i - 6]);
      reversed.push(cmdArray[i - 5]);
      reversed.push(cmdArray[i - 2]);
      reversed.push(cmdArray[i - 1]);
      reversed.push(cmdArray[i - 4]);
      reversed.push(cmdArray[i - 3]);
      reversed.push(cmdArray[i]);
      i -= 7;
    } else {
      i--;
    }
  }

  return reversed.join(' ');
}

export async function convertFont(
  arrayBuffer: ArrayBuffer,
  options: ConversionOptions
): Promise<string> {
  const font = opentype.parse(arrayBuffer);
  const resolution = 1000;
  const scale = (1 * resolution) / font.unitsPerEm;

  const fontData: FontData = {
    glyphs: {},
    familyName: font.names.fontFamily.en || font.names.fullName.en,
    ascender: Math.round(font.ascender * scale),
    descender: Math.round(font.descender * scale),
    underlinePosition: font.tables.post.underlinePosition * scale,
    underlineThickness: font.tables.post.underlineThickness * scale,
    boundingBox: {
      yMin: font.tables.head.yMin * scale,
      yMax: font.tables.head.yMax * scale,
      xMin: font.tables.head.xMin * scale,
      xMax: font.tables.head.xMax * scale,
    },
    resolution: resolution,
    original_font_information: {
      format: 0,
      copyright: font.names.copyright?.en,
      postscript_name: font.names.postScriptName?.en,
      version_string: font.names.version?.en,
      full_font_name: font.names.fullName?.en,
      font_family_name: font.names.fontFamily?.en,
      font_subfamily_name: font.names.fontSubfamily?.en,
    },
  };

  let glyphsToProcess: Array<{ char: string; glyphIndex: number }> = [];

  if (options.restrictCharacters) {
    let charSet: string[] = [];
    if (options.characterRange) {
      const parts = options.characterRange.split('-');
      if (parts.length === 2) {
        const start = parseInt(parts[0]);
        const end = parseInt(parts[1]);
        for (let i = start; i <= end; i++) {
          charSet.push(String.fromCharCode(i));
        }
      }
    } else if (options.characterSet) {
      charSet = options.characterSet.split('');
    }

    for (const char of charSet) {
      const glyph = font.charToGlyph(char);
      if (glyph && glyph.index !== 0) {
        glyphsToProcess.push({ char, glyphIndex: glyph.index });
      }
    }
  } else {
    // Export all glyphs in the font
    for (let i = 0; i < font.glyphs.length; i++) {
      const glyph = font.glyphs.get(i);
      if (!glyph || glyph.index === 0) continue;

      // Get all unicode values for this glyph
      const unicodes = glyph.unicodes || [];
      if (unicodes.length > 0) {
        for (const unicode of unicodes) {
          const char = String.fromCharCode(unicode);
          glyphsToProcess.push({ char, glyphIndex: glyph.index });
        }
      }
    }
  }

  for (const { char, glyphIndex } of glyphsToProcess) {
    const glyph = font.glyphs.get(glyphIndex);
    if (!glyph) continue;

    const path = glyph.getPath(0, 0, font.unitsPerEm);
    let commandString = '';

    for (const cmd of path.commands) {
      if (cmd.type === 'M') {
        commandString += `m ${Math.round(cmd.x * scale)} ${Math.round(cmd.y * scale)} `;
      } else if (cmd.type === 'L') {
        commandString += `l ${Math.round(cmd.x * scale)} ${Math.round(cmd.y * scale)} `;
      } else if (cmd.type === 'Q') {
        commandString += `q ${Math.round(cmd.x1 * scale)} ${Math.round(cmd.y1 * scale)} ${Math.round(cmd.x * scale)} ${Math.round(cmd.y * scale)} `;
      } else if (cmd.type === 'C') {
        // Convert cubic to quadratic (simplified)
        commandString += `b ${Math.round(cmd.x1 * scale)} ${Math.round(cmd.y1 * scale)} ${Math.round(cmd.x2 * scale)} ${Math.round(cmd.y2 * scale)} ${Math.round(cmd.x * scale)} ${Math.round(cmd.y * scale)} `;
      } else if (cmd.type === 'Z') {
        // Close path - no action needed
      }
    }

    if (options.reverseWinding) {
      commandString = reverseCommands(commandString.trim());
    }

    const bbox = glyph.getBoundingBox();
    fontData.glyphs[char] = {
      ha: Math.round(glyph.advanceWidth * scale),
      x_min: Math.round(bbox.x1 * scale),
      x_max: Math.round(bbox.x2 * scale),
      o: commandString.trim(),
    };
  }

  if (options.outputFormat === 'javascript') {
    const varName = fontData.familyName.replace(/[^a-zA-Z0-9]/g, '_');
    return `if (typeof _typeface_js === 'undefined' || typeof _typeface_js.loadFace !== 'function') {\n` +
      `  var _typeface_js = { faces: _typeface_js.faces, loadFace: function(typefaceData) { this.faces.push(typefaceData); } };\n` +
      `}\n\n` +
      `_typeface_js.loadFace(${JSON.stringify(fontData, null, 2)});`;
  } else {
    return JSON.stringify(fontData, null, 2);
  }
}
