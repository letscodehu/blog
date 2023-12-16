---
id: 1992
title: 'Az ImageTragick biztonsági hiba margójára'
date: '2016-05-04T17:28:09+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=947'
permalink: /2016/05/04/az-imagetragick-biztonsagi-hiba-margojara/
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
    - '2489'
avada_post_views_count:
    - '2489'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2016/05/29122958/30543958_m_cropped.png'
categories:
    - Biztonság
    - Hírek
---

Mostanára szinte biztos, hogy olvastad, hogy súlyos biztonsági hibákat találtak a népszerű ImageMagick nevű képfeldolgozó programkönyvtárban. Miután már a csapból is ez folyik, minket inkább az érdekel, hogy hogyan is keletkezett ez a hiba?

## Források

Szokásunktól eltérve a forrásokat most mindjárt az elején közöljük, arra az esetre, ha mélyebbre szeretnél ásni:

- [imagetragick.com](https://imagetragick.com/)
- [CVE-2016–3714, CVE-2016-3718, CVE-2016-3715, CVE-2016-3716, CVE-2016-3717](http://www.openwall.com/lists/oss-security/2016/05/03/18)
- [ImageMagick legacy changelog](http://legacy.imagemagick.org/script/changelog.php)
- [ImageMagick forráskód](https://github.com/ImageMagick/ImageMagick/commits/master/MagickCore/property.c)

## Miben áll a biztonsági hiba?

Az ImageMagick egy modulokra épülő függvénykönyvtár. Ha megnézzük a [forrását](https://github.com/ImageMagick/ImageMagick), a coders könyvtárban találjuk a különböző fájlformátumokra vonatkozó programrészeket, a utilities könyvtárban a felhasználó által hívható programokat, stb.

Az említett coderek között viszont vannak olyanok, amik az átalakításokhoz külső programokat használnak. (Igen, ez az, amiért rádszólt a senior fejlesztő: márpedig exec parancsot nem használhatsz PHP-ban.) Ilyen például az SVG, MVG, stb. fájlok a forráskód alapján.

A külső programok futtatásáról azt kell tudni, hogy Linux/UNIX rendszereken nem csak egy program futtatására van így lehetőség, hanem beágyazhatunk más programokat is, például így:

```
teljesenlegitimkepatalakito -i `gonoszprogram` -o kimenet.png
```

A backtick karakter (```) például egy ilyen karakter, amivel el lehet érni a programok futtatását, majd a kimenet beillesztését a programba. Éppen ezért kell minden külső programhívás paramétereit escape-elni.

Na de, visszatérve a kép átalakításra: hogyan érjük el, hogy a gonosz programkódunkat beillessze az ImageMagick? Viszonylag egyszerű: vannak olyan fájlformátumok, amik megengedik a külső fájlok bekötését. Például egy SVG fájlban lehet egy hivatkozás egy külső, az Interneten található fájlra, ami nélkül a kép nem alakítható át.

Például lehetne ez:

```
<?xml version="1.0" standalone="no"?>

<svg width="640px" height="480px" version="1.1"
xmlns="http://www.w3.org/2000/svg" xmlns:xlink=
"http://www.w3.org/1999/xlink">
<image xlink:href="https://example.com/image.jpg"
x="0" y="0" height="640px" width="480px"/>
</svg>
```

Forrás: [CVE-2016–3714](http://www.openwall.com/lists/oss-security/2016/05/03/18)

Itt az SVG fájlba bekötünk egy képet az Internetről, eddig semmi bonyolult. De átalakíthatjuk a kódot akár így is:

```
<?xml version="1.0" standalone="no"?>

<svg width="640px" height="480px" version="1.1"
xmlns="http://www.w3.org/2000/svg" xmlns:xlink=
"http://www.w3.org/1999/xlink">
<image xlink:href="https://example.com/image.jpg&<strong>amp;quot;|ls &quot;-la</strong>"
x="0" y="0" height="640px" width="480px"/>
</svg>
```

Forrás: [CVE-2016–3714](http://www.openwall.com/lists/oss-security/2016/05/03/18)

A hiányzó escape-elés miatt ezt az ImageMagick így fogja lefordítani:

```
wget -q -O "..." "https://example.com/image.jpg"|ls "-la"
```

Nyilván egy könyvtárlistázásnál kártékonyabb parancsot is beírhattunk volna, ám ez jól mutatja a problémát.

A helyzet súlyosságát növeli, hogy az ImageMagick fejlesztői a problémát csak részlegesen orvosolták, bizonyos esetekben még mindig kijátszható a védelem.

## További problémák

Ez eddig egy hiba az ötből. Nem mintha nem lenne elég, de van itt még bőven. Az, hogy az MVG fájlok feldolgozása közben lehetséges HTTP vagy FTP kérést indítani szinte csak apróságnak tűnik, de a következő igazán durva.

Az ImageMagick támogat mindenféle pszeudo-protokollokat (például ` ephemeral://``msl://`, stb. amik szinte közvetlen hozzáférést engednek a helyi fájlrendszerhez.

Namost, különböző fájlformátumok támogatják azt, hogy külső fájlokat ágyazz be (pl. az SVG formátum), így szükség van különböző URL-ek betöltésére. A hiba akkor van, ha ezekben az URL-ekben feltétel nélkül megbízunk, ahogy ez az ImageMagick esetében is történt. Magyarán a PHP-ból futtatott ImageMagicked el tudja olvasni az adatbázis jelszavadat.

Időközben ugyan van lehetőség ezeket bekorlátozni egy policy fájllal, de az alap telepítés önmagában nem biztonságos.

## Mit tanulhatunk ebből?

Ha megnézzük az ImageMagick forráskódját, különösen az elmúlt néhány nap változását, egy dolog rögtön feltűnik: megpróbálták a fájlnévben előforduló karaktereket fehérlistázni. Az [első próbálkozásba](https://github.com/ImageMagick/ImageMagick/commit/06c41aba39b97203f6b9a0be6a2ccf8888cddc93) azonban egy igen amatőr hiba csúszott: a backtick karakter bent maradt a fehérlistán. Mit csinál a backtick? Pont most tárgyaltuk, programot hajt végre. (Legalábbis ha a `system()` rendszerhívást használjuk.)

Ami még feltűnő, hogy a külső programokra vonatkozó parancsok egy XML fájlban vannak (MagickCore/delegates.xml.in), viszont a meghívott programok paraméterei nincsenek külön szedve:

```
<delegate decode="https" command="&quot;@WWWDecodeDelegate@&quot; -s -k -L -o &quot;%o&quot; &quot;https:%F&quot;"/>
```

Mivel az adatok beillesztése után közel lehetetlen megmondani, hogy mi tartozik egybe, és mi tartozik külön, ez a megoldás finoman szóval architekturális gondokkal küzd. Helyette ez lenne a megfelelő:

```
<delegate decode="https" command="@WWWDecodeDelegate@">
    <param>-s</param>
    <param>-k</param>
    <param>-L</param>
    <param>-o</param>
    <param>%o</param>
    <param>https:%F</param>
</delegate>
```

Ezzel a megoldással ugyanis végig lehetne menni az összes paraméteren és végrehajtás előtt escape-elni lehetne őket.

Ezt a problémát mi sem bizonyítja jobban, hogy az első próbálkozás a javításra nem egészen sikerült, és továbbra is fennáll a biztonsági hiba.

Az persze már csak hab a tortán, hogy a mindenféle fájl-hozzáféréseket nem ellenőrizzük, illetve hogy egyáltalán van ilyenekre mód.

## Hogyan védekezzünk?

Felmerül az a kérdés is, hogy webalkalmazás tulajdonosa / fejlesztőjeként hogyan lehet az ilyen hibák ellen védekezni?

Sajnos az a válasz, hogy nagyon kevés lehetőséged van rá. Végig olvashatod az általad használt szoftverek forráskódját, de ezek közül rengeteg több tíz éves múltra tekint vissza, és még ha meg is érted, jó eséllyel egyszerűen kénytelen vagy néhány kifogásolható minőségűt használni.

Néhány dolgot azonban tehetsz. Egyrészt ellenőrizheted, hogy a feltöltött fájlban az van-e, aminek mondja magát. Tehát például egy .jpg kiterjesztésű fájl JPG adatot tartalmaz-e. Erre kiváló eszköz a MIME magic könyvtár.

Ezen felül, ha külső programot vagy kénytelen futtatni, érdemes lehet ezt egy biztonságos környezetben (például a Linuxokon elérhető chrootban, Docker containerben, vagy különböző UNIX-okon elérhető jailekben) megtenni. Ezt összekötve egy feldolgozási sorral (queue) sokkal nehezebb dolga lesz egy potenciális támadónak.

Egy dolgot azonban mindenképpen érdemes bevezetni: a biztonsági frissítések kerüljenek fel mihamarabb.

## TL;DR

Külső program meghívása esetén kínosan ügyelni kell arra, hogy ne lehessen futtatható parancsot beszúrni. Ha C-ben, vagy más rendszerközeli nyelvben dolgozunk, a `system()` hívás helyett érdemes `execve()`-t használni. Ha magasabb szintű nyelvet használunk, általában vagy van az `execve()`-hez hasonló funkcionalitás, vagy biztosítanak paraméter escape-eléshez szükséges függvényeket (például PHP-ban az [escapeshellarg](https://secure.php.net/manual/en/function.escapeshellarg.php)).

Ha pedig fájlnevekkel foglalkozunk, ellenőrizzük, hogy az érintett fájl valóban a megbízható fájlok között van-e.