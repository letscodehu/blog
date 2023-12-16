---
id: 159
title: '5 ok, hogy miért felejtsd el az FTP-t'
date: '2016-02-29T23:25:21+01:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=159'
permalink: /2016/02/29/5-ok-hogy-miert-felejtsd-el-az-ftp-t/
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
    - '4105'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:0:"";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
refaktor_post_views_count:
    - '3792'
image: 'assets/uploads/2016/01/29122208/17627850_ml.jpg'
categories:
    - Üzemeltetés
tags:
    - protokoll
---

Az FTP az internet kezdeti napjai óta létezik, és elterjedt módja a fájlok átvitelének. Mindazonáltal, mint megannyi régi protokoll, rengeteg problémával küzd. Sok más protokollal ellentétben sajnos nem fejlődött együtt a követelményekkel.

Ebben a postban 5 okot mondunk, hogy miért érdemes az FTP protokollt lecserélni egy alternatívára.

## Hogyan működik az FTP?

Az FTP protokoll két kapcsolatot használ: egy vezérlő kapcsolatot, amin a parancsokat küldi át (hasonlóan a UNIX-os távvezérlő protokollokhoz, mint a telnet és az SSH), és egy plusz kapcsolatot nyit az adatátvitelekhez. Ezt a kapcsolatot vagy a szerver nyitja a kliens felé (aktív mód), vagy ahogy manapság gyakrabban használatos, a kliens nyitja a szerver felé (passzív mód). Az adatkapcsolat mindig véletlenszerű portokon történik, amit a paranccsatornán a felek megbeszélnek.

## 1. ok: a titkosítás hiánya

Az FTP, mint számos, az internet hajnalán született protokoll, eredetileg nem rendelkezett saját titkosítással. Hogy ez miért veszélyes, ezt remélhetőleg nem kell magyarázni: a jelszavak titkosítatlanul utaznak keresztül az interneten, bárki, aki egy közbenső eszközhöz hozzá tud férni (internet kávézó, titkosítatlan WLAN, stb), el tudja lopni az FTP jelszavunkat.

Ugyan időközben beépítettek SSL alapú titkosítást a protokollba, de ezt sokszor nem triviális beállítani (külön szoftvereket kell telepíteni a kliensekhez, stb), másrészt (ami sokkal nagyobb gond), hogy a titkosított paranccsatornának köszönhetően a tűzfalak nem tudják megállapítani, hogy az adatcsatorna melyik porton fog működni. Innentől kezdve a rendszergazda kénytelen az adatkapcsolathoz használható valamennyi portot kinyitni, ami azt eredményezi, hogy ott egy, a gépbe bejutott rosszindulatú támadó backdoort tud nyitni.

## 2. ok: tűzfalazás

Az óvatos rendszergazda általában úgy konfigurálja a szervereit, hogy azok több rétegű védelemmel rendelkezzenek. Az egyik ilyen réteg a tűzfal, ami jobb esetben csak és kizárólag azt a forgalmat engedi be és ki, ami a rendszerüzemeltető szándéka szerint helyén való. Éppen ezért a különböző szolgáltatásokat bekorlátozza a saját portjukra.

Ezen a ponton a figyelmes olvasó már érti is a problémát: az FTP protokoll egy bizonyos port halmazból véletlenszerűen választ egyet. Avagy nem elegendő egy-két portot kinyitni az FTP programnak, amit induláskor el is foglal, hanem ki kell nyitni egy egész halom portot, ahová más alkalmazás (pl. egy backdoor) is be tud pofátlankodni.

Erre ugyan van kerülő megoldás, amikor a tűzfal-szoftver beleolvas az FTP paranccsatornába és ebből vissza fejti a portokat, de ez csak akkor működik, ha az a csatorna nem titkosított. (Lásd 1.)

## 3. ok: karakterkódolás

