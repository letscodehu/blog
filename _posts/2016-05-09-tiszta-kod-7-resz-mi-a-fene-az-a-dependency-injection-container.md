---
id: 1993
title: 'Tiszta kód, 7. rész – Mi a fene az a Dependency Injection (Container)?'
date: '2016-05-09T06:19:02+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=968'
permalink: /2016/05/09/tiszta-kod-7-resz-mi-a-fene-az-a-dependency-injection-container/
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
    - '14493'
avada_post_views_count:
    - '14494'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
image: 'assets/uploads/2016/02/09202041/qgQSe.png'
categories:
    - Fejlesztés
tags:
    - 'clean code'
    - 'Dependency Injection'
    - 'Dependency Injection Container'
    - 'Inversion of Control'
---

A [S.O.L.I.D.](https://www.refaktor.hu/tiszta-kod-5-resz-a-s-o-l-i-d-alapelvek/) elvek kapcsán beszéltünk arról, hogy nem jó, ha a moduljaink szorosan függenek egymástól. De mégis, hogy a fenébe működik ez a gyakorlatban?

> **Figyelem!**  
> A cikk erősen épít a korábbi [S.O.L.I.D. alapelvek cikkre](https://www.refaktor.hu/tiszta-kod-5-resz-a-s-o-l-i-d-alapelvek/). Ha még nem tetted, nagyon ajánlott [előbb azt elolvasni](https://www.refaktor.hu/tiszta-kod-5-resz-a-s-o-l-i-d-alapelvek/)!

## A probléma

> **Függőség megfordítási elv**  
> A kódod függjön absztrakcióktól, ne konkrét implementációktól.

A korábbi cikkünkben részletesen elmagyarázzuk, de az elv lényege az, hogy ne hozzunk létre ilyen függőségeket:

```
class MyBusinessLogic {
    private MySQLConnection db;
    
    public MyBusinessLogic() {
        this.db = new MySQLConnection();
    }
}
```

Látszólag jó megoldás, de van néhány komoly hátulütője:

1. Nem tudjuk leválasztani az osztály függőségeit teszteléshez.
2. Nem tudjuk kicserélni a `MySQLConnection` osztályt egy másik, azonos működésű osztályra.

Magyarán szeretnénk létrehozni például egy `DatabaseConnectionInterface` interfacet, és elérni azt, hogy a `MyBusinessLogic` osztály csak és kizárólag ettől az interface-től függjön, ne pedig a konkrét megvalósítástól. Nade ha csak az interface-t használjuk, honnan fogja megkapni a `MyBusinessLogic` a megfelelő adatbázis kapcsolatot?

Az egyik megoldás, hogy bekérjük a konstruktorban például így:

```
class MyBusinessLogic {
    private DatabaseConnectionInterface db;
    
    public MyBusinessLogic(DatabaseConnectionInterface db) {
        this.db = db;
    }
}
```

Ez szépen működne is, viszont ez borzasztóan macerássá teszi az egész műveletet, hiszen minden függőséget át kell vonszolni a programunk összes rétegén. Nos, erre keresünk megoldást.

## A Service Locator / Registry (anti)pattern

> **Mi az az antipattern?**  
> Az antipattern az ajánlott tervezési minta (pattern) ellentéte. Egy olyan programozói gyakorlatot képvisel, amit különböző okokból kifolyólag érdemes elkerülni.

A dotkomlufi utáni években (fiatalabbaknak: 2000 után) rengeteg MVC framework jött létre azért, hogy könnyebbé tegyék a webes fejlesztéseket. Eleinte az egész függőség leválasztás nem is volt téma, később viszont elkezdték bevezetni, mégpedig a legkézenfekvőbb módon: csomaguljuk az összes szolgáltatást, amire valakinek szüksége lehet, egyetlen osztályba. Például így:

```
class ServiceRegistry {
    public void set(string name, ServiceInterface service) {
        //...
    }

    public ServiceInterface get(string name) {
        //...
    }
}
```

Ezt aztán így használnánk:

```
class MyBusinessLogic {
    ServiceRegistry registry;
    public MyBusinessLogic(ServiceRegistry registry) {
        this.registry = registry;
    }
    public void doSomething() {
        this.registry.get('db').query('...');
    }
}
```

Ezek után a `MyBusinessLogic` osztályunkban az elmentett `ServiceRegistry` osztály példányt használjuk, hogy beszerezzük azokat a szolgáltatásokat, amikre szükségünk van. (Például az adatbázis kapcsolatot.)

### Mi a gond a Service Locatorral?

Ha úgy érzed, hogy ez egy igen erős hack, nagyon igazad van. A Service Locator egy antipattern és érdemes elkerülni. Nézzük meg, hogy miért.

Ha szeretnél használni egy osztályt, tudnod kell, hogy milyen függőségei vannak, hiszen fel kell paraméterezned. A Service Locatorral ez viszont meglehetősen macerás lehet, ugyanis **elrejti a függőségeket.** A fenti osztályról például egyáltalán nem derül ki, hogy szüksége van adatbázis kapcsolatra. Erre csak akkor jövünk rá, ha elolvassuk a forráskódját vagy szöveges dokumentációját. Ez macerás és időrabló, sokkal jobb lenne, ha az osztálydefinícióból rögtön kitűnne, hogy mire van szüksége.

Mondhatnád azt, hogy ó, úgyis egyszer felparaméterezed és onnantól működik, de ha ne adj Isten valaki bevezet egy új függőséget és debugolnod kell, valószínűleg emlegetni fogod az adott fejlesztő összes felmenőjét.

A másik igen komoly probléma az, hogy soha nem tudhatod, hogy a `db` kulcs alatt az a tipusú szolgáltatás van letárolva, amire számítasz. Honnan tudod, hogy nem kapsz hirtelen egy Memcache szolgáltatást, ami nem tud mit kezdeni az SQL parancsaiddal? Nem tudod.

> **Tudtad?**  
> Egészen a közelmúltig a Symfony is a Service Locatort használta / [részben még használja](https://symfony.com/doc/current/book/service_container.html), a CodeIgniter pedig a mai napig kizárólag ezt használja. Jól nézd meg, hogy a modernnek hírdetett frameworköd valójában mennyire modern!

## Az igazi Dependency Injection Container (DIC)

Menjünk vissza egy pillanatra az eredeti felálláshoz, kérjük be az osztályunk függőségeit a konstruktorban:

```
class MyBusinessLogic {
    private DatabaseConnectionInterface db;
    
    public MyBusinessLogic(DatabaseConnectionInterface db) {
        this.db = db;
    }
}
```

Van-e megoldás arra, ezt a konstruktort automatikusan paraméterezzünk?

Ha kicsit utána nézünk, kiderül, hogy van. A legtöbb modern nyelv rendelkezik olyan mechanizmussal, amivel le tudjuk kérni egy függvény elvárt paramétereit. Ezt a megoldást a legtöbb nyelvben reflectionnek hívják. (Még mielőtt felhördülnél, hogy a reflection lassú, vannak megoldások, amik ezt megkerülik.)

Magyarán írhatunk egy olyan rendszert, amit egy konfigurációnak megfelelően felparaméterezi a szolgáltatásainkat. Ezt a fajta funkcionalitást *Dependency Injection Containernek*, vagy hosszabb nevén *Inversion of Control (IoC) Dependency Injection Containernek* hívják. Ilyenek például PHP-ban például az [Auryn](https://github.com/rdlowrey/auryn), Javaban a [Spring Container](http://docs.spring.io/autorepo/docs/spring/3.2.x/spring-framework-reference/html/beans.html) vagy a [Guice](https://github.com/google/guice).

Ha a fenti példánál maradunk, a Dependency Injection Container észleli, hogy az adott üzleti logikának szüksége van egy `DatabaseConnectionInterface` típusú osztályra. Ezt viszont nem tudja automatikusan létrehozni, hiszen ez egy interface amit nem lehet példányosítani. Éppen ezért a DIC-t fel kell paraméterezni, meg kell tanítani, hogy mely interface-t mely konkrét osztály valósítja meg. Egy fiktív DIC megvalósításra ez például így nézhetne ki:

```
DIC injector = new DIC();
//Megadjuk, hogy a DatabaseConectionInterface interface
//mely megvalositasat akarjuk hasznalni.
injector.alias('DatabaseConnectionInterface', 'MySQLConnection');
//Letrehozzuk a MyBusinessLogic osztalyunkat.
MyBusinessLogic businessLogic = injector.make('MyBusinessLogic');
```

Elsőre kicsit szokatlannak tűnhet ez a fajta megvalósítás, de számos előnye van. Ha szépen felépítjük a megvalósítás-listánkat (azaz mely interfacere mely megvalósítást kell létrehozni), a DIC képes lesz feloldani a többszörös függőségeket is. Magyarán ha egyszer felkonfiguráltuk a DIC-t, onnantól kezdve a `make()` függvénnyel bármilyen szolgáltatást kérhetünk, képes lesz az annak szükséges egyéb objektumokat létrehozni.

> **Figyelem!**  
> Semmiképp ne csinálj Service Locatort a DIC-ból azzal, hogy átadod a szolgáltatásaidnak! A szolgáltatásaid ne is tudjanak a DIC-ról!

Természetesen a frameworkök ezt a fajta funkcionalitást nagyrészt elfedik előlünk, a különböző szolgáltatásokat sokszor YAML vagy XML konfigurációs állományban kell megadni. (Hacsak nem akarunk keretrendszer nélkül élni.) Éppen ezért például a controllerben elegendő lehet így megadni a függőségeket:

```
class MyController {
    public MyController(MyBusinessLogicInterface businessLogic) {
        //...
    }
}
```

A többiről pedig (megfelelő konfigurálás után) a framework DIC-je gondoskodik.

## A sebességről

A legtöbb programnyelvben a reflection funkció meglehetősen lassú, de még mindig sokkal gyorsabb a diskről olvasásnál. Szerencsére a reflection műveletet nem kell minden oldallekérésre elvégezni, hiszen elég egyetlen egyszer, a program fordításakor vagy telepítésekor (deploykor) előállítani ezt az információt. (Feltételezve hogy nem FTP-n szerkeszted a PHP fájlokat közvetlenül a szerveren, amely esetben ennél komolyabb gondjaid vannak.) Ezt az információt elmentheted az alkalmazásod cache-ébe (gyorsítótárába), így nem kell mindig végrehajtani a reflection folyamatot.

Akkor sincs minden veszve, ha nem használsz még semmilyen cachelési megoldást. Nézd meg a választott DIC dokumentációját, szinte biztos, hogy képes előállítani valamilyen lementhető formában a függőségi adathalmazt. Ha ez megvan, írj egy rövid scriptet, ami legyártja ezt az információt és elmenti egy fájlba. Az éles szerverre már ezzel a fájllal együtt másold fel a kódodat.

Az olyan programnyelvekben, amik nem indulnak újra minden oldallekérésere (pl. Java), természetesen erre semmi szükség. Az alkalmazás indulásakor lefolytatjuk a reflection folyamatot, és onnantól kezdve az adat permanensen rendelkezésre áll.

> A DIC természetesen nem web-specifikus, igen könnyen használható asztali alkalmazásokra vagy konzolos programokra is.

## A következő részben

Ez sorozat egy fontos ponthoz ért: minden olyan működést tárgyaltunk, ami szükséges egy clean code elven alapuló alkalmazás lefejlesztéséhez, de még nem tudjuk feltétlenül, hogyan rakjuk össze. Éppen ezért a következő részben egy teljes blogot fejlesztünk, admin felülettel és adatbázis kapcsolattal.