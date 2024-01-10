---
id: 252
title: 'It&#8217;s a kind of __magic()!'
date: '2015-02-13T09:46:46+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=252'
permalink: /2015/02/13/its-a-kind-of-__magic/
dsq_thread_id:
    - '3511882151'
    - '3511882151'
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
    - clone
    - debugInfo
    - magic
    - methods
    - php
    - toString
---

A PHP nyelvben objektumainknak akadnak olyan metódusai, melyeket nem tudunk direkt módon  
hivatkozással elérni, hanem egy bizonyos működéshez kötődnek. Ezeket a függvényeket mágikus metódusoknak (igen, magic method) nevezzük és minden esetben \_\_ -el (dupla alsóvonás) kezdődnek. Álljon itt egy lista róluk és arról, hogy mikor és hogy is hívódnak meg:![Its_a_kind_of_magic_by_MindStep](assets/uploads/2015/02/Its_a_kind_of_magic_by_MindStep-300x225.jpg)

Kezdjük az egyik legalapvetőbbel, amivel bárki összefutott már, aki példányosított objektumot:

#### *\_\_construct()*

A fenti mágikus függvény egy objektum példányosításakor hívódik meg, amiről már beszéltem korábban az OOP-s [cikkemben]({{ site.url }}/2015/01/08/php-oop-mielott-barmibe-kezdenenk/). Roppant egyszerű a dolog:

```
$akarmilyenosztaly = new AkarmilyenOsztaly($ide_johetnek, $az, $argumentumok);
```

Amikor mi ezt beírjuk, akkor igazából az

```
AkarmilyenOsztaly::__construct($ide_johetnek, $az, $argumentumok)
```

-ra hivatkozunk, amit hiába erőszakolunk, az aktuális osztály egy példányát fogja visszaadni értékül. Itt végezhetjük el az objektumunk előkészítését, hogy igazán "ready for action" legyen, de lépjünk tovább valami kevésbé unalmasra.

#### \_\_destruct()

Hát igen, ha <del>kocsmát</del> valamit építeni akarunk, akkor <del>előtte le kell dózerolni a butikot </del> annak helyet is kell teremteni, úgy hogy az esőerdők se bánják meg. Ahogy a \_\_construct az objektum példányosításakor hívódik meg, úgy a destruct akkor, mikor az adott scope-ból visszalépünk és az objektumra mutató referenciát nem viszünk tovább, a programunk véget ér, vagy mi lépünk ki az exit() paranccsal. Itt takaríthatjuk el az ideiglenes fájlokat, netán pont lementhetünk egy aktuális állapotot, stb. Ellenben kivételt nem dobhatunk, csak egy csudaszép fatal error-ért cserébe.

> \_\_destruct() közben ne hívjuk meg az exit()-et, mert az ott rögtön véget vet a programunk futásának.

#### \_\_call()

Ez a függvény párban jár, mint a lányok a középiskola WC-jére, így mindkettejükről muszáj lesz írnom. A `__call()` mágikus metódus akkor hívódik meg, mikor sikeresen olyan metódust hívtunk meg, amit az adott contextből nem érnénk el (például kívülről egy private metódust). A `__callStatic()` ugyanezt teszi, csak statikus metódusok esetében, de nézzünk ide is egy példát:

```
class BSB_The_Call {
    public function __call($name, $args) {
        echo "Ezt szeretted volna: ".'$this'. // okkal zártam aposztrófok közé, de mindjárt szóba kerül az érintett metódus is
"->$name(".implode(", ",$args)."); ?";
    }
    public static function __callStatic($name, $args) {
       echo "Igen, statikusban is megy: ". get_called_class()."::$name(". implode(", ", $args)."); !";
    }
}
```

A fentiekből jól látható, hogy ez egyfajta hibaelhárításra szolgál, hogy a rendszer ne boruljon fel, ha kívülről szeretnénk piszkálni azt, amit előtte (nyílván okkal) levédtünk access modifierekkel, de az igazat megvallva én még sosem használtam őket, aki igen, az tegye fel a kezét a poszt végén.

#### \_\_set(), \_\_get()

