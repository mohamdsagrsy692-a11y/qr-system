function generateNumber() {
  db.ref("customers").once("value").then(function(snapshot) {
    let max = 0;

    snapshot.forEach(function(child) {  
      const code = child.key || "";  

      if (code.startsWith("CODE")) {  
        const number = parseInt(code.replace("CODE", ""), 10) || 0;  
        if (number > max) max = number;  
      }  
    });  

    const next = max + 1;  
    
    const idElem = document.getElementById("id");
    if (idElem) {
      idElem.value = "CODE" + String(next).padStart(3, "0");
    }

  });
}

// دالة مساعدة لكتابة القيم بأمان بدون Crash
function SafeSetValue(elementId, val) {
  const el = document.getElementById(elementId);
  if (el) el.value = val || "";
}

// دالة مساعدة لقراءة القيم بأمان
function SafeGetValue(elementId) {
  const el = document.getElementById(elementId);
  return el ? el.value : "";
}

function loadCustomers() {
  db.ref("customers").once("value").then(function(snapshot) {
    const select = document.getElementById("customerList");
    if (!select) return;

    select.innerHTML = '<option value="">اختر العميل</option>';  

    snapshot.forEach(function(child) {  
      const id = child.key;  
      const data = child.val() || {};  

      const option = document.createElement("option");  

      option.value = id;  
      option.textContent =  
        id + " - " + (data.name || "بدون اسم");  

      select.appendChild(option);  
    });

  }).catch(function(error) {
    alert("تعذر تحميل قائمة العملاء: " + error.message);
  });
}

function selectCustomer() {
  const selectElem = document.getElementById("customerList");
  const id = selectElem ? selectElem.value : "";

  if (id) {
    SafeSetValue("searchId", id);
    loadCustomer();
  }
}

function loadCustomer() {
  const searchInput = document.getElementById("searchId");
  if (!searchInput) return;

  const id = searchInput.value.trim();

  if (!id) {
    alert("اكتب كود العميل");
    return;
  }

  db.ref("customers/" + id).once("value").then(function(snapshot) {

    const data = snapshot.val();  

    // لو العميل جديد ومش موجود في قاعدة البيانات
    if (!data) {  
      SafeSetValue("name", "");  
      SafeSetValue("description", "");  
      SafeSetValue("logo", "");  
      SafeSetValue("whatsapp", "");  
      SafeSetValue("facebook", "");  
      SafeSetValue("instagram", "");  
      SafeSetValue("website", "");  
      SafeSetValue("instapay", "");  
      SafeSetValue("vodafonecash", "");  
      
      if (typeof resetQRDesign === "function") resetQRDesign();
      return;  
    }  

    // لو العميل موجود فعلاً
    SafeSetValue("id", id);  
    SafeSetValue("name", data.name);  
    SafeSetValue("description", data.description);  
    SafeSetValue("logo", data.logo);  
    SafeSetValue("whatsapp", data.whatsapp);  
    SafeSetValue("facebook", data.facebook);  
    SafeSetValue("instagram", data.instagram);  
    SafeSetValue("website", data.website);  
    SafeSetValue("instapay", data.instapay);  
    SafeSetValue("vodafonecash", data.vodafonecash);  

    if (data.qrStyle) {  
      SafeSetValue("dotColor", data.qrStyle.dotColor || "#000000");  
      SafeSetValue("dotStyle", data.qrStyle.dotStyle || "rounded");  
      SafeSetValue("cornerColor", data.qrStyle.cornerColor || "#000000");  
      SafeSetValue("cornerStyle", data.qrStyle.cornerStyle || "square");  
      SafeSetValue("bgColor", data.qrStyle.bgColor || "#ffffff");  
      SafeSetValue("qrLogo", data.qrStyle.qrLogo || "");  
      SafeSetValue("bottomText", data.qrStyle.bottomText || "");  
    } else {  
      if (typeof resetQRDesign === "function") resetQRDesign();  
    }  

    SafeSetValue("customerList", id);  

    if (typeof updateBottomPreview === "function") updateBottomPreview();

  }).catch(function(error) {
    console.error(error);
    alert("تعذر تحميل العميل: " + error.message);
  });
}

function saveCustomer() {

  const code = SafeGetValue("id").trim();

  if (!code) {
    alert("لا يوجد كود للعميل");
    return;
  }

  const data = {
    name: SafeGetValue("name"),
    description: SafeGetValue("description"),
    logo: SafeGetValue("logo"),
    whatsapp: SafeGetValue("whatsapp"),
    facebook: SafeGetValue("facebook"),
    instagram: SafeGetValue("instagram"),
    website: SafeGetValue("website"),
    instapay: SafeGetValue("instapay"),
    vodafonecash: SafeGetValue("vodafonecash")
  };

  db.ref("customers/" + code)
    .set(data)
    .then(function() {
      alert("تم حفظ العميل بنجاح ✅");
      loadCustomers();
      generateNumber();
    })
    .catch(function(error) {
      alert("خطأ في الحفظ: " + error.message);
    });
}

function deleteCustomer() {

  const id = SafeGetValue("id").trim();

  if (!id) {
    alert("اختر عميل أولاً");
    return;
  }

  if (confirm("هل تريد حذف " + id + " ؟")) {

    db.ref("customers/" + id)  
      .remove()  
      .then(function() {  

        alert("تم الحذف ✅");  

        loadCustomers();  
        generateNumber();  

        SafeSetValue("customerList", "");  
        SafeSetValue("searchId", "");  
        SafeSetValue("name", "");  
        SafeSetValue("description", "");  
        SafeSetValue("logo", "");  
        SafeSetValue("whatsapp", "");  
        SafeSetValue("facebook", "");  
        SafeSetValue("instagram", "");  
        SafeSetValue("website", "");  
        SafeSetValue("instapay", "");  
        SafeSetValue("vodafonecash", "");  
        SafeSetValue("qrLogo", "");  
        SafeSetValue("bottomText", "");  

        const qrcodeElem = document.getElementById("qrcode");
        if (qrcodeElem) qrcodeElem.innerHTML = "";  
        
        const qrLinkElem = document.getElementById("qrLink");
        if (qrLinkElem) qrLinkElem.textContent = "";  
        
        const bottomPreviewElem = document.getElementById("bottomPreview");
        if (bottomPreviewElem) bottomPreviewElem.textContent = "";  

        if (typeof qrCode !== "undefined") qrCode = null;  

      })  
      .catch(function(error) {  
        alert("تعذر الحذف: " + error.message);  
      });

  }
}
