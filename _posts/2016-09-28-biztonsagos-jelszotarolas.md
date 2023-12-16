---
id: 1997
title: 'Biztonságos jelszótárolás'
date: '2016-09-28T09:36:39+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=1717'
permalink: /2016/09/28/biztonsagos-jelszotarolas/
dublin_core_author:
    - 'Enter author here'
dublin_core_title:
    - 'Enter title here'
dublin_core_publisher:
    - 'Enter publisher here'
dublin_core_rights:
    - 'Enter rights here'
pyre_show_first_featured_image:
    - 'yes'
pyre_portfolio_width_100:
    - default
pyre_video:
    - ''
pyre_fimg_width:
    - ''
pyre_fimg_height:
    - ''
pyre_image_rollover_icons:
    - default
pyre_link_icon_url:
    - ''
pyre_post_links_target:
    - 'no'
pyre_related_posts:
    - default
pyre_share_box:
    - default
pyre_post_pagination:
    - default
pyre_author_info:
    - default
pyre_post_meta:
    - default
pyre_post_comments:
    - default
pyre_main_top_padding:
    - ''
pyre_main_bottom_padding:
    - ''
pyre_hundredp_padding:
    - ''
pyre_slider_position:
    - default
pyre_slider_type:
    - 'no'
pyre_slider:
    - '0'
pyre_wooslider:
    - '0'
pyre_revslider:
    - '0'
pyre_elasticslider:
    - '0'
pyre_fallback:
    - ''
pyre_avada_rev_styles:
    - default
pyre_display_header:
    - 'yes'
pyre_header_100_width:
    - default
pyre_header_bg:
    - ''
pyre_header_bg_color:
    - ''
pyre_header_bg_opacity:
    - ''
pyre_header_bg_full:
    - 'no'
pyre_header_bg_repeat:
    - repeat
pyre_displayed_menu:
    - default
pyre_display_footer:
    - default
pyre_display_copyright:
    - default
pyre_footer_100_width:
    - default
pyre_sidebar_position:
    - default
pyre_sidebar_bg_color:
    - ''
pyre_page_bg_layout:
    - default
pyre_page_bg:
    - ''
pyre_page_bg_color:
    - ''
pyre_page_bg_full:
    - 'no'
pyre_page_bg_repeat:
    - repeat
pyre_wide_page_bg:
    - ''
pyre_wide_page_bg_color:
    - ''
pyre_wide_page_bg_full:
    - 'no'
pyre_wide_page_bg_repeat:
    - repeat
pyre_page_title:
    - default
pyre_page_title_text:
    - default
pyre_page_title_text_alignment:
    - default
pyre_page_title_100_width:
    - default
pyre_page_title_custom_text:
    - ''
pyre_page_title_text_size:
    - ''
pyre_page_title_custom_subheader:
    - ''
pyre_page_title_custom_subheader_text_size:
    - ''
pyre_page_title_font_color:
    - ''
pyre_page_title_height:
    - ''
pyre_page_title_mobile_height:
    - ''
pyre_page_title_bar_bg:
    - ''
pyre_page_title_bar_bg_retina:
    - ''
pyre_page_title_bar_bg_color:
    - ''
pyre_page_title_bar_borders_color:
    - ''
pyre_page_title_bar_bg_full:
    - default
pyre_page_title_bg_parallax:
    - default
pyre_page_title_breadcrumbs_search_bar:
    - default
fusion_builder_status:
    - inactive
refaktor_post_views_count:
    - '5652'
avada_post_views_count:
    - '5652'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
categories:
    - Biztonság
    - Fejlesztés
---

Adott egy alkalmazás, ami felhasználói jelszavakat tárol, jelszóellenőrzés céljából. Igen ám, de mivel a a felhasználók többsége ugyanazt a jelszót használja több szolgáltatáshoz, ez igen kényes téma. Nézzük, hogy hogyan tudjuk ezt biztonságosan megvalósítani.

