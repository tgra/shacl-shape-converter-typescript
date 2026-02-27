export type NodeKind =
  | "IRI"
  | "Literal"
  | "BlankNode"
  | "BlankNodeOrIRI"
  | "IRIOrLiteral";

export type IRI = string & { __brand: "IRI" };

export interface ShapePropertyModel {
  path: IRI;
  codeIdentifier: string;

  name?: string;
  datatype?: IRI;
  class?: IRI;
  minCount?: number;
  maxCount?: number;
  nodeKind?: NodeKind;
}

export interface ShapeModel {
  codeIdentifier: string;
  name?: string;
  properties?: ShapePropertyModel[];

  targetClass?: IRI;
  targetNode?: IRI;
  targetSubjectsOf?: IRI;
  targetObjectsOf?: IRI;
}