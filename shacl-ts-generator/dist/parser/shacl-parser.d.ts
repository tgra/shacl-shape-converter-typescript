export interface ShapePropertyModel {
    name: string;
    path: string;
    datatype?: string;
    class?: string;
    minCount?: number;
    maxCount?: number;
}
export interface ShapeModel {
    name: string;
    targetClass: string;
    properties: ShapePropertyModel[];
}
export declare class ShaclParser {
    parse(filePath: string): Promise<ShapeModel[]>;
    private extractShapes;
    private extractName;
}
