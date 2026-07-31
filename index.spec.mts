import { teletexToString } from "./index.mjs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("teletexToString", () => {
    it("translates unequivalent characters", () => {
        const encoder = new TextEncoder();
        const input = Uint8Array.from([
            ...encoder.encode("Big"),
            0xA4,
            ...encoder.encode("Money"),
            0xA4,
        ]);
        const output = teletexToString(input);
        assert.equal(output, "Big$Money$");
    });

    it("transposes and translates diacritics", () => {
        const encoder = new TextEncoder();
        const input = Uint8Array.from([
            ...encoder.encode("BigB"),
            0xC4,
            "o".charCodeAt(0),
            0xC5,
            "i".charCodeAt(0),
        ]);
        const output = teletexToString(input);
        assert.equal(output, "BigBo\u{0303}i\u{0304}");
    });

    it("decodes an empty string", () => {
        const input = new Uint8Array();
        const output = teletexToString(input);
        assert.equal(output, "");
    });

    it("throws when encountering a double accent", () => {
        const encoder = new TextEncoder();
        const input = Uint8Array.from([
            ...encoder.encode("BigB"),
            0xC4,
            0xC4,
            "o".charCodeAt(0),
            0xC5,
            "i".charCodeAt(0),
        ]);
        assert.throws(() => {
            teletexToString(input);
        });
    })
});
