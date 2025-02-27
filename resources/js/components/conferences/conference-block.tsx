import {
    ConferenceBlock as ConferenceBlockType,
    RegularTextBlock,
    LinksTextBlock,
    HeadingTextBlock,
    KeyValueTextBlock,
    DisclamerTextBlock,
    ListTextBlock,
    SeparatorBlock
} from "@/types/blocks";
import { JSX } from "react";
import { Link, Dot } from "lucide-react";

export const ConferenceBlock = ({
    primaryColor,
    block
}: {
    primaryColor: string,
    block: ConferenceBlockType
}): JSX.Element | null => {
    switch (block.type_id) {
        case 1:
            return <RegularTextBlockComponent block={block} />
        case 2:
            return <ListTextBlockComponent block={block} />
        case 3:
            return <LinksTextBlockComponent block={block} />
        case 4:
            return <KeyValueTextBlockComponent primaryColor={primaryColor} block={block} />
        case 5:
            return <HeadingTextBlockComponent primaryColor={primaryColor} block={block} />
        case 6:
            return <DisclamerTextBlockComponent block={block} />
        case 7:
            return <SeparatorBlockComponent />
        default:
            return null;
    }
}

function SeparatorBlockComponent() {
    return (
        <div className="w-full h-px bg-black mb-8" />
    )
}

function ListTextBlockComponent({ block }: { block: ListTextBlock }) {
    return (
        <ul className="px-11 space-y-2 pb-8 w-full">
            {block.content.map((item) => (
                <li key={item.header} className="flex flex-col gap-0">
                    <div className="flex gap-2">
                        <Dot className="shrink-0" />
                        <p>{item.header}</p>
                    </div>
                    <div className="pl-6">
                        {item.items.map((subitem) => (
                            <div key={subitem} className="flex gap-2">
                                <Dot className="shrink-0" />
                                <p>{subitem}</p>
                            </div>
                        ))}
                    </div>
                </li>
            ))}
        </ul>
    )
}

function DisclamerTextBlockComponent({ block }: { block: DisclamerTextBlock }) {
    return (
        <div className="px-11 pb-8 w-full">
            <p className="text-center text-brand-textGray text-pretty text-sm">{block.content.text}</p>
        </div>
    )
}

function KeyValueTextBlockComponent({ primaryColor, block }: { primaryColor: string, block: KeyValueTextBlock }) {
    function DefaultRender() {
        return (
            <ul className="px-11 w-full">
                {block.content.items.map((pair) => (
                    <li key={pair.key}>
                        <p><span className="font-semibold">{pair.key}</span> {pair.value}</p>
                    </li>
                ))}
            </ul>
        )
    }

    function TableRender() {
        return (
            <ul className="w-full">
                {block.content.items.map((pair) => (
                    <li key={pair.key} className="flex justify-between py-4 px-11 odd:bg-brand-neutral">
                        <span className="text-pretty">{pair.key}</span>
                        <span className="whitespace-nowrap">{pair.value}</span>
                    </li>
                ))}
            </ul>
        )
    }

    function ColorRender() {
        return (
            <ul className="mb-8 w-full py-8 px-11" style={{ backgroundColor: primaryColor, color: 'white' }}>
                {block.content.items.map((pair) => (
                    <li key={pair.key}>
                        <p><span className="font-semibold">{pair.key}</span> {pair.value}</p>
                    </li>
                ))}
            </ul>
        )
    }

    function Component() {
        if (block.content.colorDisplay) {
            return <ColorRender />
        }

        if (block.content.tableDisplay) {
            return <TableRender />
        }

        return <TableRender />
    }

    return (
        <div className="pb-8 w-full">
            {/* {block.content.tableDisplay ? <TableRender /> : <DefaultRender />} */}
            {<Component />}
        </div>
    )
}

function RegularTextBlockComponent({ block }: { block: RegularTextBlock }) {
    return (
        <div className="px-11 pb-8 w-full">
            <p className="text-center">{block.content.text}</p>
        </div>
    )
}

function LinksTextBlockComponent({ block }: { block: LinksTextBlock }) {
    return (
        <ul className="px-11 pb-8 w-full">
            {block.content.map((link) => (
                <li key={link.text}>
                    <a href={link.url} className="flex gap-2 items-center underline underline-offset-4 hover:text-blue-600 transition-all">
                        <Link size={14} />
                        {link.text}
                    </a>
                </li>
            ))}
        </ul>
    )
}


function HeadingTextBlockComponent({ primaryColor, block }: { primaryColor: string, block: HeadingTextBlock }) {
    const defaultRender = () => {
        return (
            <div className="pb-4 w-full">
                <p className="font-semibold text-2xl text-center">{block.content.text}</p>
            </div>
        )
    }

    const colorRender = () => {
        return (
            <div className="mb-8 w-full py-8 px-11" style={{ backgroundColor: primaryColor, color: 'white' }}>
                <p className="font-medium text-2xl text-center">{block.content.text}</p>
            </div>
        )
    }

    return (
        <>
            {block.content.colorDisplay ? colorRender() : defaultRender()}
        </>
    )
}
