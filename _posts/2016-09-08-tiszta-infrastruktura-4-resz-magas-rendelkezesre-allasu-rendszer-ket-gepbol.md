---
id: 1652
title: 'Tiszta infrastruktúra, 4. rész – Magas rendelkezésre állású rendszer két gépből?'
date: '2016-09-08T08:38:52+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=1652'
permalink: /2016/09/08/tiszta-infrastruktura-4-resz-magas-rendelkezesre-allasu-rendszer-ket-gepbol/
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
    - '5316'
avada_post_views_count:
    - '5316'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
image: 'assets/uploads/2018/06/09202508/bridge-pattern.png'
categories:
    - Hírek
---

A <acronym title="Hungarian Unix Portal">HUP-on</acronym> immáron sokadjára [felmerült a kérdés, hogy hogyan lehetne két gépből magas rendelkezésre állású rendszert építeni?](http://hup.hu/node/149317) Ugorjunk fejest az ilyen rendszerek világába, nézzük meg, lehetséges-e?  
  
A helyzet általában így néz ki: a dolgozó főnöke beállít, és közli, hogy vett két gépet és berakta két különböző „szerverközpontba”. (Ha az adott helyet meglátogatjuk, kiderül, hogy igazából egy bérház átalakított pincehelyisége, fém polcokkal és egy ipari felhasználásra nem alkalmas légkondival.) Na a feladat az, hogy ebből kellene olyan rendszert építeni, ami *„soha nem áll le”*. (Igen, volt olyan ügyfelem, aki az asztalt verte, hogy neki 110% uptime kell.)

Mivel ilyen rendszert még nem építettünk, jó szakemberhez méltóan neki esünk a Google-nek és két óra vad konfiguráció kopipésztelés után elégedetten konstatáljuk, hogy a rendszerünk parancsra átáll egyik gépről a másikra és onnan folytatja a kiszolgálást. Na, ezzel le is tudtuk a főnök új heppjét és mehetünk vissza azt csinálni, amiért egyébként a pénzt kapjuk.

Eltelik fél év, az egyik nevezett sufnihosting légkondija leáll, az egyik gép túlmelegszik, és... az automatikus átállás elmarad. A szolgáltatás pedig leáll.

## Mi is az a nagy rendelkezésre állás?

Sokszor dobálózunk azzal a kifejezéssel, hogy nagy rendelkezésre állású rendszer, HA, stb. de sokszor emögött csak egy ködös elképzelés lapul, miszerint azt szeretnénk, ha a rendszerünk mindig elérhető lenne. Jó lenne, ha tervezett karbantartás, váratlan meghibásodás, de akár emberi hiba esetén is működőképes maradna a rendszer.

Miért szeretnénk? Nagyon egyszerű. Ha egy üzleti alapokon nyugvó rendszerről beszélünk, akkor ez **csak akkor termel pénzt, ha fut**. Ha nem fut, nem termel pénzt. Emellé persze társul az a hihetetlen mennyiségű marketing hype, ami az elmúlt években a „felhő” nevű fogalom köré épült. Ezzel együtt az üzleti vezetők egy jelentős részében kialakult egy olyan kép, hogy létezik olyan megfizethető árú és egyszerűen telepíthető technológia, amivel a rendszerünk soha nem áll le.

Egy bökkenő van: ez sajnos nem igaz. Még az olyan nagy szolgáltatók, mint az Amazon vagy a Facebook, is időnként elszenvednek egy-egy kiesést. Ha nem is az egész rendszerüket érinti, de több-kevesebb rendszerességgel előfordul, hogy bizonyos régiókban ezek a szolgáltatások pár óráig nem elérhetőek.

Az internetet ugyan úgy alkották meg, hogy kibírjon egy atomtámadást is, de arról nem volt szó egy pillanatig sem, hogy egyes részei is mindig elérhetőek lesznek. Ha jön a sárga kábelkeresőgép (köznyelven: markoló), vagy beüt egy szoftverhiba, akkor előfordulhat az, hogy egy-egy ország ideig-óráig leszakad az internetről.

Ennek fényében ha magas rendelkezésre állásról beszélünk, az első amit tisztázni kell, az az, hogy mennyire magas? Mi az elvárt reakcióidő egy meghibásodás esetén? Ha egy adott régió leszakad az internet többi részéről, szeretnénk-e, hogy az adott régió látogatói továbbra is használhassák lokálisan a szolgáltatást? Ezek mind-mind nagyon fontos szempontok, ha azt kell eldönteni, hogy milyen megoldást válasszunk az épülő rendszerünk mögé.

## Adatkonzisztencia

Ha több gépes rendszert építünk, el kell felejtenünk néhány dolgot, amit egy egy gépes rendszer fejlesztése esetén szem előtt tartunk. Az adataink nem egy szoftver kezelése alatt állnak, és a hálózatunkban fellépő késések és hibák közre játszanak abban, hogy milyen állapotban lesznek egy-egy rendszerösszeomlás után.

Az elosztott rendszerek egyik elméleti alapja az úgynevezett [CAP tétel](https://hu.wikipedia.org/wiki/CAP_t%C3%A9tel). Ez a tétel az alábbi három tulajdonságot írja le számítógépes rendszerek viselkedéséről:

<dl><dt>Konzisztencia (Consistency)</dt><dd>Ha adatot olvasunk, az mindig az aktuális állapotot adja vissza. Nem fordulhat elő, hogy régi adatokat kapunk. Ha adatot írunk, az írás mindig teljes egészében végbe megy, vagy hibával leáll, nem fordulhat elő, hogy az adat félig kerül tárolásra.</dd><dt>Rendelkezésre állás (Availability)</dt><dd>Egy nem meghibásodott gépre küldött kérésre válasz fog érkezni egy elvárható időn belül.</dd><dt>Partició-tűrés (Partition tolerance)</dt><dd>A rendszer tovább működik akkor is, ha hálózatilag két részre szakad. (Azt nem garantálja, hogy az adat mindkét részben elérhető lesz, csak azt, hogy az adatok nem sérülnek.)</dd></dl>A tétel azt is kimondja, hogy a három közül maximum kettő biztosítható egyszerre egy rendszerben. Mindhárom egyszerre nem valósulhat meg. Nézzük tehát a párokat:

<dl><dt>Konzisztencia és elérhetőség (CA)</dt><dd>Ebben a felállásban az adatok olvasása mindig az aktuális állapotot adja vissza, és emellett mindig el is érhető. Ez a fajta felállás gyakorlatilag azt jelenti, hogy soha nem történhet hálózati hiba, hiszen a rendszerünk nem tűri a partíciókat. **Ez gyakorlatilag nem opció egy több gépes rendszernél.**</dd><dt>Konzisztencia és partició-tűrés (CP)</dt><dd>Ez a felállás azt jelenti, hogy ha tudunk adatot olvasni vagy írni, az mindig konzisztens lesz. Ha egy olvasási vagy írási műveletet nem lehet konzisztens módon végrehajtani, az mindenképpen hibát fog eredményezni.</dd><dt>Elérhetőség és partíció-tűrés (AP)</dt><dd>Ez esetben egy olvasási kérésre mindig kapunk választ, bármikor írhatunk a rendszerbe, attól függetlenül, hogy szétszakadt-e a hálózatunk. Az azonban nem garantált, hogy az adat aktuális lesz-e, vagy hogy az írt adat nem vész-e el.</dd></dl>> A partíció-tolerancia kötelező eleme az elosztott rendszereknek! Bármilyen, egynél több gépen futó rendszernek partíció-toleránsnak kell lennie! Éppen ezért a CA páros nem használható HA rendszer építésére.

Nézzünk egy pár példát:

<dl><dt>MySQL egy gépen</dt><dd>Definíció szerint csak egy gépen futhat, ezért elosztott rendszerek építésében egyéb segédmegoldások nélkül nem használható.</dd><dt>MySQL master-slave replikációval</dt><dd>*AP olvasásra, P írásra*. A MySQL master-slave replikációja úgy működik, hogy mindig egy master adatbázis-szerverre írunk, olvasni viszont egy vagy több slave gépről is tudunk. A slave gépek viszont aszinkron módon replikálnak, ezért könnyen lehet, hogy nem aktuális adatot kapnak. Cserébe viszont mindig elérhetőek lesznek olvasásra. Mivel az írás csak a masterre mehet, előfordulhat, hogy nem tudunk írni, vagy hogy az írt adatok elvesznek egy meghibásodás esetén.</dd><dt>MySQL master-master replikációval</dt><dd>*AP*. A master-slave replikáció tovább fejlesztett változata, ahol két vagy több gép kölcsönösen slave-ként működik a másik gép szempontjából. Ez speciálisan megírt szoftvert igényel, ezért a gyakorlatban nem nagyon használatos.</dd><dt>MySQL Galera clusterrel</dt><dd>*CP*. A [Galera cluster](http://galeracluster.com/) szinkron replikációt valósít meg és csak akkor hajlandó adatot visszaadni, ha a clusterben részt vevő gépek többsége egységes hálózatot képez (Quorum, lásd lentebb). A hálózat nagyobb részéről leszakadt gépek viszont nem fognak válaszolni kérésekre.</dd><dt>ElasticSearch</dt><dd>*AP* A cluster szétszakadhat és bármely része elérhető lesz, de egyáltalán nem garantált az, hogy az adataink konzisztensek lesznek, vagy hogy a beleírt adatok megmaradnak.</dd></dl>Azt hiszem, ennyi elég is, a lényeget jól illusztrálja: döntenünk kell, hogy mi a fontos.

## Klasszikus szoftverek HA-ja

Ha olyan szoftvert vagyunk kénytelenek üzemeltetni, amely fejlesztője nem gondolt a magas rendelkezésre állásra (és ezzel együtt az elosztott üzemeltetésre), nehéz helyzetben vagyunk. Ez esetben a szoftver fejlesztője abból indult ki, hogy egy gépen fut, és ezzel a fenti CAP háromszögből a CA vonalon mozog, ami nehézzé teszi az elosztott üzemeltetést. A konzisztencia vélhetőleg nem áldozható fel, az adatok szentek, így az egyetlen opció az, hogy a CP vonalra térjünk át.

Erre több technológia is létezik. Az egyik ilyen példa az, hogy az egész alkalmazást egy virtuális gépen futtatjuk. A virtuális gép alatt futó fizikai gépeken pedig megoldjuk azt, hogy a merevlemez tükrözve működjön. (Erre a célra vehetünk közös fizikai adattárolót, storage-ot, vagy szoftveresen is megoldhatjuk a kérdést pl. DRBD-vel.)

Naivan azt gondolnánk, hogy erre két gép elegendő lesz, ám csalódnunk kell. Ha konzisztenciát szeretnénk, komoly megkötésekkel kell számolnunk.

### Split brain

Első problémának nézzük meg, hogy honnan tudja az egyik gép, hogy leállt a másik? Naivan azt gondolhatnánk, hogy ping paranccsal megnézzük, hogy fut-e még, de ez nem nyilatkozik arról, hogy tényleg leállt-e a gép.

Előfordulhat ugyanis az a helyzet, hogy csak a két gép közötti kommunikáció szakad meg, de a hálózat többi része ettől függetlenül működik. Ennek sokféle oka lehet, és jellemzően akkor lép fel, amikor legkevésbé szeretnénk. Például amikor túlmelegszik a gép, és az olcsó alkatrészek miatt nem áll le, hanem elkezd hülyeséget csinálni.

Ezt a helyzetet, amikor a rendszer mindkét fele azt gondolja, hogy ő az aktív, *split brainnek* hívjuk, és változatos, borzalmasnál borzalmasabb következménye lehet. Képzeljük csak el, mindkét gép azt gondolja, hogy most neki át kell vennie a szolgáltatást. És mivel mindketten megpróbálják erőltetni a saját igazukat, tikitakizni fog a rendszer.

Egy egy gépes rendszernél ilyen esetben nem lenne semmi probléma, hiszen a szolgáltatás vagy megy, vagy nem megy. De az említett HA-s felállásnál a tikitakizásnak az a következménye, hogy a rendszer hol megy, hol nem megy. Ha van monitorozó rendszerünk, hol azt jelzi, hogy megy a rendszer, hol azt, hogy nem.

Egy másik eklatáns pont ebben az esetben az adatbázis. (Márpedig melyik pénzt termelő rendszer mögött nincs?) Ha a rendszer mindkét fele azt hiszi, hogy ő az aktív, akkor engedni fogja az adatbázisba írást. Az az ha például webshopról beszélünk, az új megrendelések fele az egyik gépre, a másik fele a másik gépre megy. Egy HA-ra felkészített szoftver alatti adatbázis képes túlélni egy ilyen helyzetet, de az open source és vásárolható CMS-ekre, webshopokra ez nem jellemző. Az ilyen szoftverek fejlesztése egy külön tudomány, és szinte az esetek 100%-ában egy ilyen split brain után **nincs más hátra, mint kézzel összefésülni az adatokat**. Amíg az összefésülést végzed, természetesen nem futhat a rendszer, vagyis ami a HA rendszer nélkül egy fél órás hálózati kiesés lett volna, így könnyen egy napos vérverejtékes adatbázis kotorászássá fajul.

### Quorum

A fenti agyhasadásos epizód után remélhetőleg a főnökünk is meggyőzhető arról, hogy két gépből (nagyon ritka és speciális helyzetektől eltekintve) nem lehet HA-t építeni, úgyhogy vesz még egy gépet és betolja egy harmadik sufnihostingba.

Ezzel lehetőségünk nyílik egy olyan megoldásra, hogy a gépek többségi szavazással döntsenek arról, hogy ki van bent a clusterben és ki nincs. Ha két gép látja egymást, ők dönthetnek arról, hogy a harmadik gépet kirúgják, mert nem elérhető.

> **Óvatosan!**  
> Óva intenélek attól, hogy a szolgáltató routerét pingesd harmadik fél gyanánt! A routerek terhelés alatt nem mindig válaszolnak a pingre, mivel nem az az elsődleges feladatuk!

> **Óvatosan!**  
> Ez a rész az elosztott rendszerben résztvevő node-ok tagságáról szól! Vannak olyan adatbázis rendszerek (pl. Cassandra), amik adott esetben nem várják meg azt, hogy egy írás az összes node-on végbe menjen. Ez esetben a quorum fogalma a node-ok többségére történő írást jelenti. Ha ilyen adatbázis-kezelő rendszert használsz, három node nem elegendő egy jól működő clusterhez.

### Fencing (STONITH, SCSI-3 PR, stb)

Minden szoftverben van legalább egy bug, és a hardver is meghibásodhat, így még mindig van bőven lehetőség a szívásra. Előfordulhat például olyan helyzet, hogy quorumban egyedül maradt node továbbra is úgy gondolja, hogy neki kell a szolgáltatást biztosítani. Ha például a clusterező szoftver egy külső programot indít a szolgáltatás „megszerzésére”, terhelés alatt előfordulhat, hogy egyszerűen *még* nem állította le ezt a programot, és ezért az egyedül maradt gép továbbra is ragaszkodik a kiszolgáláshoz, így létre hozva a split brain állapotot.

Éppen ezért az olyan erőforrásokra, amik kizárólagosságot igényelnek, biztosítani kell, hogy csak a ténylegesen aktív gép férhessen hozzá. Ezt a folyamatot hívják *fencing*-nek, vagyis kerítést húzunk az erőforrás köré.

Az egyik megoldás a kerítés húzására egy kicsit brutálisnak tűnik: *megszüntetjük a clusterből kiesett gép tápellátását* (STONITH, Shoot The Other Node In The Head). Erre használhatunk céleszközt, vagy ha távmenedzsmenttel (RMM, iLO, DRAC) rendelkező gépünk van, akkor a távmenedzsment API-ját. A tápellátás megszüntetésével 100%-os garanciánk van arra, hogy a meghibásodott node nem fog előre nem látható módon viselkedni. Természetesen STONITH-t csak és kizárólag quorummal együtt használhatunk, különben szerencsétlen esetben megtörténhet, hogy a két gép egyszerre lövi ki egymást és mindkét gép leáll. (A STONITH működése rosszabb esetben pár másodpercnyi időt vesz igénybe, illetve nem mentes az egyéb buktatóktól sem, így ez nem javasolható.)

> Az SSH nem megfelelő STONITH eszköz! Ha egy node kiesett a clusterből, nem bízhatunk abban, hogy sikerül SSH-n belépni és leállítani az adott gépet!

Ha több gépre kötött közös adattároló eszközt (storage-ot) használunk, van egy másik lehetőségünk is. Ha például virtuális gépek alá szeretnénk HA rendszert építeni, a gép csak akkor fog elindulni, ha rendelkezésre áll a hozzá tartozó (virtuális) merevlemez. A legtöbb storage biztosít lehetőséget arra, hogy egy adott disk területet csak és kizárólag egy gép használhasson egy időben. (SCSI-3 PR) Ezzel biztosítható, hogy a virtuális gép csak és kizárólag egy gazdagépen fog futni, semmiképpen nem áll elő az a helyzet, hogy két gazdagép próbál egyszerre ugyanarra a disk területre írni. A node kilövésére a SCSI-3 PR rendelkezik egy `eject` paranccsal, amivel a meghibásodott node-ot kirúghatjuk a clusterből. A részletekért érdemes elolvasni a [NetApp Knowledge Base vonatkozó bejegyzését](https://kb.netapp.com/support/index?page=content&id=3012956).

## Lazítsunk a követelményeken!

A fenti rendszer akkor lényeges, ha tényleg szükségünk van konzisztenciára. A gyakorlat azonban azt mutatja, hogy sokszor erre nincs akkora szükség. Ha például a céges weboldalunk alá szeretnénk HA-t építeni, lazíthatunk a követelményeken, hiszen ha a legújabb hír a cégről elvész, vagy öt perccel később kerül ki a nyitólapra, az nem akkora kár, mint amekkora presztízs veszteséget az oldal elérhetetlensége jelentene.

Vagyis áttérhetünk az AP vonalra, eldobva a konzisztencia követelményét. Ezt a fajta megoldást szokás *eventual consistency* néven is emlegetni, vagyis ha nem piszkáljuk a rendszert, előbb-utóbb mindenhol konzisztens lesz az adat. Ez egy céges blogra tökéletesen megfelel.

Természetesen ehhez szoftver oldali támogatás is kell, hiszen például a feltöltött képeknek valahogy át kell jutniuk a másik gépre és a közös storage itt nem lesz segítségünkre.

Vagyis ha találunk olyan szoftvert, ami az AP vonalra fejlesztett adatbázis-motorral együtt tud működni, megszabadulhatunk az egész fenti konzisztencia-védelmi aparáttól.

## Jó tanácsok HA rendszerek építéséhez

### Ha nem muszáj, ne csináld

Az elosztott / HA rendszer nem helyettesíti a tesztelt, monitorozott biztonsági mentést és vészhelyzeti forgatókönyvet. [Előbb azt oldd meg](/tiszta-infrastruktura-1-resz-ha-faj-csinald-gyakrabban/), mielőtt nekiállsz HA rendszert építeni! Ha fel tudsz építeni egy olyan vészhelyzeti forgatókönyvet, ami kritikus rendszerhiba esetén, elvárható időn belül újra életre kelti a szolgáltatást egy második gép segítségével, az sokszor stabilabb működést eredményez, mint egy netről copypastelt konfigfájlokkal összerakott HA setup.

Ha például egy fél órás reakcióidő elfogadhatónak számít, akkor egy hot spare gép, amire kézzel át tudsz állni és amin megvannak az adatok, elegendőnek bizonyulhat. Az átállást természetesen gyakorolni, és a mentést elkészítő megoldást pedig tesztelni illik.

Mérd fel, hogy ténylegesen mire van igény, és arra keress megoldás.

### A főnököd számokból ért

Nem minden főnök fogja azt megérteni, amit itt leírtunk. Ha azzal jön reggel, hogy vásárolt egy új technológiát és ez megoldja az összes clusterezési gondotokat, nem szívesen fogja belátni, hogy megvezették.

Objektíven vizsgáld meg a rendelkezésre álló megoldásokat, és számold ki, hogy melyik üzemeltetése mennyibe fog kerülni emberi munkaidőben, hardverben és szolgáltatásokban. Ezt vesd össze azzal, hogy a rendelkezésre állás javulása előre láthatólag mennyivel fogja emelni a bevételeket.

### Monitorozni, monitorozni, monitorozni

Nincs annál vérfagyasztóbb pillanat, mint amikor rájössz, hogy fél éve nem megy az adatreplikációd vagy a biztonsági mentésed! Ráadásul ha a HA rendszer egy fél évvel ezelőtti változattal rendelkező másolatra áll át, gyakorlatilag létrehoztál egy split braint. Éppen ezért: monitorozni, monitorozni monitorozni.

### Tesztelni, tesztelni, tesztelni

Ha a rendszeredet szépen megkéred, hogy álljon át egyik gépről a másikra, az nem nevezhető éles tesztnek. Egy HA rendszerben rengeteg mozgóalkatrész van, éppen ezért rengeteg minden tönkremehet. Mielőtt rábízod az adataidat, érdemes mindenféle terhelést okozó eszközzel streszteszelni, illetve szimulálni a hálózati és emberi hibákat is (tűzfalazd ki a HA daemont, okozz szándékos packetloss-t, lődd le valamelyik szoftvert kézzel). Azt is érdemes kipróbálni, hogy katasztrofális leállás esetén, amikor a teljes HA rendszer bemondja az unalmast, vissza tudod-e hozni a halott rendszert.

Ha már fentebb a biztonsági mentésekről volt szó: nem csak az éles rendszert kell tesztelni, hanem a vészforgatókönyvet is. Így például érdemes rendszeresen letesztelni, hogy a mentés visszaállítható-e, és a benne levő adatok konzisztensek-e.

### Automatizálj!

Mint említettem, egy elosztott rendszer sok mozgó alkatrész összehangolt működésének köszönhetően végzi a dolgát. Nem elég egyszerűen feltenni egy Apache-ot, PHP-t, MySQL-t, ennél sokkal több szoftver fog futni, és ezek konfigurációját, szoftverfrissítéseit kezelni kell. [Korábban már beszéltünk róla](/tiszta-infrastruktura-2-resz-bevezetes-a-rendszerautomatizalasba/), de nem lehet eleget hangsúlyozni, hogy ahogy a rendszereink egyre bonyolultabbak lesznek, teljesen lehetetlen ezeket nagyfokú automatizálás nélkül biztonságosan üzemeltetni.

### Fejlesztővel mindig könnyebb

Mérhetetlenül könnyebb lesz a dolgod, ha elviszed a fejlesztőidet sörözni és hajlandóak meghallgatni a bánataidat. A fejlesztő kezében van a program módosításának a lehetősége, amivel kompatibilissá teheti egy számodra sokkal barátságosabb rendszerrel az üzemeltetendő programot.

## Utolsó kérdés: lehet két géppel HA rendszert építeni?

Lehet. Csak nem bármilyet. Ha például az eventual consistency elegendő, akkor az két géppel is tud működni.