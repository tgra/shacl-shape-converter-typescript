export type IRI = string & { __brand: "IRI" };

export function createIRI(value: string): IRI {
  return value as IRI;
}