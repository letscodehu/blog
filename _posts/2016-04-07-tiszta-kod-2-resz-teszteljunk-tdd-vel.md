---
id: 663
title: 'Tiszta kód, 2. rész: teszteljünk TDD-vel!'
date: '2016-04-07T07:08:07+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=663'
permalink: /2016/04/07/tiszta-kod-2-resz-teszteljunk-tdd-vel/
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
    - '6445'
avada_post_views_count:
    - '6454'
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
    - 'a:2:{s:56:"//www.letscode.huassets/uploads/2016/04/tdd.001.png";a:2:{s:2:"id";i:710;s:11:"source_type";s:13:"media-library";}s:79:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2016/04/29122807/tdd.001.png";a:2:{s:2:"id";i:710;s:11:"source_type";s:13:"media-library";}}'
image: 'assets/uploads/2016/04/29122814/26070869_m_cropped.jpg'
categories:
    - Fejlesztés
tags:
    - 'clean code'
    - tdd
    - 'unit testing'
---

Az [előző részben](/tiszta-kod-1-resz-teszteljek-vagy-ne-teszteljek/) arról értekeztünk, hogy egyáltalán miért érdemes tesztelni. Ebben a részben bele is vágunk a kellős közepébe és megnézzük, hogy hogyan is zajlik egy egységteszt írása.

## Az eszközkészlet

