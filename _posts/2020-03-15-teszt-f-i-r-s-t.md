---
id: 2186
title: 'Teszt F.I.R.S.T'
date: '2020-03-15T18:12:44+01:00'
author: tacsiazuma
layout: post
guid: '/?p=2186'
permalink: /2020/03/15/teszt-f-i-r-s-t/
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2020/03/15132931/time-lapse-photo-of-railway-2622848.jpg'
categories:
    - Intermediate
    - Testing
tags:
    - first
    - guide
    - test
---

Automata teszteket írni szinte bárki tud. Jó teszteket írni viszont már közel sem. Na de mégis mitől lesz egy adott teszt jó? Itt nyílván elővehetnénk a tesztlefedettséget, netán azt, hogy mutációs tesztekkel is mennyire jó metrikákat tudunk produkálni, azonban ezek közel sem fogják azt jelenteni, hogy ez az adott teszt tényleg jó. Sokan próbálták már korábban is meghatározni ezt valahogy, de objektív, mérhető módon még nem sikerült. Én sem próbálom a Szent Grált megmutatni, csupán az egyfajta irányelvet, ami segíthet a tesztjeink szebbé tételében.

Ez úgynevezett F.I.R.S.T. betűszó lesz, ami a fast, isolated, repeatable, self-validating és timely-t takarja. Ha ezeket lefordítjuk, akkor azt kapjuk, hogy gyors, izolált, ismételhető, önmagát validáló és időben készül. Fontos megjegyezni, hogy ezek leginkább unit tesztekre érvényesek, de némelyikük magasabb szintekre is érvényes. Vegyük őket sorra!

**F - Fast**

A tesztjeinknél fontos, hogy legyenek gyorsak. A blogon korábban volt szó a mutációs tesztekről és ott láttuk, hogy azok bizony jóval tovább tartottak az esetünkben, mint mikor szimplán PHPUnit segítségével lefuttattuk azokat és még közel sem volt sok tesztünk.

Harminc tesztre volt négy és fél másodperc, na most akkor képzeljük el mindezt háromezer tesztre. Megközelítőleg hét és fél percig tartana. Na most képzeljük el, hogy a simán PHPUnitból futtatott tesztjeink is eddig tartanak. Nyílván nem mindig fogjuk az összes tesztünket lefuttatni, viszont minél tovább tart a tesztek lefuttatása, annál kevesebbszer tudjuk azokat lefuttatni a napi 8 órában, és annál kevesebb kedvünk is lesz ahhoz, hogy lefuttassuk azokat. Ha TDD-zünk akkor lehet bekötünk egy fájl watchert, ami változáskor újrafutattja a tesztjeinket, netán gyorsbillentyűt állítunk be, ami kb. a másodperc törtrésze alatt visszajelez nekünk, hogyha lefutottak a tesztek, ugyanis most MÉG milliszekundumok alatt futnak le. Maradjon is így. Nyílván ahogy nő a tesztek száma, ez is felkúszik és elérheti az 1-2 másodpercet, nagyobb projekteknél akár többet is.

Integrációs tesztek esetében mindez jóval lassabb is lehet, ha pl. külső szolgáltatót hívunk és egyebek, de azokat nem futtatjuk olyan gyakran. A lényeg, hogy törekedjünk ezek gyorsaságára. Refaktorálunk? Kiemelünk valamit, átrakjuk máshova, újrafuttatjuk a teszteket, ha jó mehetünk tovább. Ha ez másodpercekig tart, akkor nem így fogunk tenni. Ha lassúak lesznek, nem fogjuk őket futtatni, mert nem akarjuk kivárni, vagy csak ritkán, amikor már átírtuk az egész kódot. Ha ekkor eltörik valamit, már lehet az IDE se fog emlékezni arra a sok lépésre, mi meg revertálhatunk az utolsó commitig, ami.. mikor is volt?

**I - Isolated**

A következő fontos elem, hogy izoláltak a tesztjeink. Ez két dolgot is jelent. Az egyik, hogy a tesztjeink egy izolált problémát vizsgálnak. Amikor ránézünk, akkor nem kell perceket gondolkozni azon, hogy mi is romlott el, mert a teszt nevéből vagy az assertion-ök típusából/szövegéből világossá válik mi is a probléma. Ha egy tesztben nem világos, hogy mi is a gond mikor eltörik, több különálló dolgot is vizsgál, akkor jobban járunk, ha lecseréljük több, apróbb, specifikusabb teszttel.

