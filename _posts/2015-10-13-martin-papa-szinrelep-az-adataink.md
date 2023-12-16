---
id: 661
title: 'Martin papa színrelép &#8211; Az adataink'
date: '2015-10-13T00:26:44+02:00'
author: Martin
layout: post
guid: '{{ site.url }}/?p=661'
permalink: /2015/10/13/martin-papa-szinrelep-az-adataink/
dsq_thread_id:
    - '4219409647'
    - '4219409647'
categories:
    - Backend
    - 'Design Pattern'
tags:
    - data
    - domain
    - dto
    - gateway
    - model
    - object
    - 'row data'
    - 'table data'
    - transfer
---

Az bizonyára köztudott, hogy manapság már nem weboldalakat, hanem webalkalmazásokat készítünk, azok mérete és komplexitása miatt. Ezzel a mérettel és komplexitással szinte egyenes arányban egyre bonyolultabb és hatalmasabb adatbázisok csücsülnek a háttérben. A módszer, hogy ezeket az adatokat hogy is érjük el, igen sokféle lehet. Régen, amikor még nem figyeltünk a kód struktúrájára, egy mysql függvény figyelt egy lekéréssel az index.php közepén, később már ezeket feldaraboltuk, netán kiszerveztük különféle fájlokba. Amikor viszont szóba jön az MVC, már mindenhol objektumokkal dobálózunk, akkor sokan eltévednek a nagy útvesztőben, hogy mégis mit és hova? [![pq2vg](assets/uploads/2015/08/pq2vg.jpg)](assets/uploads/2015/08/pq2vg.jpg)

