function getQRStyleData() {
  return {
    dotColor: document.getElementById("dotColor").value,
    dotStyle: document.getElementById("dotStyle").value,
    cornerColor: document.getElementById("cornerColor").value,
    cornerStyle: document.getElementById("cornerStyle").value,
    bgColor: document.getElementById("bgColor").value,
    qrLogo: document.getElementById("qrLogo").value.trim(),
    bottomText: document.getElementById("bottomText").value
  };
}

function updateBottomPreview() {
  const el = document.getElementById("bottomPreview");

  if (el) {
    el.textContent =
      document.getElementById("bottomText").value;
  }
}

function applyTemplate() {

  const t =
    document.getElementById("templateStyle").value;

  if (t === "business") {
    dotColor.value = "#000000";
    cornerColor.value = "#000000";
  }

  if (t === "restaurant") {
    dotColor.value = "#d32f2f";
    cornerColor.value = "#ff9800";
  }

  if (t === "payment") {
    dotColor.value = "#009688";
    cornerColor.value = "#00695c";
  }

  if (t === "luxury") {
    dotColor.value = "#c9a227";
    cornerColor.value = "#8d6e00";
  }

  if (t === "social") {
    dotColor.value = "#1877f2";
    cornerColor.value = "#e1306c";
  }

  createQR();
}

function createQR() {

  const code =
    document.getElementById("id").value.trim();

  if (!code) return;

  const url =
    "https://mohamdsagrsy692-a11y.github.io/qr-system/qr.html?id=" +
    encodeURIComponent(code);

  document.getElementById("qrLink").textContent = url;

  const qrContainer =
    document.getElementById("qrcode");

  qrContainer.innerHTML = "";

  const style = getQRStyleData();

  qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    data: url,

    image:
      uploadedLogo ||
      style.qrLogo ||
      undefined,

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

  updateBottomPreview();
}

function downloadQR() {

  if (!qrCode) {
    alert("أنشئ QR أولاً");
    return;
  }

  qrCode.download({
    name: "QR",
    extension:
      document.getElementById("downloadFormat")
        ? document.getElementById("downloadFormat").value
        : "png"
  });
}

function resetQRDesign() {

  document.getElementById("dotColor").value =
    "#000000";

  document.getElementById("cornerColor").value =
    "#000000";

  document.getElementById("bgColor").value =
    "#ffffff";

  if (document.getElementById("dotStyle")) {
    document.getElementById("dotStyle").value =
      "square";
  }

  if (document.getElementById("cornerStyle")) {
    document.getElementById("cornerStyle").value =
      "square";
  }

  if (document.getElementById("bottomText")) {
    document.getElementById("bottomText").value = "";
  }

  if (document.getElementById("qrLogo")) {
    document.getElementById("qrLogo").value = "";
  }

  uploadedLogo = "";

  const preview =
    document.getElementById("logoPreview");

  if (preview) {
    preview.src = "";
    preview.style.display = "none";
  }

  updateBottomPreview();

  createQR();
}
