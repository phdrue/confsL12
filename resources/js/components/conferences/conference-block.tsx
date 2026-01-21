import {
    ConferenceBlock as ConferenceBlockType,
    DisclamerTextBlock,
    FilesBlock,
    HeadingTextBlock,
    ImagesBlock,
    KeyValueTextBlock,
    LinksTextBlock,
    ListTextBlock,
    QuoteBlock,
    RegularTextBlock,
    SubheaderTextBlock,
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
        case 12:
            return <QuoteBlockComponent primaryColor={primaryColor} block={block} />;
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
            <div className="regular-text-content text-pretty" dangerouslySetInnerHTML={{ __html: block.content.text || '' }} />
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
            <ul role="list" className="max-h-max divide-y divide-gray-100 self-end rounded-md border border-gray-200">
                {block.content.files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between py-4 pr-5 pl-4 text-sm leading-6">
                        <div className="flex w-0 flex-1 items-center">
                            <svg className="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path
                                    fillRule="evenodd"
                                    d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                                    clipRule="evenodd"
                                ></path>
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

function lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const r = (num >> 16) + Math.round((255 - (num >> 16)) * percent);
    const g = ((num >> 8) & 0x00ff) + Math.round((255 - ((num >> 8) & 0x00ff)) * percent);
    const b = (num & 0x0000ff) + Math.round((255 - (num & 0x0000ff)) * percent);
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

function QuoteBlockComponent({ primaryColor, block }: { primaryColor: string; block: QuoteBlock }) {
    const lightenedColor = lightenColor(primaryColor, 0.9);

    return (
        <div className="w-full pb-8">
            <div
                style={{
                    backgroundColor: lightenedColor,
                }}
                className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-12 text-lg font-medium lg:max-w-7xl lg:flex-row lg:px-12"
            >
                <div className="self-start">
                    <svg width="54" height="40" viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_44_205)">
                            <path
                                d="M21.7555 37.0334L21.8624 37.1531C22.8771 36.3481 23.679 35.3916 24.2668 34.2844C24.8566 33.1734 25.1507 31.9625 25.1507 30.6537C25.1507 29.4491 24.9375 28.3173 24.5097 27.2598C24.0831 26.2052 23.4954 25.2979 22.7453 24.5404C22.0485 23.7837 21.2173 23.2026 20.2528 22.798C19.3367 22.3422 18.3402 22.1147 17.266 22.1147C16.2557 22.1147 15.4179 22.2396 14.7605 22.4976L14.7581 22.4986L14.7557 22.4996C14.1709 22.75 13.6379 23.026 13.1571 23.3279C12.688 23.6224 12.2193 23.8922 11.7508 24.1373L11.7471 24.1393L11.7434 24.1414C11.3579 24.3683 10.8401 24.4886 10.1773 24.4886C9.63547 24.4886 9.1287 24.1521 8.66893 23.383C8.21136 22.5683 7.9803 21.6302 7.9803 20.5647C7.9803 18.7597 8.42036 17.0025 9.30262 15.2917C10.1871 13.5767 11.3843 11.9828 12.8957 10.5102C14.4599 8.98781 16.2593 7.66122 18.2947 6.53059C19.9628 5.62722 21.7312 4.88059 23.6001 4.29078C24.507 4.00453 25.1507 3.21775 25.1507 2.30804C25.1507 1.14053 24.0994 0.19452 22.8543 0.360217C20.2936 0.700998 17.8305 1.37945 15.4655 2.39538C12.4545 3.63934 9.81212 5.33162 7.53959 7.47203C5.31945 9.56309 3.52307 12.0268 2.15006 14.8619L2.14907 14.864C0.826311 17.7045 0.166016 20.8171 0.166016 24.1997C0.166016 26.3436 0.536632 28.365 1.27892 30.2626L1.27944 30.2639C2.02069 32.1091 3.02735 33.7562 4.29979 35.2044L4.30165 35.2066C5.57509 36.6056 7.06158 37.7309 8.76051 38.5809L8.76416 38.5828C10.4683 39.3853 12.3053 39.7862 14.273 39.7862C15.7613 39.7862 17.1465 39.5609 18.4269 39.1087L18.4303 39.1075C19.7588 38.6069 20.9046 37.955 21.8657 37.1503L21.7555 37.0334Z"
                                fill={primaryColor}
                            ></path>
                            <path
                                d="M50.2894 37.0334L50.3963 37.1531C51.4111 36.3481 52.2129 35.3916 52.8007 34.2844C53.3905 33.1734 53.6846 31.9625 53.6846 30.6537C53.6846 29.4491 53.4714 28.3173 53.0437 27.2598C52.6171 26.2052 52.0293 25.2979 51.2793 24.5404C50.5825 23.7837 49.7512 23.2026 48.7868 22.798C47.8706 22.3422 46.8741 22.1147 45.7999 22.1147C44.7896 22.1147 43.9519 22.2396 43.2945 22.4976L43.292 22.4986L43.2896 22.4996C42.7048 22.75 42.1718 23.026 41.691 23.3279C41.2219 23.6224 40.7532 23.8922 40.2847 24.1373L40.281 24.1393L40.2774 24.1414C39.8918 24.3683 39.3741 24.4886 38.7113 24.4886C38.1694 24.4886 37.6626 24.1521 37.2029 23.383C36.7453 22.5683 36.5142 21.6302 36.5142 20.5647C36.5142 18.7597 36.9543 17.0025 37.8366 15.2917C38.721 13.5767 39.9182 11.9828 41.4296 10.5102C42.9939 8.98781 44.7933 7.66122 46.8286 6.53059C48.4968 5.62722 50.2652 4.88059 52.134 4.29078C53.0409 4.00453 53.6846 3.21775 53.6846 2.30804C53.6846 1.14053 52.6333 0.19452 51.3882 0.360217C48.8275 0.700998 46.3644 1.37945 43.9994 2.39538C40.9884 3.63934 38.3461 5.33162 36.0735 7.47203C33.8534 9.56309 32.057 12.0268 30.684 14.8619L30.683 14.864C29.3602 17.7045 28.7 20.8171 28.7 24.1997C28.7 26.3436 29.0706 28.365 29.8129 30.2626L29.8134 30.2639C30.5546 32.1091 31.5613 33.7562 32.8337 35.2044L32.8356 35.2066C34.109 36.6056 35.5955 37.7309 37.2944 38.5809L37.2981 38.5828C39.0022 39.3853 40.8393 39.7862 42.8069 39.7862C44.2952 39.7862 45.6804 39.5609 46.9609 39.1087L46.9642 39.1075C48.2927 38.6069 49.4386 37.955 50.3997 37.1503L50.2894 37.0334Z"
                                fill={primaryColor}
                            ></path>
                        </g>
                        <defs>
                            <clipPath id="clip0_44_205">
                                <rect width="53.75" height="40" fill="white"></rect>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                <div className="text-pretty lg:max-w-2xl">
                    <div className="text-pretty" dangerouslySetInnerHTML={{ __html: block.content.text || '' }} />
                </div>
            </div>
        </div>
    );
}
