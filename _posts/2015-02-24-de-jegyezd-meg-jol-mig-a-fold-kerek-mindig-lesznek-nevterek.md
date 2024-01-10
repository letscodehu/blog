---
id: 330
title: 'De jegyezd meg jól, míg a Föld kerek, mindig lesznek névterek!'
date: '2015-02-24T09:00:24+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=330'
permalink: /2015/02/24/de-jegyezd-meg-jol-mig-a-fold-kerek-mindig-lesznek-nevterek/
dsq_thread_id:
    - '3543100447'
    - '3543100447'
tie_post_bg:
    - ''
    - ''
tie_post_color:
    - ''
    - ''
tie_gallery_style:
    - slider
    - slider
tie_link_url:
    - ''
    - ''
tie_link_desc:
    - ''
    - ''
tie_video_url:
    - ''
    - ''
tie_embed_code:
    - ''
    - ''
tie_audio_mp3:
    - ''
    - ''
tie_audio_m4a:
    - ''
    - ''
tie_audio_oga:
    - ''
    - ''
tie_audio_soundcloud:
    - ''
    - ''
tie_quote_author:
    - ''
    - ''
tie_quote_link:
    - ''
    - ''
tie_quote_text:
    - ''
    - ''
tie_status_facebook:
    - ''
    - ''
tie_status_twitter:
    - ''
    - ''
categories:
    - Intermediate
    - PHP
tags:
    - autoload
    - classname
    - fully
    - import
    - namespace
    - php
    - qualified
    - use
---

Tudom, hogy tartozom még mindenféle cikkel, ezért rangsorolnom kell őket, aszerint, hogy épp ![DiscontinuousNamespace](assets/uploads/2015/02/DiscontinuousNamespace.jpg)mennyire nagy a baj az adott területen vagy épp mennyire sürgető lenne megismerni olyan dolgokat, amik így 2015-ben a "zalapműveltséghez" tartoznak<del> bizonyos körökben.</del>

A címből gondolom már mindenki rájött, hogy most a <del>Pokolgép zenekar tündöklése és bukása</del> névterek kerülnek terítékre és mindaz, amit használatukkal és bevezetésükkel elérhetünk.

#### Mi is az a névtér?

Amikor valaki nekiáll programozni és sorban ontja magából az osztályokat, függvényeket, akkor lehet ő is belefutott már abba a problémába, amit névütközésnek nevezünk, miszerint ugyanazon névvel csak egy függvényt/osztályt lehet definiálni (még jó, különben runtime érkezési sorrendben hívódnának meg, mint a háziorvosnál). Ennek a kiküszöbölésére <del>variáljuk a függvényünk nevét kis- és nagybetűkkel, alsóvonásokkal</del> hozták létre még régebben a névterek fogalmát.

Amikor valaki nem használ névtereket, akkor is használja őket, illetve csak egyet, mégpedig a globális névteret, ami minden más névtér felett áll. A namespace-ek (igen, a névtér már kissé uncsi volt) arra szolgálnak, hogy ezt az ütközést elkerüljük és csoportosítsuk, rendszerezzük a kódunkat.

Deklaráljunk hát egy névteret!

```
<?php
namespace System;
class MeinClass {
}
```

Fontos megjegyezni, hogy névtereket mindig a fájl elején deklaráljunk, különben nyávogni fog a parser. Ez a névtér az egész fájlra érvényes lesz, ha egy fájlon belül több névtért szeretnénk deklarálni, akkor kapcsos zárójeleket használjunk a következő módon:

```
namespace System {
class MeinClass {}
}
namespace AnotherNamespace {}
```

Fentebb deklaráltunk egy System névre hallgató namespace-t és azon belül pedig egy MeinClass osztályt.

Ezt egyazon névtéren belül úgy szimplán a `MeinClass` névvel tudunk elérni, viszont a névtéren kívülről a `System\MeinClass`-al, amit úgy hívunk, hogy fully qualified classname.

> A globális névtérben deklarált osztályokat és függvényeket (kivéve a beépített függvényeket és eljárásokat) egy \\ prefixel tudjuk a névtéren belülről elérni. Vagyis ha a MeinClass-t a globális névtérben deklaráltuk, akkor a `System` névtéren belülről a `\MeinClass`-al tudjuk elérni. Erre kivételek hajigálásánál figyeljünk!