Tegyük fel, hogy írunk egy római szám átalakítót, ami arab számokból római számokat készít. Ebben szerepel egy szimpla validáció, hogy csak akkor kezdjünk el dolgozni, ha az átadott praméter nullánál nagyobb szám (nyílván típusdefiníciókkal könnyebb az élet):

```
<pre class="wp-block-preformatted">private function validate($arabic) {<br></br>    if (!is_numeric($arabic) || $arabic < 1) {<br></br>        throw new \InvalidArgumentException();<br></br>    }<br></br>}
```

Minden egyes tesztesetre külön-külön metódusokat hozunk létre, amiknek a nevében is benne van, hogy mit vár az adott esetben.

```
<pre class="wp-block-preformatted"><em>/**<br></br></em><em>* </em><strong><em>@test<br></br></em></strong><em>* </em><strong><em>@expectedException </em></strong><em>InvalidArgumentException<br></br></em><em>*/<br></br></em>public function it_should_throw_exception_on_negatives() {<br></br>    $this->underTest->convert(-1);<br></br>}<br></br><br></br><em>/**<br></br></em><em>* </em><strong><em>@test<br></br></em></strong><em>* </em><strong><em>@expectedException </em></strong><em>InvalidArgumentException<br></br></em><em>*/<br></br></em>public function it_should_throw_exception_on_zero() {<br></br>    $this->underTest->convert(0);<br></br>}<br></br><br></br><em>/**<br></br></em><em>* </em><strong><em>@test<br></br></em></strong><em>* </em><strong><em>@expectedException </em></strong><em>InvalidArgumentException<br></br></em><em>*/<br></br></em>public function it_should_throw_exception_on_strings() {<br></br>    $this->underTest->convert("test");<br></br>}<br></br>
```

Mi van akkor, ha itt nem vacakolunk külön tesztekkel, hanem összedobjuk őket egybe, hiszen a kódismétlés rossz és hát minél könnyebben bővíthetővé akarjuk tenni a kódot:

```
<pre class="wp-block-preformatted"><em>/**
 * </em><strong><em>@test
</em></strong><strong><em> </em></strong><em>*/
</em>public function test_validation() {
    $params = [-1, 0, "test"];
    $count = 0;
    foreach ($params as $param) {
        try {
            $this->underTest->convert($param);
        } catch(InvalidArgumentException $ex) {
            $count++;
        }
    }
    $this->assertEquals($count, count($params));
}
```

Amikor eltörik, akkor ezt látjuk majd:

`1) RomanNumberConverterTest::test_validation<br></br> Failed asserting that 2 matches expected 3.`

Sem az assert, sem a metódus neve nem sokat segít, hogy mivel is lehet pontosan a gond. Utána valamit átírunk a kódon, újrafuttatjuk a tesztet és most azt látjuk, hogy ugyanaz a metódus hibás, de lehet itt másik "eset" tört el, már ha ezt kiszúrjuk a kódsorokból. A unit tesztek esetében izoláljuk a tesztelendő elemeket, amennyire tudjuk.

A másik, hogy az egyes tesztek nem függenek egymástól, sem a tesztek futásának sorrendjétől. Tehát nincs köztük olyan állapotátvitel, ami miatt, ha az egyik tesztet valamiért később futtatjuk egy másiknál, akkor az eltörik. A tesztek futásának sorrendje nem garantált, kivéve ha rendelkezünk erről is (ezt főleg UI tesztek esetében szokták), tehát nem feltételezhetjük, hogy jó sorrendben fognak lefutni. Nézzünk egy példát!

