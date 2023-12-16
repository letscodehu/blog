---
id: 482
title: 'Low level debugolás, 2. rész: hálózati eszközök'
date: '2016-03-16T10:33:24+01:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=482'
permalink: /2016/03/16/low-level-debugolas-2-resz-halozati-eszkozok/
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
    - '3256'
avada_post_views_count:
    - '3259'
dublin_core_author:
    - 'Enter author here'
dublin_core_title:
    - 'Enter title here'
dublin_core_publisher:
    - 'Enter publisher here'
dublin_core_rights:
    - 'Enter rights here'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
amazonS3_cache:
    - 'a:2:{s:58:"//www.letscode.huassets/uploads/2016/02/wireshark.png";a:2:{s:2:"id";i:276;s:11:"source_type";s:13:"media-library";}s:81:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2016/02/29122319/wireshark.png";a:2:{s:2:"id";i:276;s:11:"source_type";s:13:"media-library";}}'
image: 'assets/uploads/2016/03/29122703/38251176_m.jpg'
categories:
    - Alapozó
tags:
    - iptables
    - tcpdump
    - tcpflow
    - wireshark
---

A sorozat első részében megnéztük, hogy hogyan lehet egy folyamat rendszerhívásait nyomon követni. Sokszor ez azonban körülményes, ha csak a hálózati forgalomra vagyunk kíváncsiak. Ilyenkor jól jön, ha néhány hasznos eszközt megismerünk.

