import { describe, it, expect } from "bun:test";
import { parse } from "../src/index";

describe("Table Parser", () => {
  it("parses basic table", () => {
    const doc = parse("| H1 | H2 |\n|---|---|\n| D1 | D2 |");
    const table = doc.content[0] as any;
    expect(table.type).toBe("table");
    expect(table.headers.length).toBe(2);
    expect(table.rows.length).toBe(1);
    expect(table.rows[0].length).toBe(2);
  });

  it("parses table alignment", () => {
    const doc = parse("| Left | Center | Right |\n|:---|:---:|---:|\n| a | b | c |");
    const table = doc.content[0] as any;
    expect(table.alignments).toEqual(["left", "center", "right"]);
  });

  it("parses table with text decoration in cells", () => {
    const doc = parse("| Feature | Example |\n|---|---|\n| Bold | **bold** |");
    const table = doc.content[0] as any;
    const cell = table.rows[0][1];
    expect(cell.children[0].type).toBe("bold");
  });

  it("handles escaped pipes in cells", () => {
    const doc = parse("| Col |\n|---|\n| pipe \\| here |");
    const table = doc.content[0] as any;
    expect(table.rows.length).toBe(1);
  });

  it("handles table without leading/trailing pipes", () => {
    const doc = parse("H1|H2\n---|---\nD1|D2");
    const table = doc.content[0] as any;
    expect(table.type).toBe("table");
    expect(table.headers.length).toBe(2);
  });

  it("parses multiple data rows", () => {
    const doc = parse("| H1 | H2 |\n|---|---|\n| A | B |\n| C | D |\n| E | F |");
    const table = doc.content[0] as any;
    expect(table.rows.length).toBe(3);
  });
});
