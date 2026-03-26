"use client";
import {
  Input,
  Textarea,
  Card,
  CardBody,
} from "@heroui/react";
import { SectionTitle, SaveBtn, cardStyle } from "./SettingsUI";

interface IsletmeTabProps {
  bizName: string;
  setBizName: (v: string) => void;
  bizPhone: string;
  setBizPhone: (v: string) => void;
  bizEmail: string;
  setBizEmail: (v: string) => void;
  bizAddr: string;
  setBizAddr: (v: string) => void;
  bizDesc: string;
  setBizDesc: (v: string) => void;
  bizWeb: string;
  setBizWeb: (v: string) => void;
  saved: boolean;
  onSave: () => void;
}

export function IsletmeTab({
  bizName,
  setBizName,
  bizPhone,
  setBizPhone,
  bizEmail,
  setBizEmail,
  bizAddr,
  setBizAddr,
  bizDesc,
  setBizDesc,
  bizWeb,
  setBizWeb,
  saved,
  onSave,
}: IsletmeTabProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card shadow="none" style={cardStyle}>
        <CardBody style={{ padding: 24 }}>
          <SectionTitle
            title="İşletme Bilgileri"
            sub="Müşterilere ve faturalarda görünecek bilgiler"
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Input
              label="İşletme Adı"
              value={bizName}
              onValueChange={(v) => setBizName(v)}
              variant="bordered"
              size="sm"
              autoComplete="off"
              color="primary"
            />
            <Input
              label="Telefon"
              value={bizPhone}
              onValueChange={(v) => setBizPhone(v)}
              variant="bordered"
              size="sm"
              autoComplete="off"
            />
            <Input
              label="E-posta"
              value={bizEmail}
              onValueChange={setBizEmail}
              variant="bordered"
              size="sm"
              type="email"
              autoComplete="off"
            />
            <Input
              label="Web Sitesi"
              value={bizWeb}
              onValueChange={setBizWeb}
              variant="bordered"
              size="sm"
              autoComplete="off"
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <Input
              label="Adres"
              value={bizAddr}
              onValueChange={setBizAddr}
              variant="bordered"
              size="sm"
              autoComplete="off"
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <Textarea
              label="İşletme Açıklaması"
              value={bizDesc}
              onValueChange={setBizDesc}
              variant="bordered"
              size="sm"
              minRows={2}
              autoComplete="off"
            />
          </div>
        </CardBody>
      </Card>
      <SaveBtn saved={saved} onSave={onSave} />
    </div>
  );
}