A jó öreg [Martin papa](http://www.martinfowler.com/) anno kiadta az igen rövid névre hallgató "Patterns of Enterprise Application Architecture" c. könyvét. Ez a könyv elég átfogóan kitárgyalja a programtervezési dolgokat, persze nem a vidéki landing page-k szintjén. Ezen belül található egy rész, ami az adatbázisokra vonatkozik, ezt szeretném valami magyar és közérthető formában elétek tárni, de csak azért, mert [Dancsó Péter](http://www.peterdancso.com/) megengedte.

####  Az alábbiak erősen függnek az előző bejegyzéstől, így annak olvasása ajánlott ennek megértése érdökében.

#### Table Data Gateway

> Aki foglalkozott már androiddal pl. annak ismerős lesz mindez, csak Data Access Objecet (DAO) néven.

Ez az osztály egy példánya fogja elérhetővé tenni számunkra az adott táblához tartozó összes rekorodot. Ebbe az osztályba kerülnek az adott táblát érintő SQL lekérdezések, az összes. **De tényleg az összes.** Amikor az adott táblát érintő select, insert, update, stb.-re kerül a sor, akkor ennek az objektumpéldánynak a metódusain keresztül tudjuk azt megtenni.

Az interfésze roppant egyszerű. A legtöbb esetben különféle feltételek szerinti lekérdezéseket tartalmaz, valamint az adott rekordokat érintő update/select/delete. A metódusai a paramétereiket továbbadják az SQL lekérdezés felé és ez alapján építik fel azt. Ezek az objektumok állapot nélküliek, mivel csak átfolyik rajtuk az adat, azt nem tárolják.

A trükkösebbik rész itt az, hogy mégis mit adjunk vissza az egyes lekérdezések esetében? Még a legegyszerűbb findById metódus lekérdezése is több értéket szolgáltat vissza (egy rekord mezőit). Egy ilyen megoldás az lehet, ha ezeket az adatokat egy tömbbe rendszerezzük. Ez működik is, viszont ehhez az adatokat ki kell bányásszuk az adatbázisból jövő recordsetből. Ezekkel az a baj, hogy a tömbök egyes kulcsait el lehet gépelni és semmiféle segítséget nem kapunk sem kódolás, sem fordítás közben, hogy valamit elszúrtunk.

<figure aria-describedby="caption-attachment-774" class="wp-caption aligncenter" id="attachment_774" style="width: 670px">[![Ez is egy data gateway](assets/uploads/2015/10/analog-gateway-1024x843.jpg)](assets/uploads/2015/10/analog-gateway.jpg)<figcaption class="wp-caption-text" id="caption-attachment-774">Ez is egy data gateway</figcaption></figure>

Az egyik megoldás erre a problémára az ún. Data Transfer Object-ek használata.

**Data Transfer Object**

Amikor az adatainkat át akarjuk vezetni egy kommunikációs csatornán (pl. JSON API-n át mobilkliens felé, vagy C# webservice-en), akkor pár dolgot figyelembe kell vennünk :

Minden hívás a szerver-kliens kölött idő/erőforrásigényes. Ennélfogva lehetőleg minél jobban le kell redukálnunk a hívások számát, cserébe egy-egy válasszal minél több adatot kell szolgáltatnunk.  
Ilyenkor jönnek képbe a DTO-k, azaz a Data Transfer Object-ek, amik a híváshoz szükséges összes adatot képesek magukba zárni. Természetesen a kommunikációs csatornán való áthaladáshoz szükséges, hogy szerializálható legyen. Gyakori példa, hogy a szerver oldalon egy assembler továbbítja az adatot a Domain modelljeinkből a DTO-ba.

> A Sun közösségekben ugyanerre a mintára sokan a Value Object szót használják.

Alapjaiban véve egy DTO nem más, mint egy rakás példányváltozó és a hozzájuk tartozó getter/setter. Amikor egy remote kliens adatot kér, akkor megkeressük a neki való DTO-t és kiszolgáltatjuk. Általában ezek a DTO-k sokkal több adatot tartalmaznak, mint amennyire a kliensnek szüksége van, de mindenképp benne lesz, az, ami a kliensnek kell.

Ezek a DTO-k általában nem csak 1 objektumot tartalmaznak, hanem egy aggregát objektumot. Tegyük fel, hogy a kliens kér adatot egy megrendelésről. Akkor a DTO amit továbbítunk felé tartalmaz adatot a megrendelésről, a vevőről, a termékekről, kiszállítási információ, stb. Hasonló a helyzet egy üzenetnél. Komplett üzenetszálakat továbbítunk, ami üzenetekhez tartozó felhasználók, azok csoportjai is a válasz részét képezhetik.

Hogy miért nem használjuk a Domain Modeljeinket erre a célra? Mert sokkal komplexebbek, szorosan kapcsolódnak egymáshoz és gyakran lehetetlen őket serializálni. Egy gyakori példája a DTO-k használatánka az ún. Record Set, amit az SQL lekérdezéseink szolgáltatnak vissza. A Domain Modeljeink generálhatnak ilyen Record Set-et, hogy adatot továbbítsanak a kliens felé, hogy aztán a kliens úgy kezelje azt, mintha direktben az SQL-ből érkezett volna. Ez akkor előnyös, ha a kliensünk ilyen Record Set-ek fogadására alkalmas. Ekkor megtehetjük azt, hogy a Domain Modeljeink lekérdezik az adatokat SQL-ből, módosítják mindazt a logikánk szerint és ezután továbbítják, úgy hogy a kliensnek fogalma sincs arról, hogy mi "kikozmetikáztuk" az adatokat.

A DTO nem csak az adatok tárolásáért felelős, hanem a serializációért is. A Java és C# rendelkezik beépített megoldásokkal a bináris és XML szerializáláshoz. Ha lehetőségünk van ezt használni, akkor semmiképp ne erőltessük a saját megoldásunkat.

Ha ez nekünk nem megfelelő, akkor bizony kézzel kell megírni ezt a dolgot. Használhatunk reflection-t és akkor egy ősosztályunkba bele tudjuk rakni az oda-vissza alakítás folyamatát és csak ezt kell továbbörökítenünk. Ez a reflection-ösdi erőforrásigényes lehet, ezért fontoljuk meg mikor használjuk.

Ahhoz, hogy az adatainkat a Domain Modeljeinkből átvezessük a DTO-kba, szükségünk lesz ún. Assemblerekre. Ezek az Assemblerek fogják nekünk a módosításokat megejteni a Domain Modeljeinken át vagy épp a DTO-kat meghívni, a Domain Modelekből kinyert információk alapján. Na de akkor nézzünk most egy megvalósítást.

Tegyük fel, hogy JSON formában szeretnénk továbbítani a kliens felé az üzeneteinket.

Szükségünk lesz egy DTO-ra, ami az üzeneteket fogja tárolni.

\[tabs type="horizontal"\]\[tabs\_head\]\[tab\_title\]PHP\[/tab\_title\]\[/tabs\_head\]\[tab\]

```
<pre data-language="php"><?php

class MessageDTO {

   private $sendDate, $sender, $receiver, $readDate, $subject, $content;
   private static $properties;
   // setters/getters/konstruktor
   ...


   public static function deserialize($jsonString) {
         if ($json = json_decode($jsonString) !== null) {
             $obj = new self();
             $objectProperties = get_object_vars($obj);
             foreach (get_objects_vars($json) as $field) {
                  if (array_key_exists($field, $objectProperties))   
                     $obj->$field = $json->$field;
             }
             return $obj;
         }
         return false;
   }
   public function serialize() {
         if (self::$properties == null) {
             $ref = new \ReflectionClass($this); 
             self::$properties = $ref->getProperties(ReflectionProperty::IS_PRIVATE);
         }
         $json = new \stdClass();        
         foreach (self::$properties as $prop) {
             $name = $prop->getName();
             $json->$name = $prop->getValue();
         }
         return json_encode($json);
   }
}
```

\[/tab\]\[/tabs\]

> Updated: optimalizáltam kicsit a dolgot, mert tényleg sz\*rul optimalizált volt a megvalósítása. A reflection továbbra is a private property-k miatt kell.

Valamint kell egy, amiben a felhasználói adatokat tároljuk:

\[tabs type="horizontal"\]\[tabs\_head\]\[tab\_title\]PHP\[/tab\_title\]\[/tabs\_head\]\[tab\]

```
<pre data-language="php"><?php

class UserDTO {

   private $id, $name, $email;

   // setters/getters/konstruktor//serialize/deserialize, mint az előbb.. ez utóbbit egy abstrakt felmenőbe is szervezhetjük
   ...

}
```

\[/tab\]\[/tabs\]

Most, hogy megvan a DTO, szükségünk lenne a Domain Modeljeinkre. Ennek a logikáját most nem fogom túl mélyen kidolgozni, de szerintem a lényeg átjön:

\[tabs type="horizontal"\]\[tabs\_head\]\[tab\_title\]PHP\[/tab\_title\]\[/tabs\_head\]

\[tab\]

```
<pre data-language="php"><?php 

class Messages {
    
    public function findByUserFromDate($userId, $lastModification) {
           // itt leszűrjük az adott felhasználóhoz tartozó üzeneteket az utolsó szinkronizációt követően és visszaadjuk a resultsetet amit az SQL-től kaptunk.
           return $resultset;
    } 

}

class Users {
   public function getUserById($userId) {
            // itt ID alapján visszaadjuk annak a rekordnak az adatait SQL-ből
            return $record;
   }
}
```

\[/tab\]

\[/tabs\]

Na most, hogy a Domain Model kész van (ez egyébként a már fentebb említett Table Data Gateway példája is lehetne), valahogy az innen származó adatokat bele kéne oktrojálni a DTO-ba. Itt jön képbe az assemblerünk.

\[tabs type="horizontal"\]\[tabs\_head\]\[tab\_title\]PHP\[/tab\_title\]\[/tabs\_head\]

\[tab\]

```
<pre data-language="php"><?php 

class MessageAssembler {

    public function getMessageDTOByUserIdAndLastSyncDate($userid, $lastSyncDate) {
         $results = $this->getMessagesModel()->findByUserFromDate($userid, $lastSyncDate); // lekérjük SQL-ből az üzeneteket
         $messages = array();
         foreach ($results as $record) {
               $record["sender"] = $this->getUserDTO($record["senderId"]); // lekérjük a hozzá tartozó UserDTO-kat
               $record["receiver"] = $this->getUserDTO($record["receiverId"]);
               $messages[] = new MessageDTO($record["sender"], $record["receiver"], $record["subject"],$record["body"] ,$record["sendDate"], $record["closeDate"] ); // példányosítunk egy DTO-t és betoljuk a tömbbe
 }
 return $messages; // visszaadjuk a tömböt
 }

 private function getUserDTO($userId) { // szimplán az ID alapján készítünk egy UserDTO objektumot
    $record = $this->getUsersModel()->getUserById($userId);
    return new UserDTO($record["id"], $record["name"], $record["email"]); // ez egy nagyon egyszerű DTO
 }


}
```

\[/tab\]

\[/tabs\]

A fenti példában szimplán lekérjük az utolsó szinkronizáció óta történt változásokat az üzenetek terén, ami MessageDTO-kat ad vissza, bennük UserDTO objektumokkal. Most így utólag belegondolva ez a serialize/deserialize metódus elég elhamarkodott döntés volt, mivel egy abstrakt ősben elhelyezett jól átgondolt pl. \_\_toString() megvalósítással könnyebben JSON formátumba lehetne őket alakítani, de a lényeg remélhetőleg átjön. Az assemblert meghívjuk, a paraméterekkel, az a domain modeleken keresztül elvégzi a lekérdezéseket és összeállítja az aggregátot és visszaadja azt.

Akkor most, hogy ezzel megvolnánk.. térjünk vissza a Table Data Gatewayre 🙂

Hogyha nem akarunk belefolyni a DTO-k világába, akkor visszatérhetünk szimplán egy Record Set-el, amit az SQL lekérdezésből kapunk. Ez a megoldás egy kissé zűrös, ha a nyelv, amit használunk nem támogatja széleskörűen a Record Set-eket, mint pl. a .NET. Amivel jól össze lehet hozni a Table Data Gateway-t, az pl. a Table Module.

Ha Domain Modellel szeretnénk összepárosítani, akkor megtehetjük, hogy az osztályunk az illetékes Domain Model példánnyal térjen vissza. Ezzel csak az a gond, hogy a két osztály egymás függőségei, ami igazából nem vészes, ha belegondolunk, hogy szorosan kapcsolódnak<del>, de ezt kimock-olni..</del>.

Ahogy a Table Data Gateway neve is mondja, mindegyik ilyen osztályunk egy-egy táblához kapcsolódik az adatbázisban. Egyszerűbb esetekben használhatunk egyet az összes tábla összes metódusára akár, valamint ha az adatbázisunkban léteznek olyan view-k, netán speciális lekérdezések, akkor azok is megérdemelhetnek egy saját Table Data Gateway-t. Persze ez utóbbiak, lévén csak lekérdeznek, nem rendelkeznek majd update és insert parancsokat rejtő metódusokkal.

#### Adjál házit![![palinka_hazi_rf_1_oszlopos_biglead](assets/uploads/2015/10/palinka_hazi_rf_1_oszlopos_biglead.jpg)](assets/uploads/2015/10/palinka_hazi_rf_1_oszlopos_biglead.jpg)

Na de mégis miért jó ez nekünk? Vagy inkább mikor? Ez a legegyszerűbb adatbázis interfész minták egyike, mert annyira egybeépül a táblákkal és a rekordok típusával, valamint egy adott helyen összpontosul az adatbázisunk elérésének logikája. Domain Modellekkel annyira nem jó párosítás, mert ez utóbbi inkább a Data Mapper mintával passzol, mert ez utóbbi jobban elizolálja a Domain Modelleket az adatbázisunktól.

DTO-kkal csak abban az esetben éri meg machinálni, ha azokat a DTO-kat használjuk még egyéb helyeken is az alkalmazásunkban.

Ahogy a Row Data Gateway, ez a minta is jól passzol a Transaction Scripttel. Az, hogy melyiket is használjuk, igazából a lekérdezéseink méretén múlik.

De akkor nézzünk valami másfajta példát is (igen, C#), ami nem DTO-kkal manipulál:

\[tabs type="horizontal"\]\[tabs\_head\]\[tab\_title\]C#\[/tab\_title\]\[/tabs\_head\]

\[tab\]

```
<pre data-language="csharp">class PersonGateway {
     public IDataReader FindAll() { // egy szimpla kérdezzünk le mindent
           String sql = "select * from person"; 
           return new OleDbCommand(sql, DB.Connection).ExecuteReader(); // viszatérünk a result settel
     }

     public IDataReader FindWithLastName(String lastName) { // paraméterként egy nevet várunk
           String sql = "SELECT * FROM person WHERE lastname = ?";
           IDbCommand comm = new OleDbCommand(sql, DB.Connection); // létrehozzuk az SQL parancsot
           comm.Parameters.Add(new OleDbParameter("lastname", lastName)); // bindoljuk a paramétereket
           return comm.ExecuteReader(); // majd végrehajtjuk a lekérdezést és visszatérünk vele
     }

     public IDataReader FindWhere(String whereClause) { // itt már a komplet where feltételt adjuk át, lehetőséget biztosítva a komplexebb, kevésbé beégetett lekérdezéseknek
           String sql = String.Format("select * from person where {0}", whereClause);
           return new OleDbCommand(sql, DB.Connection).ExecuteReader(); // paraméterek bindolása után végrehajtjuk a parancsot és visszatérünk a kívánt értékkel
     }
}
```

\[/tab\]\[/tabs\]

Amint láthatjuk, ez sem az ördög műve, lehet már mindenki használta korábban, csak nem nagyon tudta, hogy azt, amit <del>poénból megitattak vele, az deci volt és nem feles</del> pontosan hogy is hívták, vagy annak elemeit.  
Legközelebb hasonló témakörben jön a Row Data Gateway, valamint az Active Record és a Data Mapper!