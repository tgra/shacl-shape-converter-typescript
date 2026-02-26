export interface VocabularyTerm {
    uri: string;
    prefix?: string;
}
export declare class VocabularyBuilder {
    generateVocabularyFile(terms: VocabularyTerm[], outputDir: string, fileName?: string): Promise<void>;
}
