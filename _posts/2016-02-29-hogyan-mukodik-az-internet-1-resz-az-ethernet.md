---
id: 265
title: 'Hogyan működik az Internet, 1. rész: az Ethernet'
date: '2016-02-29T23:20:13+01:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=265'
permalink: /2016/02/29/hogyan-mukodik-az-internet-1-resz-az-ethernet/
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
    - '5953'
refaktor_post_views_count:
    - '5745'
dublin_core_author:
    - 'Pásztor János'
dublin_core_title:
    - 'Hogyan működik az Internet, 1. rész: az Ethernet'
dublin_core_type:
    - text
dublin_core_publisher:
    - 'Opsbears e.U.'
dublin_core_contributor:
    - ''
dublin_core_rights:
    - 'https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:0:"";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
amazonS3_cache:
    - 'a:4:{s:58:"//www.letscode.huassets/uploads/2016/02/wireshark.png";a:2:{s:2:"id";i:276;s:11:"source_type";s:13:"media-library";}s:81:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2016/02/29122319/wireshark.png";a:2:{s:2:"id";i:276;s:11:"source_type";s:13:"media-library";}s:66:"//www.letscode.huassets/uploads/2016/02/wireshark-details.png";a:2:{s:2:"id";i:279;s:11:"source_type";s:13:"media-library";}s:89:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2016/02/29122343/wireshark-details.png";a:2:{s:2:"id";i:279;s:11:"source_type";s:13:"media-library";}}'
image: 'assets/uploads/2015/02/09201645/inception-trailer-movie-leonardo-de-caprio1.jpg'
categories:
    - Alapozó
tags:
    - ethernet
    - hálózatok
---

Sokszor a hibakeresésnél fontos lenne, ám nem tudjuk: hogyan is működnek az alapok. Éppen ezért ebben a cikksorozatban az Internetet szedjük szét, kezdve a legalsó szoftveres réteggel: hogyan működik a helyi hálózat, hogyan működik az Ethernet, pontosabban az Ethernet II.

## Mi is az az Ethernet?