#### Kihasználni a névtereket

A névterek használatával szorosan összefügg a `use` kulcsszó. A use kulcsszóval tudjuk használatba venni/importálni az adott osztályt, amit a már előbb említett fully qualified classname-el kell megadni, vagyis minden névtér előtaggal együtt. Apropó, a névtereket lehet egymásba ágyazni, ilyen formán csomagokat, modulokat tudunk létrehozni magunk számára.

```
<?php 
namespace System\Nested\ReallyNested; // több névtért egymásba lehet ágyazni ám!
use OAuth2\Server;  // az OAuth2 névtérben található Server osztályt importáljuk, ami Server-ként érhető el.
use System\MeinClass as Mc; // az előbbi System névtérben található MeinClass-t importáljuk és egy álnévvel látjuk el, így a kód többi részében Mc-ként hivatkozhatunk rá.
```

> Importáláskor az autoloaderjeink (amik ugye vannak?) sietnek segítségünkre és megkapják az osztály nevét, a névterekkel együtt, ám escapelik a stringben szereplő backslash-t, így az autoloader a System\\\\MeinClass string-et fogja megkapni a fenti esetben.

Ha egy egyszerű autoloadert összedobunk a projektünk gyökerében (ami ugye egy index.php-t tartalmazó public folder felett van egy szinttel, ugye?) és az nemes egyszerűséggel így néz ki:

```
<?php
define('DS', DIRECTORY_SEPARATOR); oprendszere vállógatja
define('APP_ROOT', __DIR__. DS); // definiáltuk a gyökérkönyvtárat

spl_autoload_register('TestAutoload');

function TestAutoload($className) { // a fully qualified classname-t kapja meg
    $segments = explode("\\", $className);
    if (file_exists(APP_ROOT. implode(DS, $segments) . ".php" )) {
       include_once(APP_ROOT. implode(DS, $segments). ".php"); 
    } 
}
```

Akkor a System\\MeinClass-t a projektgyökere\\System\\MeinClass.php-ben fogja keresni. Ilyen formában a névtereinket és a könyvtárstruktúránkat szinkronba hozhatjuk.

Ezzel a projektenként újra és újra előforduló kódokat csoportosíthatjuk, csinálhatunk magunknak egyfajta standard library-t és oda gyűjtögethetjük azt. FQC = Fully qualified classname

```
- Module // az adott modul, netán projekt neve namespace Module;
| - Controller // namespace Module\Controller;
| | - AjaxController.php // FQC Module\Controller\AjaxController;
| | - FrontendController.php // FQC Module\Controller\FrontendController
| - Model // namespace Module\Model;
| | // Nem, ide nem kerülnek modulspecifikus modellek, itt jöhet a trükk
- System // namespace System;
| - Model // namespace System\Model;
| | - UserModel // FQC System\Model\UserModel;
| | - User // FQC System\Model\User
| - Db // namespace System\Db;
| | - DbAdapter // FQC System\Db\DbAdapter;
```

A view fájlokkal ez esetben nem foglalkozok, vegyük úgy, hogy a routerünk már ott is teremtett bennünket a FrontendControllerünkben.

```
<?php
namespace Module\Controller; 

use System\Model\UserModel; // importáltuk a UserModelt.
use System\Db\DbAdapter; // importáljuk az adatbázis adaptert

class FrontendController {

   public function indexAction() {
       $um = UserModel::getInstance(); // elérjük a usermodelt 
       $um->setAdapter(new DbAdapter($valamiDbConfig)); // és beállítjuk az adatbázis adaptert rajta
       try {
           $um->commitSuicide();
       catch (\Exception $e) { // \Exception-ként adtuk meg, mivel ha nem írjuk elé, akkor alapesetben az aktuális névtérre vonatkozik, tehát Module\Controller\Exception
           die('die, die my darling!');
       }
   } 

}
```

A fenti példában és könyvtárszerkezeten remélem jól látszik, hogy valójában mennyire egyszerű és praktikus a névterek használata. Létrehozhatunk portábilis kódrészleteket, amiket ha ugyanazon autoloadereket használunk, a többi projektből is pontosan ugyanúgy érünk el. Viszont vannak a fenti kódban csúnyaságok, ha már a dependency injection-t kitárgyaltam múltkor, de akkor ha több időm és energiám lesz, visszatérek a ServiceLocator-okkal!
