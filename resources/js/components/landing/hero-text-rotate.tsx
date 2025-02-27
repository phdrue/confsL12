import { LayoutGroup, motion } from "motion/react"

import TextRotate from "@/components/ui/fancy/text-rotate"

export default function Preview() {
    return (
        <div className="w-full h-full text-3xl sm:text-4xl lg:text-5xl flex items-center justify-start bg-white dark:text-muted text-foreground overflow-hidden">
            <LayoutGroup>
                <motion.p className="flex whitespace-pre flex-col" layout>
                    <TextRotate
                        texts={[
                            "Международные",
                            "Всероссийские",
                            "Региональные"
                        ]}
                        mainClassName="text-white px-2 sm:px-2 md:px-3 bg-linear-to-r from-brand-red to-brand-red overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                        staggerFrom={"last"}
                        splitBy="characters"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={2500}
                    />
                </motion.p>
            </LayoutGroup>
        </div>
    )
}