Amiről szó lesz, nem újdonság. A *„Hogyan működik az Internet?”* sorozatunk [első](https://www.refaktor.hu/hogyan-mukodik-az-internet-1-resz-az-ethernet/) és [második részében](https://www.refaktor.hu/hogyan-mukodik-az-internet-2-resz-az-internet-protokoll/) már volt szó hálózati monitorozó eszközökről, de ezúttal egy kicsit mélyebben megnézzük a témát.

## tcpdump

A tcpdump eszköz ugyan fapados, de egyetlen Linux/UNIX fejlesztő eszköztárából sem hiányozhat. Nézzünk meg tehát – a teljesség igénye nélkül – néhány példát a használatára. A konzolos eszközökhöz híven részletes leírást a tcpdump manpage-en találsz, amit a `man tcpdump` paranccsal tekinthetsz meg.

A legegyszerűbb az az üzemmód, amikor az összes interface-en kíváncsiak vagyunk az összes hálózati forgalomra. Ezt a következőképpen érhetjük el:

```
tcpdump -i any
```

Ha ennek hatására elkezdenek a képernyőn szaladni a betűk, nem kell kétségbe esni, a Ctrl+C megnyomásával befejezhetjük a program futását. Nézzük, hogy mit is jelentenek a betűsorok:

```
22:37:52.724726 IP wordpress.org.https > obs-zyl-smallwebs01.opsbears.com.42924: Flags [P.], seq 2301339106:2301339157, ack 3205437489, win 59, options [nop,nop,TS val 2462421481 ecr 2506631540], length 51
```

Ebben a példában az látszik, hogy itt egyetlen TCP csomag érkezett a wordpress.org-ról az én szerveremre, méghozzá a P jelzőbittel. A többi paraméter pedig az adott TCP kapcsolat különböző adatait adja meg. A TCP-ről egy későbbi cikkben lesz szó, de egyelőre elégedjünk meg annyival, hogy a különböző jelzőbitek a kapcsolat felépítéséhez, fenntartásához és lebontásához szükségesek.

Ez eddig szép és jó, látjuk a ki-bemenő IP csomagokat, de jó lenne bennük szűrni is. Szerencsére ennek igen egyszerű a nyelvezete, nézzük a következő példát:

```
tcpdump -i any port not 22 and host not wordpress.org
```

Ezzel kiszűrjük a 22-es porton közlekedő csomagokat (SSH protokoll), illetve a wordpress.org-ot. Természetesen ennél jóval bonyolultabb kifejezésekre is mód van, amiről a `man pcap-filter` parancs tájékoztat.

A különböző szűrő feltételeken kívül a tcpdumpnak vannak egyéb parancssori kapcsolói is, amikkel a működését befolyásolhatjuk. Nézzünk néhány fontosabbat:

<div class="table-responsive">|  | <th>`-A`</th> |  | Kiírja a csomag tartalmának egy részét a csomag adataival együtt. Ez különösen hasznos, ha webkiszolgálást akarunk elemezni. |  |
|---|---------------|---|----------------------------------------------------------------------------------------------------------------------------------------|---|
|  | <th>`-c`</th> |  | A megadott számú elkapott csomag után kilép. |  |
|  | <th>`-C`</th> |  | Fájlba íráskor korlátozza a file méretét MiB-ben. Ha a fájl az adott méretnél nagyobb, új fájlt nyit és a nevéhez hozzáfűz egy számot. (Lásd még: `-w`) |  |
|  | <th>`-e`</th> |  | Kiírja a kapcsolati szintű fejléceket (pl. Ethernet) minden sorhoz. |  |
|  | <th>`-f`</th> |  | Kikapcsolja az IP címek barátságos DNS nevekké való feloldását távoli címekre. (Lásd még: `-n`) |  |
|  | <th>`-F`</th> |  | A parancssor helyett a megadott fájlból olvassa a filter kifejezéseket. |  |
|  | <th>`-G`</th> |  | A megadott számú másodpercenként új fájlt nyit a fájlba íráskor. (Lásd még: `-w`) |  |
|  | <th>`-i`</th> |  | Kizárólag a megadott hálózati csatolón figyeli a csomagokat. Alapértelmezetten az első csatolót választja, az *any* kulcsszóval az összes csatolón figyel. |  |
|  | <th>`-K`</th> |  | Kikapcsolja a TCP, UDP, stb. ellenörzőszámok ellenörzését. |  |
|  | <th>`-l`</th> |  | Átkapcsolja a tcpdump kimenetét olyan üzemmódba, hogy azt további programok használni tudják. (pipe) |  |
|  | <th>`-L`</th> |  | Kiírja az adott hálózati csatolón támogatott kapcsolati szintű protokollokat. (pl. Ethernet, DOCSIS, stb.) |  |
|  | <th>`-n`</th> |  | Kikapcsolja az IP címek feloldását hostnévvé. |  |
|  | <th>`-p`</th> |  | Nem kapcsolja át a hálózati csatolót un. promisc módba. (Ez a mód szükséges a nem az adott gépnek címzett csomagok elkapásához.) Ez akkor hasznos, ha már egy másik program átkapcsolta. |  |
|  | <th>`-s`</th> |  | A megadott számú byte-ot rögzíti. Alapértelmezetten ez a szám 65535 byte. |  |
|  | <th><span style="white-space: nowrap;">`-v<br></br>-vv<br></br>-vvv`</span></th> |  | A tcpdump beszédességét állítja. |  |
|  | <th>`-w`</th> |  | A megadott fájlba írja a csomagokat. Ez hasznos, ha később pl. Wiresharkkal szeretnénk elemezni az adatfolyamot. |  |

</div>## tcpflow

A tcpdump paraméterezése bevallottan nem éppen triviális. Ha egy egyszerű eszközre vágyunk pl. webes forgalom megjelenítésére, akkor a tcpflow nevű program éppen megfelelő lehet. Ez ugyanis csak a csomagok tartalmát írja ki, a küldő és a fogadó IP címmel együtt. A filterszabályai pontosan azonosak a tcpdumppal, de az egyéb paraméterezése sokkal egyszerűbb:

```
tcpflow -i any -c
```

Fontos! A -c kapcsolót semmiképp se hagyjuk le, különben a képernyő helyett megannyi file-ba íródik a kimenet.

## Wireshark

Természetesen a csinos felhasználói felületek barátai sem maradnak hálózati monitorozó eszköz nélkül. A [Wireshark](https://www.wireshark.org/) MacOS X kivételével minden aktuális operációs rendszeren kiválóan működik, és meglehetősen mély analízist tesz lehetővé az elkapott csomagokon.

![wireshark](assets/uploads/2016/02/29122319/wireshark.png)

Ha esetleg egy szerveren tcpdumppal rögzítettünk csomagokat, azokat a Wireshark képes betölteni és megjeleníteni.

## mitmproxy

Időnként nem elegendő passzívan figyelni, hanem közbe kell ékelődni a megfelelő információ megszerzéséhez. Ez különösen akkor igaz, ha egy olyan alkalmazást akarunk debugolni, aminek nem csak a forráskódja nem érhető el, de titkosított csatornán (pl. HTTPS-en) kommunikál. Erre való a [mitmproxy](https://mitmproxy.org/). Ez az egyszerű kis alkalmazás a gépünkön levő tűzfal segítségével a célszerver helyett fogadja a HTTP vagy HTTPS kéréseket, rögzíti őket, majd a célszerverről lekéri a kívánt oldalt.

A szoftver beállítása koránt sem triviális, éppen ezért a [dokumentációt](http://docs.mitmproxy.org/en/stable/) érdemes alaposan szemügyre venni. A különböző üzemmódjai abban különböznek, hogy a debugolni kívánt szoftverben lehet-e proxy-t beállítani, vagy sem. Az előbbi beállítása viszonylag egyszerű, az utóbbinál viszont némi tűzfal konfigurálás elébe nézünk, mivel a szoftver forgalmát át kell irányítanunk a mitmproxy-hoz. Szerencsére ehhez a mitmproxy fejlesztői [kiváló segítséget nyújtanak](http://docs.mitmproxy.org/en/stable/transparent/linux.html).

Ezen felül ha HTTPS oldalakat is szeretnénk kiszolgálni ezen keresztül, akkor a mitmproxy SSL certificate-jét be kell töltenünk a szerelőpadon heverő szoftver alatti operációs rendszerbe.

> **Figyelem!**  
> A debugolás végeztével mindenképpen távolítsuk el a mitmproxy CA-t az operációs rendszerből, különben az adott gép sebezhető lesz!

## fiddler

Megint csak a csinos felhasználói felületek kedvelőihez szólunk ezzel a szoftverrel. A [Fiddler](http://www.telerik.com/fiddler) hasonló a mitmproxy-hoz, de többé-kevésbé barátságos felülettel rendelkezik. Az egyetlen hibája, hogy kizárólag Windowson működik. További szomorító tényező, hogy a szoftver gyártója kötelezően kér egy e-mail címet a letöltéshez.

![fiddler](assets/uploads/2016/03/fiddler.png)

## Gyakorlati példa avagy miért fontos ez?

Pont miután megírtam a cikk első részét, futottunk bele egy jellemző példába. Az egyik általam is karbantartott alkalmazás logjában feltűnt egy hiba, amivel nem tudtunk mit kezdeni. Az egyik backend API-t használó JSON encode folyamat hibát dobott, nem tudott kódolni egy UTF-8 karaktert. Ráadásul pár másodpercenként. Az viszonylag hamar kiderült, hogy itt valaki megpróbál jelszavakat brute force-olni, az viszont nem derült ki, hogy mi okozza a hibát.

Maga az alkalmazás nem adott elegendő információt, és - mivel nagy forgalmat bonyolító szolgáltatásról volt szó - az éles rendszeren való debugolást is kizártuk. Ennek hiányában nem volt más lehetőségünk, kénytelenek voltunk az ebben, és az előző cikkben leírtakat használni a probléma felderítésére. Előszőr a strace-t használtuk, hogy felderítsük, mi is történik:

```
POOL="php-fpm-pool-neve";strace -f -s 999 $(ps auwfx | grep php | grep "pool $POOL" | awk ' { print $2 } ' | xargs -i echo -n '-p {} ')
```

Ezzel természetesen hihetetlenül sok adatot kaptunk, de a lényeg benne volt. A hibaüzenetre keresve megtaláltuk, hogy melyik processz futtatta a kódot. Miután a processz ID-t (PID) tudtuk, már egyszerű volt a keresés. Láttuk, hogy tényleg fura karakterek jönnek be. Sajnos a FastCGI protokollból nem lettünk okosabbak, de tudtuk, hogy valami fura.

Nem volt más hátra, a hálózati forgalmat kellett megnéznünk. Szerencsére a reverse proxy-tól már titkosítatlanul jött a forgalom, tehát bele tudtunk nézni. (Ez egy meglehetősen gyakori megoldás nagyobb terhelésnél, hogy a titkosítást egy, a tényleges webszerver előtt levő reverse proxy végződteti.) Hogy tudjunk később szűrni, beleírtuk a teljes forgalmat egy file-ba:

```
tcpdump -i any -n -w interesting-bug.pcap port 80
```

Miután megláttuk a hibát a logban, leállítottuk a capture-t és megnéztük, hogy mi is volt benne:

```
tcpdump -r interesting-bug.pcap -A
```

Ebben már könnyű volt keresni, és meggyőződtünk róla, hogy valóban benne van a hibát okozó lekérés. Ezek után nem volt más hátra, betöltöttük Wiresharkba a file-t, és a következő szűrőt alkalmaztuk:

```
http.request.uri=="/login"
```

Ezzel szépen leszűrtük az összes csomagot kizárólag a megfelelő címre menő lekérdezésekre. Végül egy jobb kattintás, *Follow TCP Stream* megadta a teljes lekérdezést, amit ezután le tudtunk menteni file-ba.

## Összegzés

Elméletben természetesen tökéletes alkalmazást írunk, felkészülünk minden helyzetre, és soha nincs olyan helyzet, ahol az alkalmazásunk nem ad elegendő információt. A gyakorlatban viszont sajnos ez sokszor nincs így. Még ha tökéletes is a saját kódunk, nem biztos, hogy az alatta futó platformról ugyanezt el lehet mondani.

Éppen ezért érdemes begyakorolni ezen alacsony szintű elemző eszközök használatát. Amikor élesben használni kell őket, már ujjgyakorlat szintjén lehessen kezelni a problémás eseteket.