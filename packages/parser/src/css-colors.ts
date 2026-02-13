const CSS_COLORS = new Set([
  "red", "blue", "green", "yellow", "orange", "purple", "pink",
  "black", "white", "gray", "grey", "brown", "cyan", "magenta",
  "lime", "navy", "teal", "aqua", "maroon", "olive", "silver",
  "fuchsia", "coral", "salmon", "gold", "indigo", "violet",
  "turquoise", "tan", "khaki", "crimson", "plum", "orchid",
  "sienna", "tomato", "wheat", "ivory", "linen", "lavender",
  "beige", "azure", "bisque", "chartreuse", "chocolate",
  "cornflowerblue", "cornsilk", "darkblue", "darkcyan", "darkgoldenrod",
  "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen",
  "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen",
  "darkslateblue", "darkslategray", "darkturquoise", "darkviolet",
  "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick",
  "floralwhite", "forestgreen", "gainsboro", "ghostwhite", "goldenrod",
  "greenyellow", "honeydew", "hotpink", "indianred", "lawngreen",
  "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow",
  "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen",
  "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow",
  "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid",
  "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen",
  "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream",
  "mistyrose", "moccasin", "navajowhite", "oldlace", "olivedrab",
  "orangered", "palegoldenrod", "palegreen", "paleturquoise",
  "palevioletred", "papayawhip", "peachpuff", "peru", "powderblue",
  "rosybrown", "royalblue", "saddlebrown", "sandybrown", "seagreen",
  "seashell", "skyblue", "slateblue", "slategray", "snow",
  "springgreen", "steelblue", "thistle", "yellowgreen", "rebeccapurple",
  "aliceblue", "antiquewhite", "blanchedalmond", "blueviolet",
  "burlywood", "cadetblue",
]);

export function isColorName(value: string): boolean {
  return CSS_COLORS.has(value.toLowerCase());
}
