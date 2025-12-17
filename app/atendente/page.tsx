"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ControlPanel() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [currentPassword, setCurrentPassword] = useState<number>(0);

  useEffect(() => {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL!;
    const socket = new WebSocket(WS_URL);

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "update") {
        setCurrentPassword(msg.senha);
      }
    };

    setWs(socket);
    return () => socket.close();
  }, []);

  const enviarProxima = () => {
    ws?.send(JSON.stringify({ type: "next" }));
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 to-blue-950 p-8 flex flex-col items-center justify-center">
      <div className="flex items-center justify-between gap-5 mb-12">
        <h1 className="text-4xl font-bold text-white">Painel de Controle</h1>
        <Link href="/painel">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Display
          </Button>
        </Link>
      </div>

      <div className="text-center mb-16">
        <p className="text-slate-400 text-lg mb-4">Senha Atual</p>
        <div className="text-8xl font-bold text-white">
          {String(currentPassword).padStart(3, "0")}
        </div>
      </div>

      <Button
        onClick={enviarProxima}
        className="h-20 text-lg font-semibold gap-2 bg-blue-600 hover:bg-blue-700 text-white"
      >
        Próxima
        <ChevronRight className="w-6 h-6" />
      </Button>
    </div>
  );
}