Habár az epizód elején említettem, hogy leginkább unit tesztekre érvényesek a fentiek, most mégis egy integrációs tesztet nézzünk. Tegyük fel, hogy van egy `OrderRepository` osztályunk, ami a rendszerben található megrendelések létrehozásáért és lekérdezéséért felelős. Emögött tesztek alatt egy SQLite adatbázis fut. Két legyet akarunk ütni egy csapásra, ezért egy tesztben megnézzük, hogy létre tudunk hozni, a másik tesztben pedig azt, hogy le tudjuk-e kérdezni az előzőleg létrehozott elemet. Ha jó sorrendben futnak a tesztek, akkor minden klappol, hiszen ott lesz az adatbázisrekord. Na de mi van akkor, ha először a lekérdezés fut le, utána pedig a létrehozás? Bizony eltörik, pedig lehet csak a Béla rakta ABC sorrendbe a metódusokat a tesztben. Ezért inkább oldjuk meg, hogy minden egyes tesztünk egyfajta izolált környezetben indul, jelen esetben mind egy üres táblával kezd (mert kiürítjük azt, netán droppoljuk), aztán az egyes teszteknél oldjuk meg azt, hogy minden tábla ott legyen, benne azzal ami az adott teszt futásához szükséges. Természetesen, ha pl. mindhez kell valami state, akkor az kerülhet a `before` részekbe.

**R - Repeatable**

Ez eléggé magától értetődik. A lényeg, hogy a tesztet akárhányszor, akármikor, bármilyen csillagállás alatt lefuttatva ugyanazt az eredményt fogjuk kapni. Na de mégis hol jöhetne ez elő? Az egyiket már korábban említettük. Ha a tesztjeink egymástól függnek és véletlenül a sorrend úgy alakul, akkor bizony az problémát okozhat, hiszen különböző sorrendben lefutva különböző eredmények születnek. Viszont ezt leszámítva is lehet problémánk ebből. A lényeg, hogy a teszt nem feltételezhet semmiféle környezeti változót, valamint nem hagyhat nyomot maga után. Az előbbire egy igen jó példa az idő. Nagyon könnyű olyan tesztet csinálni, ami pl. feltételezi, hogy 2020 van, de 2021-től már eltörik. A másodikra már hoztunk példát, de ide tartoznak még a külső rendszerek is. A tesztünk nem függhet attól, hogy most épp működik-e a hálózat vagy sem. A unit tesztek NEM tesztelnek külső rendszereket, ezeket a már korábbi cikkekben említett módon kicseréljük stubokra/mockokra.

**S - Self-validating**

Az S, azaz self-validating, magyarul önmagát validáló. Habár eléggé egyértelmű a név, azért menjünk kicsit utána. Ez azt jelenti, hogy semmilyen utólagos vizsgálat nem kell, hogy megbizonyosodjuk tényleg hiba nélkül lefutottak a tesztek. Vagy sikerült, vagy nem, nincs köztes állapot. Tehát nem csak kiíratjuk a konzolra valaminek az eredményét, hogy aztán utólag ellenőrízzük azt, hanem assertálunk egy értékre. Ha annak megfelel, akkor a teszt átment, ha nem akkor pedig nem sikerült a teszt. Nincs olyan, hogy ránézünk az értékre és azt mondjuk: "áh, ez csak fals pozitív, hiszen csak azért nem egyezik a két dátum, mert épp átbillent a rendszeridő a következő másodpercre", mert aztán 2, 3, 30 ilyen lesz a kódban és mikor futtatjuk a tesztjeinket, egyesével nézegethetjük, hogy épp melyik valós probléma.

**T - Timely**

Erről megoszlanak a vélemények, de a legjobb esetben a teszt már azelőtt elkészül, mint a kód, amivel kizöldítjük azt. Ez mind a TDD-ben, mint pedig a test first megoldásban is szerepel. Persze mondhatjuk, hogy nem számít mikor készül, amíg elkészül, de amikor előre írjuk a tesztet, sokminden megváltozik. Ha utólag készülne, akkor a fejlesztőnek szinte az első dolga az lesz, hogy refaktorálja addig, amíg a fenti elveknek meg nem felel. Emiatt általában kevesebb és nagyobb tesztet fog írni, amik végül sorra szembe mennek a fenti elveknek.

Sokaknak persze mindez csupán józan paraszti ész kategória, de okkal születtek, ugyanis a tesztelés mind a mai napig egy olyan sarkallatos pontja a fejlesztésnek, ahol rengetegen csak tapogatóznak.