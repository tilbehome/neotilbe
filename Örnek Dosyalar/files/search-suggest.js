/* ═══════════════════════════════════════════════════════════════════
   TILBE HOME — SEARCH TYPO SUGGEST
   ───────────────────────────────────────────────────────────────────
   Kullanıcı arama kutusuna yanlış/eksik yazdığında "şunu mu demek
   istediniz" önerisi verir.

   Çalışma şekli:
   1. Sayfa yüklenince: 241 statik terim + DOM'daki mega menu link'leri
      birleştirilir → search index oluşur.
   2. Her tuşta (debounce 180ms): kullanıcının yazdığı normalize edilir,
      index'te Levenshtein distance ile en yakın terim bulunur.
   3. Threshold: maksimum 2 karakter fark. Tam eşleşme varsa öneri yok.
   4. Öneri dropdown'da "Son Aramalar"ın üstünde gösterilir.

   Bağımlılık: YOK (Fuse.js değil, kendi implementasyonu — 4KB)
   API: YOK. Tamamen client-side, Qukasoft'tan bağımsız.
═══════════════════════════════════════════════════════════════════ */

(function(){
  'use strict';

  /* ─── 01. TERİM LİSTESİ ─────────────────────────────────────── */
  // Bu liste build-time'da search-terms.json'dan JS'e embed edilmeli.
  // Demo için inline tutuyoruz — production'da ayrı dosya.
  var STATIC_TERMS = window.TILBE_SEARCH_TERMS || [];

  /* ─── 02. TÜRKÇE NORMALIZER ────────────────────────────────── */
  // "şekersiz" ve "sekersiz" eşit kabul edilir.
  // Kullanıcı Türkçe karakter yazamadığında bile eşleşsin.
  function normalize(s){
    if(!s) return '';
    return s.toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/i̇/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* ─── 03. DAMERAU-LEVENSHTEIN DISTANCE ─────────────────────── */
  // İki string arası karakter düzenleme mesafesi.
  // Normal Levenshtein'dan farkı: transposition (karakter yer değiştirme)
  // 1 operasyon sayılır.
  // "temso" ↔ "termos" → distance 1 (m ve o yer değiştirmiş)
  // "rnde"  ↔ "rende"  → distance 1 (e eksik)
  // 20 karakter altında <1ms.
  function damerau(a, b){
    if(a === b) return 0;
    if(!a.length) return b.length;
    if(!b.length) return a.length;

    var matrix = [];
    var i, j;

    // İlk satır ve sütun
    for(i = 0; i <= b.length; i++) matrix[i] = [i];
    for(j = 0; j <= a.length; j++) matrix[0][j] = j;

    // Doldurma
    for(i = 1; i <= b.length; i++){
      for(j = 1; j <= a.length; j++){
        var cost = (b.charAt(i-1) === a.charAt(j-1)) ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i-1][j-1] + cost,  // substitution
          matrix[i][j-1] + 1,       // insertion
          matrix[i-1][j] + 1        // deletion
        );
        // Transposition — iki komşu karakter yer değiştirmiş
        if(i > 1 && j > 1 &&
           b.charAt(i-1) === a.charAt(j-2) &&
           b.charAt(i-2) === a.charAt(j-1)){
          matrix[i][j] = Math.min(matrix[i][j], matrix[i-2][j-2] + 1);
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /* ─── 04. SEARCH INDEX ─────────────────────────────────────── */
  // Her terim için hem orijinali hem normalize formu tutulur.
  // Aranırken normalize üzerinden, dönüş orijinal.
  var searchIndex = [];

  function buildIndex(){
    var seen = {};

    // 1. Statik terimler
    STATIC_TERMS.forEach(function(term){
      var key = normalize(term);
      if(key.length >= 2 && !seen[key]){
        seen[key] = true;
        searchIndex.push({ original: term, normalized: key });
      }
    });

    // 2. DOM'dan mega menu link'lerini de ekle
    // Bu otomatik genişleme — sen mega menu'ye yeni kategori
    // eklediğinde arama da öğrenir.
    try {
      var selectors = [
        '.h-cft',              // Desktop mega menu başlıklar
        '.h-cfc',              // Desktop mega menu alt linkler
        '.ms-cat span:first-child'  // Mobile sidebar kategoriler
      ];
      var nodes = document.querySelectorAll(selectors.join(','));
      for(var i = 0; i < nodes.length; i++){
        var text = (nodes[i].textContent || '').trim();
        if(text.length < 2 || text.length > 60) continue;
        var key = normalize(text);
        if(!seen[key]){
          seen[key] = true;
          searchIndex.push({ original: text, normalized: key });
        }
      }
    } catch(e){
      // DOM scan hata verirse görmezden gel — static terimler yeterli
    }
  }

  /* ─── 05. BEST MATCH BUL ───────────────────────────────────── */
  // Kullanıcı input'u → en yakın terim (varsa)
  // Return: { match: string, distance: number } veya null
  function findBestMatch(query){
    var q = normalize(query);
    if(q.length < 3) return null;  // çok kısa arama için öneri yok

    // 1. Önce prefix match var mı bak — varsa öneri gösterme
    // (kullanıcı doğru yazmaya başlamış, düzeltmeye gerek yok)
    for(var i = 0; i < searchIndex.length; i++){
      if(searchIndex[i].normalized.indexOf(q) === 0){
        return null;  // prefix match var, typo değil
      }
    }

    // 2. Tam eşleşme var mı? Varsa öneri yok
    for(var i = 0; i < searchIndex.length; i++){
      if(searchIndex[i].normalized === q) return null;
    }

    // 3. Fuzzy match — en düşük distance'lı terimi bul
    var best = null;
    var bestDist = Infinity;
    // Threshold: query uzunluğuna göre ölçekli
    // 3-4 harf → max 1 hata
    // 5-7 harf → max 2 hata
    // 8+ harf  → max 2 hata (daha fazlası çok gevşek match yapar)
    var maxDist;
    if(q.length <= 4) maxDist = 1;
    else if(q.length <= 7) maxDist = 2;
    else maxDist = 2;

    for(var i = 0; i < searchIndex.length; i++){
      var entry = searchIndex[i];
      // Uzunluk farkı maxDist'ten fazlaysa atla (optimization)
      if(Math.abs(entry.normalized.length - q.length) > maxDist) continue;
      // Çok uzun terimler için skip (30+ karakter kategorisi düşük öneri değerinde)
      if(entry.normalized.length > 30) continue;

      var d = damerau(q, entry.normalized);
      if(d < bestDist && d <= maxDist){
        bestDist = d;
        best = entry;
        if(d === 1) break;  // 1 karakter fark = perfect, daha iyisini arama
      }
    }

    if(!best) return null;
    return { match: best.original, distance: bestDist };
  }

  /* ─── 06. UI — DROPDOWN'A ÖNERİ EKLE ───────────────────────── */
  // "Son Aramalar"ın üstüne öneri bloğu ekler.
  // Desktop: .h-sd içinde, Mobile: .fs-body içinde.

  var DESKTOP_HOST = null;   // .h-sd (arama dropdown)
  var MOBILE_HOST = null;    // .fs-body
  var DESKTOP_INPUT = null;
  var MOBILE_INPUT = null;

  function getHosts(){
    DESKTOP_HOST = document.querySelector('.h-sd');
    MOBILE_HOST = document.querySelector('.fs-body');
    DESKTOP_INPUT = document.getElementById('dsi');
    MOBILE_INPUT = document.getElementById('fsInput');
  }

  function renderSuggestion(container, input, matchText){
    if(!container) return;

    // Önceki öneriyi temizle
    var prev = container.querySelector('.h-suggest');
    if(prev) prev.remove();

    if(!matchText) return;

    // Yeni öneri bloğu
    var block = document.createElement('div');
    block.className = 'h-suggest';
    block.innerHTML =
      '<div class="h-suggest-label">Şunu mu demek istediniz?</div>' +
      '<button type="button" class="h-suggest-btn">' +
        '<svg class="ic"><use href="#i-search"/></svg>' +
        '<span class="h-suggest-text"></span>' +
        '<svg class="ic h-suggest-arrow"><use href="#i-chev-right"/></svg>' +
      '</button>';

    // Text content'i güvenli şekilde yaz (XSS koruması)
    block.querySelector('.h-suggest-text').textContent = matchText;

    // Tıklanınca: input'a yaz + submit
    block.querySelector('.h-suggest-btn').addEventListener('click', function(){
      if(input){
        input.value = matchText;
        // rsAdd varsa history'ye ekle
        if(typeof window.rsAdd === 'function'){
          window.rsAdd(matchText);
        }
        // Form submit et (desktop) veya mobile için yönlendir
        var form = input.closest('form');
        if(form){
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          // Qukasoft arama URL'sine yönlendir
          window.location.href = '/arama?k=' + encodeURIComponent(matchText);
        } else {
          // Mobile input (form yok) — direkt yönlendir
          window.location.href = '/arama?k=' + encodeURIComponent(matchText);
        }
      }
    });

    // Container'ın en başına ekle
    container.insertBefore(block, container.firstChild);
  }

  /* ─── 07. DEBOUNCE ─────────────────────────────────────────── */
  function debounce(fn, ms){
    var timer;
    return function(){
      var ctx = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function(){ fn.apply(ctx, args); }, ms);
    };
  }

  /* ─── 08. INPUT DİNLE ──────────────────────────────────────── */
  function handleInput(input, host){
    return debounce(function(){
      var val = input.value || '';
      if(val.length < 3){
        // Query çok kısa — öneri temizle
        var prev = host && host.querySelector('.h-suggest');
        if(prev) prev.remove();
        return;
      }
      var result = findBestMatch(val);
      renderSuggestion(host, input, result ? result.match : null);
    }, 180);
  }

  /* ─── 09. BAŞLAT ───────────────────────────────────────────── */
  function init(){
    if(!STATIC_TERMS.length){
      console.warn('TILBE_SEARCH_TERMS tanımlı değil — search suggest devre dışı.');
      return;
    }

    buildIndex();
    getHosts();

    if(DESKTOP_INPUT && DESKTOP_HOST){
      DESKTOP_INPUT.addEventListener('input', handleInput(DESKTOP_INPUT, DESKTOP_HOST));
    }
    if(MOBILE_INPUT && MOBILE_HOST){
      MOBILE_INPUT.addEventListener('input', handleInput(MOBILE_INPUT, MOBILE_HOST));
    }

    // Debug için global
    window.tilbeSearch = {
      findBestMatch: findBestMatch,
      indexSize: function(){ return searchIndex.length; },
      normalize: normalize
    };
  }

  // DOM hazır mı?
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
