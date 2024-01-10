---
id: 119
title: 'PHP OOP &#8211; Absztrakt osztályok és interfészek'
date: '2015-01-19T12:25:39+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=119'
permalink: /2015/01/19/php-oop-absztrakt-osztalyok-es-interfeszek/
dsq_thread_id:
    - '3434386149'
    - '3434386149'
categories:
    - Intermediate
    - PHP
tags:
    - abstract
    - interface
    - oop
    - öröklődés
    - php
---

Az előző OOP részben átvettük hogyan is kell osztályokat definiálni, példányosítani, valamint az access modifier kulcsszavakat. Mostani részünkben az absztrakt osztályokat és interfészeket vesszük górcső alá és vizsgáljuk meg, hogy mi célt is szolgálnak, példákon keresztül. A példák ismét PHP nyelven keresztül lesznek bemutatva. Ellenben mielőtt belevetnénk magunkat e két téma taglalásába, előtte tisztáznunk kell pár dolgot.

#### Öröklődés

Az előző cikkben szó volt a `protected `access modifier-ről, ahol említettem, hogy az osztály ön maga és a "gyermekosztályok" férnek hozzá az adott property-hez. Okkal merül fel a kérdés, hogy

> Mi a \*\*\*\*\*\* az a gyermekosztály? Utoljára tíz éve jártam ott, vakbélműtét után!

Nos itt nem erről van szó, hanem arról, hogy az osztályok közt szülő-gyermek viszonyt tudunk kialakítani és <del>a mendeli genetika szerint az F1 nemzedék </del> így a szülő függvényeit/változóit (természetesen ha nem `private`) tovább tudjuk örökölni a gyermek osztályunkba. Ezeket már nem szükséges definiálnunk. Jön az újabb kérdés, hogy ez mégis mire jó mindez?

Maradjunk a gyártósor hasonlatnál. Képzeljünk el egy stratégiai játékot, ahol különböző harci/építő, stb. egységeket tudunk képezni. Az építő egységek tudnak építeni, hallgatnak a jobb klikkre, van életerejük, mozgási sebességük, stb. A harci egységek tudnak támadni, hallgatnak a jobb klikkre, van életerejük, sebzésük, mozgási sebességük, stb.

