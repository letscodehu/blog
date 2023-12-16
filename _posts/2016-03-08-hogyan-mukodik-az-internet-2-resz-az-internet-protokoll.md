---
id: 366
title: 'Hogyan működik az Internet, 2. rész: az Internet Protokoll'
date: '2016-03-08T07:00:38+01:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=366'
permalink: /2016/03/08/hogyan-mukodik-az-internet-2-resz-az-internet-protokoll/
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
avada_post_views_count:
    - '5355'
refaktor_post_views_count:
    - '5334'
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
image: 'assets/uploads/2016/03/29122441/45855021_m_cropped.jpg'
categories:
    - Alapozó
tags:
    - hálózatok
---

A cikksorozatunk [előző részében](/hogyan-mukodik-az-internet-1-resz-az-ethernet/) azzal foglalkoztunk, hogy hogyan kommunikálnak az eszközök a helyi hálózatban. Ebben a részben azt nézzük meg hogyan tudunk kitörni a helyi hálózatból, és kijutni a nagy betűs Internetre.

Ha vissza emlékezünk az előző részre, az egy hálózatban levő eszközök a hálózati kártya egyedi MAC címe alapján találják meg egymást. Ez viszont csak bizonyos méretig működik, hiszen az eszközöknek folyamatosan be kell „kiabálniuk”, hogy megtudják, ki hol van. Ez a forgalom terheli a hálózatot. Éppen ezért nagyobb rendszert érdemes több hálózatra bontani. Az így létrejött alhálózatoknak tudniuk kell kommunikálni egymással, össze kell kötnünk őket.

