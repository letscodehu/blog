---
id: 2003
title: 'Az SQL injectionről egyszerűen'
date: '2016-12-04T22:29:56+01:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=1942'
permalink: /2016/12/04/sql-injectionrol-egyszeruen/
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
    - '5642'
avada_post_views_count:
    - '5642'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
categories:
    - Alapozó
    - Biztonság
---

Ha régóta fejlesztesz, ez a téma valószínűleg a könyöködön jön ki. De épp a mai nap kaptam egy fájlt amiben egy egyetemi oktató által írt program volt és igen, 2016-ban volt benne SQL injection sebezhetőség. Úgyhogy szomorú, de beszélnünk kell róla.

Nézzük az alapokat. Adott egy SQL lekérdezés, ami az adatbázisból kikeres egy felhasználónév-jelszó párost:

```
SELECT
  id
FROM
  users
WHERE
  username="janoszen"
  AND
  password="almafa"
```

Abba most ne menjünk bele, hogy mennyire rossz ötlet jelszavakat plaintextben tárolni, az egyetemisták kedvéért most ettől eltekintünk. Ha jelszavakat tárolsz, [van erről egy dedikált cikkünk](https://www.refaktor.hu/biztonsagos-jelszotarolas/) ami kötelező olvasmány.

A fenti példában a felhasználónév és a jelszó a felhasználótól jön, például egy webes űrlapból. Mi történik, ha most a jelszó helyett azt ütjük be, hogy `" OR 1=1 --`? Ez lesz az előző lekérdezésből:

```
SELECT
  id
FROM
  users
WHERE
  username="janoszen"
  AND
  password="<ins>" OR 1=1 --</ins>"
```

Gyakorlatilag jelszó nélkül be tudtam jelentkezni, ami elég komoly probléma. A bejelentkezésen kívül ez a technika adatlopásra, sőt, törlésre is használható.

## Védekezzünk a bemeneten! (ne)

Egy kezdő programozó ösztönös reakciója erre az, hogy „tiltsuk meg a felhasználónak az illegális karaktereket!” Az az szűrjük meg a felhasználótól érkező bemenetet úgy, hogy abban semmilyen veszélyes karakter ne fordulhasson elő. Ennek hatására születnek aztán az ilyen kódok:

```
function sanitize($value) {
    return htmlentities(strip_tags(stripslashes($value)));
}
```

Vagyis keressük meg az adott programnyelvben az összes szűrő függvényt, csapjuk őket egymás mögé véletlenszerű sorrendben és majd úgy jó lesz. Amellett, hogy ez nem 100%-os megoldás, van néhány kellemetlen mellékhatása, például az, hogy a beadott tartalomból hiányozni fog az összes `<` és `>`, illetve az összes adatunk HTML-re kódolva kerül tárolásra, ami nem feltétlenül ideális.

Oké, mondja a kezdő, közelítsük meg egy kicsit racionálisabban. Használjuk csak egy olyan függvényt ami minden `"` jel elé betesz egy visszaper jelet. (`\"`). Így már minden rendben, ugye? Hiszen a kód ezután így néz ki:

```
SELECT
  id
FROM
  users
WHERE
  username="janoszen"
  AND
  password="\" OR 1=1 --"
```

\*Sóhaj\*. Sajnos ez sem elég. Beszélgessünk kicsit karakterkódolásról. Remélhetőleg ha eljutottál idáig a programozásban, akkor tudod, hogy egy byte 8 bit és a karaktereket klasszikusan 8 biten tároltuk. Sajnos 8 bit nem elég a világ összes karakterére, ezért az elején a 8 bit kiosztása karakterkódolásonként különbözőképpen értelmezték. Vagyis ami ISO-8859-2 (Kelet-európai) kódolásban az Ő, az ISO-8859-3 (Dél-európai) kódolásban Ġ. Ahogy aztán egyre globalizálódtunk, ez a megoldás sem volt megfelelő, új technológiára volt szükség. Így született a unicode (UTF-8, UTF-16, stb), ami már nem 8 biten tárolja a karaktereket. Vagyis a korábbi, 8 biten működő függvényeink egy unicode karakterkódolású szövegen már nem megfelelőek.

Nem fárasztalak a részletekkel, a lényeg az, hogy a házi tákolású védelmi függvényeket érdemes messzemenően elkerülni, hiszen jó eséllyel nem követed napi szinten az adatbázisok fejlődését, nem fogod tudni, hogy milyen SQL injectionnel kapcsolatos változások jelennek meg.

## Védekezzünk az SQL lekérdezésnél!

Miért is használnánk tákolt megoldásokat, ha az összes modern adatbáziskezelő függvénykönyvtár biztosít beépített megoldást a probléma megoldására? Ez a megoldás különböző formákban jelenik meg, de gyakorlatilag minden függvénykönyvtár biztosít megoldást a legbiztonságosabb módszerre, a **prepared statementek** használatára.

Ezek körülbelül így néznek ki:

```
$sql = 'SELECT
  id
FROM
  users
WHERE
  username=?
  AND
  password=?';
sql_query($sql, ['janoszen', 'almafa']);
```

A konkrét megvalósítás természetesen programnyelvtől és adatbázis kezelő könyvtártól függ, de itt mindössze annyi történik, hogy a kérdőjeleket az SQL kezelő motor biztonságos módon helyettesíti a tömbben átadott adatokkal.

Ha eddig eljutottál, ezeket a megoldásokat jó eséllyel megtalálod saját magad is, de álljon itt néhány példa hogy hogyan lehet prepared statementeket használni különböző nyelvekben:

- [PHP](http://php.net/pdo)
- [Python](https://dev.mysql.com/doc/connector-python/en/connector-python-example-cursor-transaction.html)
- [Java](https://docs.oracle.com/javase/tutorial/jdbc/basics/prepared.html)

## Alternatívák (ne)

Sok függvénykönyvtár, így például a PHP MySQLi fel fog kínálni olyan megoldást is, amivel egy menetben össze lehet építeni az SQL queryt, például így:

```
$sql = 'SELECT
  id
FROM
  users
WHERE
  username="' . $db->escape('janoszen') . '"
  AND
  password="' . $db->escape('almafa') . '"';
```

Ezt azonban két okból is érdemes elkerülni. Egyrészt ennél a megoldásnál az adatbáziskezelő függvénykönyvtárnak tudnia kell, hogy az adataid milyen karakterkódolásban vannak. Másrészt, és ez a nagyobb probléma, el fogod felejteni.

PHP-ban például a [CodeIgniter framework javasolja ezt a fajta megoldást](https://www.codeigniter.com/user_guide/database/queries.html). Miután ezt minden egyes querynél el kell követni, talán nem is meglepő, hogy szinte minden CI projekt amit eddig láttam tartalmazott legalább 3-4 SQL injection sebezhetőséget.

Az emberi figyelmetlenség és lustaság hatalmas, rengetegen a legkisebb ellenállás irányába mennek, így érdemes a legkisebb ellenállás irányát úgy kialakítani, hogy az legyen a biztonságos.

## Összefoglaló

Az SQL injectionök elleni védelem hihetetlenül könnyű prepared statementek használatával. Használjuk őket! 2016-ban ennek a biztonsági hibának nem is szabadna léteznie.