Vagy az ékezetes betűk problémája. Az FTP nem közvetít információt arról, hogy a szerver fájlrendszere milyen karakterkódolással működik. Azaz könnyen előfordulhat, hogy ami a webes alkalmazásunkban szép ékezetes karakterekkel jelenik meg, az az FTP-n keresztül egy értelmezhetetlen katyvasz.

Noha az ékezetes fájlnevek használata különösen fejlesztői körökben jogos közutálatnak örvend, mégis előfordul, hogy egy tapasztalatlanabb kolléga ténykedése kapcsán születik egy-egy ilyen fájl. Ha aztán FTP-n próbáljuk meg törölni a például PHP-val létrehozott fájlt, könnyen lehet, hogy lyukra futunk: nem lehet törölni a fájlt. Ilyenkor aztán a szolgáltatóhoz kell fordulnunk, hogy távolítsa el a renitens adathalmazt, ami kínos és időrabló.

## 4. ok: szóközök a fájlnevekben

Az FTP protokoll megalkotása közben valószínűleg nem gondoltak arra, hogy valamikor 8+3 karakternél hosszabb fájlnevekkel fogunk dolgozni, éppen ezért nem is nagyon foglalkoztak azzal, hogy a fájlnevek köré a paranccsatornában elválasztó karaktereket tegyenek. Ennek az a szomorú következménye, hogy ha egyszer valahogy létrehozunk egy fájlt, ami szóközzel kezdődik vagy arra végződik, az bizony megint csak törölhetetlenné válhat, attól függően, hogy milyen kliens és szerver szoftver fut.

## 5. ok: sortörések

Az FTP protokollt eredetileg szövegfájlok átvitelére tervezték, és hogy a platformok (DOS, MacOS, UNIX) között olvashatóak maradjanak a fájlok, a protokoll előírja, hogy a szövegfájloknál (ASCII mód) a sortöréseket ki kell cserélni a platformnak megfelelőre. Tehát DOS/Windows esetén kocsivissza (ASCII #10) + sortörés (ASCII #13), régi MacOS-eknél csak kocsivissza, UNIX rendszereknél pedig csak sortörés.

Ez eddig rendben is volna, de ezzel az FTP programok igen könnyen tönkre tehetnek egy bináris fájlt (például egy képet), ahol a sortörés karakternek teljesen más jelentése van. Szerencsére az FTP programok többsége intelligens, és csak a szöveg fájl végződések esetén alkalmaz ASCII módot, de ha véletlenül egy szövegfájlba bináris adatot csomagolunk, akkor némi hajtépést okozhat az automatikus karaktercsere.

## Alternatíva

Szerencsére mára már vannak az FTP-nél sokkal jobb, és végiggondoltabb protokollok. Az egyik ilyen az SSH, amit elsődlegesen szervereken szokás használni távoli parancssor alkalmazásnak. Az SSH egyik alfunkciója viszont a fájl átvitel, akár egyesével, vagy az rsync alkalmazás segítségével akár szinkronizációs üzemmódban is. Az SSH-t ráadásul meglehetősen könnyű bekonfigurálni úgy, hogy az ügyfél csak egy adott könyvtárat érjen el (chroot).

Az ügyfélnek szintén egyszerűbb dolga van. A Windows felhasználók ingyenes TotalCommander alternatívát kapnak a [WinSCP](https://winscp.net/) formájában, a többi platform pedig szintén rendelkezik hasonló, ingyenes szoftverekkel.

## Mit tegyek?

A webhosting szolgáltatóknak csak azt tudom javasolni, hogy fektessenek be nem csak az SSH telepítésébe, hanem az ügyfelek oktatásába is. Nincsenek illúzióim, az FTP nem fog eltűnni egyik napról a másikra (bármennyire is szeretném), de azokat az ügyfeleket, akik belefutnak ezekbe a problémákba, érdemes átterelni SSH-ra.

Az FTP felhasználóknak pedig csak azt tudom javasolni, hogy kérjék meg a szolgáltatójukat az SSH, de legalább titkosított FTP telepítésére.