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

    document.getElementById("id").value =  
      "CODE" + String(next).padStart(3, "0");

  });
}

function loadCustomers() {
  db.ref("customers").once("value").then(function(snapshot) {
    const select = document.getElementById("customerList");

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
  const id = document.getElementById("customerList").value;

  if (id) {
    document.getElementById("searchId").value = id;
    loadCustomer();
  }
}

function loadCustomer() {
  const id = document.getElementById("searchId").value.trim();

  if (!id) {
    alert("اكتب كود العميل");
    return;
  }

  db.ref("customers/" + id).once("value").then(function(snapshot) {

    const data = snapshot.val();  

    // لو العميل جديد ومش موجود في قاعدة البيانات
    if (!data) {  
      document.getElementById("name").value = "";  
      document.getElementById("description").value = "";  
      document.getElementById("logo").value = "";  
      document.getElementById("whatsapp").value = "";  
      document.getElementById("facebook").value = "";  
      document.getElementById("instagram").value = "";  
      document.getElementById("website").value = "";  
      document.getElementById("payment").value = "";  
      
      if (typeof resetQRDesign === "function") resetQRDesign();
      return;  
    }  

    // لو العميل موجود فعلاً
    document.getElementById("id").value = id;  
    document.getElementById("name").value = data.name || "";  
    document.getElementById("description").value = data.description || "";  
    document.getElementById("logo").value = data.logo || "";  
    document.getElementById("whatsapp").value = data.whatsapp || "";  
    document.getElementById("facebook").value = data.facebook || "";  
    document.getElementById("instagram").value = data.instagram || "";  
    document.getElementById("website").value = data.website || "";  
    document.getElementById("payment").value = data.payment || "";  

    if (data.qrStyle) {  
      if (document.getElementById("dotColor")) document.getElementById("dotColor").value = data.qrStyle.dotColor || "#000000";  
      if (document.getElementById("dotStyle")) document.getElementById("dotStyle").value = data.qrStyle.dotStyle || "rounded";  
      if (document.getElementById("cornerColor")) document.getElementById("cornerColor").value = data.qrStyle.cornerColor || "#000000";  
      if (document.getElementById("cornerStyle")) document.getElementById("cornerStyle").value = data.qrStyle.cornerStyle || "square";  
      if (document.getElementById("bgColor")) document.getElementById("bgColor").value = data.qrStyle.bgColor || "#ffffff";  
      if (document.getElementById("qrLogo")) document.getElementById("qrLogo").value = data.qrStyle.qrLogo || "";  
      if (document.getElementById("bottomText")) document.getElementById("bottomText").value = data.qrStyle.bottomText || "";  
    } else {  
      if (typeof resetQRDesign === "function") resetQRDesign();  
    }  

    document.getElementById("customerList").value = id;  

    if (typeof updateBottomPreview === "function") updateBottomPreview();

  }).catch(function(error) {
    console.error(error);
    alert("تعذر تحميل العميل: " + error.message);
  });
}

function saveCustomer() {

  const code = document.getElementById("id").value.trim();

  if (!code) {
    alert("لا يوجد كود للعميل");
    return;
  }

  // ✅ تم تصحيح Const إلى const هنا
  const data = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    logo: document.getElementById("logo").value,
    whatsapp: document.getElementById("whatsapp").value,
    facebook: document.getElementById("facebook").value,
    instagram: document.getElementById("instagram").value,
    website: document.getElementById("website").value,
    payment: document.getElementById("payment").value
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

  const id = document.getElementById("id").value.trim();

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

        document.getElementById("customerList").value = "";  
        document.getElementById("searchId").value = "";  
        document.getElementById("name").value = "";  
        document.getElementById("description").value = "";  
        document.getElementById("logo").value = "";  
        document.getElementById("whatsapp").value = "";  
        document.getElementById("facebook").value = "";  
        document.getElementById("instagram").value = "";  
        document.getElementById("website").value = "";  
        document.getElementById("payment").value = "";  
        if (document.getElementById("qrLogo")) document.getElementById("qrLogo").value = "";  
        if (document.getElementById("bottomText")) document.getElementById("bottomText").value = "";  

        if (document.getElementById("qrcode")) document.getElementById("qrcode").innerHTML = "";  
        if (document.getElementById("qrLink")) document.getElementById("qrLink").textContent = "";  
        if (document.getElementById("bottomPreview")) document.getElementById("bottomPreview").textContent = "";  

        if (typeof qrCode !== "undefined") qrCode = null;  

      })  
      .catch(function(error) {  
        alert("تعذر الحذف: " + error.message);  
      });

  }
}
