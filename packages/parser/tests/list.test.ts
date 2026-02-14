import { describe, it, expect } from "bun:test";
import { parse } from "../src/index";
import { assertList, assertParagraph } from "./test-helpers";

describe("List", () => {
  describe("unordered lists", () => {
    it("parses single dash item", () => {
      const doc = parse("- item");
      const list = assertList(doc.content[0]);
      expect(list.ordered).toBe(false);
      expect(list.items.length).toBe(1);
      expect(list.items[0].children[0]).toMatchObject({ type: "text", value: "item" });
    });

    it("parses multiple dash items", () => {
      const doc = parse("- first\n- second\n- third");
      const list = assertList(doc.content[0]);
      expect(list.ordered).toBe(false);
      expect(list.items.length).toBe(3);
      expect(list.items[0].children[0]).toMatchObject({ type: "text", value: "first" });
      expect(list.items[1].children[0]).toMatchObject({ type: "text", value: "second" });
      expect(list.items[2].children[0]).toMatchObject({ type: "text", value: "third" });
    });

    it("parses asterisk items", () => {
      const doc = parse("* item one\n* item two");
      const list = assertList(doc.content[0]);
      expect(list.ordered).toBe(false);
      expect(list.items.length).toBe(2);
    });

    it("treats mixed dash and asterisk as same unordered list", () => {
      const doc = parse("- dash\n* asterisk\n- dash again");
      const list = assertList(doc.content[0]);
      expect(list.ordered).toBe(false);
      expect(list.items.length).toBe(3);
    });
  });

  describe("ordered lists", () => {
    it("parses numbered items", () => {
      const doc = parse("1. first\n2. second\n3. third");
      const list = assertList(doc.content[0]);
      expect(list.ordered).toBe(true);
      expect(list.startNumber).toBe(1);
      expect(list.items.length).toBe(3);
    });

    it("preserves start number", () => {
      const doc = parse("3. third\n4. fourth");
      const list = assertList(doc.content[0]);
      expect(list.ordered).toBe(true);
      expect(list.startNumber).toBe(3);
      expect(list.items.length).toBe(2);
    });
  });

  describe("list type separation", () => {
    it("separates unordered followed by ordered into two nodes", () => {
      const doc = parse("- unordered\n1. ordered");
      expect(doc.content.length).toBe(2);
      const ul = assertList(doc.content[0]);
      const ol = assertList(doc.content[1]);
      expect(ul.ordered).toBe(false);
      expect(ol.ordered).toBe(true);
    });

    it("separates ordered followed by unordered into two nodes", () => {
      const doc = parse("1. ordered\n- unordered");
      expect(doc.content.length).toBe(2);
      const ol = assertList(doc.content[0]);
      const ul = assertList(doc.content[1]);
      expect(ol.ordered).toBe(true);
      expect(ul.ordered).toBe(false);
    });
  });

  describe("nesting", () => {
    it("parses nested unordered list", () => {
      const doc = parse("- parent\n  - child");
      const list = assertList(doc.content[0]);
      expect(list.items.length).toBe(1);
      expect(list.items[0].sublists.length).toBe(1);
      const sublist = list.items[0].sublists[0];
      expect(sublist.ordered).toBe(false);
      expect(sublist.items.length).toBe(1);
      expect(sublist.items[0].children[0]).toMatchObject({ type: "text", value: "child" });
    });

    it("parses three levels of nesting", () => {
      const doc = parse("- level 1\n  - level 2\n    - level 3");
      const list = assertList(doc.content[0]);
      const l2 = list.items[0].sublists[0];
      const l3 = l2.items[0].sublists[0];
      expect(l3.items[0].children[0]).toMatchObject({ type: "text", value: "level 3" });
    });

    it("parses mixed nesting (ordered inside unordered)", () => {
      const doc = parse("- parent\n  1. child one\n  2. child two");
      const list = assertList(doc.content[0]);
      const sublist = list.items[0].sublists[0];
      expect(sublist.ordered).toBe(true);
      expect(sublist.items.length).toBe(2);
    });

    it("parses siblings after nested children", () => {
      const doc = parse("- first\n  - nested\n- second");
      const list = assertList(doc.content[0]);
      expect(list.items.length).toBe(2);
      expect(list.items[0].sublists.length).toBe(1);
      expect(list.items[1].sublists.length).toBe(0);
      expect(list.items[1].children[0]).toMatchObject({ type: "text", value: "second" });
    });
  });

  describe("inline content", () => {
    it("parses bold in list item", () => {
      const doc = parse("- **bold** text");
      const list = assertList(doc.content[0]);
      expect(list.items[0].children[0]).toMatchObject({ type: "bold" });
    });

    it("parses link in list item", () => {
      const doc = parse("- [link](https://example.com)");
      const list = assertList(doc.content[0]);
      expect(list.items[0].children[0]).toMatchObject({ type: "link", url: "https://example.com" });
    });

    it("parses color in list item", () => {
      const doc = parse("- |red,colored|");
      const list = assertList(doc.content[0]);
      expect(list.items[0].children[0]).toMatchObject({ type: "color" });
    });
  });

  describe("list boundaries", () => {
    it("blank line ends the list", () => {
      const doc = parse("- item\n\nparagraph");
      expect(doc.content.length).toBe(2);
      assertList(doc.content[0]);
      assertParagraph(doc.content[1]);
    });

    it("non-list line ends the list", () => {
      const doc = parse("- item\n# Heading");
      expect(doc.content.length).toBe(2);
      assertList(doc.content[0]);
      expect(doc.content[1].type).toBe("heading");
    });

    it("paragraph before list parses correctly", () => {
      const doc = parse("some text\n\n- item");
      expect(doc.content.length).toBe(2);
      assertParagraph(doc.content[0]);
      assertList(doc.content[1]);
    });
  });

  describe("non-list patterns", () => {
    it("*italic* is not a list", () => {
      const doc = parse("*italic text*");
      const para = assertParagraph(doc.content[0]);
      expect(para.children[0]).toMatchObject({ type: "italic" });
    });

    it("**bold** is not a list", () => {
      const doc = parse("**bold text**");
      const para = assertParagraph(doc.content[0]);
      expect(para.children[0]).toMatchObject({ type: "bold" });
    });

    it("-text without space is not a list", () => {
      const doc = parse("-text");
      assertParagraph(doc.content[0]);
    });

    it("1.text without space is not a list", () => {
      const doc = parse("1.text");
      assertParagraph(doc.content[0]);
    });
  });
});
