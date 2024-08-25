"use client"
import { motion } from "framer-motion";
import { Search, Plus, Trash2, Image } from "lucide-react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { useSession } from "next-auth/react";
import LoadingDots from "@/components/shared/icons/loading-dots";
import SignIn from "@/components/SignIn";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const role = session?.user?.role;

    

    if (status === "loading") {
        return (
            <div className="w-full flex items-center h-[100vh] justify-center">
                <LoadingDots />
            </div>
        );
    }

    if (status === "authenticated" && (role === "manager" || role === "admin")) {
        return (
            <><SignIn /><div className="w-full flex z-[1000] justify-center">
                <div className="container my-20">
                    <motion.div
                        className="z-10 mb-20 flex flex-col"
                        initial="hidden"
                        whileInView="show"
                        animate="show"
                        viewport={{ once: true }}
                        variants={{
                            hidden: {},
                            show: {
                                transition: {
                                    staggerChildren: 0.8,
                                },
                            },
                        }}
                    >
                        <motion.h2
                            className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
                        >
                            <Balancer>Manage</Balancer>
                        </motion.h2>
                        <motion.p className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-md font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-lg">
                            <Balancer>Manage database students and logs from this dashboard</Balancer>
                        </motion.p>
                    </motion.div>

                </div>
            </div></>
        );
    }

    return <div>NOT ALLOWED</div>;
}
