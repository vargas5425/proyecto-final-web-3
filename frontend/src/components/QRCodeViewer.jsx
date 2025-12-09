import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeViewer({ url }) {
  return (
    <div>
      <QRCodeCanvas value={url} size={128} />
      <p>Escanea este código para validar tu ingreso</p>
    </div>
  );
}
