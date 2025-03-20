import { ConferenceBlock as ConferenceBlockType } from "@/types/blocks"
import { Conference } from "@/types/conferences"
import { ConferenceBlock } from "./conference-block"

export default function Show({
    blocks,
    conference
}: {
    blocks: Array<ConferenceBlockType>,
    conference: Conference
}) {
    return (
        <div className="w-full flex flex-col gap-8">
            <h1 className="text-center text-3xl font-semibold">{conference.name}</h1>
            <div className="self-center aspect-[584/384] w-full max-w-[584px] bg-white rounded-md overflow-hidden">
                <img className="size-full object-cover" alt={conference.name} src={`storage/${conference.img_path}`} />
            </div>
            <div>
                {blocks.map((block) => (
                    <ConferenceBlock primaryColor={conference.primary_color} key={block.id} block={block} />
                ))}
            </div>
        </div>
    )
}