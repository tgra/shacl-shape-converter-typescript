import { ShapeModel } from "../parser/shacl-parser";
import { PropertyGenerator } from "./property-generator";
export declare class ClassGenerator {
    private propertyGenerator;
    constructor(propertyGenerator?: PropertyGenerator);
    generate(shape: ShapeModel): string;
}
