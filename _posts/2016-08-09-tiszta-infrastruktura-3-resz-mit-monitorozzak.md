---
id: 1995
title: 'Tiszta infrastruktúra, 3. rész — Mit monitorozzak?'
date: '2016-08-09T07:20:58+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=1482'
permalink: /2016/08/09/tiszta-infrastruktura-3-resz-mit-monitorozzak/
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
avada_post_views_count:
    - '3484'
refaktor_post_views_count:
    - '3483'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
image: 'assets/uploads/2016/08/29123206/39293884_m.jpg'
categories:
    - Üzemeltetés
---

Lássuk be: egy nagyobb rendszert monitorozni kihívás. Amíg 4-5 egyszerű weboldalról könnyű megmondani, hogy működik-e, addig egy nagyobb, bonyolultabb infrastruktúra működési ellenőrzése már komoly kihívás lehet. Nézzük meg, hogy mit érdemes monitorozni.

## Miért monitorozunk?

Mielőtt azonban belevágunk, tisztázzuk: miért is monitorozunk? Persze, most magadban lehülyéztél, hiszen természetesen azért monitorozunk, hogy tudjuk, működik-e a rendszer.

### Az üzletvezetői szemlélet

Ha egy üzletvezetőt kérdezünk a monitorozásról, valószínűleg úgy magyarázná el, hogy tudni szeretné, hogy ellátja-e még a feladatát, vagyis üzleti szemszögből: termel-e még pénzt. Ha például van egy nagyobb forgalmú webshopunk, akkor ő olyan dolgokra lenne kiváncsi, hogy mikor volt a legutolsó fizetés, mennyi az elmúlt egy óra vagy egy nap bevétele, stb. Ha egy adatfeldolgozó rendszert üzemeltetünk, akkor kiváncsiak lehetünk a feldolgozott adatsorok számára, vagy hasonlóra.

Ezek a számok egy jól bejáratott rendszernél jellemzően konstansak, vagy ha nem azok, annak oka van. Arra azonban érdemes figyelni, hogy olyan metrikát válasszunk, ami lehetőség szerint nem okoz hibás riasztásokat. Ha például minden hétvégén lemegy a forgalom és ezért minden hétvégén megy ki riasztás a fizetésekről, akkor hamar elvész a bizalom a monitorozásban, ami azt eredményezi, hogy az üzletvezető Téged, kedves rendszergazda, fog piszkálni, hogy valami gyanús neki.

### A rendszergazdai szemlélet

A rendszergazdát mindez természetesen csak addig érdekli, amíg piszkálják vele, egyébként magasról tesz arra, hogy mennyit fizetnek a kedves ügyfelek a webshopban, sokkal izgalmasabb az, hogy ténylegesen milyen szolgáltatások mennek.

Az olyanok, hogy megy-e még a webszerver, és betölt-e az oldal, az meglehetősen triviális, ez a legtöbb rendszerben meg is van. Ami viszont hiányzik, az a mélyebb, szolgáltatás-szintű monitorozás. Azt például, hogy működik-e még a mailszerver érdemes úgy ellenőrizni, hogy ténylegesen elküldünk egy levelet, és megnézzük, hogy megérkezett-e. Hiszen csak így lehetünk biztosak benne, hogy nincs-e az Exim konfigurációnkban egy elírt kapcsos zárójel.

Arra is érdemes figyelni, hogy a fejlesztőink által, remélhetőleg önállóan deployolt kód vajon mennyire működik jól. A legtöbb programnyelv, framework, rendelkezik valami féle hibanapló (log) funkcionalitással. Jobb esetben szoftvergyáros kollégákat rá lehet venni, hogy a súlyos hibákat más *hibaszinttel* küldjék a logba. Ezzel remélhetőleg kiszűrhetővé válik a kódban elkövetett hibák egy része.

## Hogyan kezdjünk neki?

