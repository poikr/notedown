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

  it("parses F# dark mode foreground color", () => {
    const doc = parse("|F#FFFFFF,white text in dark mode|");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "color",
      foreground: null,
      foregroundDark: "#FFFFFF",
      background: null,
      backgroundDark: null,
    });
  });

  it("parses B# dark mode background color", () => {
    const doc = parse("|B#000000,black bg in dark mode|");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "color",
      foreground: null,
      foregroundDark: null,
      background: null,
      backgroundDark: "#000000",
    });
  });

  it("parses both light and dark foreground colors", () => {
    const doc = parse("|f#000000,F#FFFFFF,theme aware text|");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "color",
      foreground: "#000000",
      foregroundDark: "#FFFFFF",
      background: null,
      backgroundDark: null,
    });
  });

  it("parses both light and dark background colors", () => {
    const doc = parse("|b#FFFFFF,B#000000,theme aware bg|");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "color",
      foreground: null,
      foregroundDark: null,
      background: "#FFFFFF",
      backgroundDark: "#000000",
    });
  });

  it("parses all four color options", () => {
    const doc = parse("|f#000,F#FFF,b#EEE,B#111,fully theme aware|");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "color",
      foreground: "#000",
      foregroundDark: "#FFF",
      background: "#EEE",
      backgroundDark: "#111",
    });
  });

  it("handles escaped F# tag", () => {
    const doc = parse("|\\F#FFFFFF,not colored|");
    const para = doc.content[0] as any;
    // Should not be parsed as color
    expect(para.children[0].type).not.toBe("color");
  });

  it("handles escaped B# tag", () => {
    const doc = parse("|\\B#000000,not colored|");
    const para = doc.content[0] as any;
    // Should not be parsed as color
    expect(para.children[0].type).not.toBe("color");
  });
});
