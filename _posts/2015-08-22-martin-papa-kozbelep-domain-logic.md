---
id: 677
title: 'Martin papa közbelép &#8211; Domain Logic'
date: '2015-08-22T21:40:47+02:00'
author: Martin
layout: post
guid: '{{ site.url }}/?p=677'
permalink: /2015/08/22/martin-papa-kozbelep-domain-logic/
dsq_thread_id:
    - '4057422371'
    - '4057422371'
categories:
    - Advanced
    - Backend
tags:
    - domain
    - 'domain model'
    - logic
    - pattern
    - 'service layer'
    - 'table module'
    - 'transaction script'
---

Sok helyen és cikkben lehet olvasni a Domain, Domain Logic szót, azonban a legtöbb helyen nincs leírva, hogy ez pontosan mi?  
[![pwzpf](assets/uploads/2015/08/pwzpf.jpg)](assets/uploads/2015/08/pwzpf.jpg)

> A Domain Logic írja le azokat a funkcionális algoritmusokat vagy épp üzleti logikát, ami az információ áramlását kezeli az adatbázis és a UI között. A jól szervezett Domain Logic komponenseket könnyű karbantartani és bővíteni.

### **Domain Logic minták**

Ahhoz, hogy a következő cikkek mondjanak is valamit, ahhoz először mindenképp végig kell mennünk a <del>veresegyházi asszonykóruson</del> azon, hogy az üzleti logikánkat miként is szervezhetjük.

- Transaction Script
- Domain Model
- Table Module
- Service Layer (Domain Model és Table Module felé szervezve)

#### Transaction Script

Ha megvizsgáljuk az üzleti alkalmazásokat, akkor feltűnhet, hogy szerkezetüket tekintve különböző "tranzakciók" sokaságából állnak. Az egyik tranzakció megtekinthet némi információt valamilyen módon rendezve, míg egy másik ugyanezen információkba változásokat visz be. A szerver-kliens kapcsolat közötti minden interakció tartalmaz némi logikát. Egyes esetekben ez nem több, mint az adatok megjelenítése az adatbázisból, de előfordulhatnak több lépcsős számítások és validálások is.

A Transaction Script ezt a logikát egy szimpla függvénybe szervezi, a hívásokat direktbe az adatbázisnak vagy egy vékony wrapperen keresztül intézve. Minden tranzakciónak megvan a maga Transaction Scriptje, habár az ismétlődő subtask-ok mentén felbonthatjuk ezeket is.

##### Értem én, hogy TS... na de mi hajtsa?

Ha Transaction Scripteket használunk, az üzleti logikánk ezen tranzakciók mentén van rendszerezve. Ha le akarunk foglalni egy hotelszobát, a logika az, hogy ellenőrízzük a szabad szobákat, kiszámoljuk az árakat, aztán frissítjük az adatainkat egy BookHotelRoom függvényben.

Az egyszerűbb esetekben (és általában ilyen esetekben használjuk ezt a mintát), túl sokat nem lehet hozzáfűzni, hogy mégis mindezt hogy lehet szervezni. Persze, ahogy minden más programot itt is olyan modulokba szervezhetjük mindezt, ahova valók. A legnagyobb előnye ennek, hogy nem kell foglalkoznunk azzal, hogy mit is csinál a többi tranzakció. A feladatunk egyszerű: bejön az input, megpiszkáljuk az adatbázist és esetleg visszalökünk valami outputot.

Hogy hova tegyük ezeket a scripteket, nagyban múlik azon, hogy is szerveztük alkalmazásunk különböző rétegeit. Ezek lehetnek külön CGI szkriptekben, osztályokban elszeparálva a data source-tól és a presentationtől. Fontos, hogy a Transaction Scriptek ne függjenek a megjelenítés logikájától. Ezáltal könnyebb lesz módosítani a kódot és tesztelni ezeket a scripteket.

Ha osztályokba szervezzük mindezt, akkor ezt két módon tehetjük meg. Az egyik - és egyben az egyszerűbb - módszer az, hogy szimplán pár osztályba belekulákolunk egy csomó ilyen script-et, ahol az egyes osztályok csoportosítják azokat az érintett terület alapján. (pl. Customer, Order, stb.)

