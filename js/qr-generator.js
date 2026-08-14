let qrCode = null;
let uploadedLogo = "";

// دالة آمنة لقراءة القيم
function SafeGetValue(elementId, defaultValue = "") {
  const el = document.getElementById(elementId);
  return el ? el.value : defaultValue;
}

// دالة آمنة لوضع القيم
function SafeSetValue(elementId, val) {
  const el = document.getElementById(elementId);
  if (el) el.value = val;
}

function getQRStyleData() {
  return {
    dotColor: SafeGetValue("dotColor", "#000000"),
    dotStyle: SafeGetValue("dotStyle", "square"),
    cornerColor: SafeGetValue("cornerColor", "#000000"),
    cornerStyle: SafeGetValue("cornerStyle", "square"),
    bgColor: SafeGetValue("bgColor", "#ffffff"),
    qrLogo: SafeGetValue("qrLogo").trim(),
    bottomText: SafeGetValue("bottomText")
  };
}

function updateBottomPreview() {
  const el = document.getElementById("bottomPreview");
  if (el) {
    el.textContent = SafeGetValue("bottomText");
  }
}

function applyTemplate() {
  const t = SafeGetValue("templateStyle");

  if (t === "business") {
    SafeSetValue("dotColor", "#000000");
    SafeSetValue("cornerColor", "#000000");
  } else if (t === "restaurant") {
    SafeSetValue("dotColor", "#d32f2f");
    SafeSetValue("cornerColor", "#ff9800");
  } else if (t === "payment") {
    SafeSetValue("dotColor", "#009688");
    SafeSetValue("cornerColor", "#00695c");
  } else if (t === "luxury") {
    SafeSetValue("dotColor", "#c9a227");
    SafeSetValue("cornerColor", "#8d6e00");
  } else if (t === "social") {
    SafeSetValue("dotColor", "#1877f2");
    SafeSetValue("cornerColor", "#e1306c");
  }

  createQR();
}

function createQR() {
  const codeElem = document.getElementById("id");
  if (!codeElem) return;
  
  const code = codeElem.value.trim();
  if (!code) return;

  const url = "https://mohamdsagrsy692-a11y.github.io/qr-system/qr.html?id=" + encodeURIComponent(code);

  const qrLinkElem = document.getElementById("qrLink");
  if (qrLinkElem) qrLinkElem.textContent = url;

  const qrContainer = document.getElementById("qrcode");
  if (!qrContainer) return;

  qrContainer.innerHTML = "";

  const style = getQRStyleData();

  if (typeof QRCodeStyling !== "undefined") {
    qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      data: url,
      image: uploadedLogo || style.qrLogo || undefined,
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 8,
        imageSize: 0.22,
        hideBackgroundDots: true
      },
      dotsOptions: {
        color: style.dotColor,
        type: style.dotStyle
      },
      cornersSquareOptions: {
        color: style.cornerColor,
        type: style.cornerStyle
      },
      cornersDotOptions: {
        color: style.cornerColor,
        type: "dot"
      },
      backgroundOptions: {
        color: style.bgColor
      }
    });

    qrCode.append(qrContainer);
  }

  updateBottomPreview();
}

function downloadQR() {
  if (!qrCode) {
    alert("أنشئ QR أولاً");
    return;
  }

  const format = SafeGetValue("downloadFormat", "png");

  qrCode.download({
    name: "QR",
    extension: format
  });
}

function resetQRDesign() {
  SafeSetValue("dotColor", "#000000");
  SafeSetValue("cornerColor", "#000000");
  SafeSetValue("bgColor", "#ffffff");
  SafeSetValue("dotStyle", "square");
  SafeSetValue("cornerStyle", "square");
  SafeSetValue("bottomText", "");
  SafeSetValue("qrLogo", "");

  uploadedLogo = "";

  const preview = document.getElementById("logoPreview");
  if (preview) {
    preview.src = "";
    preview.style.display = "none";
  }

  updateBottomPreview();
}
