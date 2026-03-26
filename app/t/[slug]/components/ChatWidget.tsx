"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card, CardHeader, CardBody, CardFooter, Input, Avatar, ScrollShadow } from "@heroui/react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
    id: string;
    text: string;
    isSender: boolean;
    time: string;
}

export default function ChatWidget({ tenantName }: { tenantName: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: `Merhaba! ${tenantName} olarak size nasıl yardımcı olabilirim?`,
            isSender: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            isSender: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, newMsg]);
        setInputValue("");

        // Simulate reply
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    text: "Mesajınızı aldık, en kısa sürede dönüş yapacağız.",
                    isSender: false,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="mb-4 origin-bottom-right"
                    >
                        <Card className="w-[320px] sm:w-[350px] shadow-2xl border border-neutral-200">
                            <CardHeader className="bg-black text-white px-4 py-3 flex justify-between items-center rounded-t-xl">
                                <div className="flex items-center gap-3">
                                    <Avatar name={tenantName} size="sm" className="bg-white text-black text-xs font-semibold" showFallback />
                                    <div>
                                        <p className="text-sm font-semibold">{tenantName}</p>
                                        <p className="text-xs text-neutral-300">Online</p>
                                    </div>
                                </div>
                                <Button isIconOnly size="sm" variant="light" className="text-white hover:bg-white/20" onPress={() => setIsOpen(false)}>
                                    <X size={18} />
                                </Button>
                            </CardHeader>

                            <CardBody className="p-0 bg-neutral-50 h-[350px]">
                                <ScrollShadow ref={scrollRef} className="p-4 h-full flex flex-col gap-3">
                                    {messages.map((msg) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={msg.id}
                                            className={`flex flex-col max-w-[80%] ${msg.isSender ? "self-end items-end" : "self-start items-start"}`}
                                        >
                                            <div
                                                className={`px-3 py-2 rounded-2xl text-sm shadow-sm ${msg.isSender
                                                    ? "bg-black text-white rounded-tr-sm"
                                                    : "bg-white border border-neutral-200 text-black rounded-tl-sm"
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>
                                            <span className="text-[10px] text-neutral-400 mt-1 px-1">
                                                {msg.time}
                                            </span>
                                        </motion.div>
                                    ))}
                                </ScrollShadow>
                            </CardBody>

                            <CardFooter className="bg-white border-t border-neutral-100 p-3">
                                <form
                                    className="flex w-full items-center gap-2"
                                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                >
                                    <Input
                                        size="sm"
                                        radius="full"
                                        placeholder="Mesajınızı yazın..."
                                        value={inputValue}
                                        onValueChange={setInputValue}
                                        className="flex-1"
                                        classNames={{
                                            inputWrapper: "bg-neutral-100 border-none shadow-inner",
                                            input: "text-sm placeholder:text-neutral-400"
                                        }}
                                    />
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        radius="full"
                                        className="bg-black text-white"
                                        type="submit"
                                        isDisabled={!inputValue.trim()}
                                    >
                                        <Send size={16} className="-ml-0.5" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    isIconOnly
                    radius="full"
                    className="w-14 h-14 bg-black text-white shadow-xl flex items-center justify-center relative z-10"
                    onPress={() => setIsOpen(!isOpen)}
                >
                    <AnimatePresence mode="popLayout">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X size={24} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chat"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MessageCircle size={24} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Button>
                {/* Ping animation when closed and messages <= 1 (just welcome msg) */}
                {!isOpen && messages.length === 1 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white top-1 right-1 z-10"></span>
                    </span>
                )}
            </motion.div>
        </div>
    );
}
