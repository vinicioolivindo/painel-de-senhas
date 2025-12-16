"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link";
import { useEffect, useState } from "react";


export default function ControlPanel() {

    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");
        setWs(socket);
        return () => socket.close();
    }, [])

  const [currentPassword, setCurrentPassword] = useState()
  
  const enviarProxima = () => {
    ws?.send(JSON.stringify({ type: "next" }));
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "update") setCurrentPassword(msg.senha);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 to-blue-950 p-8 flex flex-col items-center justify-center">
      <div className="flex items-center justify-between gap-5 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white">Painel de Controle</h1>
        </div>
        <Link href="/painel">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Display
            </Button>
        </Link>
      </div>

      <div className="text-center mb-16">
        <p className="text-slate-400 text-lg mb-4">Senha Atual</p>
        <div className="text-8xl font-bold text-white drop-shadow-lg">{String(currentPassword).padStart(3, "0")}</div>
      </div>

      <div>
        <Button
          onClick={enviarProxima}
          className="h-20 text-lg font-semibold gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Próxima
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
