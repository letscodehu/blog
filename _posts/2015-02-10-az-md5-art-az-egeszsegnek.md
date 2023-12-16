---
id: 245
title: 'Az MD5 árt az egészségnek!'
date: '2015-02-10T10:52:39+01:00'
author: Tacsiazumax
layout: post
guid: '{{ site.url }}/?p=245'
permalink: /2015/02/10/az-md5-art-az-egeszsegnek/
dsq_thread_id:
    - '3502281197'
    - '3502281197'
tie_post_bg:
    - ''
    - ''
tie_post_color:
    - ''
    - ''
tie_gallery_style:
    - slider
    - slider
tie_link_url:
    - ''
    - ''
tie_link_desc:
    - ''
    - ''
tie_video_url:
    - ''
    - ''
tie_embed_code:
    - ''
    - ''
tie_audio_mp3:
    - ''
    - ''
tie_audio_m4a:
    - ''
    - ''
tie_audio_oga:
    - ''
    - ''
tie_audio_soundcloud:
    - ''
    - ''
tie_quote_author:
    - ''
    - ''
tie_quote_link:
    - ''
    - ''
tie_quote_text:
    - ''
    - ''
tie_status_facebook:
    - ''
    - ''
tie_status_twitter:
    - ''
    - ''
categories:
    - PHP
    - Security
tags:
    - bruteforce
    - md5
    - password
    - security
    - sha1
    - sha2
    - sha512
---

Mázlim volt és ezen a szerveren se volt letiltva az `eval` függvény (ahogy sok más sem 3:)), így most szabadon garázdálkodhatok rajta. Hozzá is adtam rögtön egy felhasználót magamnak c999-en át

Mai témánk az lesz, hogy miért is kéne kerülnünk az ősöreg MD5 128 bites egyirányú kódolási eljárásnak a használatát, legalábbis ha szerveroldalon tárolt adat összefüggésében tesszük azt. Fájlok eredetiségének az ellenőrzésére továbbra is alkalmas.[![multi_index_hashing](assets/uploads/2015/02/multi_index_hashing-1024x227.png)](assets/uploads/2015/02/multi_index_hashing.png)

Az egészet 1991-ben fejlesztették ki az akkor már elavult MD4 lecserélésére. Furcsamód 96-ban már találtak is benne egy biztonsági rést és már ekkor terelgették a népet egyéb hashelési eljárások (pl. Sha-1) használatára, de az emberek (és itt a PHP-sekre gondolok) bőszen ellenálltak a dolognak.

Gondolom senkinek sem kell bemutatnom a lényegét, egy 32 karakterből álló hexadecimális zagyvalékká alakítja a kapott adatot, amit nem lehet visszafejteni. Eddig nincs is vele hiba, valóban nem lehet visszafejteni azt. A 32 hexa karakter 16₃₂ variációt foglal magában, ami valljuk be a variációk tárháza. Ezzel sincs baj.

A gond ott kezdődik, hogy a mai számítási teljesítmények mellett elég gyorsan végre lehet hajtani ezt az algoritmust, és erre specializálódott oldalakon md5 érték - hash párok milliárdjai megtalálhatóak (pl. md5znaet.org, aminek megnézését sem ajánlom). Így hiába tároljuk a jelszavakat md5 hashelve az adatbázisainkban, azt gondolnánk, hogy azok továbbra is biztonságban vannak, holott ez közel sem igaz. A gondot tovább fokozza, hogy ugyanazt az md5 hash-t nem csupán egy, hanem egyszerre több érték is produkálhatja, ezzel tovább rövidítve a feltörési időt.

Vagy vegyük példának a script-et, ami apu szar i5-ösén fut és szép tatásan végigszuttyog az összes létező stringen, ami bejöhet. Egy md5 legenerálása kétszázmilliomod másodpercet vesz igénybe, mivel rövid stringek esetében az md5 algoritmus egy részét "át lehet ugrani". Ha csak az angol abc karaktereit használjuk, akkor az karakterenként 26 lehetőség, ha kis- és nagybetű egyaránt szerepel benne, akkor az már 52 lehetőség, ha szám is van benne, az már 62. Ha mindezt a kiterjesztett magyar ábécé (+ékezetes betűk és q,w,x,y) karaktereivel, akkor az már 98 lehetőség egy karakteren.

Ha jelszavunk 10 kisbetűs karakterből áll, akkor az 26₁₀, azaz 141.167.100.000.000 lehetőség az angol ABC kisbetűivel. Ez apa i5-ösével bizony "sok", 196 órát venne igénybe. Na de ki az az amatőr aki csak egy számítógépet használna ilyen célokra? Erre van a jól szituált bot hálózatunk. Na meg azt se felejtsük el, hogy lehet ezt gyorsabban is csinálni, 16 magon "némileg" gyorsabb lenne mindez. Ráadásul amint már megbeszéltük, mivel több érték mutathat ugyanarra az md5-re, lehet már a 100.000-ik próbálkozásunk is kiadja azt az md5-öt, amit keresünk, ami bizony jóval kevesebb energia és idő.

> A szerver pedig csak az md5-öket hasonlítja össze, nem érdekli, hogy a bejövő jelszó csak 3 karakter vagy 10.

Akkor most nézzünk egy fokkal modernebb eljárást, az ún. Sha-1-et. Ez már 160 bites hash-t generál, ami egy fokkal bonyolultabb, de a gond továbbra is az, hogy ezek gyors eljárások, ezért továbbra is a bruteforce támadások fő célpontjai lesznek, arról nem is beszélve, hogy ennél a módszernél is található ún. ütközés a generált kulcsok között.

Akkor jöjjön a sha-2/512, ami némileg lassabb, mint a sha-1-es elődje és 512 bites stringet produkál, de ami a legfontosabb, eddig nem találtak benne ütközést a kulcsok között, így bízhatunk abban, hogyha egy 10 karakteres jelszót keresnek, akkor bizony végig kell szüttyögniük mind a 141 ezer milliárd opciót.

Egyelőre ennyit az md5-ről és a jelszavakról. Most csak ilyen kisfröccsre futotta, de ne feledjétek: `if (function_exists('eval')) die();`