Erre több megoldás is létezik (például a régi [IPX](https://en.wikipedia.org/wiki/Internetwork_Packet_Exchange)), de a manapság használatos megoldás az *Internet Protokoll*, vagy röviden IP. Ez a rövidítés ismerős lehet az *IP cím* fogalmáról.

## Az IP cím

Nézzünk egy példát egy IP címre, ami sokaknak ismerős lehet: `192.168.1.1`

Ez egy hagyományos IPv4 IP cím. Mint látható, négy részből áll, amely mindegyike 0-255 értéket vehet fel, azaz 1 byte helyen tárolható. Az egész IP cím ennek megfelelően 4 byte (vagy 32 bit) helyet foglal.

Ebből adódóan az IPv4 rendelkezik egy beépített korlátozással: maximum 2<sup>32</sup>, azaz 4.294.967.296 IPv4 cím létezhet. Ezért már több mint egy évtizede elkezdték fejleszteni az IPv6 protokollt. Egy IPv6-os cím így néz ki: `2001:0db8:AC10:FE10:0000:0000:0000:0000`, vagy rövid formájában `2001:db8:AC10:FE10::`

Mint látható, ez radikálisan másképp néz ki. A 10-es számrendszerbeli (decimális) ábrázolás helyett itt 16-os számrendszert (hexadecimális) választottak, azaz minden egyes szám 0-9 és A-F értéket vehet fel. A cím összesen 8, 4 számjeggyel rendelkező blokkot, azaz összesen 32 számjegyet tartalmaz. A jó matekosok már ki is számolhatták, hogy ez összesen 128 bitnyi adatot jelent, az 2<sup>128</sup> (340 szextillió) IPv6 cím létezhet. Igen, ez baromi sok.

## Routing

![](assets/uploads/2016/03/routing.png)

Felmerül a teljesen jogos kérdés: "Szép és jó, hogy most már nem egy, hanem két címe van az eszközünknek, de vajon ettől miért lesz jobb?" Hogyan talál oda az adat a céleszközhöz, ha az nincs a helyi hálózaton.

Erre a válasz az úgynevezett *routing*, vagy magyarul a hálózati útválasztás. Egy modern hálózatban levő eszköz nem csak IP címmel, vagy adott esetben IP címekkel rendelkezik, hanem egy szabálykészlettel is, hogy melyik hálózatok merre találhatóak, azaz kinek kell küldeni a csomagot. Ha például a helyi hálózatban található a céleszköz, akkor azt közvetlenül annak az eszköznek küldjük.

Ha egy másik hálózatban található a cél, akkor jó eséllyel a *routerünknek* (hálózati útválasztónknak) továbbítjuk az adatcsomagot, amely aztán tudja, hogy neki hova kell tovább küldenie. Ennek a folyamatnak van egy kis trükkje. Az az eszköz, amely először összerakja a csomagot, készít egy IP csomagot, ezt pedig egy Ethernet frameben helyezi el, ami a routernek van címezve. Amikor a router ezt megkapja, kibontja belőle az IP csomagot, majd a szabálykészlet (routing tábla) alapján egy új Ethernet framet készít a következő routernek címezve. Ez a folyamat egészen addig folytatódik, amíg a csomag célba nem ér.

### Hol van az IP cím?

Most már csak egy dologot kell tisztáznunk: honnan tudja a router, hogy merre van a következő ugrás (hop)? Erre két mód van: a routert vagy *statikusan* konfiguráljuk (tehát kézzel beállítjuk), vagy pedig dinamikus kiosztással működik. A legegyszerűbben, egy otthoni vagy irodai router esetén, a szolgáltatónk az IP címmel együtt egyetlen routing szabályt küld le (az un. DHCP protokollon keresztül): ad egy IP címet, és ezen keresztül elérhető az egész világ.

Szolgáltatók között ennél bonyolultabb a helyzet, itt egyéni, un. peering megállapodások születnek. Ezekben a megállapodásokban két szolgáltató megegyezik kölcsönös vagy egyirányú adatkicserélésről. Optimális esetben a szolgáltatónk több ilyen kapcsolattal rendelkezik, ezek között terhelést oszthat el, illetve hiba esetén átállhat az egyik kapcsolatról a másikra. Hogy ezt ne kelljen mindig kézzel konfigurálni, a szolgáltatók az rajtuk keresztül elérhető hálózatokat az un. [BGP protokollon](https://en.wikipedia.org/wiki/Border_Gateway_Protocol) keresztül hirdetik ki, és a routerek automatikusan frissítik a saját routing tábláikat.

### Hogy néz ki egy routing szabály?

Nade, hogyan is néz ki egy routing tábla bejegyzés? A teljesség igénye nélkül nézzünk meg egy példát:

```
77.74.49.75/27 via 10.103.1.15
```

Az első rész felírást a szakmában CIDR néven emlegetjük. Nem csak az IP címet adjuk meg, hanem azt is, hogy *mekkora* a hálózat. Ahogy kicsit feljebb megtárgyaltuk, egy IPv4-es IP cím 32 bites. Ebben a példában ebből 27 bit a hálózathoz tartozik, azaz ebben a hálózatban az első 27 bit mindig ugyanaz lesz, és csak az utolsó 5 bit fog változni. Magyarán ebben a hálózatban az IP címek bináris formában mindig így kezdődnek:

```
01001101.01001010.00110001.010
```

Ezt a kezdő sorozatot *hálózati prefixnek* is hívjuk. Ebből az is következik, hogy ebben a hálózatban összesen 2<sup>5</sup>, azaz 32 IP cím létezhet, mivel 5 biten maximum 32 különböző szám képezhető le. Ez alapján az IP címek (bináris formában) így nézhetnek ki:

```
01001101.01001010.00110001.010 00000
01001101.01001010.00110001.010 00001
01001101.01001010.00110001.010 00010
...
```

A szabály többi része (`via 10.103.1.15`) pedig megadja, hogy az adott hálózat melyik routeren keresztül érhető el. Ha több ilyen szabályt készítünk, szinte tetszőlegesen szabályozhatjuk, mely adatcsomagok mely hálózati routeren, vagy hálózati kapcsolaton kerüljenek továbbításra.

> Gyakorlás képpen számoljuk ki a következő, helyi hálózatban szabadon kiosztható IP tartományok lehetséges IP címeit!
> 
> - 10.0.0.0/8
> - 172.16.0.0/12
> - 192.168.0.0/16

> **Tudtad?**  
> A legtöbb hálózaton van egy olyan router, amely az összes, más hálózatokba szánt csomagot fogadja. Ezt hívjuk alapértelmezett átjárónak, vagy angolul default gateway-nek. Ezt az alapértelmezett átjáró szabályt a legtöbb lakossági vagy irodai eszköz megkapja a szolgáltatótól, amikor IP címet kér. Ide kerül továbbításra minden olyan csomag, amire nem vonatkozik speciálisabb szabály. Ettől függetlenül a hálózaton lehetnek egyéb routerek is, amelyekre más szabályok vonatkoznak.

### Ütközés kezelése

Felmerül a teljesen jogos kérdés, hogy mi történik akkor, hogy ha két ütköző szabály létezik? Például az egyik szabály `77.74.49.75/27`, a másik pedig `77.74.49.75/26`.

A konfliktusok kezelése a Linux kernelben például a következő szabályok szerint működik:

1. Keressük meg a leghosszabb prefixű szabályt. (Ez esetben ez a /27 lesz az.)
2. Ha több ilyen szabály van, nézzük meg az [adminisztratív súlyozást](https://en.wikipedia.org/wiki/Administrative_distance). Ezzel előnyben részesítjük például a helyi hálózatban elérhető kapcsolatokat a routeren keresztül elérhetőekkel szemben.
3. Ha még mindíg fennáll egy konfliktus, használjuk azt a kapcsolatot, ami alacsonyabb *metrikával* rendelkezik. (Ez egy kézzel beállítható érték.)

Természetesen ezt felül bírálhatjuk és a cél IP cím helyett hozhatunk döntéseket forrás IP cím, vagy egyéb faktorok alapján is. Ezt hívják *policy routingnak*, ez azonban csak speciális esetben használatos.

> **Nézd meg a routing tábládat!**  
> Linuxon és MacOS-en a `netstat -r`, Windowson a `route print` parancs mutatja meg a beállított routing szabályokat.

> **Buktató!**  
> Ahhoz, hogy a hálózat működjön, a routingnak mindkét irányban helyesen kell működnie! Ha csak az egyik irányba működik, a válasz-csomagok nem találnak vissza az eredeti eszközhöz.

## A következő részben

A sorozat következő részében az ICMP, TCP és UDP protokollokat nézzük meg.

## Források

- <https://en.wikipedia.org/wiki/IPv4>
- <http://linux-ip.net/html/routing-selection.html>