Ha egyáltalán nincs még monitorozásod, nehéz dolgod lesz. [Ahogy az egységtesztelésnél is](https://www.refaktor.hu/tiszta-kod-2-resz-teszteljunk-tdd-vel/), úgy a monitorozásnál sem lehetsz biztos abban, hogy működik, amíg a szolgáltatás egyszer tényleg le nem áll. Éppen ezért nem elegendő bekonfigurálni a monitorozást és elégedetten hátradőlni. Nézzük, hogy milyen módszerek vannak a bevezetésre.

### 1. Ha megáll, elkezdjük monitorozni

A lehető legegyszerűbb, de egyben a legkevésbé hatékony módszer a monitorozás kiépítésére az, hogy ha egy szolgáltatás leáll és nem értesülünk róla, építünk rá monitorozást. Ezt az elvet természetesen akkor is érdemes követni, ha jobb a monitoring-lefedettségünk, hiszen mindig előfordulhat, hogy megfeledkezünk egy szolgáltatásról.

Itt fontos megemlíteni, hogy ilyenkor nem elegendő azt az egy szolgáltatást betenni a monitorozásba, végre kell hajtani egy post-mortem elemzést, hogy mi is ment félre. Egy-egy leállás sokszor akár tervezési gyengeségre is rámutathat, például hogy egy szolgáltatás nem eléggé redundáns, vagy nem eléggé skálázható. Éppen ezért ezt az eredendő okot, amellett, hogy kiépítjük a monitorozást, érdemes kommunikálni az üzletvezetés felé a jövőbeni orvoslás érdekében. (Ezt más néven root cause analysisnek is hívják.)

Ez a módszer természetesen csak akkor működik, ha ezt az elvet tényleg betartjuk. Minden leállásnál fel kell derítenünk az okát, és le kell tesztelni, hogy hasonló leállás tényleg kivált-e figyelmeztetést a monitorozó rendszerben.

Természetesen az ellenkezője is igaz, ha hamis riasztást kapunk, azt tűzzel-vassal irtani kell, különben megbízhatatlan lesz a monitorozó rendszerünk.

### 2. Kényszerített leállítás

A fenti módszer durvább változata az, amikor szándékosan állítunk le szolgáltatásokat. Sajnos ez azt is jelenti, hogy kénytelenek vagyunk karbantartási ablakokat beiktatni. Cserébe viszont sokkal gyorsabban nő a szolgáltatásaink lefedettsége.

### 3. Automatizálás

Ha megfogadtad [az előző cikkünkben írtakat és automatizálsz](https://www.refaktor.hu/tiszta-infrastruktura-2-resz-bevezetes-a-rendszerautomatizalasba/), akkor közvetlenül az automatizáló rendszerbe építhetsz be monitorozást.

Hogy egy konkrét példát mondjuk, építhetsz egy webszervert konfiguráló modult. Ebben a modulban csinálsz egy olyan funkciót, ami egy vhostot (domaint) konfigurál, például a puppetes példánál maradva így:

```
lamp::vhost {
  "www.refaktor.hu":
     vhost => "www.refaktor.hu",
     port => 6524,
     uid => 6524,
     ssl => true,
     ssl_certificate => "puppet:///files/ssl/refaktor/refaktor-2016.crt",
     ssl_key => "puppet:///files/ssl/refaktor/refaktor-2016.key"
     ssl_redirect => true
     mysqluser => "refaktorhu"
     mysqldb => "refaktorhu"
     mysqlpassword => "ieno..."
     sshkeys => [
       "ssh-rsa AAAAB3..."
     ],
     extra => "if (!-e $request_filename) {\n\t\trewrite ^.*$ /index.php last;\n\t}";
}
```

Ez a modul aztán szépen felkonfigurálja az nginx-et, a PHP-FPM poolt, a MySQL-t, létrehozza a könyvtárat, stb. Miért ne hozhatná létre a monitorozással járó konfigurációt is? Az, hogy nem ugyanazon a gépen van a monitorozás mint amin a webszerver, nem túl nagy akadály. Puppetben például [exportált erőforrásokkal](https://docs.puppet.com/puppet/latest/reference/lang_exported.html) adhatunk át másik gépeknek konfiguráció-részeket.

Vagyis abban a pillanatban, hogy beleírjuk a konfiguráció-menedzsment rendszerünkbe az adott weboldalt, nem csak a szolgáltatáshoz szükséges konfiguráció készül el, hanem mindjárt a monitorozás is feléled, külön munka nélkül. Ezzel a megoldással egyből garantáljuk, hogy az oldal betölt és 200-as státuszkóddal tér vissza, az SSL cert nem jár le a következő időben, stb.

Nyilván így nem tudunk mindent lefedni, hiszen több gépet érintő full-stack, vagy programozásnál szokott néven: integrációs teszteket így nem tudunk kezelni.

### 4. Full-stack tesztek

Ha a fentiekkel végeztünk és az alapvető szolgáltatások monitorozása adott, érdemes még egy kört futni azzal, hogy a teljes szoftverhalmazt összeépítve tesztelő monitorozást is építünk. Ilyen lehet például e-mail esetén egy olyan teszt, ami elküld egy levelet, majd megnézi, hogy az adott postafiókból IMAP-on keresztül olvasható-e. Egy másik jó példa erre egy olyan megoldás, ami egy tényleges böngészőben, például [Phantom JS-el](http://phantomjs.org/) betölti a weboldalt és ellenőrzi, hogy bizonyos paraméterek egyeznek-e, illetve megfelelő-e a betöltési sebesség.

Ezekre a tesztekre nincs általános megoldás, minden rendszernek másra van szüksége. Jó gyakorlat az, hogy ha valami leáll és nem egyértelmű, hogy leállt, akkor arra építsünk tesztet.

## Üzleti érték

Lássuk be, nem minden ugyanolyan fontos. Rendszergazdaként hajlamosak vagyunk messze túlbecsülni annak a fontosságát, hogy tényleg minden szolgáltatás minden körülmény között fusson, és elfeledtkezünk arról, hogy a feladatunk az „üzleti” érdekek védelme. Példának okáért egy follow-up marketing e-mail kiküldése sokkal fontosabb lehet, mint az, hogy éppen fut-e a CPU terheltséget mérő collectd.

A monitorozás kiépítésekor érdemes a számunkra nagy értéket jelentő szolgáltatások figyelése mellett az üzleti érdekeket is figyelembe venni. Ha csak a saját eszközkészletünket tartjuk rendben és egy másodpercig sem gondolkodunk el azon, hogy mi is keresi itt az energiaitalra valót, könnyen előfordul, hogy az üzletileg fontos metrikákról sem grafikon, sem riasztás nem készül.

Ez azért is fontos, mert ha például pénzügyi tranzakciókat monitorozunk, nem mindegy, hogy mennyire érzékeny a rendszer. Ha sok a fals pozitív, sok munkaidőt fogunk elpocsékolni nem létező hibák levadászására. Ha viszont nem elég érzékeny, akkor adott esetben sok idő telhet el, amíg észrevesszük, hogy baj van.

## Csoportosítás

Térjünk vissza egy kicsit az eredeti felvetésre. A monitorozás különböző embereknek különböző dolgokat jelent. Egy üzletvezető teljesen másra kíváncsi, mint egy rendszergazda. Egy üzletvezetőnek például semmit nem fog mondani, hogy ha 86 szolgáltatás piros, ha ettől még a termék üzemel.

Éppen ezért érdemes a teszteket *csoportosítani*. A legalapvetőbb, hogy a full-stack teszteket, amik több szolgáltatást tesztelnek együtt, leválasztjuk az egy szolgáltatást önállóan figyelő tesztekről. Azok a tesztek, amik arra a kérdésre válaszolnak, hogy *megy-e a szolgáltatás*, kerüljenek önálló csoportba, amire egy üzletvezető ránézhet, feliratkozhat.

## A monitozorás mint hosszú távú eszköz

Eddig arról beszéltünk, hogy a monitorozás hogyan segíti a napi üzemeltetést és üzletmenetet, vagyis csúnya szóval élve a tűzoltást. A legtöbb ilyen szoftver azonban sokkal többre képes, hiszen adatokat gyűjt. Mi mikor állt le, vagy ha grafikonozunk is, mi mikor volt lassú, stb.

Ez azért hasznos, mert ha rászánjuk az időt és időnként kielemezzük ezeket az adatokat, rájöhetünk arra, hogy melyek az infrastruktúra olyan pontjai, amik jellemzően nem működnek olyan jól, mint kellene.

## Összegzés

Nem tudom eleget hangsúlyozni, hogy kiemelten fontos az, hogy ezekben ne legyen (túl sok) fals pozitív, de ne is legyen olyan leállás, amiről senki nem tud. Egy döntéshozó nem lát bele egy rendszergazda munkájába. Ha azt veszi észre, hogy leáll a rendszer anélkül, hogy bárki tudna róla, vagy ellenkezőleg, anélkül riaszt a monitorozó rendszer, hogy bármi lenne, az erősen rontja a szakértelmünkbe vetett bizalmat. Nincs annál kellemetlenebb, mint amikor egy üzletvezető nem bízik meg a saját alkalmazottai rátermettségében és ezért a rendszergazdáival való egyeztetés nélkül külső segítséget hív a szekrényben lapuló vélt vagy valós csontvázak eltakarítására.