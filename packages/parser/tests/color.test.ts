import { describe, it, expect } from "bun:test";
import { parse } from "../src/index";

describe("Color Syntax", () => {
  it("parses named foreground color", () => {
    const doc = parse("|red,this is red|");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "color",
      foreground: "red",
      background: null,
    });
  });

  it("parses f# foreground color with hex", () => {
    const doc = parse("|f#00FF00,green text|");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "color",
      foreground: "#00FF00",
      background: null,
    });
  });

  it("parses f# foreground color with named color", () => {
    const doc = parse("|f#red,red text|");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "color",
      foreground: "red",
      background: null,
    });
  });

  it("parses b# background color", () => {
    const doc = parse("|b#0000FF,blue bg|");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "color",
      foreground: null,
      background: "#0000FF",
    });
  });

  it("parses both foreground and background", () => {
    const doc = parse("|f#yellow,b#green,colored text|");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "color",
      foreground: "yellow",
      background: "green",
    });
  });

  it("parses background then foreground order", () => {
    const doc = parse("|b#black,f#white,white on black|");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "color",
      foreground: "white",
      background: "black",
    });
  });

  it("handles escaped color with backslash pipe", () => {
    const doc = parse("\\|red,not colored\\|");
    const para = doc.content[0] as any;
    // Should be plain text with literal pipes
    const text = para.children.map((n: any) => n.type === "text" ? n.value : "").join("");
    expect(text).toContain("|red,not colored|");
  });

  it("handles escaped f# tag", () => {
    const doc = parse("|\\f#00FF00,not colored|");
    const para = doc.content[0] as any;
    // Should not be parsed as color
    expect(para.children[0].type).not.toBe("color");
  });
});
