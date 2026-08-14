<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>الورشة | Alwarsha</title>
    <!-- مكتبة الأيقونات Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- مكتبات Firebase -->
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background: linear-gradient(135deg, #0b2239 0%, #116888 50%, #1583a3 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 40px 15px;
            color: #fff;
        }

        .container {
            width: 100%;
            max-width: 420px;
            text-align: center;
        }

        .logo-container {
            margin-bottom: 15px;
        }

        .logo {
            width: 130px;
            height: 130px;
            border-radius: 50%;
            background-color: #fff;
            object-fit: cover;
            border: 4px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }

        .title {
            font-size: 2.2rem;
            font-weight: bold;
            margin-bottom: 4px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .subtitle {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 25px;
            opacity: 0.9;
        }

        .btn-list {
            display: flex;
            flex-direction: column;
            gap: 14px;
        }

        .btn-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(255, 255, 255, 0.88);
            backdrop-filter: blur(10px);
            padding: 12px 20px;
            border-radius: 20px;
            text-decoration: none;
            color: #000;
            font-weight: bold;
            font-size: 1.15rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            height: 60px;
        }

        .btn-card:hover {
            transform: translateY(-3px);
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
        }

        .btn-text {
            flex-grow: 1;
            text-align: center;
            letter-spacing: 0.5px;
        }

        .phone-num {
            direction: ltr;
            font-size: 1.25rem;
            letter-spacing: 1px;
        }

        .icon {
            font-size: 1.8rem;
            width: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .icon-img {
            width: 65px;
            height: auto;
            object-fit: contain;
        }

        .fa-whatsapp { color: #25d366; }
        .fa-facebook { color: #1877f2; }
        .fa-instagram { color: #e4405f; }
        .fa-globe { color: #0d6efd; }
        .fa-credit-card { color: #198754; }

        .footer {
            margin-top: 30px;
            font-size: 0.95rem;
            font-weight: 600;
            opacity: 0.8;
        }

        #loading-state {
            font-size: 1.2rem;
            margin-top: 50px;
        }
    </style>
</head>
<body>

    <div class="container">
        <div id="loading-state">جاري تحميل البيانات...</div>

        <div id="main-content" style="display: none;">
            <!-- اللوجو -->
            <div class="logo-container">
                <img id="cust-logo" class="logo" src="" alt="Logo" onerror="this.src='../assets/logo.png'">
            </div>

            <!-- الاسم والوصف -->
            <h1 id="cust-name" class="title"></h1>
            <div id="cust-desc" class="subtitle"></div>

            <!-- قائمة الأزرار -->
            <div id="cust-btns" class="btn-list"></div>

            <div class="footer">
                Alwarsha ©
            </div>
        </div>
    </div>

    <!-- استدعاء ملف الاتصال المباشر -->
    <script src="../firebase.js"></script>

    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const urlParams = new URLSearchParams(window.location.search);
            const customerId = urlParams.get('id') || urlParams.get('code') || "CODE001";

            // التأكد من تحميل الفايربيز
            function loadData() {
                if (typeof db === "undefined" && typeof firebase !== "undefined") {
                    window.db = firebase.database();
                }

                if (typeof db !== "undefined") {
                    db.ref("customers/" + customerId).once("value").then(snapshot => {
                        const data = snapshot.val();
                        
                        document.getElementById("loading-state").style.display = "none";
                        document.getElementById("main-content").style.display = "block";

                        if (!data) {
                            document.getElementById("cust-name").textContent = "العميل غير موجود";
                            return;
                        }

                        // 1. تعبئة البيانات
                        document.getElementById("cust-name").textContent = data.name || "الورشة";
                        document.getElementById("cust-desc").textContent = data.description || "Alwarsha";
                        
                        const logoEl = document.getElementById("cust-logo");
                        if (data.logo && data.logo.trim() !== "") {
                            logoEl.src = data.logo;
                        } else {
                            logoEl.src = "../assets/logo.png";
                        }

                        // 2. تعبئة الأزرار المتاحة
                        const btnList = document.getElementById("cust-btns");
                        btnList.innerHTML = "";

                        if (data.whatsapp) {
                            btnList.innerHTML += `
                                <a href="https://wa.me/${data.whatsapp}" target="_blank" class="btn-card">
                                    <span class="btn-text phone-num">${data.whatsapp}</span>
                                    <span class="icon"><i class="fa-brands fa-whatsapp"></i></span>
                                </a>`;
                        }

                        if (data.facebook) {
                            btnList.innerHTML += `
                                <a href="${data.facebook}" target="_blank" class="btn-card">
                                    <span class="btn-text">Facebook</span>
                                    <span class="icon"><i class="fa-brands fa-facebook"></i></span>
                                </a>`;
                        }

                        if (data.instagram) {
                            btnList.innerHTML += `
                                <a href="${data.instagram}" target="_blank" class="btn-card">
                                    <span class="btn-text">Instagram</span>
                                    <span class="icon"><i class="fa-brands fa-instagram"></i></span>
                                </a>`;
                        }

                        if (data.website) {
                            btnList.innerHTML += `
                                <a href="${data.website}" target="_blank" class="btn-card">
                                    <span class="btn-text">الموقع الإلكتروني</span>
                                    <span class="icon"><i class="fa-solid fa-globe"></i></span>
                                </a>`;
                        }

                        if (data.payment) {
                            btnList.innerHTML += `
                                <a href="${data.payment}" target="_blank" class="btn-card">
                                    <span class="btn-text">طرق الدفع</span>
                                    <span class="icon"><i class="fa-solid fa-credit-card"></i></span>
                                </a>`;
                        }

                    }).catch(err => {
                        console.error(err);
                        document.getElementById("loading-state").textContent = "خطأ في تحميل بيانات العميل";
                    });
                } else {
                    setTimeout(loadData, 300); // إعطاء مهلة إضافية لقراءة الفايربيز
                }
            }

            loadData();
        });
    </script>
</body>
</html>
