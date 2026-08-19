self.addEventListener('fetch', (event) => {
    // هذا الكود يجعل التطبيق يعمل حتى لو المتصفح في وضع الأوفلاين
    event.respondWith(fetch(event.request));
});