Ma talán az Ethernet már egyet jelent a helyi hálózattal, azonban ez nem mindig volt így. Számos konkurense volt, mint például a [token ring](https://en.wikipedia.org/wiki/Token_ring), illetve a mai napig vannak nem Ethernet hálózatok. De mi is az az Ethernet?

Az Ethernet egy olyan problémát kíván megoldani, amin talán ma már nem sokat gondolkozunk: itt van egy helyi hálózat, hogyan juttatom el az én adathalmazomat a címzett gépnek, amely ugyanezen a hálózaton lóg. Nyilván valamilyen rézdróton vagy száloptikán, de ezen belül hogy?

Erre a kérdésre igyekszik választ adni az Ethernet, ami először úgynevezett koax kábelen, minden gépet láncba fűzve működött. Ezt aztán később lecserélte a csillag-topológiás kábelezés, hubok, majd később switchek közbeiktatásával. (Magyarán a későbbiekben egy kábellel csak két eszköz került összekötésre.)

## Fizikai réteg

Az Ethernet eredeti koncepciója az volt, hogy az adatok ugyanazon a médiumon közlekedjenek, mint az egyéb távközlési formák, éppen ezért ugyanazt a BNC kábelezést használták. A számítógépeket és egyéb eszközöket egy láncra fűzték, a lánc végére pedig lezáró dugót (ellenállást) kellett helyezni.

Ennek a hálózatnak az volt a jellegzetessége, hogy mivel mindenki azonos kábelezésen volt, könnyen előfordulhattak ütközések, amikor két készülék egyszerre akart adatot küldeni. Az ehhez készült hálózati kártyákat éppen ezért felszerelték egy olyan algoritmussal, ami észlelte ezt az ütközést, és ezután véletlenszerű időintervallumot várt.

Természetesen ahogy a hálózatok és az adatmennyiség fejlődött, ez a fajta hibakezelés már nem működött, szükség volt a pont-pont alapú kábelezésre, avagy a ma használatos CAT-5, CAT-5E és CAT-6 (vagy közismertebb nevén Ethernet) kábelekre.

## Adatcsomagok

Az Ethernet csomag-alapú, tehát egy meghatározott adatmennyiséget küld egy csomagban. Ha ennél több adatot akarunk küldeni, akkor azt több csomagra kell bontani.

<div class="fusion-table table-1">|  | Preambulum |  | SFD |  | Source MAC |  | Destination MAC |  | Ethertype |  | Payload |  | FCS |  |
|---|------------|---|-----|---|------------|---|-----------------|---|-----------|---|---------|---|-----|---|
|  | 7 byte |  | 1 byte |  | 6 byte |  | 6 byte |  | 2 byte |  |  | 4 bytes |  |

</div>Maga az adatcsomag egy úgynevezett *preambulummal*, vagyis csomagkezdő jellel indul, ami nem más, mint egy meghatározott bitsorozat. Ethernet esetén ez egy 57 bites (7 byte hosszú) bitsorozat, aminek a szabvány szerinti értéket kell tartalmaznia: `0x55 0x55 0x55 0x55 0x55 0x55 0x55`.

A preambulumot egy úgynevezett *Space Frame Delimiter (SFD)* követi, ami egy byte hosszú és arra szolgál, hogy jelezze a tényleges Ethernet Frame kezdetét, konkrétan: `0xD5`.

Az SFD után jön a *küldő eszköz MAC címe*, majd a *céleszköz MAC címe*, összesen 2x6 byte hosszban, majd ezután az *Ethertype*.

Az Ethertype egy érdekes jószág: ha az értéke 1500 vagy az alatt van, akkor a frame-ben foglalt hasznos adat hosszát tartalmazza. Ha 1536, vagy efölötti értéket tartalmaz, akkor azt jelöli, hogy milyen csomag van a hasznos adat részben. Ez esetben a frame végét a framet követő Frame Check Sequence, valamint a framet követő csomagok közti szünet jelöli.

Az Ethertype után következik maga a hasznos adat (*payload*). Ebben sok minden lehet, például egy IP csomag (amiről a következő cikkben lesz szó), vagy egy IPX csomag, stb. Ennek a hossza elméletben nem korlátozott, azonban a gyakorlatban a mai hálózatok 1500 byte hosszú MTU-t (Maximum Transmission Unit) használnak.

A csomagot utolsó eleme a *Frame Check Sequence*, azaz az ellenőrzőszám. Ezt a küldő eszköz a CRC32 algoritmussal számolja ki, a címzett pedig ugyanezzel az algoritmussal ellenőrzi. Ezt pedig követi egy 12 byte hosszú *interpacket gap*, azaz egy szünet a csomagok között.

## Ethernet a gyakorlatban

### Wireshark

Nade, hogy ne csak elméletben beszélgessünk az Ethernetről, nézzük meg mindezt a gyakorlatban. Ehhez a [Wireshark](https://www.wireshark.org/) nevű eszközt fogjuk használni, ami minden modern operációs rendszerre ingyenesen érhető el.

A Wiresharkot megnyitva a *List Capture Interfaces* gomb megnyomásával elkezdhetjük a gépünk hálózati forgalmát monitorozni, vagy adott esetben megnyithatunk egy *tcpdump* programmal előállított, például egy szerverről származó filet. Ez aztán így néz ki:

![wireshark](assets/uploads/2016/02/29122319/wireshark.png)

Az egyes sorok az egyes adatcsomagokat jelentik, amikre duplán kattintva megtekinthetjük a csomag részleteit:

![wireshark-details](assets/uploads/2016/02/29122343/wireshark-details.png)

Mint látható, az Ethernet frame részleteit szépen ki lehet olvasni a rögzített adatokból.

### tcpdump

A tcpdump eszköz a legtöbb Linux/UNIX rendszergazda szerszámkészletében jelen van, gyakorlatilag a defacto szabvány hálózatmonitorozó szoftver ezeken a platformokon.

Ha az Ethernet fejlécekbe szeretnénk belekukkantani, azt igen egyszerűen megtehetjük:

```
tcpdump -i any -n -e -XX host 77.74.49.66 and host 77.74.49.75
```

Ebben a példában korlátozom a monitorozást a két nevezett gépre, de természetesen enélkül is futtatható a parancs. A tcpdump különböző lehetséges kapcsolóiról a `man tcpdump` parancs ad részletesebb felvilágosítást.

Ha a fenti parancsot lefuttatjuk, ilyeneket fogunk látni:

```
19:56:16.387450 Out 00:25:90:c1:93:8a ethertype ARP (0x0806), length 44:
        Request who-has 77.74.49.75 tell 77.74.49.66, length 28
        0x0000:  0004 0001 0006 0025 90c1 938a 0000 0806  .......%........
        0x0010:  0001 0800 0604 0001 0025 90c1 938a 4d4a  .........%....MJ
        0x0020:  3142 0000 0000 0000 4d4a 314b            1B......MJ1K
```

Koránt sem olyan szép, mint a Wireshark, de ha éppen nincs kéznél grafikus felülettel rendelkező számítógép, vagy gyorsan kell eredményre jutnunk, ez is tökéletes eszköz.

## A sorozat következő részében

A sorozat következő cikkében arról fogunk tárgyalni, hogy mit is lehet elküldeni egy Ethernet frameben, és hogyan léphetjük át a helyi hálózatunk határait.

## Források

- [https://en.wikipedia.org/wiki/Token\_ring](https://en.wikipedia.org/wiki/Token_ring)
- <https://en.wikipedia.org/wiki/10BASE2>
- <https://en.wikipedia.org/wiki/Ethernet>
- [https://en.wikipedia.org/wiki/Ethernet\_frame](https://en.wikipedia.org/wiki/Ethernet_frame)
- [https://en.wikipedia.org/wiki/Maximum\_transmission\_unit](https://en.wikipedia.org/wiki/Maximum_transmission_unit)