Na már most a programozás egyik igen fontos elve, a [DRY (Don't repeat yourself)](http://en.wikipedia.org/wiki/Don%27t_repeat_yourself), vagyis kerüljük az ismétlődő elemeket (ugyanis abban rejlik egy minta, amit le tudunk rövidíteni). Ugyan most nem kódot írtam az előbb, ellenben már a leírás során is látni, hogy itt ismétlődő elemek vannak/lesznek. Csináljuk meg most "rosszul" a fenti osztályokat.

```
class BuilderUnit {

   private $healthPoints, $movementSpeed; // az életerő és mozgási sebesség

   public function build() {} // építünk
   public function move() {} // mozgunk a térképen
}

class MilitaryUnit {

   private $healthPoints, $movementSpeed, $attackDamage; // az életerő, mozgási sebesség és sebzés

   public function attack() {} // támadunk
   public function move() {} // mozgunk a térképen

}
```

A fenti példában is látható, hogy bizony önmagunkat ismételjük. Hogy tudnánk ezt megoldani? Csinálhatnánk egy általános osztályt az egységekre és felruházhatnánk azt az összes előforduló tulajdonsággal, de az csak újabb gondokkal járna, mivel minden függvényünknek elágazások garmadáját kellene tartalmaznia, hogy felderítsük, az adott egység típusnak lehet-e támadnia, építenie, stb. Maradjunk most a mateknál és egyszerűsítsük le a fenti kódot.

Nézzük meg, mik is az ismétlődő elemek, amik minden egységre jellemzőek! Minden egység tud mozogni, van életereje és mozgási sebessége (legalábbis a példánk alapján).

Csináljunk hát egy "általános" Unit osztályt, ami ezeket tartalmazza, a MilitaryUnit és BuilderUnit osztályokat ebből származtatjuk.

```
class Unit  {
    protected $healthPoints, $movementSpeed;
    public function move() {}
}
class MilitaryUnit extends Unit {
   private $attackDamage;
   public function attack() {}
}

class BuilderUnit extends Unit {
  public function build() {}
}
```

A Unit osztályban a változókat protected előtaggal láttuk el, így a leszármazottak elérhetik azokat, ellenben a move metódust publikussá tettük, mivel azt később kívülről szeretnénk meghívni (az osztályaink publikus interfészét képezi majd). Az extends kulcsszó után írjuk az osztály nevét, amiből örökölni szeretnénk. A gyermekosztályból a szülő osztály konstruktorát is meghívhatjuk, a `parent::__construct();` -al, természetesen a szükséges paramétereket megadva.

#### Final

Nem, nem fogunk záróvizsgázni, csak egy kis kiegészítés az előbbi témához. Ha örököltünk egy osztálytól és a gyerek osztályunkban újra definiálunk egy metódust, amit már a szülőben megtettünk, akkor azt felülírjuk (<del>Mona Lisa</del> override) és meghívásakor a felülírt verzió lesz "életben". Viszont ha a `final `kulcsszóval definiáljuk a szülőosztályunkban, akkor a felülírását ez meggátolja. Ez a kulcsszó alkalmazható még osztályok definíciójában is, ez esetben az osztályt nem lehet az `extends `kulcsszóval továbbörökíteni.

#### Absztrakt osztályok![7-abstract-rainbows-digital-art-1080x1920](assets/uploads/2015/01/7-abstract-rainbows-digital-art-1080x1920-300x169.jpg)

Az absztrakt <del>művek legfontosabb tulajdonsága, hogy részeg kiskutyák festik őket és marhasokat keres velük a gazdi</del> osztályok legfontosabb tulajdonsága, hogy nem lehet őket példányosítani. Mi értelme ennek?

Az előbbi példánkban definiáltunk egy általános Unit osztályt, amit aztán továbbörökítettünk két másik osztályba, amiket a későbbiek folyamán példányosíthatunk. Katonákra szükség van és építő egységekre is, ellenben mi van akkor, ha tévedésből egy általános Unit-ot példányosítanánk? Nos ilyet nem akarunk, mert ilyen egység a játékban nem lesz, csak egy alapot szolgáltat a többi egységnek. Ezáltal ezt absztrakt osztállyá tehetjük, ezzel elkerülve egy kínos véletlent és leszögezve, hogy ez nem valódi példányosítható osztály. Definíciója roppant egyszerű:

```
abstract class AbstractUnit {} // a nevében is nyilvánvalóvá tehetjük a tényt, hogy absztrakt osztályról van szó
```

#### Interfészek![ForeRunnerLE_25_ATM_Network_Interface_(1)](assets/uploads/2015/01/ForeRunnerLE_25_ATM_Network_Interface_1-300x200.jpg)

Már párszor említettem a korábban az osztályok ún. publikus interfészét. Az objektumaink ugye egymással "kommunikálnak" és ezt csak public (netán protected) metódusokon keresztül tudják megtenni. Ezt a "felületet" nevezzük osztályunk publikus interfészének.

Ellenben az interfészek témakör nem erről szól. Az interface esetünkben hasonlít egy osztályhoz, viszont ez nem példányosítható és nem is örökölhető.

Definíciója így néz ki:

```
interface UnitInterface {
      public function move();
}
```

Jellemzőjük még, hogy itt a metódusok definíciója véget ér az argumentumok megadásával, nincs tartalmuk. Mégis mire jók az interfészek? Az interfészek egyfajta szerződést jelentenek. A szerződés kulcsszava az `implements`. Az osztály, ami elfogadja a szerződést ( más néven "implementálja" az adott interfészt), vállalja, hogy az adott metódusokat tartalmazni fogja. Maradjunk az előző példánál és nézzük hogy is tudnánk az interfészeket meghonosítani egy ilyen egyszerű esetben.

```
abstract class AbstractUnit implements UnitInterface {
    protected $healthPoints, $movementSpeed;
    public function move() {}
}
```

Itt létrehoztunk egy absztrakt osztályt, ami implementálja a fentebb definiált UnitInterface-t. Ezzel elfogadja, hogy tartalmazni fogja a move() metódust. Később ezt az osztályt fogjuk továbbörökíteni.

> Miért is jó ez nekünk?

Így tudunk egyfajta egységes kezelőfelületet biztosítani több osztályunknak is. Képzeljünk el egy osztályt, ami a gyorsítótárazást fájlokba ( ami azért főbűn, bár még mindig jobb, mint egy API kulcsot koptatni ) végzi. Ennek az osztálynak legyenek a gyorsítótárazásra jellemző metódusai (set, get, touch, stb.). Ha csinálunk még egy osztályt, ami memóriába végzi a gyorsítótárazást, akkor a legegyszerűbb, ha e két osztály kezelőfelülete (a metódusok, amin keresztül elérjük a gyorsítótárazott adatainkat) egységes, nemde (ez később megkönnyíti a dolgunkat, ha pl. injectáljuk, de ezt majd később)?

Ennek megvalósítása nem (vagy csak részben) lehetséges egy szülő osztály létrehozásával és annak öröklésével, mivel az osztályok nem egyforma módon érik el az adatot. Tehát itt jöhet képbe egy interface implenentálása, ami ha a gondunkat nem is oldja meg, de rákényszerít, hogy a két osztályunk kezelőfelülete egyforma legyen.

```
interface StorageInterface {
   public function get($key);
   public function set($key, $value);
   public function touch($key);
   // egyéb metódusok
}

class MemCache implements StorageInterface {
  // metódusok, amik az osztály belső működésének részei

  // metódusok, amiket definiálnunk KELL
}

class FileSystemCache implenents StorageInterface {
// metódusok, amik az osztály belső működésének részei

// metódusok, amiket definiálnunk KELL
}
```

A fenti példában láthatjuk, hogy az osztályunk belső működése egyedi, ellenben ugyanazzal metódusokkal lehet őket meghívni (ha a visszatérési típusuk is ugyanaz, akkor már jók vagyunk), így ha úgy döntünk, hogy pl. nem fájlrendszerben akarjuk tárolni az adatainkat, akkor nem kell az ezen osztályt használó programrészleteket teljesen átvariálni, csak a használt osztály neve változik (na meg némi konfiguráció) és bumm, működik is.

Egyelőre ennyit, következő cikkemben újabb falat következik, Dependency Injection és Singleton-ok!
