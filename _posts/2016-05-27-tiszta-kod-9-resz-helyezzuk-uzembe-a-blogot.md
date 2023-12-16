---
id: 1095
title: 'Tiszta kód, 9. rész – Helyezzük üzembe a blogot!'
date: '2016-05-27T06:00:25+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=1095'
permalink: /2016/05/27/tiszta-kod-9-resz-helyezzuk-uzembe-a-blogot/
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
    - '4216'
avada_post_views_count:
    - '4219'
fusion_builder_content:
    - ''
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
amazonS3_cache:
    - 'a:2:{s:64:"//www.letscode.huassets/uploads/2016/05/blogapplication.png";a:2:{s:2:"id";i:1139;s:11:"source_type";s:13:"media-library";}s:87:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2016/05/29123044/blogapplication.png";a:2:{s:2:"id";i:1139;s:11:"source_type";s:13:"media-library";}}'
image: 'assets/uploads/2016/05/29123039/31531715_m_cropped.png'
categories:
    - Fejlesztés
tags:
    - 'clean code'
    - Entity-Boundary-Interactor
---

[Az előző részben](https://www.refaktor.hu/tiszta-kod-8-resz-egy-tiszta-kod-blog-kezdetei/) megírtuk egy blog üzleti logikáját, teljesen figyelmen kívül hagyva a tényleges adatbázist vagy böngészőt. Most itt az ideje, hogy üzembe is helyezzük.

> Ez a cikk erősen épít a sorozat korábbi elemeire. Érdemes az olvasást [az elején kezdeni](https://www.refaktor.hu/tiszta-kod-1-resz-teszteljek-vagy-ne-teszteljek/).

## A külső függőségek problémája

Egészen eddig egyáltalán nem foglalkoztunk azzal, hogy milyen frameworköt vagy külső csomagokat fogunk használni. [Bob bácsi azt mondta, hogy a rendszerünk magja legyen **független a frameworköktől**](https://blog.8thlight.com/uncle-bob/2012/08/13/the-clean-architecture.html), de azt nem igazán magyarázta el, hogy miért?

Teljesen mindegy, hogy nyílt forrású csomagokat használunk GitHubról, vagy külső partner által szállított szoftverkomponenst, érdemes néhány dologra ügyelni. Nézzük, hogy melyek ezek.

### Biztonság

Mennyire biztonságos az a komponens, amit használsz? Itt két fontos eszköz van a kezedben. Az egyik természetesen az, hogy auditálod a kódod. Azaz elolvasod és leteszteled biztonsági hibákra. Legyünk őszinték, ez a lehető legkevesebb esetben történik meg, különösen ha nem csak néhány kis komponensről van szó, hanem egész frameworkökről.

A másik fontos mutató a közösség az adott projekt körül. Ha egy projektet több tízezer helyen használnak, a több szem többet lát elv alapján sokkal előbb derülnek ki a problémák, mint a néhány tucat felhasználós kis projekteknél. Ez persze nem abszolut szabály, egy jól képzett, biztonsági háttérrel rendelkező fejlesztő által karbantartott kis modul sokkal biztonságosabb lesz, mint az átlagos, több ezer felhasználóval rendelkező 0.0.1-es NodeJS modul.

Bármelyiket is választjuk, két fontos feladatot mindenképpen szem előtt kell tartanunk. Az egyik, hogy figyeljük a biztonsági értesítéseket. Ha a projekt rendelkezik security levelezési listával, iratkozzunk fel rá. Ha nincs ilyen, nézzük meg a csomagkezelőnket, hátha támogatja azt, hogy jelezze a biztonsági frissítéseket.

### Stabilitás

Persze, a biztonság fontos, de ami talán még fontosabb, az a stabilitás. Ha megváltozik a bekötött modul egyik napról a másikra, előre nem tervezhető fejlesztések elé nézünk, és jó eséllyel nem fogjuk végrehajtani a biztonsági frissítéseket.

Röviden és tömören, ezekre érdemes figyelni:

- Van-e előre tervezett karbantartási ciklus?
- Van-e szemantikus verziózás? (Azaz egy visszafele nem kompatibilis változásnál változik-e a főverzió száma?)
- Van-e elérhető levelezési lista (vagy hasonló) a kiadásokról?

Ha ezek mindegyikére nem a válasz, komoly kockázattal jár a csomag használata, hiszen bármikor szembe jöhet az a probléma, hogy egy `composer update` megöli az egész rendszerünket.

Természetesen néha kénytelenek vagyunk ezzel a kockázattal élni, például amikor nincs alternatív csomag és nincs keret megírni a kívánt funkcionalitást. Ha ilyen kompromisszumot kötünk, különösen ügyelni kell arra, hogy a külső csomag kellően le legyen választva a rendszerünkről.

### Minőség

Némileg kapcsolódik a stabilitáshoz a külső csomag minősége is. Ha egyszer külső csomag vagy keretrendszer mellett döntünk, szeretnénk ha az jó minőségű lenne. Mi alapján dönthetünk erről:

- **Ránézünk a kódra.** Ha hihetetlenül hosszú függvényekkel, spagettikóddal találkozunk, esetleg HTML és debug kód keveredik a tényleges programlogikával, legyünk nagyon nagyon óvatosak. (Ugyanakkor megjegyezném, hogy a bonyolult nem azonos a rossz kódminőséggel.)
- **Vannak-e tesztek?** A tesztek jelenléte, és könnyű futtathatósága azt jelzi számunkra, hogy a csomag szerzője foglalkozott a projektje minőségbiztosításával. Amíg a saját projektek teszteletlensége, ha nem is bocsánatos bűn, de legalább valamilyen szinten korlátozott következményekkel jár, a külső felhasználásra készített függvénykönyvtárak nem tesztelése komoly intő jel lehet.
- **Futnak-e automatikusan a tesztek?** A legjobb teszt mit sem ér, ha nem kerülnek futtatásra. Éppen ezért a modernebb open source projektek a tesztjeiket automatikusan futtatják, például [Travis-CI](https://travis-ci.org/) segítségével, és ezt büszkén jelzik is a GitHub oldalukon.

Külső projekteket értelemszerűen nem fogunk unittesztelni. Éppen ezért halmozottan fontos, hogy ne csak egységteszteket, hanem integrációs teszteket is alkalmazzunk, amik az egész szoftvercsomag együttes működését tesztelik. Erre vannak különböző megoldások, amiket majd megvizsgálunk a cikk további részében.

## Mit szeretnénk egy frameworktől?

Az világos, hogy ma már senki nem fog nulláról, csak saját kódot felhasználva megírni egy teljes blogot. Gazdasági szempontból ez egyáltalán nem hatékony. Éppen ezért vizsgáljuk meg, hogy mit is várunk egy frameworktől, milyen szempontokat kell figyelembe vennünk?

### 1. dependency injection

Ez majdnem triviális, szeretnénk egy [dependency injection megoldást](https://www.refaktor.hu/tiszta-kod-7-resz-mi-a-fene-az-a-dependency-injection-container/), hogy ne kelljen kézzel összedrótozni az alkatrészeket.

### 2. adatbázis kezelés

Ahhoz, hogy a blogunk ténylegesen használható is legyen, kell mögé valamilyen adattároló. SQL, vagy fájlok, majdnem mindegy, de jó lenne, ha nem nekünk kellene megírni.

### 3. routing és HTTP kezelés

Ha bejön egy kérés egy böngészőtől, szeretnénk a megfelelő kódrészhez irányítani. Mindezt a lekért cím alapján szeretnénk megtenni, tehát a `http://www.example.com/` oldalra a blogpostok listáját szeretnénk kiszolgálni, a `http://www.example.com/elso-blogpost/` címre pedig a konkrét blogpostot. Ezen felül persze a választ is szeretnénk visszaküldeni a böngészőnek.

### 4. sablon kezelés

Ha HTML-t kell gyártanunk, semmi sem kényelmetlenebb, mint a működési logikát összevegyíteni a kimenettel. Éppen ezért szeretnénk egy sablon kezelő rendszert, pl. Smarty, Twig, Jinja2, stb.

### 5. konfiguráció

Ahhoz, hogy a későbbiekben kellemesen lehessen használni, jó lenne, ha lenne egy INI, YAML vagy XML fájl amiben konfigurálni lehet a blogunkat.

### 6. caching (gyorsítótárazás)

Idővel szükségünk lehet arra, hogy bizonyos dolgokat cacheljünk, hogy gyorsabb legyen a blogunk. Ez első pillanatban nem feltétlenül szempont, de a későbbiekben érdekes lehet.

## Választási lehetőségek

Ha ezeket a szempontokat figyelembe vesszük, három nagy kategória van, amiből választhatunk:

### Teljes framework

Ezek a fajta frameworkök (Symfony, Zend, stb) rengeteg funkcionalitást hoznak magukkal. A jogosultság-kezeléstől, az adatbázis kezelésen át, a mindenféle konfigurációig mindent kapunk. Ennek vannak előnyei, hiszen szinte semmit nem kell leprogramoznunk a core logikán kívül, viszont egy szép nagy halom függőséget kapunk ajándékba. Az alap Symfony telepítés például 31 csomagot ránt magával 11 különböző gyártótól, a Laravel 57 csomagot húz be 31 különböző gyártótól. Ugyan a frameworkök gyártói hihetetlen munkát végeznek a csomagok összehangolásánál, de azért említésre méltó, hogy némely ezek közül nem rendelkezik tesztekkel, és elég sok a rendszermagtól teljesen eltérő kódolási konvencióval vagy felépítéssel rendelkezik.

### Mikroframeworkök

Ezek olyan frameworkök, amelyek igyekeznek a funkcionalitásukat minimálisra szorítani. Az egyik ilyen framework a [Silex](http://silex.sensiolabs.org/), amely 9 csomagot húz be 4 gyártótól. Sokkal kevesebb függőség, sokkal egyszerűbb felépítés, viszont számos olyan funkció hiányzik, amire mindenképpen szükségünk lesz, például az adatbázis kapcsolatok kezelése. Magyarán a core csomagok nem lesznek elegendőek a rendszer felépítésére.

### Framework nélkül

Némely körökben eretnekségnek számíthat, de koránt sem elvetemült ötlet. Ebben az esetben saját magunk válogatjuk össze a modulokat, amiket behúzunk. Szinte egyértelmű, hogy ezt nem ússzuk meg integrációs tesztelés nélkül, és kénytelenek leszünk komoly erőfeszítést fordítani arra, hogy ezek a modulok szépen szeparáltak legyenek a rendszerünktől. Az sem elhanyagolható tényező, hogy senki másra nem számíthatunk, kénytelenek leszünk a használt csomagok kódját bizonyos mélységig átnézni, auditálni. Ez a fajta felépítés különösen akkor érdekes, ha olyan feladatunk van, amibe a framework kevés hozzáadott értéket vinne be.

## Mit választunk?

Ennyi bevezető után bizonyára már kíváncsian várod: mégis mit választunk? Itt egy olyan döntést hozunk, ami a fentiek alapján némileg furának tűnhet, és ennek meg is van az oka.

A válasz az, hogy framework nélkül fogunk fejleszteni. De nem azért, mert így hatékony, koránt sem. Csomó munkát megspórolhatnánk azzal, hogy behúzunk egy mikroframeworköt.

> Kizárólag azért dolgozunk framework nélkül, hogy bemutassuk az alkalmazás teljes felépítését. Kérlek, ne így építsd fel a következő éles projektedet!

Na de, ha nincs framework, milyen csomagokat fogunk használni?

|---|
|-----|
|  | [Auryn](https://github.com/rdlowrey/auryn) |  | Dependency Injection Container |  | `<a href="https://packagist.org/packages/rdlowrey/auryn">rdlowrey/auryn</a>` |  |
|  | [Twig](http://twig.sensiolabs.org/) |  | Sablon kezelő rendszer |  | `<a href="https://packagist.org/packages/twig/twig">twig/twig</a>` |  |
|  | [FastRoute](https://github.com/nikic/FastRoute) |  | Routing könyvtár |  | `<a href="https://packagist.org/packages/nikic/fast-route">nikic/fast-route</a>` |  |
|  | [PSR-7](http://www.php-fig.org/psr/psr-7/) |  | Szabványosított interfacek HTTP kérdésekre/válaszokra PHP-ban |  | `<a href="https://packagist.org/packages/psr/http-message">psr/http-message</a>` |  |
|  | [Guzzle PSR-7](https://github.com/guzzle/psr7) |  | PSR-7 megvalósítás |  | `<a href="https://packagist.org/packages/guzzlehttp/psr7">guzzlehttp/psr7</a>` |  |

## A facade pattern, vagyis a külső függőségek leválasztása

Mint már számtalanszor említettük, a célunk az, hogy a külső függőségeket leválasszuk. Ennek vajmi egyszerű az oka: ha a külső függőség gyártójának elgurul a gyógyszere és elkezd hülyeséget csinálni, szeretnénk biztositani a lehetőséget, hogy kidobjuk a csomagot és lecseréljük egy másikra. Viszonylag fájdalommentesen.

> Külső függőség alatt itt a frameworköt is értjük! Azt is érdemes leválasztani, így a frissítés a következő verzióra sokkal fájdalommentesebb lesz!

Ezt az un. facade patternnel fogjuk megvalósítani. Először is, végig gondoljuk a feladatot és létrehozunk egy jól definiált interface-t a feladatra. Ez a dependency injection containerünkre nézhetne ki például így:

```
interface DependencyInjectionContainer {
    /**
     * Mark a class, interface or object as shared.
     *
     * @param string|object $classNameOrInstance
     */
    public function share($classNameOrInstance);

    /**
     * Mark a certain implementation as an alias for an interface.
     * This can be used to specify the concrete implementation
     * of an interface.
     *
     * @param string $interfaceName
     * @param string $implementationClassName
     */
    public function alias($interfaceName, $implementationClassName);

    /**
     * Set the values for a certain class' constructor explicitly.
     * This is useful when a certain parameter has no type hinting,
     * e.g. a configuration option.
     *
     * @param string $className
     * @param array  $arguments key-value array of arguments and
     *                          their values.
     */
    public function setClassParameters($className, $arguments);

    /**
     * Create an instance of $class or its alias, using dependency
     * injection.
     *
     * @param string $class
     *
     * @return object
     */
    public function make($class);

    /**
     * Call a class method with the parameter autodiscovery.
     *
     * @param callable $method
     * @param array    $arguments Optional arguments set explicitly.
     *
     * @return mixed
     */
    public function execute($method, $arguments = []);
}
```

Természetesen itt nagyon figyelni kell arra, hogy a facade ne csak azt az egy konkrét megvalósítást támogassa. Éppen ezért érdemes megnézni legalább 2-3 hasonló külső könyvtárat, hogy egy általános csatolófelületet hozzunk létre.

Ezek után neki esünk a megvalósításnak, szem előtt tartva, hogy a magvalósító osztálynak el kell fednie a külső könyvtár összes rondaságát. Az Auryn esetén ez relatíve egyszerű, de egy SwiftMailer (levelező könyvtár), vagy a Twig (templatező rendszer) felkonfigurálása már trükkösebb lehet. Az eddigi aranyszabály az volt, hogy a függőségeket bekérjük a konstruktorban, de ezt itt tudatosan megsértjük:

```
class AurynDependencyInjectionContainer
    implements DependencyInjectionContainer {

    /**
     * @var Injector
     */
    private $auryn;
	
    public function __construct() {
        $this->auryn = new Injector();
    }
    
    //...
}
```

Mielőtt kezdenéd kibontani a vákuum csomagolt instant vasvillát, erre jó okunk van. Az Aurynnál viszonylag egyszerű dolgunk van, de más külső könyvtáraknál, például a Twignél, már bonyolultabb lesz felhúzni:

```
$loader = new Twig_Loader_Filesystem($templateDirectory);
$twig = new Twig_Environment($loader, array('debug' => true));
$twig->addExtension(new Twig_Extension_Debug());
```

Természetesen ezt még bonyolíthatjuk különböző extesionökkel, cacheléssel, stb.

Na most, a DIC-t konfigurálnunk kell, vagyis meg kell adnunk, hogy melyik interface helyett mit töltsön be, és melyek a fix paraméterek (pl. `$templateDirectory`). Ha facade-ok belső életét is dependency injectionnel toljuk be (tehát a `Twig_Loader_Filesystem` osztályt bekérjük a konstruktorban), akkor egy részt olvashatatlanul hosszú lesz a konfig. Másrészt, és ez a lényegesebb, ismernünk kell a facade belső életét ahhoz, hogy használni tudjuk. Na de pont ez az, amit szerettünk volna elkerülni!

Magyarán maradunk annál, hogy a facade megvalósításában elrejtjük a külső könyvtár összes komplexitását, beleértve az osztályok példányosítását is. Ennek persze az a következménye, hogy már nem tudunk *egység*tesztelni, hiszen az `AurynDependencyInjectionContainer` az osztályok létrehozása miatt nem tesztelhető önállóan.

De semmi vész, helyette integrációs tesztelést végzünk. Vagyis nem egy osztályt, hanem a teljes modul teljes funkcionalitását teszteljük egyszerre. Ha például a Twig (template engine) integrációt teszteljük, lerakunk egy templatet és megkérjük, hogy olvassa fel. Ha azt kapjuk vissza, amit várunk, minden rendben.

Fontos látni, hogy sok esetben meglehetősen macerás az integrációs tesztelés. Ha például egy adatbázis kezelő réteget húzunk be, szükségünk van egy adatbázis szerverre a megfelelő teszteléshez. Ilyen esetben azt szokás csinálni, hogy ezeket az *online* teszteket egy külön csoportba vagy *test suite*-be rakjuk, és csak akkor futtatjuk, ha rendelkezésre áll a teszteléshez használt, dedikált adatbázis szerver. Jobbára az integrációs réteg nem változik túl gyakran, tehát nem kell fejlesztés közben tesztelnünk, elég release előtt. Ideális esetben ezt egy Continuous Integration szerver végzi egy erre a célra felhúzott környezetben.

## Architektúra

Na most aztán jól kiveséztük a külső függőségek kezelését, térjünk rá az architektúra kérdésre egy kicsit. Az előző részben felépítettük a meglehetősen egyszerű, de igen csak bővíthető üzleti logikánkat. Ezt most két új résszel kell felszerelnünk: a webes kiszolgálást végző *delivery mechanizmussal* és valamiféle *perzisztens adattárolóval*, például adatbázissal.

Kezdjük a delivery mechanizmussal. Itt teljesen szabályosan követni fogjuk a modern MVC keretrendszereket: lesz egy routing, ami eldönti, hogy melyik címre melyik controllert kell használni, lesz néhány controller és ezekhez view-k. Valahogy így:

![blogapplication](assets/uploads/2016/05/29123044/blogapplication.png)

*Majdnem* MVC, igaz? A különböző interfaceket nem jelöltem az ábrán, de remélhetőleg ez nem okoz túl sok bonyodalmat. A kódot ehhez szokás szerint [megtalálod a GitHub oldalunkon](https://github.com/refaktormagazin/blog).

Mi a helyzet az adatbázissal? Na az a helyzet, hogy az adatbázissal semmi nincs. Az előző cikkben tárgyaltak szerint az adatbázis felé az *entity gateway* nyújt felületet, vagyis elegendő írnunk egy `PDOMySQLBlogEntityGateway` osztályt, ami közvetlenül használja a [PDO-t](https://secure.php.net/pdo), és készen vagyunk.

Megtehetnénk, hogy behúzunk egy csilivili adatbázis absztrakciós réteget? Meg. Esetleg egy ORM-et? Hogyne. De vegyük észre, hogy blogot írunk, nem egy vezérlőrendszert a [SpaceX Dragon űrhajóhoz](http://www.spacex.com/dragon). (A NASA emlegetése olyan régimódi.) Minek bonyolítani?

## A tesztelés

A sorozat elején megbeszéltük, hogy a unit tesztek mindig az egységeket tesztelik, az összeépítést viszont nem. Erre valóak a különböző szintű integrációs tesztek. Ha valami bonyolultabbat írnánk, akkor minden bizonnyal bevezetnénk különböző közép szintű tesztet, ami néhány modul összeépítését teszteli, esetleg csinálnánk olyan teszteket, amik csak a delivery mechanizmust tesztelik a működési logika leválasztásával. De ismétlem, egy blogot írunk, nem egy űrhajó oprendszerét.

Éppen ezért a tesztelést [Seleniumon](http://www.seleniumhq.org/) keresztül fogjuk végezni [Behat Mink](http://mink.behat.org/en/latest/) segítségével. Ez azt eredményezi, hogy PHPUnitban írhatunk teszteket, amik a szemünk láttára a böngészőben nyomkodják végig az alkalmazást. Ezek a tesztek nézhetnek ki például így:

```
$session = new Session(
    new Selenium2Driver());

$session->start();

$session->visit(
    'http://localhost:8000/');

$page = $session->getPage();

$this->assertEquals(
    'This is my second post',
    $page->find('css', 'h2')->getText());

$page->find('css', 'h2 a')
     ->click();

$this->assertEquals(
    'http://localhost:8000/second-post',
    $session->getCurrentUrl());
```

## Vissza az ügyfélhez

Ezen a ponton eltöltöttünk a feladattal 2 munkanapot (16 munkaórát), és van egy működőképes, ámbár elég fapados blogmotorunk. Az ügyfél igényeinek megfelelően ezután jön az admin felület kialakítása, a design felhúzása, stb stb. Magyarán ez volt a munka bevezető része. Viszont ezzel megteremtettük a lehetőséget arra, hogy szinte bármilyen elképesztő kérést fedél alá hozzunk.

Ha szeretnéd kipróbálni az általunk írt blogot, azt viszonylag egyszerűen megteheted:

1. Töltsd le [a forráskódot GitHubról](https://github.com/refaktormagazin/blog)
2. Készítsd el a `config/local.php` fájlt a minta alapján
3. Futtasd ke a `composer install` parancsot
4. Futtasd le a `bin/migrate.php` fájlt
5. Indítsd el a fejlesztői PHP szervert a `htdocs` mappában: php -S 127.0.0.1:8000
6. Nyisd meg a <http://localhost:8000> oldalt a böngésződben.

A [PHPLoc](https://github.com/sebastianbergmann/phploc) kimenetét megnézve az src könyvtárral nem is melóztunk olyan sokat ezen két nap alatt:

```
Directories                                         12
Files                                               40

Size
  Lines of Code (LOC)                             1679
  Comment Lines of Code (CLOC)                     580 (34.54%)
  Non-Comment Lines of Code (NCLOC)               1099 (65.46%)
  Logical Lines of Code (LLOC)                     394 (23.47%)
    Classes                                        305 (77.41%)
      Average Class Length                           7
        Minimum Class Length                         0
        Maximum Class Length                        32
      Average Method Length                          2
        Minimum Method Length                        1
        Maximum Method Length                       20
    Functions                                        2 (0.51%)
      Average Function Length                        0
    Not in classes or functions                     87 (22.08%)

Cyclomatic Complexity
  Average Complexity per LLOC                     0.12
  Average Complexity per Class                    2.23
    Minimum Class Complexity                      1.00
    Maximum Class Complexity                     11.00
  Average Complexity per Method                   1.56
    Minimum Method Complexity                     1.00
    Maximum Method Complexity                    11.00

Dependencies
  Global Accesses                                    0
    Global Constants                                 0 (0.00%)
    Global Variables                                 0 (0.00%)
    Super-Global Variables                           0 (0.00%)
  Attribute Accesses                                80
    Non-Static                                      80 (100.00%)
    Static                                           0 (0.00%)
  Method Calls                                     140
    Non-Static                                     140 (100.00%)
    Static                                           0 (0.00%)

Structure
  Namespaces                                        13
  Interfaces                                        11
  Traits                                             0
  Classes                                           29
    Abstract Classes                                 4 (13.79%)
    Concrete Classes                                25 (86.21%)
  Methods                                          104
    Scope
      Non-Static Methods                           104 (100.00%)
      Static Methods                                 0 (0.00%)
    Visibility
      Public Methods                                92 (88.46%)
      Non-Public Methods                            12 (11.54%)
  Functions                                          3
    Named Functions                                  1 (33.33%)
    Anonymous Functions                              2 (66.67%)
  Constants                                          1
    Global Constants                                 1 (100.00%)
    Class Constants                                  0 (0.00%)
```

## Összegzés

Nincs olyan szabály, amire nincs kivétel. Nincs olyan framework, ami minden feladatra egyformán alkalmas lenne. Éppen ezért azt javaslom, hogy válaszd ki azokat az eszközöket, amik a Te projektedhez legjobban illenek, amikkel tudsz dolgozni és amihez találsz hozzáértő munkatársat. Ha olyan alkalmazást gyártasz, ami 2 hónapig fog élni, teljesen fölösleges ennyire leválasztani a frameworkről. Ha előre láthatólag akár tíz évnél is hosszabb ideig karban kell tartani, akkor nem csak a frameworkről, de a programnyelv beépített eszközeiről is le kell valasztanod.

Sajnos a szakmánkban dúl a [silver bullet szindróma](https://www.youtube.com/watch?v=3wyd6J3yjcs), mindig újabb és újabb eszközök jönnek ki, és sokan ész nélkül ráugranak ezekre. Blogpostokat írnak, hogy ez a jövő, erre kell váltani, és hülye vagy, ha nem ezt csinálod. Egy évvel később pedig ugyanezekről az emberekről olvasod, hogy migrálnak lefele a korábban hype-olt technológiáról. Csak az a kár, hogy egyik esetben sincs igazuk. Nem feltétlenül kellene rögtön felugrani a legújabb hype trainre, főleg ha a karbantarthatóság a fontos, de azt is látni kellene, hogy minden technológiának megvan a helye, nem kell rögtön leugrálni sem, amint alább hagyott a lelkesedés. Ha hosszú távon karbantartható projekteket akarsz fejleszteni, akkor nem árt egy kis konzervatív gondolkodásmód, egy kis óvatosság. Technológiák, frameworkök, függvénykönyvtárak jönnek-mennek, az alkalmazásaink viszont egyre hosszabb ideig élnek.

Végső soron talán egyetlen tanáccsal szolgálhatok a mindennapi fejlesztéshez: olyan eszközöket, módszertant válassz, ami *a projekt teljes időtartama alatt* a lehető legkevesebb fájdalommal jár. Vagyis olyat válassz, ami *Neked* jó. Ezt pedig – jó eséllyel – csak Te tudod eldönteni.

Ezzel a cikkel véget ért a tiszta kód sorozatunk. De ne csüggedj, a jövőben is fogunk a tiszta kódról írni, egyelőre azonban más irányba állítjuk a napszélvitorlát: **megnézzük, hogy hogyan is kell egy ilyen tiszta kód projektet üzemeltetni.**

## Kérdőív

Ha szeretnél nekünk visszajelzést adni a sorozatról, itt a lehetőséged:

\[formidable id=2\]