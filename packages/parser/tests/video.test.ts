import { describe, it, expect } from "bun:test";
import { parse } from "../src/index";
import { assertParagraph } from "./test-helpers";

describe("Video Parser", () => {
  it("parses basic video", () => {
    const doc = parse("@[my video](https://example.com/video.mp4)");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0]).toMatchObject({
      type: "video",
      url: "https://example.com/video.mp4",
      alt: "my video",
      width: null,
      height: null,
      alignment: null,
      youtube: false,
    });
  });

  it("parses video with width", () => {
    const doc = parse("@[w#500px,demo](./video.mp4)");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0]).toMatchObject({
      type: "video",
      width: "500px",
      alt: "demo",
    });
  });

  it("parses video with height", () => {
    const doc = parse("@[h#300px,demo](./video.mp4)");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0]).toMatchObject({
      type: "video",
      height: "300px",
    });
  });

  it("parses video with width and height", () => {
    const doc = parse("@[w#640px,h#360px,demo](./video.mp4)");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0]).toMatchObject({
      type: "video",
      width: "640px",
      height: "360px",
    });
  });

  it("parses video with percentage width", () => {
    const doc = parse("@[w#100%,fullwidth](./video.mp4)");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0]).toMatchObject({
      type: "video",
      width: "100%",
    });
  });

  it("parses video with alignment", () => {
    const doc = parse("@[a#center,centered](./video.mp4)");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0]).toMatchObject({
      type: "video",
      alignment: "center",
    });
  });

  it("parses video with combined attributes", () => {
    const doc = parse("@[w#800px,a#center,tutorial](./video.mp4)");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0]).toMatchObject({
      type: "video",
      width: "800px",
      alignment: "center",
      alt: "tutorial",
    });
  });

  it("parses video with empty alt", () => {
    const doc = parse("@[](./video.mp4)");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0]).toMatchObject({
      type: "video",
      url: "./video.mp4",
      alt: "",
    });
  });

  it("does not parse invalid video syntax", () => {
    const doc = parse("@[broken");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0]).toMatchObject({
      type: "text",
      value: "@[broken",
    });
  });

  it("parses video alongside text", () => {
    const doc = parse("Watch this: @[demo](./video.mp4) and enjoy");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0]).toMatchObject({ type: "text", value: "Watch this: " });
    expect(para.children[1]).toMatchObject({ type: "video", url: "./video.mp4" });
    expect(para.children[2]).toMatchObject({ type: "text", value: " and enjoy" });
  });

  it("parses youtube embed video", () => {
    const doc = parse("@[y#true](https://www.youtube.com/embed/NRGuwOiixY4?si=5pq3TJyWrvSc324n)");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0]).toMatchObject({
      type: "video",
      url: "https://www.youtube.com/embed/NRGuwOiixY4?si=5pq3TJyWrvSc324n",
      youtube: true,
      alt: "",
    });
  });

  it("parses youtube embed with dimensions and alt", () => {
    const doc = parse("@[y#true,w#560px,h#315px,My Video](https://www.youtube.com/embed/abc123)");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0]).toMatchObject({
      type: "video",
      url: "https://www.youtube.com/embed/abc123",
      youtube: true,
      width: "560px",
      height: "315px",
      alt: "My Video",
    });
  });

  it("parses youtube embed with alignment", () => {
    const doc = parse("@[y#true,a#center](https://www.youtube.com/embed/abc123)");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0]).toMatchObject({
      type: "video",
      youtube: true,
      alignment: "center",
    });
  });

  it("defaults youtube to false when not specified", () => {
    const doc = parse("@[demo](./video.mp4)");
    const para = assertParagraph(doc.content[0]);
    expect(para.children[0]).toMatchObject({
      type: "video",
      youtube: false,
    });
  });
});
