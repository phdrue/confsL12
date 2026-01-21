import {
    ConferenceBlock as ConferenceBlockType,
    DisclamerTextBlock,
    HeadingTextBlock,
    ImagesBlock,
    KeyValueTextBlock,
    LinksTextBlock,
    ListTextBlock,
    RegularTextBlock,
    SubheaderTextBlock,
    FilesBlock,
} from '@/types/blocks';
import AutoScroll from 'embla-carousel-auto-scroll';
import { Dot, Link } from 'lucide-react';
import { JSX } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';

export const ConferenceBlock = ({ primaryColor, block }: { primaryColor: string; block: ConferenceBlockType }): JSX.Element | null => {
    switch (block.type_id) {
        case 1:
            return <RegularTextBlockComponent block={block} />;
        case 2:
            return <ListTextBlockComponent block={block} />;
        case 3:
            return <LinksTextBlockComponent block={block} />;
        case 4:
            return <KeyValueTextBlockComponent primaryColor={primaryColor} block={block} />;
        case 5:
            return <HeadingTextBlockComponent primaryColor={primaryColor} block={block} />;
        case 6:
            return <DisclamerTextBlockComponent block={block} />;
        case 7:
            return <SeparatorBlockComponent />;
        case 9:
            return <ImageBlockComponent block={block} />;
        case 10:
            return <SubheaderTextBlockComponent block={block} />;
        case 11:
            return <FilesBlockComponent block={block} />;
        default:
            return null;
    }
};

// function ImageBlockComponent({ block }: { block: ImagesBlock }) {
//     return (
//         <div className="flex flex-row flex-wrap gap-4 pb-8">
//             {block.content.images &&
//                 block.content.images.map((image, index) => <img key={index} className="h-16 lg:h-24" alt={image.name} src={`/${image.path}`} />)}
//         </div>
//     );
// }