Ha már az access modifiereknél tartunk, akkor itt a PHP válasza a kismillió setter/getter fügvényre. A \_\_set és \_\_get függvények akkor hívódnak meg, mikor olyan változókra hivatkozunk, amik nem léteztek/nem elérhetőek az adott contextből. Tehát ha létrehozunk egy jól szituált \_\_set(), \_\_get() párost, és privát változókat használunk, akkor megspórolhatunk egy halom setter/getter metódust (amit a legtöbb IDE magától is legenerál, de sebaj 🙂 és simán

```
$objektum = new SetGet();
$objektum->valtozo = $ertek; // $objektum->__set('valtozo', $ertek) kerül meghívásra
echo $objektum->masikValtozo; // $objektum->__get('masikValtozo') hívódik meg

class SetGet {
    private $valtozo, $masikValtozo;

    public function __set($name, $ertek) {
        $this->$name = $ertek; // variable variables és máris kész a setterünk
    }
    public function __get($name) {
        return $this->$name; // ez pedig a getterünk lesz
    }
}
```

viszont azt ne feledjük, hogy ha ezt a módszert használjuk, akkor elesünk attól a védelemtől, amit a setter(), getter() függvények nyújtanak, pl. if-else esetében egy ottfelejtett értékadásnál.

#### \_\_isset(), \_\_unset()

Ez a két függvény pontosan azt a célt szolgálja, amire első ránézésre gondolnánk is.

Amikor meghívjuk

```
$ojjektum = new HaromSzazezer();
isset($ojjektum->drotkoszoru); // $ojjektum->__isset('drotkoszoru');
unset($ojjektum->drotkoszoru); // $ojjektum->__unset('drotkoszoru');
```

Akkor igazából a kommentelt parancsok futnak le, amennyiben a `$drotkoszoru `változónk nem érhető el az adott contextből.

####  \_\_sleep(), \_\_wakeup<del> Neo</del>()

Na ha valaki most a többszálúságra és hasonlókra gondol, azt bizony el kell keserítsem, mert ennek a mágikus metódusnak semmi köze a thread-ekhez, ennél félrevezetőbb nevet nem is találhattak volna neki. E metódus akkor hívódik meg, mikor az objektumunkat a serialize függvénnyel szeretnénk feldolgozni. Ez ugye alapesetben tömböket alakít string típusúvá, így könnyen tárolható adatbázisban, stb. Na de mikor egy objektumon hajtjuk végre, akkor röfögne egy sort, hogy valami nincs rendjén, mivel ezt a metódust nem találja. Ha viszont létrehozzuk, akkor egy tömböt kell visszaadjunk, az objektumunk elemeivel, amin aztán csak lefut az a serialize. A wakeup pedig az unserialize esetében fog meghívódni.

```
class EzEgyExcelTabla { // nem a legjobb példája a value object-eknek, de most megteszi
     private $table = array(1,2,3,4,5,6,7); // csináltunk valami egyszerűt, amit vissza lehet adni
     public function __sleep() {
          return $this->table; // a tömbünket adjuk vissza, amit aztán simán leserialize-ol.
     }
     public function __wakeup() {
          $this->table = array(1,2,3,4,5,6,7); // Neo felébredt
     }
}
```

A sleep metódus akkor jön jól, mikor egy nagy osztályunknak csupán egy részét szeretnénk elmenteni, netán rendszerezni akarjuk a benne lévő adatokat. A wakeup az unserialize esetén hívódik meg, így ha bármit is félbehagytunk, itt újra összeépíthetjük azt.

#### \_\_toString()

A Java programozók most izgalomba jöhetnek, mert ismerős szöveget látnak. Igen, PHP-ben mágikus metódusként érkezett a toString metódus, aminek egyetlen világmegváltó célja az, hogyha valaki egy szimpla echo-val megjelenítené az objektumot, ne egy hibaüzenet fogadja a kedves ügyfelet, miszerint objektumot nem illik string-é alakítani, hanem a metódus keretein belül foglalt csudaszép szöveg. Ha pl. csinálunk egy $form objektumot, amibe beledobáljuk az elemeket, akkor ezt átadhatjuk egy az egyben a view-nak és ki lehet echo-zni, a függvényben pedig tudjuk, hogy az egyes elemeket hogy és miként kell megjeleníteni.

```
class Money {
     private $amount = 1000;
     private $format = "$";
    public function __toString() {
         return $this->amount." ". $this->format;
   }
}
$zsozso = new Money();
echo $zsozso; // 1000 $-t fog kiírni a drága.
```

#### \_\_invoke(), azaz idézzünk szellemeket

Az invoke() metódusa akkor hívódik meg, mikor osztályunkra nem változóként, hanem függvényként hivatkozunk. Ezzel lehet érdekes dolgokat csinálni és esetleg megspórolni függvényeket.

Vegyünk pl. egy ZF2 layoutból lopott viewhelpert:

```
$this->HeadLink()->appendFile($src);
```

Ugye itt az aktuális object context-ből hívunk meg egy metódust, ami visszaad egy osztályt és azon meghívunk még egy metódust.

> Method chaining: Akkor beszélhetünk róla, mikor egy meghívott függvény egy objektumot szolgáltat vissza (gyakran önmagát), ami referenciaként szolgál egy következő függvény meghívásához és így tovább.

Alábbi esetet kétféleképpen tudjuk elérni, az egyik, ha az osztályunkban van egy

private function HeadLink() {

return HeadLink::getInstance(); // vagy épp ami, a lényeg, hogy a hívó kontextusában kell definiálni.

}

a másik verzió, ha a meghívott objektumon belül biztosítjuk az ilyesfajta elérést és az osztály egy példányát tároljuk egy HeadLink nevű változóban a hívó contextusában:

```
// ez lesz a fenti példában a $this context
class Layout {
    private $HeadLink = HeadLink::getInstance();
}
// ez hívódik meg
class HeadLink extends Singleton { // az extend csak az előbbi példa okán
    public function __invoke() {
    return $this;
   }
}
```

Persze nem csak önmagát szolgáltathatja vissza, lehet egyfajta konstruktor is (habár csak objektumPÉLDÁNYON hívható meg), vagy igazából bármit tehetünk az osztályunkban.

#### \_\_set\_state()

Ez a metódus a var\_export esetében (ami majdnem ugyanaz, mint a var\_dump, azt leszámítva, hogy ez VALID, VÉGREHAJTHATÓ php kódot eredményez) siet a segítségünkre, paraméterként pedig a var\_export-nak átadott paramétereket kapja meg, egy asszociatív tömb formájában. Ezen paraméterek a példányváltozók név => érték formában vannak rendezve benne.

```
class VarExportable {

    public static function __set_state($array) {
         $export = new self(); // csinálunk még egyet magunkból
         foreach ($array as $key => $value) { //végigszuttyogjuk a tömböt és a kulcsokat példányváltozóként hozzáadjuk
            $export->$key = $value;
         
         }
         return $export; // aztán visszapasszoljuk az objektumot
    }

}

$a = new VarExportable();
$a->dara = "nein";
$a->para = "foo";

var_export($a, true); // ez a következőt teszi: VarExportable::__set_state(['dara' => "nein", 'para' => "foo" ]);

```

#### \_\_clone()

Végre valami, amit valamivel gyakrabban fogunk használni. A \_\_clone() metódus akkor kerül meghívásra, mikor a clone kulcsszóval lemásolunk egy már létező objektumot, annak minden változójával együtt. A \_\_clone() metódusunk egyfajta event handlerként működik, (ahogy sok más mágikus metódus is) így a klónozáskor ha bármit tennénk (változtatásokat eszközölnénk az osztályon, referenciákat hagynánk itt-ott, stb), azt itt végre tudjuk hajtani, nem kell a hívó fél oldalán mahinálnunk.

####  \_\_debugInfo()

Ez a metódus (PHP 5.6 és afelett) a var\_dump függvény működését hivatott felülbírálni, hiszen egy nagy kompozit (az osztály viselkedését nem örökléssel, hanem több más osztálypéldány/referencia magába foglalásával érjük el) osztálypéldány esetében a var\_dump igen csúnya outputot tud produkálni, arról nem is beszélve, hogy annak előállítása akár perceket is igénybe vehet.

Így ha tudjuk, hogy egyes osztályaink esetében milyen infókra lenne szükségünk egy var\_dump() esetén, szimplán összeszedegetjük őket pl. egy asszociatív tömbbe, jól érthető kulcsok használatával és kiíratjuk azt.
