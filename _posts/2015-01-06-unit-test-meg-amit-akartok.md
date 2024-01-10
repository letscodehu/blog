---
id: 75
title: 'Unit test meg amit akartok'
date: '2015-01-06T22:52:15+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=75'
permalink: /2015/01/06/unit-test-meg-amit-akartok/
dsq_thread_id:
    - '3396773963'
    - '3396773963'
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
    - Advanced
    - Testing
tags:
    - green
    - php
    - phpunit
    - qunit
    - red
    - refactor
    - tdd
    - test
    - testing
    - unit
---

A [szoftverek tesztelésének](http://hu.wikipedia.org/wiki/Szoftvertesztel%C3%A9s) több fajtája van, amik közül néhányról azok is hallhattak már, akik igazából nem foglalkoznak fejlesztéssel ( Ilyen például a béta-tesztelés). Ellenben van egy tesztelési forma, ami szoros kapcsolatban áll a konkrét fejlesztéssel és végigköveti annak életciklusát.

> Ez pedig a unit testing.

#### Mi az a Unit?

Unit testing esetében a unit ( magyarul egység) az a legkisebb darabja a programnak, ami valami konkrét feladatot lát el. Esetünkben ez egy függvény/metódus. Minden egyes teszt egy ilyen kis darab működését (visszatérési érték, dobott kivételek) teszteli le különböző körülmények (paraméterek, stb.) között. [Unit testing](http://en.wikipedia.org/wiki/Unit_testing) során függetleníteni kell a többi, külső tényezőtől a tesztelni kívánt részletünket, ezért használunk ún. mock object-eket és hasonlókat, de erről majd később.

#### Assert

A programozási nyelvek többségében szerepel egy assert névvel (vagy éppen funkcióval) bíró függvény.

```
assert(TRUE);
assert(1==1);
```

Ezt leginkább egy `if - else` elágazáshoz lehetne hasonlítani, azzal az eltéréssel, hogyha itt logikai vizsgálat `false`-al zárul, akkor <del>a bulinak annyi,</del> a kódunk nem fog tovább menni. Ugyanis itt nem vizsgáljuk a dolgot, hanem kijelentünk valamit, aminek **úgy kell lennie**.

Unit tesztelés során a különböző egységeket ilyen módon vizsgáljuk, az egyes nyelvekre specifikus unit testing framework-ök segítségével (persze mi is összeügyeskedhetünk valami egyszerűbbet ). Php esetében ilyen lehet például a [PHPUnit](https://phpunit.de/), Javascript esetében pedig a [QUnit](http://qunitjs.com/). Ezeknek az installálásra nem térnék ki részletesebben, elég jól leírják a honlapjukon, inkább nézzünk egy tesztelni kívánt osztályt/metódust és egy arra írt tesztet.

```
 <?php

class ClassToBeTested {
     
     public function MeaningOfLife() { // ügyeljünk arra, hogy csak publikus függvényeket tudunk meghívni
          return 42;  
     }
}
```

Rémegyszerű a képlet, van egy osztályunk, azon belül van egy publikus metódusunk, ami nem vár paramétert és 42-t ad vissza. Nézzünk rá egy tesztet:

```
<?php

use PHPUnit_Framework_TestCase as TestCase; // a PHPUnit tesztesetét használjuk fel

class OurFirstTest extends TestCase { // és abból származtatjuk a tesztünket

        private $classToBeTested; //  

        public function setUp() { // ezt a metódust meghívja a PHPUnit a tesztek előtt
              $this->classToBeTested = new ClassToBeTested(); // az autoloaderek segítségével a ClassToBeTested.php fájlban fogja ezt keresni a framework
        }
        
        public function TestMeaningOfLife() {  
              $meaningOfLife = $this->classToBeTested->MeaningOfLife();
              $this->assertEquals(42,$meaningOfLife); // azt ellenőrzi, hogy a két paraméter egyenlő-e (csak '==', nem '===' !)
        }
}
```

A fenti kód a következőket csinálja, példányosítja az imént definiált osztályunkat, meghívja a MeaningOfLife metódusát és a visszatérési értéket pedig összeveti 42-vel. Mivel az 42 lesz, ezért a tesztünk sikeres. Persze ez egy nagyon lebutított példa, hiszen nem ennyi logika rejtezik 1-1 függvény mélyén.

#### TDD

A TDD rövidítés a [Test-Driven Development](http://en.wikipedia.org/wiki/Test-driven_development) fogalmat takarja, ami a szoftverfejlesztés egyik "műfaja". A lényegét egy képpel lehetne ábrázolni:![redgreenrefacor](assets/uploads/2015/01/redgreenrefacor-300x256.png)

A folyamat alapvetően három stádiumból áll, amiket a fejlesztés során ismétlünk. **Red-> Green -> Refactor.**

#### Mi a ... az a Red?

A red esetünkben a failing testre utal, ugyanis a unit teszteléskor a legtöbb keretrendszer valamiféle vizuális módon megjeleníti az eredményt és sikertelenség esetén pirossal jelöli azt. Ebből következik, hogy a zöld a sikeres teszt, a refaktorálást pedig akinek kell, annak nem most fogom elmagyarázni 🙂

> De miért sikertelen teszttel kezdünk?

A dolog roppant egyszerű és ebben rejlik a lényeg. TDD esetén a tesztek irányítják a programozás folyamatát. Írunk egy egyszerű, egy igazán egyszerű tesztet. Mivel semmi nincs mögötte, nincs kész az osztály, amit tesztelünk, ezért a teszt sikertelen lesz (már ha egyáltalán lefut). Ez a **red.**

Ezután megnyitjuk a programunkat és elkészítjük az adott osztályt, és a hozzá tartozó metódust úgy, hogy az a tesztet kielégítse. Lefuttatjuk újra a tesztet... siker. **Green.**

Ezután pedig végignyálazzuk a kódunkat, ismétlődésekre vadászva, hiszen ahol ismétlődés van, ott lapul egy "minta", ott valamit össze lehet vonni, stb. **Refactor.**

A folytatásban végigvesszük a folyamatot és írunk TDD-módra egy római szám -> arab szám konvertáló programot.
