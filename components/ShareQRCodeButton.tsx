"use client";

import { Button } from "@heroui/react";
import { QrCodeIcon, DownloadIcon, SparklesIcon } from "lucide-react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { useEffect, useRef, useState } from "react";

interface ShareQRCodeButtonProps {
    previewUrl: string;
    slug: any;
}

const W = 1020, H = 1440;

export default function ShareQRCodeButton({ previewUrl, slug }: ShareQRCodeButtonProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const exportCanvasRef = useRef<HTMLCanvasElement>(null);
    const [ready, setReady] = useState(false);

    async function drawQR(canvas: HTMLCanvasElement, text: string, size: number) {
        const QRCode = (await import("qrcode")).default;
        await QRCode.toCanvas(canvas, text, {
            width: size,
            margin: 2,
            errorCorrectionLevel: "H",
            color: { dark: "#000000", light: "#ffffff" },
        });
    }

    useEffect(() => {
        if (!isOpen) { setReady(false); return; }
        const c = previewCanvasRef.current;
        if (!c) return;
        const url = previewUrl === "#" ? "https://ayarlio.xyz" : previewUrl;
        drawQR(c, url, 114).then(() => setReady(true));
    }, [isOpen, previewUrl]);

    function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    async function downloadSticker() {
        const canvas = exportCanvasRef.current!;
        canvas.width = W;
        canvas.height = H;

        const ctx = canvas.getContext("2d")!;
        const url = previewUrl === "#" ? "https://ayarlio.xyz" : previewUrl;

        // Clean white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, W, H);

        // Subtle border
        ctx.strokeStyle = "#e0e0e0";
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, W - 20, H - 20);

        // Company name
        ctx.fillStyle = "#2c3e50";
        ctx.font = "500 48px 'Inter', system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("AYARLIO", W / 2, 100);

        // Divider line
        ctx.beginPath();
        ctx.moveTo(W / 2 - 100, 130);
        ctx.lineTo(W / 2 + 100, 130);
        ctx.strokeStyle = "#3498db";
        ctx.lineWidth = 2;
        ctx.stroke();

        // QR Code Section
        const qrSize = 500;
        const qrX = (W - qrSize) / 2;
        const qrY = 200;

        // QR Code border
        ctx.strokeStyle = "#34495e";
        ctx.lineWidth = 2;
        drawRoundedRect(ctx, qrX - 15, qrY - 15, qrSize + 30, qrSize + 30, 12);
        ctx.stroke();

        // QR Code
        const qrCanvas = document.createElement("canvas");
        await drawQR(qrCanvas, url, qrSize);
        ctx.drawImage(qrCanvas, qrX, qrY);

        // Scan instruction
        ctx.fillStyle = "#7f8c8d";
        ctx.font = "400 24px 'Inter', system-ui, sans-serif";
        ctx.fillText("SCAN ME", W / 2, qrY + qrSize + 45);

        // Business name/slug
        ctx.fillStyle = "#2c3e50";
        ctx.font = "500 32px 'Inter', system-ui, sans-serif";
        ctx.fillText(`${slug}.ayarlio.xyz`, W / 2, qrY + qrSize + 110);

        // Footer text
        ctx.fillStyle = "#95a5a6";
        ctx.font = "400 20px 'Inter', system-ui, sans-serif";
        ctx.fillText("Book your appointment instantly", W / 2, H - 80);

        // Save
        const a = document.createElement("a");
        a.download = `ayarlio-sticker-${slug}.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
    }

    return (
        <>
            <Button className="ring-0" variant="ghost" endContent={<QrCodeIcon size={16} />} onPress={onOpen}>
                İşletmenizi Paylaşın
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} placement="center" size="sm">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>İşletmenizi Paylaşın</ModalHeader>
                            <ModalBody className="flex flex-col items-center gap-4 py-4">
                                <div className="bg-linear-to-br from-purple-50 to-blue-50 p-4 rounded-xl">
                                    <p className="text-sm text-default-700 text-left mb-3">
                                        <strong>Müşterileriniz QR kodu okutarak anında randevu alabilir!</strong>
                                    </p>
                                    <p className="text-xs text-default-500 text-left">
                                        Bu sticker'ı yazdırıp işletmenizin kapısına, kasasının yanına veya
                                        menülerinizin üzerine yapıştırın. Müşteri deneyimini dijitalleştirin!
                                    </p>
                                </div>
                                <div className="rounded-xl bg-white border-2 border-primary-200 p-2 shadow-lg">
                                    <canvas ref={previewCanvasRef} width={114} height={114}
                                        style={{ display: "block", borderRadius: 8, width: 114, height: 114 }} />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>Kapat</Button>
                                <Button color="primary" isDisabled={!ready}
                                    startContent={<DownloadIcon size={15} />} onPress={downloadSticker}>
                                    Sticker İndir
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <canvas ref={exportCanvasRef} style={{ display: "none" }} />
        </>
    );
}