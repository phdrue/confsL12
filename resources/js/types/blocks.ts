export type ConferenceBlock =
    RegularTextBlock |
    ListTextBlock |
    LinksTextBlock |
    HeadingTextBlock |
    KeyValueTextBlock |
    DisclamerTextBlock |
    SeparatorBlock |
    ButtonsBlock |
    ImagesBlock

export type RegularTextBlock = {
    id: number;
    name: string;
    position: number;
    type_id: 1;
    content: {
        text: string
    }
}

export type ListTextBlock = {
    id: number;
    name: string;
    position: number;
    type_id: 2;
    content: Array<{
        header: string,
        items: Array<{
            header: string,
            items: Array<string>
        }>
    }>
}

export type LinksTextBlock = {
    id: number;
    name: string;
    position: number;
    type_id: 3;
    content: Array<{
        text: string
        url: string
    }>
}

export type KeyValueTextBlock = {
    id: number;
    name: string;
    position: number;
    type_id: 4;
    content: {
        tableDisplay: boolean;
        colorDisplay: boolean;
        items: Array<{
            key: string
            value: string
        }>;
    }
}

export type HeadingTextBlock = {
    id: number;
    name: string;
    position: number;
    type_id: 5;
    content: {
        colorDisplay: boolean;
        text: string
    }
}

export type DisclamerTextBlock = {
    id: number;
    name: string;
    position: number;
    type_id: 6;
    content: {
        text: string
    }
}

export type SeparatorBlock = {
    id: number;
    name: string;
    position: number;
    type_id: 7,
    content: {}
}

export type ButtonsBlock = {
    id: number;
    name: string;
    position: number;
    type_id: 8,
    content: {}
}

export type ImagesBlock = {
    id: number
    name: string
    position: number
    type_id: 9
    content: {
        // images: Array<Image>
        images: Array<{
            path: string,
            name: string
        }>
    }
}

export interface ConferenceBlockType {
    id: number,
    name: string,
}

export interface Image {
    id: number,
    category?: ImageCategory,
    category_id: number,
    default: boolean,
    name: string,
    url: string,
    path: string
}

export interface ImageCategory {
    id: number,
    name: string,
}
