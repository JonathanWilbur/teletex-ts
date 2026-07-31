// See https://en.wikipedia.org/wiki/ITU_T.61
const teletexCharToStringCharMap: Map<number, number> = new Map([
    [ 0xA4, '$'.charCodeAt(0) ],
    [ 0xA6, '#'.charCodeAt(0) ],
    [ 0xA8, '¤'.charCodeAt(0) ], // U+00A4
    [ 0xB4, '×'.charCodeAt(0) ], // U+00D7
    [ 0xB8, '÷'.charCodeAt(0) ], // U+00F7
    [ 0xE0, 'Ω'.charCodeAt(0) ], // U+2126
    [ 0xE1, 'Æ'.charCodeAt(0) ], // U+00C6
    [ 0xE2, 'Ð'.charCodeAt(0) ], // U+00D0
    [ 0xE3, 'ª'.charCodeAt(0) ], // U+00AA
    [ 0xE4, 'Ħ'.charCodeAt(0) ], // U+0126
    [ 0xE6, 'Ĳ'.charCodeAt(0) ], // U+0132
    [ 0xE7, 'Ŀ'.charCodeAt(0) ], // U+013F
    [ 0xE8, 'Ł'.charCodeAt(0) ], // U+0141
    [ 0xE9, 'Ø'.charCodeAt(0) ], // U+00D8
    [ 0xEA, 'Œ'.charCodeAt(0) ], // U+0152
    [ 0xEB, 'º'.charCodeAt(0) ], // U+00BA
    [ 0xEC, 'Þ'.charCodeAt(0) ], // U+00DE
    [ 0xED, 'Ŧ'.charCodeAt(0) ], // U+0166
    [ 0xEE, 'Ŋ'.charCodeAt(0) ], // U+014A
    [ 0xEF, 'ŉ'.charCodeAt(0) ], // U+0149
    [ 0xF0, 'ĸ'.charCodeAt(0) ], // U+0138
    [ 0xF1, 'æ'.charCodeAt(0) ], // U+00E6
    [ 0xF2, 'đ'.charCodeAt(0) ], // U+0111
    [ 0xF3, 'ð'.charCodeAt(0) ], // U+00F0
    [ 0xF4, 'ħ'.charCodeAt(0) ], // U+0127
    [ 0xF5, 'ı'.charCodeAt(0) ], // U+0131
    [ 0xF6, 'ĳ'.charCodeAt(0) ], // U+0133
    [ 0xF7, 'ŀ'.charCodeAt(0) ], // U+0140
    [ 0xF8, 'ł'.charCodeAt(0) ], // U+0142
    [ 0xF9, 'ø'.charCodeAt(0) ], // U+00F8
    [ 0xFA, 'œ'.charCodeAt(0) ], // U+0153
    [ 0xFB, 'ß'.charCodeAt(0) ], // U+00DF
    [ 0xFC, 'þ'.charCodeAt(0) ], // U+00FE
    [ 0xFD, 'ŧ'.charCodeAt(0) ], // U+0167
    [ 0xFE, 'ŋ'.charCodeAt(0) ], // U+014B

    // Accent bytes
    [ 0xC1, 0x0300 ],
    [ 0xC2, 0x0301 ],
    [ 0xC3, 0x0302 ],
    [ 0xC4, 0x0303 ],
    [ 0xC5, 0x0304 ],
    [ 0xC6, 0x0306 ],
    [ 0xC7, 0x0307 ],
    [ 0xC8, 0x0308 ],
    [ 0xC9, 0x0308 ],
    [ 0xCA, 0x030A ],
    [ 0xCB, 0x0327 ],
    [ 0xCC, 0x0332 ],
    [ 0xCD, 0x030B ],
    [ 0xCE, 0x0328 ],
    [ 0xCF, 0x030C ],
]);

// NOTE: 0 - 127 are identical to ASCII.

/**
 * @summary Convert a T.61 / Teletex String into a normal Unicode string.
 * @description
 *
 * This implementation is not known to be correct. There is not enough test data
 * out there, and frankly, the value of this code is pretty low. Just don't use
 * Teletex. It was abandoned by the ITU, after all.
 *
 * Any characters not recognized as valid T.61 characters are simply passed
 * through to Unicode.
 *
 * This implementation handles conversion diacritic modifiers.
 *
 * @param ttex The raw bytes of the T.61 string.
 * @returns The `string` equivalent.
 */
export
function teletexToString(ttex: Uint8Array): string {
    /**
     * In T.61, the accents prefix a base character, whereas they postfix it
     * in Unicode. This variable exists to store a prefix to perform this swap.
     */
    let accent: number | undefined;
    const codePoints: number[] = [];
    for (const byte of Array.from(ttex)) {
        const equiv = teletexCharToStringCharMap.get(byte);
        if (equiv) {
            if (
                (byte >= 0xC0)
                && (byte <= 0xCF)
            ) {
                if (accent) {
                    // ChatGPT says this is the correct behavior.
                    throw new Error(); // Accent was already set.
                }
                accent = equiv;
                continue;
            }
            codePoints.push(equiv);
        } else {
            codePoints.push(byte);
        }
        if (accent) {
            codePoints.push(accent);
            accent = undefined;
        }
    }
    return String.fromCodePoint(...codePoints);
}

export default teletexToString;
