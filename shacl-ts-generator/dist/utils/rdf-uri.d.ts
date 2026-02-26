export declare class RdfUriUtils {
    /**
     * Extract local name from RDF URI
     */
    static localName(uri: string): string;
    /**
     * Extract namespace from URI
     */
    static namespace(uri: string): string;
    /**
     * Convert URI → safe TypeScript identifier
     */
    static toIdentifier(uri: string): string;
}