> **Ne írj saját jelszótitkosító programot!**  
> A kriptográfia külön szakma! Ez a cikk ugyan leírja a jelszótitkosítás *elméleti* alapjait, de a gyakorlatban rengeteg olyan apróság van, amire itt nem tudunk kitérni. Jelszó titkosításra mindenképpen válassz kész megoldást, pl. PBKDF-2 vagy bcrypt.

## A naív megközelítés

Miért probléma ez? Hiszen az alkalmazásunk remélhetőleg biztonságos, így teljesen mindegy lenne, hogy hogyan tároljuk a jelszavakat, nem? Vagyis fogjuk a felhasználó jelszavát, elmentjük az adatbázisunkba és ezzel kész is vagyunk.

A gyakorlat viszont azt mutatja, hogy ez egy borzasztó rossz ötlet. Még az olyan nagy és vélhetőleg képzett programozókkal rendelkező cégek, [mint a Linkedin, is szenvednek el támadásokat](http://fortune.com/2016/05/18/linkedin-data-breach-email-password/) és kikerülnek a felhasználó-jelszó adatbázisaik. De tegyük fel, hogy az alkalmazás 100%-ig biztonságos. Biztosak vagyunk benne, hogy az alatta levő környezet is az? A PHP-ban, Javaban, NodeJS-ben, Pythonban nincs biztonsági hiba? Vagy a Linuxban ami futtatja a szolgáltatásunkat?

Félreértés ne essék, rengeteget tehetünk azért, hogy az jelszó-adatbázisunk ne kerüljön ki. Építhetünk például külön microservice-t, ami csak a felhasználók jelszavaival foglalkozik, de ez kellőképpen sok időbefektetést igényel. Éppen eleget ahhoz, hogy egy kezdeti fázisban levő vállalkozás ezt ne lépje meg. Akárhogy is legyen, fel kell készününk arra, hogy a jelszó-adatbázisunk ki fog kerülni. Tehát valahogy „titkosítanunk” kell.

## Hashelés

A [kriptográfiáról szóló cikkünkben már beszéltünk a hashelésről](/kriptografia-madartavlatbol/) (ujjlenyomat-függvényekről). Röviden alkotunk egy olyan függvényt, ami egy egyedi bemenetre ad egy egyedi kimenetet úgy, hogy az a kimenetből nem tudjuk visszafejteni a bemenetet.

Például:

```
var titkositott = sha256('szupertitkosjelszo')
//0a54c43ed40a7c11eb4adc928698e6a5e46765821363659428e807434c30d7ae
```

Az `SHA-256` hash függvény eredménye egy olyan karaktersorozat, amiből az eredeti jelszót nem tudjuk visszafejteni. A jelszót ellenőrizni viszont könnyű:

```
if (sha256(megadottjelszo) ==
    '0a54c43ed40a7c11eb4adc928698e6a5e46765821363659428e807434c30d7ae') {
    //...
}
```

Vagyis nincs is szükségünk az eredeti jelszóra, elég ha van egy ujjlenyomatunk (hashünk), amivel össze tudjuk hasonlítani a megadott jelszó hash-ét.

Ezzel biztonságban vagyunk? **Nem.**

Tegyük fel, hogy a hash függvényünk tökéletes és nincsenek benne olyan hibák, amik könnyebbé teszik a jelszó visszafejtését. Az egyetlen megoldásunk egy hash visszafejtésére az, hogy végig próbáljuk az összes lehetséges jelszót, pl. így:

```
sha256('aaaaaa')
//ed02457b5c41d964dbd2f2a609d63fe1bb7528dbe55e1abf5b52c249cd735797

sha256('aaaaab')
//bb4161ce37466cebb4c055c7664c071f2956dcc1300ac63ef8b5565c528301de

//...
```

Lássuk be, ez így nagyon sokáig fog tartani, ha *egy* jelszót szeretnénk visszafejteni, mivel 6 karakteres jelszavakkal és csak a latin ABC betűivel és számokkal számolva `(26*2+10)<sup>6</sup>`, vagyis laza 56 milliárd lehetőséget kell végig próbálnunk. Egy modern számítógép több millió hasht tud előállítani másodpercenként, vagyis egy jelszóért azért számottevő időt kell szenvedni. (1-2 nap.)

Igen ám, de ha nem csak egy jelszót kell megtörni, akkor mindjárt sokkal jobbak az esélyeink! Hiszen amelyik hasht már kiszámoltuk, azt el is menthetjük és a következő jelszó törésnél felhasználhatjuk. Sőt mi több, az interneten szép számmal találunk kész hash-adatbázisokat különböző szótári szavakra. Ezeket az adatbázisokat szivárványtáblának hívjuk és gyakorlatilag egyenértékűvé teszik ezt a jelszótárolási módszert azzal, mint ha plain textben tárolnánk őket.

## Sózás

Köpjünk bele, nem is, sózzuk el a gonosz támadó levesét! Gátoljuk meg a szivárványtáblák használatában! Valahogy meg kell azt oldanunk, hogy még ha azonos jelszót használ is két felhasználó, a hash akkor is különböző legyen.

Erre való a sózás. Minden felhasználóhoz kitalálunk egy **egyedi** kulcsot, amit elmentünk a felhasználóval, és ezt beleszerkesztjük a jelszóba hashelés előtt:

```
sha256('szupertitkos' + 'eeGei7ro')
//db950a827d9e6d110f28fc8a65ddf9bb5147005be1ba46d9340d53ba18795fa4

sha256('szupertitkos' + 'aXo8hi8u')
//c0e6e800270a630bb04ab27238dcb743410b1fe3249adabe1cb6bb115f932c26
```

Vagyis hiába rendelkezik a támadó szivárványtáblával, ezzel mit sem ér, hiszen a hash előtti érték felhasználónként különböző. A sót magát nem kell titkosítanunk, azt eltárolhatjuk plain textben a felhasználóval, hiszen önmagábal semmilyen értéket nem képvisel. Fontos megjegyezni, hogy a sónak egyedinek kell lennie ahhoz, hogy tényleg biztonságos legyen. Éppen ezért az [RFC 2898](https://www.ietf.org/rfc/rfc2898.txt) például legalább 64 bitnyi sót ír elő.

Biztonságban vagyunk? **Nem.**

Ha így szerkesztjük meg a jelszó-adatbázisunkat, jó eséllyel az összes jelszót nem fogja tudni senki megtörni. (Jelen tudásunk szerint.) Igen ám, de mi van a VIP felhasználókkal? Mondjuk egy ismert politikus felhasználójával, aki egy társkereső oldalon regisztrált? Nem is kell feltétlenül végig próbálni az összes lehetséges jelszót, elég lehet, ha végig megyünk egy szótáron. Néhány százezer szó hashét szinte pillanatok alatt elő lehet állítani, így igazán nem kihívás egy fontosabb jelszó megtörése.

## Több kör

A problémánk egyértelmű: túl gyorsan előállítható a hash. Olyan hashelési megoldást szeretnénk, ami *lassú*. Sőt mi több, olyan megoldást szeretnénk, ami paraméterezhetően lassú, hogy kompenzáljuk a fejlődő számítási kapacitást.

Megint válasszuk a naív megközelítést. Mi történik, ha a hash függvényt nem egyszer, hanem többször hajtjuk végre?

```
string jelszo = 'szupertitkos' + so;
for (int i = 0; i 
```

Ezzel ezereszeresére növeltük a töréshez szükséges számítási kapacitást. A bónusz: ha a körök számát változtathatóvá tesszük és elmentjük a felhaszálóval, a jövőben könnyen feljebb tudjuk tekerni a körök számát.

Biztonságban vagyunk? Tudom, elmegyek a fenébe. **Nem.**

Az SHA-256 függvényben jelen tudásunk szerint nincs *ütközés*, vagyis olyan helyzet, amikor két különböző bemenet azonos kimenetet ad. Az MD5-re és SHA-1-re ez már nem mondható el. Az ütközés azért probléma, mert ha két különböző jelszó azonos hasht ad, akkor nem is feltétlenül kell ismernünk a helyes jelszót, elég, ha egy megfelelő jelszót állítunk elő.

Ez a több körös hasheléssel azért probléma, mert ha az algoritmusban van ütközés, akkor minden kör gyengíti a hasht.

## Még több só

Úgy tűnik, nem elég sós még a jelszó, úgyhogy adjunk hozzá még egy kicsit:

```
string jelszo = 'szupertitkos';
for (int i = 0; i 
```

Vagyis minden körben kicsit megsózzuk a hasht. Ez ugyan nem feltétlenül küszöböli ki az ütközés problémáját, de egy támadónak minden körrel külön kell foglalkoznia az ütközés előállítása érdekében.

Biztonságban vagyunk? **Talán.**

## Általános jótanácsok

Ha hash algoritmust választunk, az olyan megoldások az ideálisak, amelyeket nem könnyű párhuzamosítani, GPU-ra implementálni, és arra is érdemes figyelni, hogy a jelszó és a só összefűzése helyett érdemes lehet például HMAC algoritmust használni, mint ezt teszi például a PBKDF-2 is. Ez is mutatja, hogy a jelszó kezelés egy igen komplex téma és jobban jársz, ha nem állsz neki jelszótitkosító programot írni. Egyrészt jó eséllyel nem rendelkezel a megfelelő háttértudással, másrészt nem valószínű, hogy napi szinten követed a kriptográfiával kapcsolatos fejleményeket. Használj egy jól ismert és tesztelt programkönyvtárat, például a PBKDF-2-t vagy a bcryptet.

Viszont akármelyiket is használod, tárold el mellé a használt módszert és tedd lehetővé a programodban, hogy fokozatosan le tudd cserélni a használt módszert. Amikor a felhasználó bejelentkezik, ellenőrizd, hogy az aktuálisan kívánt módszert használja-e és ha nem, titkosítsd újra a jelszót.

Talán mondani sem kell, de azért a rend kedvéért megemlítjük, hogy a klienstől érkező adatban nem bízhatsz meg. Időről időre felmerülnek a különböző fórumtémákban ötletek, hogy hogyan kellene a kliensen előállítani a hasht és attól majd biztonságos lesz a rendszer, ez egy nagyon nagyon rossz ötlet. Vannak ilyen megoldások, pl. az [SCRAM](https://en.wikipedia.org/wiki/Salted_Challenge_Response_Authentication_Mechanism), de ezek teljesen másra valóak.

## Függvénykönyvtárak

- [PHP](https://secure.php.net/manual/en/function.password-hash.php)
- [NodeJS](https://nodejs.org/api/crypto.html)
- [Python](https://bitbucket.org/ecollins/passlib/wiki/Home)
- [Java](https://www.owasp.org/index.php/Hashing_Java)

## További olvasmányok

- [OWASP Password Storage Cheat Sheet](https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet)
- [Cryptography Stack Exchange](https://crypto.stackexchange.com/)
- [With PBKDF2, what is an optimal Hash size in bytes? What about the size of the salt? — Cryptography Stack Exchange](https://security.stackexchange.com/questions/17994/with-pbkdf2-what-is-an-optimal-hash-size-in-bytes-what-about-the-size-of-the-s)
- [Do any security experts recommend bcrypt for password storage? — Cryptography Stack Exchange](https://security.stackexchange.com/questions/4781/do-any-security-experts-recommend-bcrypt-for-password-storage/6415#6415)