/* ===================================================
   CERTIFICATIONS DATA
   To add a new certification, push a new object to
   the CERTIFICATIONS array below, then drop the image
   at assets/certifications/<your-filename>.jpg
   =================================================== */

const CERTIFICATIONS = [
  {
    title:        "Fundamentals of Electronic Device Fabrication",
    issuer:       "NPTEL (IIT Madras)",
    subIssuer:    "Funded by the Ministry of Education, Govt. of India",
    level:        "Elite",
    date:         "July\u2013August 2026",
    duration:     "4-week course",
    description:  "Covered core principles of semiconductor device fabrication, including process fundamentals and manufacturing techniques.",
    credentialId: "NPTEL26MM56S153500199",
    credentialUrl: "https://beta.nptel.ac.in/verify/NOC-RD8B-BVWX-57BMY",
    image:        "assets/certifications/nptel-edf-2026.jpg",
    imageAlt:     "NPTEL \u2014 Fundamentals of Electronic Device Fabrication, Elite Certificate"
  }
];

/* ── Render ── */
(function () {
  const list = document.getElementById('cert-list');
  if (!list || !CERTIFICATIONS.length) return;

  CERTIFICATIONS.forEach(function (cert, i) {
    var num  = String(i + 1).padStart(2, '0');
    var item = document.createElement('div');
    item.className = 'cert-item reveal';

    var verifyHtml = cert.credentialUrl
      ? '<a href="' + cert.credentialUrl + '" target="_blank" rel="noopener" class="cert-verify-link"><i class="fas fa-external-link-alt"></i> Verify on NPTEL</a>'
      : '<span class="cert-verify-qr"><i class="fas fa-qrcode"></i> Verifiable via QR code on certificate</span>';

    item.innerHTML =
      '<div class="cert-meta">' +
        '<p class="cert-num">/ ' + num + '</p>' +
        '<p class="cert-issuer">' + cert.issuer + '</p>' +
        '<p class="cert-sub-issuer">' + cert.subIssuer + '</p>' +
        '<p class="cert-date">' + cert.date + '</p>' +
      '</div>' +
      '<div class="cert-content">' +
        '<span class="cert-level-pill">' + cert.level + '</span>' +
        '<h3 class="cert-title">' + cert.title + '</h3>' +
        '<p class="cert-duration"><i class="fas fa-clock"></i> ' + cert.duration + '</p>' +
        '<p class="cert-desc">' + cert.description + '</p>' +
        '<div class="cert-credential-row">' +
          '<span class="cert-credential-label">Credential ID</span>' +
          '<span class="cert-credential-id">' + cert.credentialId + '</span>' +
        '</div>' +
        verifyHtml +
        '<div class="cert-image-wrap">' +
          '<div class="cert-img-ph" aria-hidden="true">' +
            '<i class="fas fa-certificate"></i>' +
            '<span>Place certificate image at:<br><code>' + cert.image + '</code></span>' +
          '</div>' +
          '<img src="' + cert.image + '" alt="' + cert.imageAlt + '" class="cert-img" loading="lazy">' +
        '</div>' +
      '</div>';

    /* Show placeholder only if image fails to load */
    var img = item.querySelector('.cert-img');
    var ph  = item.querySelector('.cert-img-ph');
    function showPlaceholder() { img.style.display = 'none'; ph.style.display = 'flex'; }
    img.addEventListener('error', showPlaceholder);
    /* Handle already-cached/local images that loaded before the listener attached */
    if (img.complete && img.naturalWidth === 0) showPlaceholder();

    list.appendChild(item);
  });
})();