function ImageBlockComponent({ block }: { block: ImagesBlock }) {
    return (
        <div className="mx-auto mt-0 max-w-screen-xl px-4 pb-8 sm:px-6">
            <p className="text-brand-textSecondary text-center text-sm font-semibold uppercase">Информационные партнеры</p>
            <Carousel
                className="mt-6 w-full"
                opts={{
                    loop: true,
                    watchDrag: false,
                }}
                plugins={[
                    AutoScroll({
                        speed: 0.5,
                    }),
                ]}
            >
                <div className="absolute top-0 left-0 z-10 h-full w-[100px] bg-gradient-to-r from-white"></div>
                <div className="absolute top-0 right-0 z-10 h-full w-[100px] bg-gradient-to-l from-white"></div>
                <CarouselContent>
                    {block.content.images.map((image, index) => (
                        <CarouselItem key={index} className="flex max-h-16 basis-1/2 items-center justify-center md:basis-1/3 lg:basis-1/5">
                            <div className="size-full pl-4">
                                <img className="size-full object-contain" src={`/${image.path}`} alt="partner" />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}

function SeparatorBlockComponent() {
    return <div className="mb-8 h-px w-full bg-black" />;
}

function ListTextBlockComponent({ block }: { block: ListTextBlock }) {
    return (
        <ul className="w-full space-y-2 px-11 pb-8">
            {block.content.map((item, index) => (
                <li key={index} className="flex flex-col gap-0">
                    <div className="flex gap-2">
                        <Dot className="shrink-0" />
                        <p>{item.header}</p>
                    </div>
                    {item.items && item.items.length > 0 && (
                        <div className="pl-6">
                            {item.items.map((subitem, subIndex) => (
                                <div key={subIndex} className="flex flex-col gap-0">
                                    <div className="flex gap-2">
                                        <Dot className="shrink-0" />
                                        <p>{subitem.header}</p>
                                    </div>
                                    {subitem.items && subitem.items.length > 0 && (
                                        <div className="pl-6">
                                            {subitem.items.map((nestedItem, nestedIndex) => (
                                                <div key={nestedIndex} className="flex gap-2">
                                                    <Dot className="shrink-0" />
                                                    <p>{nestedItem}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
}

function DisclamerTextBlockComponent({ block }: { block: DisclamerTextBlock }) {
    return (
        <div className="w-full px-11 pb-8">
            <p className="text-brand-textGray text-center text-sm text-pretty">{block.content.text}</p>
        </div>
    );
}

function KeyValueTextBlockComponent({ primaryColor, block }: { primaryColor: string; block: KeyValueTextBlock }) {
    function DefaultRender() {
        return (
            <ul className="w-full px-11">
                {block.content.items.map((pair, index) => (
                    <li key={index}>
                        <p>
                            <span className="font-semibold">{pair.key}</span> {pair.value}
                        </p>
                    </li>
                ))}
            </ul>
        );
    }

    function TableRender() {
        return (
            <ul className="w-full">
                {block.content.items.map((pair, index) => (
                    <li key={index} className="odd:bg-brand-neutral flex justify-between px-11 py-4">
                        <span className="text-pretty">{pair.key}</span>
                        <span className="whitespace-nowrap">{pair.value}</span>
                    </li>
                ))}
            </ul>
        );
    }

    function ColorRender() {
        return (
            <ul className="mb-8 w-full px-11 py-8" style={{ backgroundColor: primaryColor, color: 'white' }}>
                {block.content.items.map((pair, index) => (
                    <li key={index}>
                        <p>
                            <span className="font-semibold">{pair.key}</span> {pair.value}
                        </p>
                    </li>
                ))}
            </ul>
        );
    }

    function Component() {
        if (block.content.colorDisplay) {
            return <ColorRender />;
        }

        if (block.content.tableDisplay) {
            return <TableRender />;
        }

        return <TableRender />;
    }

    return (
        <div className="w-full pb-8">
            {/* {block.content.tableDisplay ? <TableRender /> : <DefaultRender />} */}
            {<Component />}
        </div>
    );
}

function RegularTextBlockComponent({ block }: { block: RegularTextBlock }) {
    return (
        <div className="w-full px-11 pb-8">
            <style>{`
                .regular-text-content p {
                    text-indent: 1.5em;
                }
            `}</style>
            <div 
                className="text-pretty regular-text-content" 
                dangerouslySetInnerHTML={{ __html: block.content.text || '' }} 
            />
        </div>
    );
}

function LinksTextBlockComponent({ block }: { block: LinksTextBlock }) {
    return (
        <ul className="w-full px-11 pb-8">
            {block.content.map((link, index) => (
                <li key={index}>
                    <a
                        href={link.url}
                        target="_blank"
                        className="flex items-center gap-2 underline underline-offset-4 transition-all hover:text-blue-600"
                    >
                        <Link size={14} />
                        {link.text}
                    </a>
                </li>
            ))}
        </ul>
    );
}

function HeadingTextBlockComponent({ primaryColor, block }: { primaryColor: string; block: HeadingTextBlock }) {
    const defaultRender = () => {
        return (
            <div className="w-full pb-4">
                <p className="text-center text-2xl font-semibold">{block.content.text}</p>
            </div>
        );
    };

    const colorRender = () => {
        return (
            <div className="mb-8 w-full px-11 py-8" style={{ backgroundColor: primaryColor, color: 'white' }}>
                <p className="text-center text-2xl font-medium">{block.content.text}</p>
            </div>
        );
    };

    return <>{block.content.colorDisplay ? colorRender() : defaultRender()}</>;
}

function SubheaderTextBlockComponent({ block }: { block: SubheaderTextBlock }) {
    return (
        <div className="w-full pb-4">
            <p className="text-center text-lg font-semibold">{block.content.text}</p>
        </div>
    );
}

function FilesBlockComponent({ block }: { block: FilesBlock }) {
    return (
        <div className="w-full px-11 pb-8">
            <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200 max-h-max self-end">
                {block.content.files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                        <div className="flex w-0 flex-1 items-center">
                            <svg className="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clipRule="evenodd"></path>
                            </svg>
                            <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                <span className="truncate font-medium">{file.name}</span>
                            </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                            <a href={route('blocks.download-file', [block.id, index])} className="font-medium text-indigo-600 hover:text-indigo-500">
                                Скачать
                            </a>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
