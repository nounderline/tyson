const JSON_TYPES = [
  "null",
  "boolean",
  "number",
  "string",
  "array",
  "object",
] as const;

/**
 * Possible values from `typeof`
 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#description
 */
type JSTypes =
  | "undefined"
  | "boolean"
  | "number"
  | "bigint"
  | "string"
  | "symbol"
  | "function"
  | "object";

type JSONTypes = typeof JSON_TYPES[number];

export function toJSONType(value): JSONTypes | undefined {
  const type = typeof value;

  if (
    type === "boolean" ||
    type === "string"
  ) {
    return type;
  }

  if (
    type === "number" &&
    Number.isFinite(value) &&
    !Object.is(value, -0)
  ) {
    return "number";
  }

  if (type === "object") {
    if (value === null) {
      return "null";
    }

    if (Array.isArray(value)) {
      return "array";
    }

    if (isPlainObject(value)) {
      return "object";
    }
  }

  return undefined;
}

const ObjectProtoNames = Object.getOwnPropertyNames(
  Object.prototype,
)
  .sort()
  .join("\0");

export function toStringTag(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

export function getEnumerableSymbols(object: Record<string | symbol, any>) {
  return Object.getOwnPropertySymbols(object).filter(
    (symbol) => Object.getOwnPropertyDescriptor(object, symbol)!.enumerable,
  );
}

export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const proto = Object.getPrototypeOf(value);

  return (
    proto === Object.prototype ||
    proto === null ||
    Object.getOwnPropertyNames(proto).sort().join("\0") === ObjectProtoNames
  );
}

export function isPrimitive(
  thing: unknown,
): thing is string | number | boolean | null | undefined {
  return Object(thing) !== thing;
}
