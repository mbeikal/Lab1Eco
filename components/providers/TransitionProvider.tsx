// components/providers/TransitionProvider.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useRef } from "react";

function FrozenRouter({ children }: { children: React.ReactNode }) {
    const context = useContext(LayoutRouterContext);

    const frozen = useRef(context).current;

    if (!frozen) {
        return <>{children}</>;
    }

    return (
        <LayoutRouterContext.Provider value={frozen}>
            {children}
        </LayoutRouterContext.Provider>
    );
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1]
                }}
                className="flex-1 flex flex-col w-full h-full"
            >
                <FrozenRouter>
                    {children}
                </FrozenRouter>
            </motion.div>
        </AnimatePresence>
    );
}