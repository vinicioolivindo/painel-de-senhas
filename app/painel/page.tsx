"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function PasswordDisplay(){
    const [currentPassword, setCurrentPassword] = useState(1)
    
   useEffect(() => {
     const WS_URL = process.env.NEXT_PUBLIC_WS_URL!;
     const ws = new WebSocket(WS_URL);

     ws.onmessage = (event) => {
       const msg = JSON.parse(event.data);
       if (msg.type === "update") {
         setCurrentPassword(msg.senha);
       }
     };

     return () => ws.close();
   }, []);


  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 p-8">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="text-center">
          <div className="text-9xl font-bold text-white drop-shadow-2xl tracking-wider mb-6">
            {String(currentPassword).padStart(3, "0")}
          </div>
          <p className="text-xl text-blue-200">Senha Atual</p>
        </div>
      </div>

      <Link href="/atendente">
          <Button
            className="absolute bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Painel de Controle
          </Button>
      </Link>
    </div>
  )
}
