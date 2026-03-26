"use client";
import { useState, useEffect } from "react";
import { Spinner } from "@heroui/react";
import { IsletmeTab } from "./components/BusinessTab";
import { useSettings } from "./hooks/useSettings";

export default function SettingsView() {
  const { data, isLoading } = useSettings();
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [bizName, setBizName] = useState("");
  const [bizPhone, setBizPhone] = useState("");
  const [bizEmail, setBizEmail] = useState("");
  const [bizAddr, setBizAddr] = useState("");
  const [bizDesc, setBizDesc] = useState("");
  const [bizWeb, setBizWeb] = useState("");

  useEffect(() => {
    if (data) {
      setBizName(data.name || "");
      setBizPhone(data.phone || "");
      setBizEmail(data.settings?.email || "");
      setBizAddr(data.settings?.address || "");
      setBizDesc(data.settings?.description || "");
      setBizWeb(data.settings?.website || "");
    }
  }, [data]);

  const handleSave = async () => {
    if (!data) return;
    
    setIsSaving(true);
    try {
      const response = await fetch("/api/tenant/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bizName,
          phone: bizPhone,
          settings: {
            ...data.settings,
            email: bizEmail,
            address: bizAddr,
            description: bizDesc,
            website: bizWeb,
          },
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        console.error("Ayarlar güncellenirken hata:", resData.message);
        alert(resData.message || "Ayarlar güncellenirken hata oluştu.");
      }
    } catch (error) {
      console.error("Settings PUT error:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner size="lg" label="Ayarlar yükleniyor..." />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 860, margin: "0 auto" }}>
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#111827",
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          Ayarlar
        </h1>
        {isSaving && <Spinner size="sm" color="primary" />}
      </div>

      <IsletmeTab
        bizName={bizName}
        setBizName={setBizName}
        bizPhone={bizPhone}
        setBizPhone={setBizPhone}
        bizEmail={bizEmail}
        setBizEmail={setBizEmail}
        bizAddr={bizAddr}
        setBizAddr={setBizAddr}
        bizDesc={bizDesc}
        setBizDesc={setBizDesc}
        bizWeb={bizWeb}
        setBizWeb={setBizWeb}
        saved={saved}
        onSave={handleSave}
      />
    </div>
  );
}
