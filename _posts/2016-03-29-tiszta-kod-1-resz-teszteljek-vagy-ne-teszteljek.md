---
id: 628
title: 'Tiszta kód, 1. rész: teszteljek vagy ne teszteljek?'
date: '2016-03-29T19:17:46+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=628'
permalink: /2016/03/29/tiszta-kod-1-resz-teszteljek-vagy-ne-teszteljek/
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
    - '13689'
avada_post_views_count:
    - '13688'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
image: 'assets/uploads/2016/03/29122743/23345780_m.jpg'
categories:
    - Fejlesztés
tags:
    - 'clean code'
    - tdd
    - tesztelés
---

Minden program köztudottan tartalmaz legalább egy hibát. Néha kezeljük, néha a szőnyeg alá söpörjük. Hogyan lehet automatizálni a tesztelést? Érdemes egyáltalán vele vesződni?

> Ez a cikk jelentős részben [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_Cecil_Martin) munkásságára épül. A könyvei és előadásai világszerte sikert arattak, és részben magyar nyelven is elérhetőek a [Kiskapu Kiadó](http://www.kiskapu.hu/) gondozásában.

Először is tisztázzuk: olyan, hogy tökéletes kód, nem létezik. Bármelyik programozó, ha néhány hónap múlva ránéz a saját kódjára, többé-kevésbé elégedetlen lesz vele. Ez természetes, a tanulási folyamat része. Projektvezetőként és fejlesztőként viszont egyaránt sokat tehetünk azért, hogy a kódbázis ne váljon kezelhetetlenné.

> **Figyelem!**  
> A cikk az érthetőség jegyében helyenként egyszerűsítéseket vagy pontatlanságokat tartalmaz. A sorozat következő részeiben ezeket természetesen tisztázzuk.

## Hogyan tesztelünk?

Ha tesztelésről beszélünk, a legtöbb ember arra gondol, hogy valaki ül egy számítógép előtt és nyomkodja a terméket. Ebből készül egy hibanapló, amit végül a fejlesztők megkapnak, majd ez alapján javítják a hibákat. Az ilyen jellegű tesztelés természetesen létezik, sőt néha akár pár száz oldalas tesztelési ellenőrzőlisták is születnek, amelyek hatalmas adminisztratív és anyagi teherrel járnak. Mindazonáltal néha elkerülhetetlenek.

Az ilyenkor szokásos autós példával élve, felteszem a kérdést: Hogyan tesztelnénk egy autót? Építhetünk például egy robotot, ami minden vezérlőszervet végigpróbál? A probléma, hogy az a robot csak azt az egy típust tesztelheti, vagyis minden egyes szériához új robotot kell terveznünk. Esetleg megfizethetnénk egy hadseregnyi embert, hogy teszteljék a járművek minden egyes funkcióját, azonban ez sem lesz olcsóbb. Ha tényleg minden funkciót, minden egyes részében le szeretnénk tesztelni, ez a megoldás nagyon gyorsan kezelhetetlenné válik.

Ha durva egyszerűsítéssel megnézzük, a gyártási folyamatoknál sokkal racionálisabb módját választják az egyes alkatrészek tesztelésének: kiépítik, és különállóan vizsgálják őket. Amikor a végén összerakják az eszközt, természetesen letesztelik egészében, de koránt sem teljes részletességében.

Informatikára lefordítva – felületesen szólva – a tesztelés két formáját különböztetjük meg: az *egységtesztelést* és a *funkcionális* tesztelést. Jellemzően mindkettőt automatizáltan futtatjuk, de van egy lényeges különbség a kettő között.

### Az egységtesztelés

Az egységtesztelés (*unit testing*) - mint ahogy a neve is mutatja - az egységet teszteli. Ahogy az autórádió vizsgálata során nem érdekes, hogy a generátor jól működik-e, úgy egy modul tesztelése során is mellékes, hogy az adatbázis szerver helyesen működik-e. Az ilyen tesztekkel általában a kód egy kicsi részét teszteljük, sokszor csak néhány tucat sor kódot egyszerre, mindenféle külső összeköttetés nélkül. Magyarán sem az adatbázisra, sem egy webszerverre, de még grafikus környezetre sincs szükségünk. Ideális esetben az ilyen jellegű tesztjeink néhány másodperc alatt lefuttathatóak, mindenféle előzetes beállítás nélkül.

### A funkcionális tesztelés

A funkcionális tesztelés az előzőekkel ellentétben azt teszteli, hogy a korábban letesztelt alkatrészek összeköttetése, összeépítése megfelelő-e. Ezek a fajta tesztek messze nem olyan részletesek, mint az egység tesztek. Azonban felfedik az egységek közötti kommunikációban rejlő hibákat.

A legegyszerűbben úgy képzelhetjük el ezeket, mint egy automatát, ami például egy böngészőben, vagy egy grafikus felületen kattingat. Esetleg HTTP lekérdezéseket indít egy webszerverhez, és ellenőrzi, hogy a megjelenő információk helyesek-e.

A funkcionális tesztek különböző szintjei vannak, tesztelhetünk akár csak néhány modult, vagy az egész alkalmazást is, igénytől függően.

## Miért tesztelünk?

Ez az egész rengeteg munkának hangzik. Miért tennénk meg mindezt?

Az említett autógyártáson kívül más szakma is van, ami megköveteli a kiemelt figyelmet (az informatikához hasonlóan): a könyvelés. Egyéni vállalkozók kivételével egy könyvelő úgynevezett *kettős könyvelést* végez. Ez azt jelenti, hogy minden tételt egyszer a bevétel, egyszer pedig a kiadás oldalra kell bekönyvelni. Az ellenőrzés abból áll, hogy a két oldal végösszegének egyeznie kell.

Hasonlóképpen vagyunk a teszteléssel is: a kód és a teszt kiegészítik egymást. Ha a kód hibás, remélhetőleg a teszt megfogja. Ha a teszt hibás, a kód ellenőrzi. Ha mindent jól csinálunk, ott a védőháló. Ha egy jövőbeni sürgős feature request kapcsán módosítanunk kell a kódon, és hibát követünk el, azonnal jelzést kapunk erről.

Egy bökkenő viszont van: ez csak akkor működik, ha a tesztjeink a funkcionalitás egészét, vagy legalábbis nagy részét lefedik. Ha a projekt elején elhanyagoljuk a tesztek írását, később nagyon nehéz behozni ezt a hátrányt, és a tesztek pont a lényegüket vesztik el: a védőháló jellegüket.

## Minden projektnek szüksége van erre?

Ennél a kérdésnél lesz kicsit szubjektív a vita. Sok projekt tulajdonos a projekt elején azt gondolja, hogy a tesztelés kevésbé fontos, a lényeg az, hogy az első termék (MVP; Minimum Viable Product) hamar készen legyen. Természetesen egy rövid távú üzleti célnak ez megfelelő lehet. Azonban ha később soha nem pótoljuk a hiányosságokat (ami halmozottan nehéz), soha nem számíthatunk a tesztek védelmére.

Az ilyen jellegű problémákat fokozza, ha később csapatban dolgozunk. A sikeres termékek csapata idővel bővül, és a rendszerbe éppen beletanuló kollégák olyan hibákat véthetnek, amiket még évekkel később sem feltétlenül sikerül kitakarítani a kódból. Hosszabb életű projekteknél ezek a hibák, következetlenségek egymásra rakódnak. Ezzel nem csak a jelenlegi hibalehetőségek többszöröződnek, hanem a módosítások implementálása is egyre hosszasabb lesz.

> **Tudtad?**  
> A projekt elején elkövetett kisebb-nagyobb „bűnöket” (rövidítések, gányolás, stb) *technical debtnek*, azaz műszaki adósságnak nevezzük. Mint a pénzügyi adósságot, előbb-utóbb ezt is vissza kell fizetni, különben összecsapnak a fejünk fölött a hullámok.

Ráadásul, ha csak a személyes tapasztalatokat vesszük alapul, több olyan példát is láttam, ahol a tesztvezérelt fejlesztés ([TDD](https://en.wikipedia.org/wiki/Test-driven_development)) gyakorlott fejlesztőkkel nem hogy lassította volna, hanem gyorsította a projektet. Magyarán a tesztek írása egyszerűsítette a projektet, mivel nem kellett triviális hibák javításával vesződni.

Röviden összefoglalva: minden olyan projektnek szüksége van a tesztekre, amelyen előre láthatólag több ember fog dolgozni, és ahol nincs költségvetés később kidobni és újraírni a projektet.

## Milyen teszteket írjunk?

Itt jön a kérdés: milyen teszteket írjunk? Egységteszteket vagy funkcionális teszteket? A funkcionális teszteken belül különböző szintek és feladatok vannak, de közös bennük, hogy nagyobb egységeket tesztelnek.

Ha maradunk az autós analógiánál: Ha a slusszkulcsot elforgatva nem kapcsol be a rádió, akkor az vagy rossz, vagy ki van kapcsolva. Ha a tesztünk feltételezi, hogy bekapcsol, akkor hibát jelez mindkét esetre, ha azt, hogy ki van kapcsolva, akkor nem veszi észre a hibát.

Minél nagyobb darabokat tesztelünk egyben, annál nagyobb az esélye annak, hogy fals riasztásokat kapunk, vagy nem veszünk észre egy hibát, amit egy apró, nem dokumentált változtatás okozott. Ilyen lehet például egy gomb helyének megváltoztatása a felületen, egy átmeneti hiba az adatbázis kapcsolatban, és még megannyi más. Minél nagyobb részt tesztelünk egyben, azok annál kevésbé tudnak rámutatni a konkrét hiba okára. Adott esetben hosszas manuális keresgélésbe fullad a teszt futtatása.

Ez nem azt jelenti, hogy a funkcionális tesztek haszontalanok, éppen ellenkezőleg: ezek szavatolják, hogy a letesztelt darabokat helyesen raktuk össze. Egységtesztek nélkül ezek a tesztek viszont csak nehezen tarthatóak karban, és kevés előnyt jelentenek. Ha választanunk kell a két fajta teszt közül, az egységtesztek sokkal több haszonnal járnak.

### Mi a helyzet a kézi teszteléssel?

Felmerül a teljesen jogos kérdés, hogy mi a helyzet a kézi teszteléssel? Teljesen szükségtelen? Vagy van létjogosultsága?

Ha megnézzük a kézi tesztelést, az ilyen tesztek végrehajtása – az automatizált tesztekkel ellentétben – folyamatosan pénzbe kerül. Ez nem csak azt jelenti, hogy hosszú távon jelentősen magasabb anyagi terhet jelent, hanem azt is, hogy egy esetleges költségcsökkentés áldozata lesz. Ez pedig a teszt lefedettséget csökkenti.

Természetesen mindig lesz olyan, amit nem lehet automatizálni. Egy hitelkártyás fizetést, egy tényleges vásárlási folyamatot nem feltétlenül lehet, vagy érdemes automatizálni. Így gyakorlatilag kiegészítjük a funkcionális teszteket. A projekt elején teljesen járható út a funkcionális tesztelés kézi kivitelezése, de hosszabb távon mindenképpen érdemes ezt is automatizálni, különben el fog maradni.

## Az egységtesztelés kellemes mellékhatásai

Ahhoz, hogy valamit egységben tudjunk tesztelni, el kell választanunk minden függőségétől: a felhasználói felülettől, az adatbázistól, cache-ektől, és minden mástól. Pontosan mint az autórádió, amit kiszerelünk tesztelni. Amellett, hogy a kódunk jól tesztelhető, ez egy kellemes mellékhatással jár: a kódunkban a modulok között laza kapcsolatot teremtünk.

Laza kapcsolat alatt azt értjük, hogy a moduljaink nem közvetlenül hívják egymást, hanem egy elfedő vagy kapcsoló rétegen keresztül, ami (helyes megvalósításnál) lehetővé teszi azt, hogy a modulokat kicseréljük anélkül, hogy a rendszer többi részén módosítani kellene. Szoros kapcsolat ezzel szemben az, amikor a modulok közvetlenül hívják egymást, konkrétan nevén nevezve a másik modult. Például:

```
class MyBusinessLogic {
    public void doCalculateSomething() {
        MySQLConnector db = new MySQLConnector();
        // ...
    }
}
```

Mint ezen a pszeudokódon is látszik, az üzleti logika közvetlenül hívja az adatbázist. Ez nem csak lehetetlenné teszi a unit tesztek írását, hanem meggátolja az adatbázis kapcsoló modul kicserélését a forráskód módosítása nélkül.

A szoros kapcsolásra elég jó példa az, ami néhány napja a JavaScript világban történt. Egy látszólag jelentéktelen modult [eltávolítottak az NPM csomagkezelőből](http://itcafe.hu/hir/javascript_modul_osszeomlas.html), ami hatására rengeteg más JavaScript projekt eltört. A szépséghiba az, hogy ezen projektek fejlesztői javarészt nem is tudtak arról, hogy a szóban forgó modult használták, mert a függőségi fában 6-7 réteg mélységben volt elásva (azaz a projekt függőségének a függőségének a függőségének... a függőségét távolították el). Laza kapcsolásnál ez egyáltalán nem lett volna probléma, hiszen a modult könnyedén ki lehetett volna cserélni egy másik, azonos funkcionalitásúra. De ez már a sorozat következő részeibe tartozik.

## A következő részben

A sorozat következő részeiben a clean code elv többi alkotóelemeiről fogunk beszélni: a S.O.L.I.D. elvekről, az architektúra tervezés fontosságáról, és a fejlesztéshez kapcsolódó projektmenedzsment módszertanról.

## Források

- [Core Design Principles for Software Developers by Venkat Subramaniam](https://www.youtube.com/watch?v=llGgO74uXMI)
- [Robert C. Martin munkássága](https://en.wikipedia.org/wiki/Robert_Cecil_Martin)