---
id: 1074
title: 'Tiszta infrastruktúra, 1. rész — Ha fáj, csináld gyakrabban!'
date: '2016-06-27T07:35:08+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=1074'
permalink: /2016/06/27/tiszta-infrastruktura-1-resz-ha-faj-csinald-gyakrabban/
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
    - '4535'
avada_post_views_count:
    - '4535'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
image: 'assets/uploads/2016/11/09202321/Selection_051.png'
categories:
    - Üzemeltetés
---

Ha üzemeltetésről beszélünk, jellemzően van néhány olyan dolog, amitől a rendszer gazdái hihetetlenül félnek. Ez lehet akár az, hogy egy felszentelt gép leállása, vagy a biztonsági mentések visszaállítása.

[Martin Fowler fogalmazta meg](http://martinfowler.com/bliki/FrequencyReducesDifficulty.html) talán a legjobban: <q cite="http://martinfowler.com/bliki/FrequencyReducesDifficulty.html">Ha fáj, csináld gyakrabban!</q>

Az elmúlt évek során rengeteg olyan infrastruktúrával találkoztunk, ahol rengeteg dolog azért nem, vagy csak nagyon ritkán történt meg, mert hihetetlenül fájdalmas volt. Legyen szó élesítésről, gép újraindításról, vagy biztonsági tesztelésről.

Ezek többnyire olyan feladatok, amiket félre lehetne söpörni, hiszen nem okoz komoly fennakadást a nehézkes végrehajtás. A valóság azonban az, mint látni fogjuk a továbbiakban, hogy ezek többnyire architekturális gyengeségek és komoly kockázatokat hordoznak magukban. Mielőtt azonban rátérünk a példákra, nézzük meg, hogy miért is érdemes a fájó pontokat gyakrabb végrehajtással orvosolni:

1. A ritkán végrehajtott feladatok jellemzően azt jelentik, hogy hajlamosak vagyunk összegyűjteni a kapcsolódó feladatokat. Ezzel viszont a bonyolultság is nő, minél több mindent kell egyszerre megcsinálnunk, annál valószínűbb, hogy elrontunk valamit.
2. Minél gyakrabban hajtunk végre egy feladatot, annál több visszajelzés érkezik, annál több dologra jövünk rá. Az az annál könnyebb lesz orvosolni a fájó pontot. Ezt nevezhetjük *agile* módszertannak, vagy józan paraszti észnek is.
3. Az utolsó szempont a gyakorlás. Ha egy bonyolult folyamatot évente egyszer hajtjuk, nyilvánvalóan sokkal kevesebb gyakorlatunk lesz benne, mintha heti rendszerességgel hajtjuk végre. Nem véletlen például, hogy a kórházak a bonyolult műtéteket együtt, egy helyen hajtják végre, hogy az orvosok kellő gyakorlattal rendelkezzenek az adott műtét elvégzésében.

Ezt szem előtt tartva, nézzük, hogy milyen gyakori példák vannak ezekre a nem elég gyakran végrehajtott feladatokra.

## Élesítés (deployment)

Noha ebből élünk, még mindig rengeteg cég dolgozik úgy, hogy az élesítés gyakorlatilag manuális folyamat. Meglehetősen gyakran a fejlesztő összekészíti az élesítendő csomagot, majd azt a rendszergazda felszenteli és csak általa mehet ki az éles szerverre.

Talán mondanom sem kell, hogy ez a folyamat hihetetlenül lassú és sokszor csak egy-két ember tudja elvégezni az adott cégben. A szokásos *mi van, ha elüti a villamos* / *elmegy szabadságra* érvelésen kívül (ami úgysem hat meg senkit), ezzel van egy sokkal nagyobb gond.

**Ha ritkán deployolsz, sok változás megy ki egyszerre.**

Félreértés ne essék, hibák történnek, teljesen mindegy, hogy mennyire jól tesztelt a szoftver. Néha csak élesben derülnek ki dolgok, néha több jelentéktelen hiba összejátszása okoz komoly fennakadást. Azt remélhetőleg nem kell magyarázni, hogy ha sok változást élesítesz egyszerre, sokkal sokkal nehezebb lesz lekövetni, hogy mi okozta a hibát.

Ezen felül van azonban még egy gond azzal, ha ritka / nehézkes az élesítés. Ha ritkán végzünk élesítést, jó eséllyel sok a kézi munka a folyamatban, ez pedig azt jelenti, hogy sok a lehetőség a hibázásra az élesítés közben. Kimaradnak fájlok, [kimaradnak adatbázis változások](https://www.refaktor.hu/adatbazis-valtozasok-kezelese/), stb.

A háttérben nem csak műszaki okok húzódnak, ez részben cégkultúra kérdése is. Sok helyen tapasztalom azt, hogy az üzemeltetők bizalmatlanul állnak a fejlesztők munkájához, az éles szerverek közelébe sem engedik őket.

Miért történik ez így? Miért nem bízunk meg a (remélhetőleg szakképzett) kollégánkban?

Ez visszavezet a „klasszikus” fejlesztési módszerekhez: a fejlesztő fejleszt, és az éles szerverhez nincs hozzáférése. Az élesítést az üzemeltető végzi, és ha valami gond van a szoftverrel, az maximum hibajegyben jut vissza a fejlesztőhöz. Mondanom sem kell, hogy itt a hibafelderítés- és javítás átfutási ideje mai szemmel nézve hihetetlenül magas volt, adott esetben több hónapot is igénybe vett. Ha nem éppen egy hatalmas, több ezer főt foglalkoztató IT cégnek dolgozunk, ez a fajta munkaszervezés jó eséllyel sok elégedetlenségre ad okot.

Ha kisebb, „agilisabb”, csapatban dolgozunk, szerencsére kénytelenek vagyunk ezt a folyamatot felgyorsítani. És itt jön be a DevOps buzzword alatt emlegetett gondolkodásmód. Nem elég, ha a fejlesztő a saját kis buborékában fejleszt, kénytelen kiterjeszteni a tudását és a felelősségüket a tényleges futási környezetre is. Vagyis lesz olyan fejlesztő, akinek bejárása lesz az éles szerverekre a hibák felderítése érdekében, és automatizálnunk kell az élesítési folyamatot. Így a fejlesztők, akár a rendszergazdák közreműködése nélkül is, élesíthetik a kódjukat, de lehetőségük van a saját hibáik javítására is.

Talán mondanom sem kell, hogy szinte lehetetlen egy ilyen rendszert bevezetni néhány alapvető illemszabály nélkül. Ilyen lehet például az, hogy délután 4 után, illetve pénteken nem élesítünk (hacsak nem ég a ház), vagy az, hogy fejlesztő ne telepítsen szoftvert és ne módosítson konfigurációt az éles gépen előzetes egyeztetés nélkül.

Félreértés ne essék, ez a fajta módszer nem alkalmazható minden projektre! Olyan helyeken, ahol különleges biztonsági követelmények vannak, sajnos kénytelenek vagyunk ezekkel együtt élni. A legtöbb projekt azonban nem ilyen, például a tesztelés hiánya sem feltétlenül akadály. Noha hasznos, ha a tesztelés egy részét vagy egészét automatizáljuk, és automatizáltan futtatjuk, egy kézi tesztelésű rendszert is kitehetünk gombnyomásra egy teszt szerverre, illetve ha a tesztelési ciklus véget ért, az éles rendszerbe.

Az optimalizálás fellegvára természetesen az, ha úgynevezett *continuous integration / deployment* rendszerrel, közvetlenül a verziókezelőből kerül ki (automatizált teszt futtatás után) a kód az éles rendszerbe, emberi közbeavatkozás nélkül.

## Biztonsági mentések

Már hallom a „De nekem van biztonsági mentésem!” felkiáltásokat a tisztelt olvasóközönségtől. Lenne viszont egy kérdésem: mikor tesztelted utoljára? Mikor próbáltál meg visszaállítani belőle valamit? Honnan tudod, hogy a biztonsági mentéseid egyáltalán még működnek?

Ha most végig futott a hátadon a hideg, vagy legyintettél, hogy á, arra nincs idő, akkor sikerült rátapintanom egy problémás pontra az infrastruktúrádban. A mentés ugyanis az utolsó mentsvárad arra az esetre, hogy minden más felmondja a szolgáltatot, meghal mindkét disk a RAID alatt, esetleg meghülyül a RAID controller és elkezdi felülírni az értékes adataidat véletlenszerű hülyeséggel.

Itt nem csak az a fontos, hogy van-e mentésed, hanem az, hogy értelmes időn belül vissza tudod-e állítani? Ha egy személyes blogról van szó, egy heti kiesés nem nagy ügy, de ha például egy webshopot üzemeltetsz, akkor egy heti bevétel kiesés igen komoly károkat tud okozni. Néhány esetben ez a cég végét is jelentheti.

Éppen ezért fontos rendszeresen tesztelni azt, hogy mennyi a tényleges visszaállítási idő, és működik-e még megfelelően a mentés.

## Szerver újraindítás

Megint egy olyan jelenség, amivel sajnos gyakran találkozom: a szerver ujraindítástól sok rendszergazda retteg. Sokszor még kritikus biztonsági frissítések miatti ujraindítások is csak hónapokkal később történnek meg.

A félelemnek több oka is lehet. Az egyik, viszonylag könnyen orvosolható, hogy a gép indulás nem feltétlenül probléma mentes. Például nem indulnak el automatikusan a szükséges szolgáltatások, vagy extrém esetben nem is tudjuk, hogy elindul-e rendesen a gép.

Ami sokkal komolyabb, hogy a gépen futhatnak olyan szolgáltatások, amelyek kiesése káoszt okoz a rendszerben. Ha ez az eset áll fent, abból csak egy következtetést lehet levonni: a kérdéses gép egy Single Point of Failure (SPOF), vagyis a gép kiesése esetén leáll az egész rendszer.

Mindkét esetben jogos a félelem, de lássuk be: minden gép leáll egyszer. Sokkal jobb, ha a kritikus gépnél ez ellenőrzött körülmények között történik meg, mint ha valamikor éjjel áll le. Ráadásul az ellenőrzött újraindítások lehetőséget adnak arra, hogy a hibákat javítsuk.

Erre a technikára jó példa [a Netflix Chaos Monkey-ja](http://techblog.netflix.com/2012/07/chaos-monkey-released-into-wild.html), amely rendszeresen kapcsol le különböző gépeket az infrastruktúrájukban.

## Gép újratelepítés

Van olyan géped, ami évek óta fut, és félsz hozzányúlni, mert ki tudja, mi történik? Esetleg fut rajta egy olyan szoftver, amely konfigurációjáról semmit nem tudsz?

Ez a jelenség könnyen elkerülhető azzal, hogy ha a gépeinket rendszeresen újratelepítjük. Ez nem csak azt jelenti, hogy a gépeink (remélhetőleg) egységesek lesznek, és tudjuk, hogy mi miért történik, hanem azt is, hogy jó mérnökként ezt a folyamatot automatizáljuk.

Erre a feladatra valóak az úgynevezett konfiguráció menedzsment szoftverek, mint például a Puppet, a Chef, az Ansible vagy a SaltStack. Egy jól összeállított konfiguráció mellett egy szerver újratelepítése (nyilván az adatok nélkül) akár néhány perc alatt is végbe mehet.

Az így felépített rendszer egyik kellemes mellékhatása az, hogy ha szükségünk van egy új fejlesztői gépre vagy tesztkörnyezetre, azt egyszerűen felhúzhatjuk a már meglevő konfiguráció menedzsment rendszerrel.

## Összegzés

Természetesen ez csak néhány példa olyan folyamatokra, amiket ilyen vagy olyan okból kifolyólag nem hajtunk végre elég gyakran. Te milyen feladattól félsz? Újraindítás? Biztonsági frissítés? Esetleg a szerver leltár? Miket automatizáltál a rendszeredben? Írd le a kommentekben!

## Források

- [Martin Fowler — Frequency reduces difficulty](http://martinfowler.com/bliki/FrequencyReducesDifficulty.html)
- [Chaos Monkey Released Into The Wild](http://techblog.netflix.com/2012/07/chaos-monkey-released-into-wild.html)