\[fusion\_tabs design="classic" layout="horizontal" justified="yes" backgroundcolor="" inactivecolor="" bordercolor="" class="" id=""\]  
\[fusion\_tab title="PHP" icon=""\]  
PHP-ban a defacto szabvány eszköz a tesztelésre a [PHPUnit](https://phpunit.de/), amit vagy PHAR formátumban tölthetünk le, vagy pedig hozzáadhatjuk a projektünkhöz composerrel:

```
composer require --dev phpunit/phpunit
```

Ezenfelül szükségünk lesz még egy phpunit.xml-re, amiben meghatározzuk, hol is keressük a teszteket:

```
<phpunit
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="http://schema.phpunit.de/5.1/phpunit.xsd"
    bootstrap="vendor/autoload.php"
>
    <!-- Ha nem hasznalunk composert, a fenti bootstrap sort le kell cserelni a sajat autoloaderunkre. -->
    <testsuites>
        <testsuite name="all">
            <!-- Itt adjuk meg a teszt konyvtarunkat -->
            <directory suffix=".php">tests</directory>
        </testsuite>
    </testsuites>
    <filter>
        <whitelist>
            <!-- Ide irjuk be a forraskod konyvtarunkat -->
            <directory suffix=".php">src</directory>
        </whitelist>
    </filter>
    <logging>
        <!-- Ha szeretnenk csinos riportokat a tesztekrol, azokat itt adhatjuk meg. -->
        <log type="coverage-html" target="build/logs/coverage.html" />
        <log type="coverage-clover" target="build/logs/clover.xml" />
    </logging>
</phpunit>
```

Ezek után nincs más dolgunk, mint lefuttatni a projekt könyvtárunkban a phpunitot. Persze még nincs tesztünk, de ezt azonnal pótoljuk.

Tegyük fel, hogy van egy Circle osztályunk:

```
class Circle {
    private $radius;

    public function __construct($radius) {
        $this->radius = $radius;
    }

    public function getArea() {
        return pow($this->radius, 2)*pi();
    }
}
```

Nincs más dolgunk, mint létrehozni hozzá egy tesztet:

```
class CircleTest extends PHPUnit_Framework_TestCase {
    public function testGetArea() {
        $testCircle = new Circle(3);
        
        $this->assertEquals($testCircle->getArea(), 9*M_PI);
    }
}
```

Mint látható, itt definiáltunk egy olyan tesztet, ami a kör területének kiszámítását ellenőrzi. Ha lefuttatjuk a phpunitot, ezúttal látnunk kellene a teszt sikeres végrehajtását.

Mint mindent, ezt is gyakorolni kell, de a tesztek írása nem túl nehéz feladat.  
\[/fusion\_tab\]  
\[fusion\_tab title="Java" icon=""\]  
A Java világban több lehetőséged is van, ha unit tesztelésre adnád a fejed. A két leggyakoribb a jUnit, és a TestNG. Hogy melyik jobb, az hitéleti vita kérdése, a két framework működése nagyon hasonló, mi most a testNG-t fogjuk használni.

Ha Mavent használsz, elég hozzáadni a dependenciákhoz a pom.xml-ben a testNG-t, és már használhatod is:

```
<dependency>
  <groupId>org.testng</groupId>
  <artifactId>testng</artifactId>
  <version>6.8</version>
  <scope>test</scope>
</dependency>
```

Gradle esetén:

```
'org.testng:testng:6.8'
```

Ha IDE-ből szeretnéd futtatni a tesztjeidet, Eclipse-ben használhatod az Eclipse TestNG plugint:  
http://marketplace.eclipse.org/marketplace-client-intro?mpc\_install=1549

IntelliJ-ből használva pedig semmi egyéb dolgod nincs, csak meg kell kérned szépen, hogy szerezzen be egy legfrissebb jar-t a nagy internetről, és már működik is... 🙂

Tegyük fel, van egy Circle osztályunk.

```
package com.example;

public class Circle {
    private final Double radius;

    public Circle(Double radius) {
        this.radius = radius;
    }

    Double getArea() {
        return Math.pow(radius, 2)*Math.PI;
    }
}
```

Nincs más dolgunk, mint létrehozni hozzá egy tesztet:

```
package com.example;

import static org.testng.Assert.*;
import org.testng.annotations.Test;

public class CircleTest {
    @Test
    public void testGetArea() throws Exception {
        Circle testCircle = new Circle(3);
        
        assertEquals(testCircle.getArea(), 9*Math.PI);
    }
}
```

Mint látható, itt definiáltunk egy olyan tesztet, ami a kör területének kiszámítását ellenőrzi.

Definiálthatunk egy XML-t, amiben leírjuk a futtatandó teszteket testng.xml néven (az intelliJ vagy az Eclipse ezt megteszi helyettünk).

```

<suite name="Test Suite 1" verbose="1">
  <test name="UnitTests" >
    <packages>
      <package name="com.example" />
    </packages>
  </test>
</suite>
```

Futtatva (mvn verify, vagy IDE-ből Run as TestNG test) az alábbi eredményt kapjuk:

```
[TestNG] Running:
  testng.xml

===============================================
Default Suite
Total tests run: 1, Failures: 0, Skips: 0
===============================================


Process finished with exit code 0
```

Mint mindent, ezt is gyakorolni kell, de a tesztek írása nem túl nehéz feladat.  
\[/fusion\_tab\]  
\[/fusion\_tabs\]

## A jó tesztek titka

Had áruljak el egy hatalmas titkot: semmilyen titok nincs a jó tesztek mögött. Ha van egy függvényed, és tudod, hogy mit kellene csinálnia, pontosan úgy írod meg a tesztet, mintha rendesen használnád. Végül pedig a visszatérési értéket ellenőrzöd. Gondolkozni kell rajta, de semmi olyan nincs benne, amit ne csinálnánk nap mint nap.

**A titok nem a tesztekben, hanem a tesztelhető kód írásában keresendő.**

Felmerül a kérdés, hogy vajon mi akadályozza meg a tesztek írását?

Ha egy osztályt írunk, azt szeretnénk “körbetesztelni„. Ez azt jelenti, hogy kizárólag a tesztelendő osztályt szeretnénk tesztelni, függetlenül a mögötte levő funkcionalitástól. Ha például a kérdéses osztály egy adatbázist használ, szeretnénk "kiiktatni" az adatbázist, és anélkül tesztelni.

Ezzel szinte már meg is válaszoltuk a kérdést: **a jól tesztelhető kód leválasztható a mögöttes működéstől**.

Ezt a fajta leválasztást többféleképpen is elérhetjük. A legegyszerűbb példa, ha ahelyett, hogy a konstruktorban hozzuk létre az adatbázis kapcsolatot, ezt külön bekérjük paraméterként:

Vagyis ehelyett:

```
class MyBusinessObject {
    private DatabaseConnector db;
    public function MyBusinessObject() {
        this.db = new DatabaseConnector();
    }
}
```

Haszáljuk ezt:

```
class MyBusinessObject {
    private DatabaseConnector db;
    public MyBusinessObject(DatabaseConnector db) {
        this.db = db;
    }
}
```

Ez persze felvet egy kód-menedzsment problémát: hogyan kezeljük az átadandó osztályokat? Hogyan oldjuk meg, hogy ne kelljen kézzel átadogatni mindent? Erre adhatnak megoldást a különböző [Dependency Injection Containerek](https://www.refaktor.hu/tiszta-kod-7-resz-mi-a-fene-az-a-dependency-injection-container/), de ez [egy másik cikk témája lesz](https://www.refaktor.hu/tiszta-kod-7-resz-mi-a-fene-az-a-dependency-injection-container/).

## A tesztvezérelt fejlesztés

Tegyük fel, hogy van egy projektünk, amin elhatározzuk, hogy tesztekkel fejlesztünk. Megírjuk a kódot, majd megírjuk a tesztet... vagyis, ha őszinték vagyunk magunkkal, azt hazudjuk, hogy majd ha időnk lesz, írunk tesztet, ami soha nem következik be. Szóval ez igazából nem jó módszer.

Helyette érdemes megnézni a mostanában elterjedő, elsőre meglehetősen nagy badarságnak hangzó módszert: először írunk tesztet. Más néven a tesztvezérelt fejlesztést (TDD).

> ### A TDD három szabálya
> 
> 1. Csak akkor írhatsz éles kódot, ha van egy teszt, amit ki szeretnél javítani.
> 2. Csak annyi tesztkódot írhatsz, hogy pontosan egy hibát idézz elő.
> 3. Legfeljebb annyi éles kódot írhatsz, hogy az éppen hibára futó teszt megjavuljon.

Magyarán hogy is működik ez a TDD?

![tdd.001](assets/uploads/2016/04/29122807/tdd.001.png)

1. Írunk egy rövid tesztet, ami egy alap funkcionalitást tesztel. Ez hibára fog futni, hiszen nincs kód, ami alapján a teszt lefuthatna. Nagyon fontos, hogy ezt a tesztet ténylegesen le is futtassuk, hiszen csak így látjuk, hogy a teszt tényleg hibára fut-e, azaz a teszt helyes-e?
2. Megírjuk azt a minimális kódot, ami ahhoz sükséges, hogy a teszt átmenjen. Ha ez pusztán annyi, hogy visszatérünk egy fix értékkel, akkor csak és kizárólag ennyi kódot írunk.
3. A már megírt tesztekben bízva refaktoráljuk, egyszerűsítjük a meglevő kódot.
4. Vissza az elejére.

Nézzünk egy buta egyszerű példát, számoljunk [Fibonacci sort](https://hu.wikipedia.org/wiki/Fibonacci-sz%C3%A1mok) TDD-vel.

\[fusion\_tabs design="classic" layout="horizontal" justified="yes" backgroundcolor="" inactivecolor="" bordercolor="" class="" id=""\]  
\[fusion\_tab title="PHP" icon=""\]  
A TDD szabályai szerint először létrehozom a teszt osztályomat az első tesztemmel:

```
class FibonacciTest {
    public function testFibonacci() {
        $myFibonacci = new Fibonacci();
        $this->assertEquals(0, $myFibonacci->fibonacci(0));
    }
}
```

Ha ezt most megpróbálom lefordítani, hibára futok, tehát létrehozom a Fibonacci osztályt a lehető legegyszerűbb tartalommal:

```
class Fibonacci {
    public function fibonacci(int n) {
        return $n;
    }
}
```

Miután a 0 Fibonacci száma 0, ezért a teszt futtatás után sikeres lesz. Refaktorálni pedig nincs mit, így lépjünk tovább, írjunk egy újabb tesztet.

```
$this->assertEquals(1, $myFibonacci->fibonacci(1));
```

Ha megnézzük, ez még mindig jó, tehát tovább vihetjük a tesztet:

```
$this->assertEquals(1, $myFibonacci->fibonacci(2));
```

Na itt már hibát jelez a teszt, ezért most már dolgunk van:

```
public function fibonacci($n) {
    if ($n <= 1) {
        return $n;
    } else {
        return 1;
    }
}
```

Túl szájbarágósnak, macerásnak tűnik? Lehet, de a való életben ennél bonyolultabb feladatok várnak, nézzük tehát tovább. A teszt lefut, ezért most újabb teszt következik:

```
$this->assertEquals(2, $myFibonacci->fibonacci(3));
```

Megint nem fut le a teszt, ezért megint kiegészítjük a függvényünket:

```
public function fibonacci($n) {
    if ($n <= 1) {
        return $n;
    } else if ($n == 2) {
        return 1;
    } else {
        return 2;
    }
}
```

Erre megint le fog futni a teszt, ám itt most bejön a plusz lépés, a refaktorálás. Észrevehetjük, hogy a 2-nél a visszatért érték 1, 3-nál pedig 2. Naívan megpróbálunk egyszerűsíteni:

```
public function fibonacci($n) {
    if ($n <= 1) {
        return $n;
    } else {
        return $n-1;
    }
}
```

A teszt még mindig lefut, ezért most megint további tesztet írunk:

```
$this->assertEquals(3, $myFibonacci->fibonacci(4));
```

A teszt még mindig lefut, ezért megint tovább dolgozunk:

```
$this->assertEquals(5, $myFibonacci->fibonacci(5));
```

Na itt megint bajban vagyunk, ezért naívan megint kiegészítjük a függvényünket:

```
public function fibonacci($n) {
    if ($n <= 1) {
        return $n;
    } else if ($n < 5) {
        return $n-1;
    } else {
        return $n;
    }
}
```

Na ezen a ponton már többe kerül a lustaságunk, mint rendesen megírni a programot, ezért itt most bevetjük a refaktorálást, hiszen van elég teszt esetünk arra, hogy ne tegyünk tönkre a kódot. Átírjuk a fibonacci függvényünket:

```
public function fibonacci($n) {
    if ($n <= 1) { return $n; } else { return $this->fibonacci($n-1) + $this->fibonacci($n - 2);
    }
}
```

\[/fusion\_tab\]  
\[fusion\_tab title="Java" icon=""\]  
A TDD szabályai szerint először létrehozom a teszt osztályomat az első tesztemmel:

```
package org.refaktor;

import org.testng.annotations.Test;
import static org.testng.Assert.*;

public class FibonacciTest {
    @Test
    public void testFibonacci() {
        Fibonacci myFibonacci = new Fibonacci();
        assertEquals(myFibonacci.fibonacci(0), 0);
    }
}
```

Ha ezt most megpróbálom lefordítani, hibára futok, tehát létrehozom a Fibonacci osztályt a lehető legegyszerűbb tartalommal:

```
package org.refaktor;

public class Fibonacci {
    public int fibonacci(int n) {
        return n;
    }
}
```

Miután a 0 Fibonacci száma 0, ezért a teszt futtatás után sikeres lesz:

```
[TestNG] Running:
  temp-testng-customsuite.xml

===============================================
Default Suite
Total tests run: 1, Failures: 0, Skips: 0
===============================================
```

Refaktorálni nincs mit, így lépjünk tovább, írjunk egy újabb tesztet.

```
assertEquals(myFibonacci.fibonacci(1), 1);
```

Ha megnézzük, ez még mindig jó, tehát tovább vihetjük a tesztet:

```
assertEquals(myFibonacci.fibonacci(2), 1);
```

Na itt már hibát jelez a teszt, ezért most már dolgunk van:

```
public int fibonacci(int n) {
    if (n <= 1) {
        return n;
    } else {
        return 1;
    }
}
```

Túl szájbarágósnak, macerásnak tűnik? Lehet, de a való életben ennél bonyolultabb feladatok várnak, nézzük tehát tovább. A teszt lefut, ezért most újabb teszt következik:

```
assertEquals(myFibonacci.fibonacci(3), 2);
```

Megint nem fut le a teszt, ezért megint kiegészítjük a függvényünket:

```
public int fibonacci(int n) {
    if (n <= 1) {
        return n;
    } else if (n == 2) {
        return 1;
    } else {
        return 2;
    }
}
```

Erre megint le fog futni a teszt, ám itt most bejön a plusz lépés, a refaktorálás. Észrevehetjük, hogy a 2-nél a visszatért érték 1, 3-nál pedig 2. Naívan megpróbálunk egyszerűsíteni:

```
public int fibonacci(int n) {
    if (n <= 1) {
        return n;
    } else {
        return n-1;
    }
}
```

A teszt még mindig lefut, ezért most megint további tesztet írunk:

```
assertEquals(myFibonacci.fibonacci(4), 3);
```

A teszt még mindig lefut, ezért megint tovább dolgozunk:

```
assertEquals(myFibonacci.fibonacci(5), 5);
```

Na itt megint bajban vagyunk, ezért naívan megint kiegészítjük a függvényünket:

```
public int fibonacci(int n) {
    if (n <= 1) {
        return n;
    } else if (n < 5) {
        return n-1;
    } else {
        return n;
    }
}
```

Na ezen a ponton már többe kerül a lustaságunk, mint rendesen megírni a programot. Ezért itt most bevetjük a refaktorálást, hiszen van elég teszt esetünk arra, hogy ne tegyük tönkre a kódot. Átírjuk a fibonacci függvényünket:

```
public int fibonacci(int n) {
    if (n <= 1) {
        return n;
    } else {
        return fibonacci(n-1) + fibonacci(n - 2);
    }
}
```

\[/fusion\_tab\]  
\[/fusion\_tabs\]

Ezen a ponton – jogosan – elgondolkozhatunk azon, hogy vajon nem volt-e ez egy picit túl sok erőlködés egy egyszerű Fibonacci számsor előállításához, hiszen a képletet ismerjük? És a válasz az, hogy: de.

## A TDD előnyei és következményei

### Sebesség

Elsőre ellentmondásosnak tűnhet, de TDD-vel fejleszteni – némi gyakorlás után – gyorsabb, mint TDD nélkül. Miért is van ez így?

Ha egy, a fentinél kicsit bonyolultabb példát veszünk, akkor sokszor előfordul, hogy minden igyekezetünk ellenére nem sikerül az összes sarokpontot fejben tartani. Vagy még fejlesztés közben jövünk rá, hogy valamit elhibáztunk, és utána debugolni kell, vagy ami rosszabb, éles környezetben.

Ha szeretnél erről megbizonyosodni, érdemes egy alapvető algoritmust implementálni, időre. Ilyen lehet például egy rendező algoritmus, vagy egy keresés egy bonyolultabb adatstruktúrában. Vajon melyikkel van jobb esélyünk több esetet lekezelni? És melyikkel leszünk gyorsabban készen?

### Megszakítások

Nem tudom, hogy Te, kedves Olvasó, milyen munkahelyen dolgozol. Nálam szerencsésnek mondható az a nap, amikor nem szeretnének pár percenként megszakítani, és van egy szabad fél órám valamit implementálni.

Ha TDD-vel dolgozom, szó szerint 30 másodpercre vagyok a következő stabil állapottól, és ezzel együtt a következő commit lehetőségtől. Nem kell feltétlenül beküldenem a változásaimat a verziókezelő rendszerbe, de akár be is küldhetném 30 másodpercenként. Ha ezzel szemben a teszteket utólag írom, a gyakori megszakításokkal jó eséllyel el fogok felejteni valamit, vagy rosszabb esetben meg sem írom a teszteket.

### Stabilitás

A tesztvezérelt fejlesztés rákényszerít arra, hogy előbb gondolkozzunk. Ha betartjuk a szabályokat, esélyünk sincs csak úgy nekiülni kódolni. Gondolkoznunk kell egy pillanatot, hogy mit is szeretnénk ettől a szerencsétlen függvénytől vagy osztálytól, és hogy a fenébe fogjuk ezt letesztelni? Ezenfelül kénytelenek vagyunk a programunkat szépen darabokra szabdalni, és lehetőséget teremteni arra, hogy belenyúljunk a mögöttes működésbe.

Ha a jövőt nézzük, akkor biztosak lehetünk abban, hogy minden funkcionalitásra született valami többé-kevésbé értelmes teszt. Tehát ha módosítani szeretnénk valamit, és ezzel elrontunk egy már meglevő működést, akkor azt jó eséllyel valamilyen teszt megfogja. (Gondoljunk csak bele, ha TDD-vel fejlesztünk, elvileg nem születhet olyan kódsor, amire nincs teszt.) Ez persze nem zárja ki azt, hogy valaki gyenge minőségű tesztet ír, de egészen biztosan jobb, mint ha egyáltalán nem írna tesztet.

### A tesztjeid dokumentálják a kódodat

Ha belegondolsz, a tesztjeid tulajdonképpen semmi mást nem csinálnak, mint működő példákat adnak arra, hogy hogyan kell használni az általad írt kódot. Ha jól csinálod, megúszod a doksi írás egy részét is.

## A TDD veszélyei

A TDD-nek - mint szinte mindennek - vannak veszélyei, és vannak olyan dolgok, amik a TDD-re jelentenek veszélyt.

### Hosszú teszt futás

Szinte egyértelmű: ha hosszúak a tesztfutásaink, akkor nem fogunk tudni 30 másodperces TDD ciklust tartani. Itt érdemes megvizsgálni, hogy miért is olyan hosszúak a tesztjeink? Túl sok komponenst tesztelünk egyszerre? Esetleg túlságosan sok az összenövés az alkalmazásunkban, és nem tudunk elég kis rétegeket tesztelni? Nem egységteszteket próbálunk futtatni a TDD ciklusban?

Ezek mind-mind intő jelek arra, hogy nem csak a TDD-vel, hanem az egész fejlesztési módszertanunkkal bajok vannak. Ha túl nagyok a darabok, azok nem csak nehezen tesztelhetőek, hanem komplexek is. A komplexitás pedig erősen összefügg a hibalehetőségekkel.

### Alacsony lefedettség, hibázó tesztek

Ahhoz, hogy a TDD működjön, meg kell tudnunk bízni a tesztjeinkben. Ha a kód túlnyomó része nincs lefedve tesztekkel, vagy rendszeresen futnak hibára olyan tesztek, amiknek működnie kellene (például külső függőségek miatt), akkor nem fogunk megbízni a tesztekben. Ez pedig azt eredményezi, hogy nem fogunk olyan bátorsággal nekiesni a kért módosításoknak, mint amilyennel kellene. Így pedig a tesztek írása tulajdonképpen időpocsékolás.

## A következő részben

Miután most már többször szó volt arról, hogy a kódunkat a tesztelhetőség és átláthatóság érdekében érdemes jól szervezni, a következő részben a [SOLID alapelvek](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)) első elemével kezdünk el foglalkozni: az egy felelősség elvével.