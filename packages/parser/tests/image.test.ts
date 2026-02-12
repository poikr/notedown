import { describe, it, expect } from "bun:test";
import { parse } from "../src/index";

describe("Image Parser", () => {
  it("parses basic image", () => {
    const doc = parse("![logo](https://example.com/logo.png)");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "image",
      url: "https://example.com/logo.png",
      alt: "logo",
      width: null,
      height: null,
      alignment: null,
      link: null,
    });
  });

  it("parses image with width", () => {
    const doc = parse("![w#100px,small](./img.jpg)");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "image",
      width: "100px",
      alt: "small",
    });
  });

  it("parses image with height", () => {
    const doc = parse("![h#200px,tall](./img.jpg)");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "image",
      height: "200px",
    });
  });

  it("parses image with width and height", () => {
    const doc = parse("![w#150px,h#150px,square](./img.jpg)");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "image",
      width: "150px",
      height: "150px",
    });
  });

  it("parses image with percentage width", () => {
    const doc = parse("![w#45%,responsive](./img.jpg)");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "image",
      width: "45%",
    });
  });

  it("parses image with alignment", () => {
    const doc = parse("![a#center,centered](./img.jpg)");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "image",
      alignment: "center",
    });
  });

  it("parses image with combined attributes", () => {
    const doc = parse("![w#200px,a#center,centered img](./img.jpg)");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "image",
      width: "200px",
      alignment: "center",
      alt: "centered img",
    });
  });

  it("parses linked image", () => {
    const doc = parse("[![logo](./logo.png)](https://example.com)");
    const para = doc.content[0] as any;
    expect(para.children[0]).toMatchObject({
      type: "image",
      url: "./logo.png",
      alt: "logo",
      link: "https://example.com",
    });
  });
});