A másik módszer az az, hogy az egyes Transaction Scripteknek külön osztályt hozunk létre, a [Command pattern](https://en.wikipedia.org/wiki/Command_pattern) alapján. Ezesetben létre kell hoznunk egy ősosztályt, ami lefedi a scriptek által végrehajtott logikát. Ez azért jó, mert az egyes osztályokat runtime lehet piszkálni, ezáltal nem kőbe vésett a scriptjeink lefutása. Viszont ez némileg ellentmondásos, mivel a Transaction Script-ek viszonylag egyszerűbb üzleti logika mellett használatosak és ilyen formájú bonyolításuk felveti valamivel komolyabb Domain Logic patternek használatát.

##### Mikor éri meg?

A Transaction Script-ek legnagyobb előnye az egyszerűségük. Azonban amikor az üzleti logika kezd egyre bonyolultabb lenni, egyre nehezebbé válik hogy mindezt szervezve tartsuk.

Na de eleget beszéltünk már erről, úgyhogy nem ártana végre valami gyakorlati megvalósítását látni a dolognak, nemde?

Tegyük fel, hogy van egy ilyen táblánk:

```
CREATE TABLE revenueRecognitions (contract int, amount decimal, recognizedOn date, PRIMARY KEY (contract, recognizedOn))
```

A példánkban egy Transaction Script fog helyet foglalni, ami kiszámolja egy szerződésre vonatkozó bevételi kimutatásainkat.

A scriptben egy meghatározott napig számoljuk ki az értékeket. Ezt meg lehet csinálni két lépcsőben. Az elsőben összekulákoljuk a megfelelő sorokat a revenueRecognitions táblából, míg a második lépésben összeadjuk az értékeket.

A legtöbb Transaction Script direktben operál az adatbázissal, így SQL-t is lehet látni a függvényekben. Ezt kiszervezhetjük a Data Source layerbe, pl. Table Data Gatewaybe. Mivel a Table Data Gateway a következő cikk tárgya lesz, ezért most direktben belehákolom az SQL-t a függvényekbe.

\[tabs type="horizontal"\]\[tabs\_head\]\[tab\_title\]PHP\[/tab\_title\]\[/tabs\_head\]\[tab\]

```
<pre data-language="php"><?php

class RecognitionService { // egy osztályba szervezem a metódusokat

     public function __construct(\PDO $db) { // DI
         $this->db = $db;
     }

     private static $findRecognitionStatement = "SELECT amount FROM revenueRecognitions WHERE contract = :contract AND recognizedOn <= :date"; // az SQL beégetve autentikusan
     public function findRecognitionsFor($contractNumber, $asOf) { // ez fog kapcsolatba lépni az adatbázissal
        $statement = $this->db->createStatement(self::$findRecognitionStatement);
        $result = $statement->execute(array(
              'contract' => $contractNumber, "date" => $asOf
         ));
        return $result; // visszatérünk a leszűrt result settel
     }
     public function recognizedRevenue($contractNumber, $asOf) {
         $result = $this->findRecognitionsFor($contractNumber, $asOf); // továbbproxyzzuk a kérést
         $amount = 0;
         foreach ($result as $record) {
            $amount += $record["amount"]; // végigiterálunk a sorokon és az értékeket összeadjuk
         } 
         return $amount;
     }

}
```

\[/tab\]\[/tabs\]

A fenti példa egyszerű, mint a faék, de remélhetőleg a lényeg átjött. Bruttó egy osztályt csináltunk, amiből meghívtunk egy metódust, ami meghívott egy másikat, aztán összeadogatta a visszatért értékeket. Persze csinálhatott volna bármit az adatokkal, a logikának megfelelően mindneféle módon manipulálhattuk volna, ez már csak rajtunk múlik. Na de mi a helyzet akkor, ha 10, 20, netán 100 táblánk van, amik ide-oda lépnek interakciókba egymással?

#### Domain Model

A Domain Model egy olyan objektum, ami magába foglalja az adatokat és a viselkedést egyaránt. Amikor elszabadul a pokol <del>és felültetnek bennünket a szopórollerre</del><del></del> akkor bizony az üzleti logika igen komplex tud lenni. Rengeteg helyzetnek és szabálynak kell megfelelnünk és ez az a komplexitás, ahol az objektumaink igazán jól tudnak működni. A Domain Model objektumok olyan összefüggő hálózata, ahol minden egyes objektum valami elemet reprezentál, legyen az az elem egy olyan hatalmas, akár egy cég vagy olyan apró, mint egy megrendelőlap egyik sora.

Ha Domain Modelt akarunk az alkalmazásunkba, akkor készüljünk fel, hogy objektumok egész rétegét kell beleoktrojálni az alkalmazásunkba, ami modellezi az üzleti logikánkat, amivel dolgozunk. Lesznek olyanok, amik az üzletünkben jelenlévő adatokat reprezentálják és olyanok is, amik az üzleti szabályokért felelősek. A legtöbb esetben az adat és a folyamat kombinálva lesz jelen, hogy közel tartsa a folyamatot az adathoz, amivel dolgozik.

Ennek eredményeképpen kétféle Domain Model van a területen:

A szimpla Domain Modelek, amik közel állnak az adatbázis struktúrához és egy Domain objektum egy adatbázis táblához köthető. Egy komplex Domain Model már más tészta. Itt eltérünk az adatbázis struktúrától, öröklődéseket vezetünk be, stratégiákat és egyéb tervezési mintákat, amik révén létrejön az apró összeköttetésben álló objektumok hálózata. Ez utóbbi a komplex logikához jó, viszont sokkal nehezebb az adatbázishoz kötni. A szimpla Domain Modelek használhatnak Active Recordot, míg a komplexek inkább a Data Mapperen át fogják elérni az adatbázist.

Lévén az üzleti logika gyakran változik, ezért roppant fontos, hogy képesek legyünk azt módosítani, tesztelni, méghozzá könnyen. Ennek eredményeképp a Domain Model és a rendszer egyéb rétegei között a lehető legkevesebb kapcsolatot szeretnénk.[![pulp-fiction](assets/uploads/2015/08/pulp-fiction-1024x768.jpg)](assets/uploads/2015/08/pulp-fiction.jpg)

> **Mondd ezt még egyszer, hogy hogy mi!**

Ha nehéz belőni, hogy hogy is kéne megvalósítani a Domain Modeleket, mivel olyan hatalmas objektumok, akkor a "mikor" talán még nehezebb. Minden a rendszerünk komplexitásától függ. Ha a rendszerünk komplikált és tele van folyamatosan változó üzleti szabályokkal, beleértve validálást, származtatást, kalkulációkat, akkor nagy eséllyel a válasz igen. Más esetben, ha csak szimpla not-null check és egy pár szummázás az egész, akkor a Transaction Scriptel jobban járunk.

Ha a Domain Model mellett döntesz, akkor az adatbázissal Data Mapperrel ajánlatos összekapcsolni, lévén ez segít elkülöníteni a Domain Modelt az adatbázistól és ez a megközelítés a legjobb, ha a Domain Model és az adatbázis séma eltér.

Ha Domain Modeleket használsz, akkor fontolóra veheted, hogy egy Service Layer alá beburkold az egészet.

##### Na de nézzünk valami példát, nemde?

A gond azonban ezekkel, hogy helyhiány miatt próbálok egyszerű példákat hozni, ami egyszerűség elfedi a Domain Modelek lényegét.

Tegyük fel, hogy ismét bevételi kimutatásokat akarunk számolni. Ebben az esetben a számítások a vevővel kezdődnek és a termék fogja átdobni egy stratégia hierarchiának. A [strategy pattern](https://en.wikipedia.org/wiki/Strategy_pattern) egy közismert objektumorientált minta, aminek segítségével műveletek egy csoportját tudjuk egy osztályhierarchiába rejteni.

[![uml](assets/uploads/2015/08/uml.png)](assets/uploads/2015/08/uml.png)

Minden Product objektumpéldány egy RecognitionStrategy példányhoz kapcsolódik, ami utóbbi eldönti, hogy mely algoritmus is szükséges a bevételi kimutatásokat kiszámolni. Ebben az esetben két származtatott osztályunk lesz, a kétféle kalkulációs metódusra. Először is hozzuk létre a Contract és Product osztályunkat, valamint a RevenueRecognition osztályt:

\[tabs type="horizontal"\]\[tabs\_head\]\[tab\_title\]PHP\[/tab\_title\]\[/tabs\_head\]\[tab\]

```
<pre data-language="php">class Contract { // a szerződés osztályunk
    private $product, $revenue, $whenSigned, $id;

    public function getRevenue()
    {
        return $this->revenue;
    }

    public function getWhenSigned()
    {
        return $this->whenSigned;
    }
    private $revenueRecognitions = array();
    public function __construct(Product $product, $revenue, $whenSigned) { // szimpla CTOR
        $this->product = $product;
        $this->revenue = $revenue;
        $this->whenSigned = $whenSigned;
    }

    public function addRevenueRecognition(RevenueRecognition $revenueRecognition) {
        $this->revenueRecognitions[] = $revenueRecognition; // hozzácsapjuk a bevételi kimutatásokat
    }

    public function calculateRecognitions()
    {
        $this->product->calculateRevenueRecognitions($this); // továbbítjuk a kérést a produkt osztály felé
    }

    public function recognizedRevenue(Date $date) { // ez számolja ki, hogy mennyi bevételünk származott az adott időpontig
        $result = 0;
        foreach ($this->revenueRecognitions as $r) {
            if ($r->isRecognizableOf($date)) {
                $result += $r->getAmount();
            }
        }
        return $result; // és visszatér az összesített értékkel
    }
}

class Product { // a termék osztályunk
    private $name, $recognitionStrategy;

    public function __construct($name, RecognitionStrategy $recognitionStrategy) {
        $this->name = $name;
        $this->recognitionStrategy = $recognitionStrategy;
    }

    public static function newWordProcessor($name) {
        return new self($name, new CompleteRecognitionStrategy()); // különböző stratégiák alapján példányosítjuk a termékünket
    }
    public static function newSpreadSheet($name) {
        return new self($name, new ThreeWayRecognitionStrategy(60,90));
    }
    public static function newDatabase($name) {
        return new self($name, new ThreeWayRecognitionStrategy(30,60));
    }

    public function calculateRevenueRecognitions(Contract $contract)  { // az adott termékre vonatkozó bevételeket számolja ki
        $this->recognitionStrategy->calculateRevenueRecognitions($contract);
    }
}

class RevenueRecognition {

    private $amount, $date;

    public function __construct($amount, DateTime $date) {
        $this->date = $date;
        $this->amount = $amount;
    }

    public function getAmount() {
        return $this->amount;
    }

    public function isRecognizableBy(DateTime $date) {
        return $this->date < $date;
    }

}
```

\[/tab\]\[/tabs\]

Ahhoz, hogy kiszámoljuk mennyi bevételt tudunk realizálni egy adott dátumhoz kapcsolódóan, a Contract és RevenueRecognition osztályokra is szükségünk lesz. A Domain Modelek esetében gyakori, hogy több osztály lép interakcióba egymással, még a legegyszerűbb feladatok elvégzése esetén is. Ez az, ami miatt gyakran panaszkodnak, hogy az objektumorientált programok esetében rengeteg idő megy el azzal, hogy osztályról osztályra haladva keressük azokat. Persze mindez nem alaptalan. Ezért fontos, hogy a logikát oda és csak oda foglaljuk, amelyik osztályra mindez tartozik. Ezáltal elkerülhetjük a duplikációt és a kapcsolódást a különböző objektumok közt.  
\[tabs type="horizontal"\]\[tabs\_head\]\[tab\_title\]PHP\[/tab\_title\]\[/tabs\_head\]\[tab\]

```
<pre data-language="php"><?php 

abstract class RecognitionStrategy {
    abstract function calculateRevenueRecognitions(Contract $contract);
}

class CompleteRecognitionStrategy {
    public function calculateRevenueRecognitions(Contract $contract) {
        $contract->addRevenueRecognition(new RevenueRecogntion($contract->getRevenue(), $contract->getWhenSigned()));
    }
}

class ThreeWayRecognitionStrategy {
    private $firstRecognitionOffset, $secondRecognitionOffset;

    public function __construct($firstRecognitionOffset, $secondRecognitionOffset) {
        $this->firstRecognitionOffset = $firstRecognitionOffset;
        $this->secondRecognitionOffset = $secondRecognitionOffset;
    }

    public function calculateRevenueRecognitions(Contract $contract) {
        $allocation = $contract->getRevenue()->allocate(3);
        $contract->addRevenueRecognition(new RevenueRecognition($allocation[0],$contract->getWhenSigned()));
        $contract->addRevenueRecognition(new RevenueRecognition($allocation[1],$contract->getWhenSigned()->add($this->firstRecognitionOffset)));
        $contract->addRevenueRecognition(new RevenueRecognition($allocation[2],$contract->getWhenSigned()->add($this->secondRecognitionOffset)));
    }
}


// ahhoz, hogy teszteljük, a statikus metódusokon keresztül hívjuk meg őket
$wordProcessor = Product::newWordProcessor("1");
$spreadSheet = Product::newSpreadSheet("2");
$database = Product::newDatabase("3");
```

\[/tab\]\[/tabs\]

A legnagyobb előnye a stratégiák alkalmazásának, hogy egy igen jó lehetőséget adnak az alkalmazásunk bővítésére. Egy új algoritmus hozzáadása nem kerül többe, mint egy új osztály származtatása és calculateRevenueRecognitions metódus felülírása.

Ahhoz, hogy új terméket hozzunk létre, a hozzátartozó Strategy objektumokkal hozzuk őket létre. Ezt persze elfedik a statikus metódusaink.

Feltűnhet, hogy a példában egy szó sincs arról, hogy is nyerjük ki az alábbi objektumokat az adatbázisból, vagy épp hogyan írunk bele. Részben azért, mert ez a következő cikk tárgya lesz, másrészt a Domain Model lényege pont az, hogy elrejtse az adatbázist a felsőbb rétegek felől, így a kódot ilyen formában olvasni jól szemlélteti hogy lehet leprogramozni mindezt mappingtől függetlenül.

A Domain Logic patternek közül még hátravan a Table Module és a Service Layer, viszont ezek már a következő cikkbe fognak csak beleférni.